import { describe, expect, it } from "vitest"
import { allTags, getPackageBySlug, getRelatedPackages, packages } from "./packages"

const VALID_TAGS = new Set(allTags)

describe("packages", () => {
  it("is a non-empty array", () => {
    expect(packages.length).toBeGreaterThan(0)
  })

  it("has unique slugs", () => {
    const slugs = packages.map((pkg) => pkg.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(packages)("package '$slug' has required non-empty fields", (pkg) => {
    expect(pkg.name.trim().length).toBeGreaterThan(0)
    expect(pkg.tagline.trim().length).toBeGreaterThan(0)
    expect(pkg.description.trim().length).toBeGreaterThan(0)
    expect(pkg.capacity.trim().length).toBeGreaterThan(0)
    expect(pkg.spaceRequirement.trim().length).toBeGreaterThan(0)

    expect(pkg.tags.length).toBeGreaterThan(0)
    pkg.tags.forEach((tag) => expect(VALID_TAGS.has(tag)).toBe(true))

    expect(pkg.inclusions.length).toBeGreaterThan(0)
    pkg.inclusions.forEach((line) => expect(line.trim().length).toBeGreaterThan(0))

    expect(pkg.images.length).toBeGreaterThan(0)
    pkg.images.forEach((image) => {
      expect(image.seed.trim().length).toBeGreaterThan(0)
      expect(image.alt.trim().length).toBeGreaterThan(0)
    })

    expect(pkg.priceTiers.length).toBeGreaterThan(0)
    pkg.priceTiers.forEach((tier) => {
      expect(tier.label.trim().length).toBeGreaterThan(0)
      expect(tier.price).toBeGreaterThanOrEqual(0)
    })

    expect(pkg.startingPrice).toBeGreaterThanOrEqual(0)
  })

  it.each(packages.filter((pkg) => pkg.themes))("package '$slug' themes have non-empty names and prices", (pkg) => {
    pkg.themes?.forEach((theme) => {
      expect(theme.name.trim().length).toBeGreaterThan(0)
      expect(theme.price.trim().length).toBeGreaterThan(0)
      if (theme.image) expect(theme.image.startsWith("/")).toBe(true)
    })
  })

  it.each(packages.filter((pkg) => pkg.popularAddOns))(
    "package '$slug' popular add-ons have non-empty names and prices",
    (pkg) => {
      pkg.popularAddOns?.forEach((addOn) => {
        expect(addOn.name.trim().length).toBeGreaterThan(0)
        expect(addOn.price.trim().length).toBeGreaterThan(0)
        if (addOn.image) expect(addOn.image.startsWith("/")).toBe(true)
      })
    },
  )
})

describe("getPackageBySlug", () => {
  it("returns the matching package for a known slug", () => {
    expect(getPackageBySlug("canopy-lounge")?.name).toBe("Canopy Lounge")
  })

  it("returns undefined for an unknown slug", () => {
    expect(getPackageBySlug("does-not-exist")).toBeUndefined()
  })
})

describe("getRelatedPackages", () => {
  it("never includes the current package in its results", () => {
    const current = packages[0]
    const related = getRelatedPackages(current)
    expect(related.some((pkg) => pkg.slug === current.slug)).toBe(false)
  })

  it("respects the requested count", () => {
    const current = packages[0]
    const related = getRelatedPackages(current, 2)
    expect(related.length).toBeLessThanOrEqual(2)
  })
})
