import { describe, expect, it } from "vitest"
import { realPhotos } from "./realPhotos"

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
})
