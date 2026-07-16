import { describe, expect, it } from "vitest"
import { buildFlatFeePricingRows, parsePriceValue, slugify } from "./catalogItem"

describe("parsePriceValue", () => {
  it("returns 0 when price is undefined", () => {
    expect(parsePriceValue(undefined)).toBe(0)
  })

  it("returns 0 when price is an empty string", () => {
    expect(parsePriceValue("")).toBe(0)
  })

  it("returns 0 when no dollar amount is present", () => {
    expect(parsePriceValue("Contact us for price.")).toBe(0)
  })

  it("parses a simple dollar amount", () => {
    expect(parsePriceValue("$75.00")).toBe(75)
  })

  it("parses a dollar amount embedded in surrounding text", () => {
    expect(parsePriceValue("Purchase price: $15.00")).toBe(15)
  })

  it("parses comma-formatted thousands", () => {
    expect(parsePriceValue("$1,000.00")).toBe(1000)
  })

  it("parses an integer amount with no decimal portion", () => {
    expect(parsePriceValue("$500")).toBe(500)
  })

  it("parses the first amount when multiple dollar amounts are present", () => {
    expect(parsePriceValue("$80.00 per tent, $400.00 minimum")).toBe(80)
  })
})

describe("slugify", () => {
  it("lowercases and hyphenates a simple name", () => {
    expect(slugify("Boho Umbrella")).toBe("boho-umbrella")
  })

  it("collapses parentheses and slashes into single hyphens", () => {
    expect(slugify("3 in 1 Combo (Bounce House/Slide/Ball Pit)")).toBe("3-in-1-combo-bounce-house-slide-ball-pit")
  })

  it("collapses multiple consecutive separators into one hyphen", () => {
    expect(slugify("A   B---C")).toBe("a-b-c")
  })

  it("strips leading and trailing separators", () => {
    expect(slugify("-Test-")).toBe("test")
    expect(slugify(" Hello! ")).toBe("hello")
  })

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("")
  })

  it("returns an empty string when input has no alphanumeric characters", () => {
    expect(slugify("!!!---???")).toBe("")
  })
})

describe("buildFlatFeePricingRows", () => {
  it("returns a single Flat fee row formatted as currency when a price is set", () => {
    expect(buildFlatFeePricingRows(7500, false)).toEqual([{ label: "Flat fee", value: "$75.00" }])
  })

  it("formats thousands with a comma separator", () => {
    expect(buildFlatFeePricingRows(160000, false)).toEqual([{ label: "Flat fee", value: "$1,600.00" }])
  })

  it("returns an empty array when price is on request", () => {
    expect(buildFlatFeePricingRows(7500, true)).toEqual([])
  })

  it("returns an empty array when priceCents is null", () => {
    expect(buildFlatFeePricingRows(null, false)).toEqual([])
  })
})
