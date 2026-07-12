import { exports } from "cloudflare:workers"
import { it, expect } from "vitest"
import { readJson } from "./helpers"

interface AddonCategory {
  id: number
}

// Each `it()` in this file shares the same D1 storage (isolation is per test
// file, not per test), so every created category uses a slug unique to its
// own test to avoid UNIQUE constraint collisions between tests.
async function createCategory(slug: string): Promise<AddonCategory> {
  const response = await exports.default.fetch("https://example.com/api/admin/addon-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug,
      name: "Test Category",
      tagline: "A tagline",
      description: "A description",
      heroImageUrl: "/media/hero.jpg",
      heroImageAlt: "Hero",
      cardImageUrl: "/media/card.jpg",
      cardImageAlt: "Card",
    }),
  })
  expect(response.status).toBe(201)
  const body = await readJson<{ data: AddonCategory }>(response)
  return body.data
}

it("reordering add-on categories persists the new sort order via a single batch", async () => {
  const a = await createCategory("test-category-reorder-a")
  const b = await createCategory("test-category-reorder-b")

  const reorderResponse = await exports.default.fetch("https://example.com/api/admin/addon-categories/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds: [b.id, a.id] }),
  })
  expect(reorderResponse.status).toBe(200)

  const listResponse = await exports.default.fetch("https://example.com/api/admin/addon-categories")
  const listBody = await readJson<{ data: { id: number; sortOrder: number }[] }>(listResponse)
  const bRow = listBody.data.find((row) => row.id === b.id)
  const aRow = listBody.data.find((row) => row.id === a.id)
  expect(bRow?.sortOrder).toBe(0)
  expect(aRow?.sortOrder).toBe(1)
})

it("deleting an add-on category cascades to its catalog items via a single batch", async () => {
  const category = await createCategory("test-category-delete")
  const itemResponse = await exports.default.fetch("https://example.com/api/admin/catalog-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placement: "add_on_category",
      addonCategoryId: category.id,
      slug: "test-category-delete-item",
      name: "Test Item",
      categoryBreadcrumb: "Test",
      description: [],
      pricing: [],
    }),
  })
  const item = (await readJson<{ data: { id: number } }>(itemResponse)).data

  const deleteResponse = await exports.default.fetch(`https://example.com/api/admin/addon-categories/${category.id}`, { method: "DELETE" })
  expect(deleteResponse.status).toBe(200)

  const itemsResponse = await exports.default.fetch("https://example.com/api/admin/catalog-items?placement=add_on_category")
  const itemsBody = await readJson<{ data: { id: number }[] }>(itemsResponse)
  expect(itemsBody.data.some((row) => row.id === item.id)).toBe(false)
})

it("reordering catalog items persists the new sort order via a single batch", async () => {
  const category = await createCategory("test-category-item-reorder")
  const itemIds: number[] = []
  for (const slug of ["test-item-reorder-1", "test-item-reorder-2"]) {
    const response = await exports.default.fetch("https://example.com/api/admin/catalog-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placement: "add_on_category",
        addonCategoryId: category.id,
        slug,
        name: "Test Item",
        categoryBreadcrumb: "Test",
        description: [],
        pricing: [],
      }),
    })
    const body = await readJson<{ data: { id: number } }>(response)
    itemIds.push(body.data.id)
  }

  const reversedIds = [...itemIds].reverse()
  const reorderResponse = await exports.default.fetch("https://example.com/api/admin/catalog-items/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds: reversedIds }),
  })
  expect(reorderResponse.status).toBe(200)

  const listResponse = await exports.default.fetch("https://example.com/api/admin/catalog-items?placement=add_on_category")
  const listBody = await readJson<{ data: { id: number; sortOrder: number }[] }>(listResponse)
  const reordered = listBody.data.filter((row) => reversedIds.includes(row.id)).sort((a, b) => a.sortOrder - b.sortOrder)
  expect(reordered.map((row) => row.id)).toEqual(reversedIds)
})
