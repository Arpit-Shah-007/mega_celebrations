import { describe, expect, it } from "vitest"
import { parsePriceValue } from "@/lib/catalogItem"
import { addOnCategories, getAddOnBySlug } from "./addOns"

describe("addOnCategories", () => {
  it("is a non-empty array", () => {
    expect(addOnCategories.length).toBeGreaterThan(0)
  })

  it("has unique category slugs", () => {
    const slugs = addOnCategories.map((category) => category.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(addOnCategories)("category '$slug' has required non-empty fields", (category) => {
    expect(category.slug).toMatch(/^[a-z0-9-]+$/)
    expect(category.name.trim().length).toBeGreaterThan(0)
    expect(category.tagline.trim().length).toBeGreaterThan(0)
    expect(category.description.trim().length).toBeGreaterThan(0)
    expect(category.items.length).toBeGreaterThan(0)
  })

  it("has unique item slugs across all categories", () => {
    const allSlugs = addOnCategories.flatMap((category) => category.items.map((item) => item.slug))
    expect(new Set(allSlugs).size).toBe(allSlugs.length)
  })

  it.each(addOnCategories.flatMap((category) => category.items))("item '$slug' has valid required fields", (item) => {
    expect(item.slug).toMatch(/^[a-z0-9-]+$/)
    expect(item.name.trim().length).toBeGreaterThan(0)
    expect(item.category.trim().length).toBeGreaterThan(0)
    expect(item.price.trim().length).toBeGreaterThan(0)
    expect(item.image === null || item.image.startsWith("/")).toBe(true)
    expect(item.description.length).toBeGreaterThan(0)
    item.description.forEach((line) => expect(line.trim().length).toBeGreaterThan(0))
    item.pricing.forEach((row) => {
      expect(row.label.trim().length).toBeGreaterThan(0)
      expect(row.value.trim().length).toBeGreaterThan(0)
    })
    item.additionalImages?.forEach((path) => expect(path.startsWith("/")).toBe(true))
    item.details?.forEach((row) => {
      expect(row.label.trim().length).toBeGreaterThan(0)
      expect(row.value.trim().length).toBeGreaterThan(0)
    })
  })

  it("parses every item price into a non-negative number", () => {
    for (const category of addOnCategories) {
      for (const item of category.items) {
        expect(parsePriceValue(item.price)).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

describe("getAddOnBySlug", () => {
  it("returns the matching category for a known slug", () => {
    expect(getAddOnBySlug("decor")?.name).toBe("Decor")
  })

  it("returns undefined for an unknown slug", () => {
    expect(getAddOnBySlug("does-not-exist")).toBeUndefined()
  })
})
