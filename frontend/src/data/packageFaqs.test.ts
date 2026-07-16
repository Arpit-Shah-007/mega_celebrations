import { describe, expect, it } from "vitest"
import { getPackageFaqs } from "./packageFaqs"

describe("getPackageFaqs", () => {
  it("returns the exact mapped question set for a known package, in order", () => {
    const faqs = getPackageFaqs("tent-sleepover")
    expect(faqs.map((faq) => faq.question)).toEqual([
      "How much space is needed?",
      "What if I don't have my final guest count yet?",
      "What if I need to cancel?",
      "When do you set up and pick up?",
      "How is everything cleaned?",
    ])
  })

  it("returns a different question set for a different known package", () => {
    const faqs = getPackageFaqs("pamper-party")
    expect(faqs.map((faq) => faq.question)).toEqual([
      "Do you stay for the event?",
      "What do guests get to keep?",
      "What if I need to cancel?",
      "How is everything cleaned?",
    ])
  })

  it("every returned FAQ has non-empty question and answer text", () => {
    for (const slug of ["tent-sleepover", "megamovie-night", "celebrations-picnic-adult"]) {
      for (const faq of getPackageFaqs(slug)) {
        expect(faq.question.length).toBeGreaterThan(0)
        expect(faq.answer.length).toBeGreaterThan(0)
      }
    }
  })

  it("falls back to a random 5-6 question set for a package not in the fixed map", () => {
    const faqs = getPackageFaqs("some-brand-new-package")
    expect(faqs.length).toBeGreaterThanOrEqual(5)
    expect(faqs.length).toBeLessThanOrEqual(6)
  })

  it("returns the same random set for the same unmapped slug every time (stable, not re-randomized per render)", () => {
    const first = getPackageFaqs("some-brand-new-package")
    const second = getPackageFaqs("some-brand-new-package")
    expect(second).toEqual(first)
  })

  it("returns no duplicate questions within a single random set", () => {
    const faqs = getPackageFaqs("another-new-package")
    const questions = faqs.map((faq) => faq.question)
    expect(new Set(questions).size).toBe(questions.length)
  })

  it("gives different unmapped slugs different-looking sets (not the same fallback every time)", () => {
    const a = getPackageFaqs("new-package-alpha")
    const b = getPackageFaqs("new-package-beta")
    expect(a).not.toEqual(b)
  })
})
