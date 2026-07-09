import { describe, expect, it } from "vitest"
import { testimonials } from "./testimonials"

describe("testimonials", () => {
  it("is a non-empty array", () => {
    expect(testimonials.length).toBeGreaterThan(0)
  })

  it("has unique ids", () => {
    const ids = testimonials.map((testimonial) => testimonial.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("has non-empty name and quote text with an integer rating between 1 and 5", () => {
    testimonials.forEach((testimonial) => {
      expect(testimonial.name.trim().length).toBeGreaterThan(0)
      expect(testimonial.quote.trim().length).toBeGreaterThan(0)
      expect(Number.isInteger(testimonial.rating)).toBe(true)
      expect(testimonial.rating).toBeGreaterThanOrEqual(1)
      expect(testimonial.rating).toBeLessThanOrEqual(5)
    })
  })
})
