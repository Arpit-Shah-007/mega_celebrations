import { describe, expect, it } from "vitest"
import { faqCategories, faqs } from "./faqs"

describe("faqs", () => {
  it("is a non-empty array", () => {
    expect(faqs.length).toBeGreaterThan(0)
  })

  it("has non-empty question and answer text for every entry", () => {
    faqs.forEach((faq) => {
      expect(faq.question.trim().length).toBeGreaterThan(0)
      expect(faq.answer.trim().length).toBeGreaterThan(0)
    })
  })

  it("only uses categories declared in faqCategories", () => {
    faqs.forEach((faq) => {
      expect(faqCategories).toContain(faq.category)
    })
  })

  it("has at least one FAQ for every declared category", () => {
    faqCategories.forEach((category) => {
      const matches = faqs.filter((faq) => faq.category === category)
      expect(matches.length).toBeGreaterThan(0)
    })
  })

  it("has no duplicate question text within the same category", () => {
    faqCategories.forEach((category) => {
      const questions = faqs.filter((faq) => faq.category === category).map((faq) => faq.question)
      expect(new Set(questions).size).toBe(questions.length)
    })
  })
})
