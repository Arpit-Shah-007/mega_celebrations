import { describe, expect, it } from "vitest"
import { BedDouble, Home, Sofa, Sparkles, TreePine, Utensils } from "lucide-react"
import { getAddOnIcon, getTagIcon } from "./tagIcons"

describe("getTagIcon", () => {
  it("returns the mapped icon for each known package tag", () => {
    expect(getTagIcon("Sleepover")).toBe(BedDouble)
    expect(getTagIcon("Dining")).toBe(Utensils)
    expect(getTagIcon("Lounge")).toBe(Sofa)
    expect(getTagIcon("Indoor")).toBe(Home)
    expect(getTagIcon("Outdoor")).toBe(TreePine)
  })

  it("falls back to Sparkles for an unrecognized tag", () => {
    // @ts-expect-error intentionally passing a value outside the PackageTag union
    expect(getTagIcon("Unknown")).toBe(Sparkles)
  })
})

describe("getAddOnIcon", () => {
  it("returns the mapped icon for each known add-on category slug", () => {
    expect(getAddOnIcon("decor")).not.toBe(Sparkles)
    expect(getAddOnIcon("activities-crafts")).not.toBe(Sparkles)
    expect(getAddOnIcon("favors")).not.toBe(Sparkles)
  })

  it("falls back to Sparkles for an unrecognized slug", () => {
    expect(getAddOnIcon("not-a-real-category")).toBe(Sparkles)
  })
})
