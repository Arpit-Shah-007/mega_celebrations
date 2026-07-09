import { describe, expect, it } from "vitest"
import { parsePriceValue } from "@/lib/catalogItem"
import aLaCarteItemsData from "./aLaCarteItems.json"
import type { CatalogItem } from "@/types"

const aLaCarteItems = aLaCarteItemsData as CatalogItem[]

describe("aLaCarteItems", () => {
  it("is a non-empty array", () => {
    expect(aLaCarteItems.length).toBeGreaterThan(0)
  })

  it("has unique item slugs", () => {
    const slugs = aLaCarteItems.map((item) => item.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(aLaCarteItems)("item '$slug' has valid required fields", (item) => {
    expect(item.slug).toMatch(/^[a-z0-9-]+$/)
    expect(item.name.trim().length).toBeGreaterThan(0)
    expect(item.category.trim().length).toBeGreaterThan(0)
    expect(item.price.trim().length).toBeGreaterThan(0)
    expect(item.image === null || item.image.startsWith("/")).toBe(true)
    expect(item.description.length).toBeGreaterThan(0)
    item.description.forEach((line) => expect(line.trim().length).toBeGreaterThan(0))
    expect(item.pricing.length).toBeGreaterThan(0)
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

  it("parses every item price into a positive number", () => {
    for (const item of aLaCarteItems) {
      expect(parsePriceValue(item.price)).toBeGreaterThan(0)
    }
  })
})
