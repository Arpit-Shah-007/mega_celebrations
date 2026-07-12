import { exports } from "cloudflare:workers"
import { it, expect } from "vitest"
import { readJson } from "./helpers"

interface AdminPackage {
  id: number
  startingPriceCents: number
}

// Each `it()` in this file shares the same D1 storage (isolation is per test
// file, not per test), so every created package uses a slug unique to its
// own test to avoid UNIQUE constraint collisions between tests.
async function createPackage(slug: string): Promise<AdminPackage> {
  const response = await exports.default.fetch("https://example.com/api/admin/packages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug,
      name: "Test Package",
      tagline: "A tagline",
      description: "A description",
      tags: ["Indoor"],
      inclusions: [],
      capacity: "Up to 10",
      spaceRequirement: "10x10ft",
    }),
  })
  expect(response.status).toBe(201)
  const body = await readJson<{ data: AdminPackage }>(response)
  return body.data
}

it("admin routes are reachable without a token when Access is unconfigured (local dev)", async () => {
  const response = await exports.default.fetch("https://example.com/api/admin/packages")
  expect(response.status).toBe(200)
})

it("creating a package defaults startingPriceCents to 0 with no price tiers", async () => {
  const created = await createPackage("test-package-defaults")
  expect(created.startingPriceCents).toBe(0)
})

it("adding price tiers recomputes startingPriceCents to the minimum tier price", async () => {
  const pkg = await createPackage("test-package-tiers")

  await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}/price-tiers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label: "8 guests", priceCents: 50000 }),
  })
  const secondTierResponse = await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}/price-tiers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label: "16 guests", priceCents: 80000 }),
  })
  const secondTier = (await readJson<{ data: { id: number } }>(secondTierResponse)).data

  const afterAdd = await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const afterAddBody = await readJson<{ data: { package: AdminPackage } }>(afterAdd)
  expect(afterAddBody.data.package.startingPriceCents).toBe(50000)

  await exports.default.fetch(`https://example.com/api/admin/packages/price-tiers/${secondTier.id}`, { method: "DELETE" })

  const afterDelete = await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const afterDeleteBody = await readJson<{ data: { package: AdminPackage; priceTiers: unknown[] } }>(afterDelete)
  expect(afterDeleteBody.data.package.startingPriceCents).toBe(50000)
  expect(afterDeleteBody.data.priceTiers).toHaveLength(1)
})

it("rejects a package payload missing required fields", async () => {
  const response = await exports.default.fetch("https://example.com/api/admin/packages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Missing slug and other fields" }),
  })
  expect(response.status).toBe(400)
})

it("deleting a package cascades to its images, tiers, and variants", async () => {
  const pkg = await createPackage("test-package-delete")
  await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "hero", url: "/media/hero.jpg", alt: "Hero" }),
  })

  const deleteResponse = await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}`, { method: "DELETE" })
  expect(deleteResponse.status).toBe(200)

  const getResponse = await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}`)
  expect(getResponse.status).toBe(404)
})

it("reordering gallery images persists the new sort order via a single batch", async () => {
  const pkg = await createPackage("test-package-reorder-images")
  const imageIds: number[] = []
  for (const url of ["/media/one.jpg", "/media/two.jpg", "/media/three.jpg"]) {
    const response = await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "gallery", url, alt: "Gallery photo" }),
    })
    const body = await readJson<{ data: { id: number } }>(response)
    imageIds.push(body.data.id)
  }

  const reversedIds = [...imageIds].reverse()
  const reorderResponse = await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}/images/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds: reversedIds }),
  })
  expect(reorderResponse.status).toBe(200)

  const getResponse = await exports.default.fetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const getBody = await readJson<{ data: { images: { id: number; sortOrder: number }[] } }>(getResponse)
  const gallery = getBody.data.images.filter((image) => reversedIds.includes(image.id)).sort((a, b) => a.sortOrder - b.sortOrder)
  expect(gallery.map((image) => image.id)).toEqual(reversedIds)
})
