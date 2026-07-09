import { it, expect, describe } from "vitest"
import { parsePriceString, formatPriceDisplay, centsToDollars } from "@/lib/money"

describe("parsePriceString", () => {
  it("parses a plain dollar amount", () => {
    expect(parsePriceString("$80.00")).toEqual({ priceCents: 8000, isPriceOnRequest: false })
  })

  it("parses an amount with thousands separators", () => {
    expect(parsePriceString("$1,600.00")).toEqual({ priceCents: 160000, isPriceOnRequest: false })
  })

  it("treats non-numeric strings as price-on-request", () => {
    expect(parsePriceString("Contact us for price.")).toEqual({ priceCents: null, isPriceOnRequest: true })
  })
})

describe("formatPriceDisplay", () => {
  it("formats cents back into a dollar string", () => {
    expect(formatPriceDisplay(8000, false)).toBe("$80.00")
  })

  it("returns the contact-us copy when price is on request", () => {
    expect(formatPriceDisplay(null, true)).toBe("Contact us for price.")
  })

  it("returns the contact-us copy when cents is null even if the flag is false", () => {
    expect(formatPriceDisplay(null, false)).toBe("Contact us for price.")
  })
})

describe("centsToDollars", () => {
  it("converts cents to a rounded dollar number", () => {
    expect(centsToDollars(8000)).toBe(80)
    expect(centsToDollars(8050)).toBe(80.5)
  })
})
