import { describe, expect, it } from "vitest"
import { getAddOnCardPhoto, getAddOnPhoto, getPackageHeroPhoto, getPackagePhoto, realPhotos } from "./realPhotos"
import { packages } from "./packages"

function expectMediaPath(path: string) {
  expect(path.startsWith("/media/")).toBe(true)
}

describe("realPhotos", () => {
  it("has non-empty media paths for top-level single-photo fields", () => {
    expectMediaPath(realPhotos.logo)
    expectMediaPath(realPhotos.heroBanner)
    expectMediaPath(realPhotos.aboutBg)
    expectMediaPath(realPhotos.aboutFamily)
    expectMediaPath(realPhotos.aboutBgTent)
    expectMediaPath(realPhotos.aLaCarte)
    expectMediaPath(realPhotos.aLaCarteHero)
    expectMediaPath(realPhotos.packagesListingHero)
  })

  it("has non-empty media paths for how-to-book icons", () => {
    Object.values(realPhotos.howToBookIcons).forEach(expectMediaPath)
  })

  it("has non-empty media paths for every add-on category banner and card", () => {
    Object.values(realPhotos.addOns).forEach(expectMediaPath)
    Object.values(realPhotos.addOnCards).forEach(expectMediaPath)
  })

  it("has a listing card photo for every package in packages.ts", () => {
    packages.forEach((pkg) => {
      expect(getPackagePhoto(pkg.slug)).toBeDefined()
    })
  })

  it("has a detail-page hero photo for every package in packages.ts", () => {
    packages.forEach((pkg) => {
      expect(getPackageHeroPhoto(pkg.slug)).toBeDefined()
    })
  })

  it("uses valid media paths for every package card and hero photo", () => {
    Object.values(realPhotos.packageCards).forEach(expectMediaPath)
    Object.values(realPhotos.packageHero).forEach(expectMediaPath)
  })
})

describe("photo lookup helpers", () => {
  it("returns the matching photo for a known package slug", () => {
    expect(getPackagePhoto("canopy-lounge")).toBe(realPhotos.packageCards["canopy-lounge"])
    expect(getPackageHeroPhoto("canopy-lounge")).toBe(realPhotos.packageHero["canopy-lounge"])
  })

  it("returns undefined for an unknown package slug", () => {
    expect(getPackagePhoto("does-not-exist")).toBeUndefined()
    expect(getPackageHeroPhoto("does-not-exist")).toBeUndefined()
  })

  it("returns the matching photo for a known add-on category slug", () => {
    expect(getAddOnPhoto("decor")).toBe(realPhotos.addOns.decor)
    expect(getAddOnCardPhoto("decor")).toBe(realPhotos.addOnCards.decor)
  })

  it("returns undefined for an unknown add-on category slug", () => {
    expect(getAddOnPhoto("does-not-exist")).toBeUndefined()
    expect(getAddOnCardPhoto("does-not-exist")).toBeUndefined()
  })
})
