import { describe, expect, it } from "vitest"
import { galleryPhotos } from "./galleryPhotos"

describe("galleryPhotos", () => {
  it("is a non-empty array", () => {
    expect(galleryPhotos.length).toBeGreaterThan(0)
  })

  it("has an absolute src path and non-empty alt text for every photo", () => {
    galleryPhotos.forEach((photo) => {
      expect(photo.src.startsWith("/")).toBe(true)
      expect(photo.alt.trim().length).toBeGreaterThan(0)
    })
  })

  it("has no duplicate src paths", () => {
    const paths = galleryPhotos.map((photo) => photo.src)
    expect(new Set(paths).size).toBe(paths.length)
  })
})
