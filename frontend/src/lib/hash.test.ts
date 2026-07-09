import { describe, expect, it } from "vitest"
import { hashSeed } from "./hash"

describe("hashSeed", () => {
  it("returns a non-negative integer for a typical string", () => {
    const result = hashSeed("canopy-lounge")
    expect(Number.isInteger(result)).toBe(true)
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it("returns 0 for an empty string", () => {
    expect(hashSeed("")).toBe(0)
  })

  it("is deterministic for the same input", () => {
    expect(hashSeed("mega-tent")).toBe(hashSeed("mega-tent"))
  })

  it("returns different values for different inputs", () => {
    expect(hashSeed("mega-tent")).not.toBe(hashSeed("canopy-lounge"))
  })
})
