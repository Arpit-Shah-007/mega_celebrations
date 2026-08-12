import { describe, expect, it } from "vitest"
import { formatWishlistSummary } from "./wishlist-summary"
import type { WishlistItem } from "@/types"

const TENT: WishlistItem = {
  slug: "tent-sleepover",
  name: "Tent Sleepover",
  imageSeed: "tent-sleepover-1",
  startingPrice: 80,
  category: "package",
}
const PARIS: WishlistItem = {
  slug: "a-night-in-paris",
  name: "A Night In Paris",
  imageSeed: "a-night-in-paris",
  startingPrice: 0,
  category: "theme",
  packageSlug: "tent-sleepover",
}

describe("formatWishlistSummary", () => {
  it("returns an empty string for an empty wishlist", () => {
    expect(formatWishlistSummary([])).toBe("")
  })

  it("nests picked themes under the package they came from", () => {
    expect(formatWishlistSummary([TENT, PARIS])).toBe(
      [
        "MY WISHLIST (from the Mega Celebrations website)",
        "",
        "PACKAGES",
        "- Tent Sleepover",
        "    Theme: A Night In Paris",
      ].join("\n"),
    )
  })

  it("groups a la carte and add-on picks under their own headings", () => {
    const summary = formatWishlistSummary([
      { slug: "farm-table", name: "Farm Table", imageSeed: "farm-table", startingPrice: 125, category: "a-la-carte" },
      { slug: "balloons", name: "Balloons", imageSeed: "balloons", startingPrice: 75, category: "add-on" },
    ])

    expect(summary).toContain("A LA CARTE\n- Farm Table")
    expect(summary).toContain("ADD-ONS\n- Balloons")
  })

  it("spells out a quantity above one and leaves a single unit unmarked", () => {
    const summary = formatWishlistSummary([
      { slug: "farm-table", name: "Farm Table", imageSeed: "farm-table", startingPrice: 125, category: "a-la-carte", quantity: 3 },
      { slug: "balloons", name: "Balloons", imageSeed: "balloons", startingPrice: 75, category: "add-on", quantity: 1 },
    ])

    expect(summary).toContain("- Farm Table x3")
    expect(summary).toContain("- Balloons")
    expect(summary).not.toContain("Balloons x1")
  })

  it("still lists a theme whose package is missing rather than dropping it", () => {
    const summary = formatWishlistSummary([PARIS])

    expect(summary).toContain("THEMES\n- A Night In Paris")
    expect(summary).not.toContain("PACKAGES")
  })

  it("omits sections with nothing in them", () => {
    const summary = formatWishlistSummary([TENT])

    expect(summary).toContain("PACKAGES")
    expect(summary).not.toContain("A LA CARTE")
    expect(summary).not.toContain("ADD-ONS")
    expect(summary).not.toContain("THEMES")
  })
})
