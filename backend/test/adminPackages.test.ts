import { it, expect } from "vitest"
import { adminFetch, readJson } from "./helpers"

interface AdminPackage {
  id: number
  startingPriceCents: number
}

// Each `it()` in this file shares the same D1 storage (isolation is per test
// file, not per test), so every created package uses a slug unique to its
// own test to avoid UNIQUE constraint collisions between tests.
async function createPackage(slug: string): Promise<AdminPackage> {
  const response = await adminFetch("https://example.com/api/admin/packages", {
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

it("admin routes are reachable with a valid admin session", async () => {
  const response = await adminFetch("https://example.com/api/admin/packages")
  expect(response.status).toBe(200)
})

it("creating a package defaults startingPriceCents to 0 with no themes", async () => {
  const created = await createPackage("test-package-defaults")
  expect(created.startingPriceCents).toBe(0)
})

it("adding theme variants recomputes startingPriceCents to the cheapest theme's price", async () => {
  const pkg = await createPackage("test-package-themes")

  await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/variants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "theme", name: "8 guests", priceCents: 50000 }),
  })
  const secondThemeResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/variants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "theme", name: "16 guests", priceCents: 80000 }),
  })
  const secondTheme = (await readJson<{ data: { id: number } }>(secondThemeResponse)).data

  const afterAdd = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const afterAddBody = await readJson<{ data: { package: AdminPackage } }>(afterAdd)
  expect(afterAddBody.data.package.startingPriceCents).toBe(50000)

  await adminFetch(`https://example.com/api/admin/packages/variants/${secondTheme.id}`, { method: "DELETE" })

  const afterDelete = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const afterDeleteBody = await readJson<{ data: { package: AdminPackage; variants: unknown[] } }>(afterDelete)
  expect(afterDeleteBody.data.package.startingPriceCents).toBe(50000)
  expect(afterDeleteBody.data.variants).toHaveLength(1)
})

it("rejects a package payload missing required fields", async () => {
  const response = await adminFetch("https://example.com/api/admin/packages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Missing slug and other fields" }),
  })
  expect(response.status).toBe(400)
})

it("deleting a package cascades to its images and variants", async () => {
  const pkg = await createPackage("test-package-delete")
  await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "hero", url: "/media/hero.jpg", alt: "Hero" }),
  })

  const deleteResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`, { method: "DELETE" })
  expect(deleteResponse.status).toBe(200)

  const getResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`)
  expect(getResponse.status).toBe(404)
})

it("creating a FAQ attaches it to the package and appears in the admin GET", async () => {
  const pkg = await createPackage("test-package-faqs")

  const createResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/faqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: "How much space is needed?", answer: "Plenty." }),
  })
  expect(createResponse.status).toBe(201)
  const created = (await readJson<{ data: { id: number; packageId: number } }>(createResponse)).data
  expect(created.packageId).toBe(pkg.id)

  const getResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const getBody = await readJson<{ data: { faqs: { id: number; question: string; answer: string }[] } }>(getResponse)
  expect(getBody.data.faqs).toEqual([{ id: created.id, packageId: pkg.id, question: "How much space is needed?", answer: "Plenty.", sortOrder: 0 }])
})

it("updating and deleting a FAQ persists correctly", async () => {
  const pkg = await createPackage("test-package-faqs-update-delete")
  const createResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/faqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: "Original question?", answer: "Original answer." }),
  })
  const created = (await readJson<{ data: { id: number } }>(createResponse)).data

  const updateResponse = await adminFetch(`https://example.com/api/admin/packages/faqs/${created.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer: "Updated answer." }),
  })
  expect(updateResponse.status).toBe(200)
  const updated = (await readJson<{ data: { answer: string } }>(updateResponse)).data
  expect(updated.answer).toBe("Updated answer.")

  const deleteResponse = await adminFetch(`https://example.com/api/admin/packages/faqs/${created.id}`, { method: "DELETE" })
  expect(deleteResponse.status).toBe(200)

  const getResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const getBody = await readJson<{ data: { faqs: unknown[] } }>(getResponse)
  expect(getBody.data.faqs).toHaveLength(0)
})

it("reordering FAQs persists the new sort order via a single batch", async () => {
  const pkg = await createPackage("test-package-faqs-reorder")
  const faqIds: number[] = []
  for (const question of ["Question one?", "Question two?", "Question three?"]) {
    const response = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer: "An answer." }),
    })
    const body = await readJson<{ data: { id: number } }>(response)
    faqIds.push(body.data.id)
  }

  const reversedIds = [...faqIds].reverse()
  const reorderResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/faqs/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds: reversedIds }),
  })
  expect(reorderResponse.status).toBe(200)

  const getResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const getBody = await readJson<{ data: { faqs: { id: number; sortOrder: number }[] } }>(getResponse)
  expect(getBody.data.faqs.sort((a, b) => a.sortOrder - b.sortOrder).map((faq) => faq.id)).toEqual(reversedIds)
})

it("deleting a package cascades to its FAQs", async () => {
  const pkg = await createPackage("test-package-faqs-cascade")
  await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/faqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: "A question?", answer: "An answer." }),
  })

  const deleteResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`, { method: "DELETE" })
  expect(deleteResponse.status).toBe(200)

  const getResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`)
  expect(getResponse.status).toBe(404)
})

it("reordering gallery images persists the new sort order via a single batch", async () => {
  const pkg = await createPackage("test-package-reorder-images")
  const imageIds: number[] = []
  for (const url of ["/media/one.jpg", "/media/two.jpg", "/media/three.jpg"]) {
    const response = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "gallery", url, alt: "Gallery photo" }),
    })
    const body = await readJson<{ data: { id: number } }>(response)
    imageIds.push(body.data.id)
  }

  const reversedIds = [...imageIds].reverse()
  const reorderResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}/images/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds: reversedIds }),
  })
  expect(reorderResponse.status).toBe(200)

  const getResponse = await adminFetch(`https://example.com/api/admin/packages/${pkg.id}`)
  const getBody = await readJson<{ data: { images: { id: number; sortOrder: number }[] } }>(getResponse)
  const gallery = getBody.data.images.filter((image) => reversedIds.includes(image.id)).sort((a, b) => a.sortOrder - b.sortOrder)
  expect(gallery.map((image) => image.id)).toEqual(reversedIds)
})
