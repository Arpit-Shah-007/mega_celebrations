import { describe, expect, it } from "vitest"
import { getPackageGallery, packageGalleries } from "./packageGalleries"
import { packages } from "./packages"

describe("packageGalleries", () => {
  it("has at least one gallery entry", () => {
    expect(Object.keys(packageGalleries).length).toBeGreaterThan(0)
  })

  it("only references package slugs that exist in packages.ts", () => {
    const knownSlugs = new Set(packages.map((pkg) => pkg.slug))
    Object.keys(packageGalleries).forEach((slug) => {
      expect(knownSlugs.has(slug)).toBe(true)
    })
  })

  it("has a non-empty array of /media/ paths for every package", () => {
    Object.values(packageGalleries).forEach((photos) => {
      expect(photos.length).toBeGreaterThan(0)
      photos.forEach((path) => expect(path.startsWith("/media/")).toBe(true))
    })
  })

  it("has no duplicate media paths within a single package's gallery", () => {
    Object.values(packageGalleries).forEach((photos) => {
      expect(new Set(photos).size).toBe(photos.length)
    })
  })
})

describe("getPackageGallery", () => {
  it("returns the photo array for a known slug", () => {
    expect(getPackageGallery("canopy-lounge")).toBe(packageGalleries["canopy-lounge"])
  })

  it("returns an empty array for an unknown slug", () => {
    expect(getPackageGallery("does-not-exist")).toEqual([])
  })
})
