import { env, exports } from "cloudflare:workers"
import { it, expect } from "vitest"
import { createDb } from "@/db/client"
import { packages, packageImages, packageVariants, packageFaqs } from "@/db/schema"
import { readJson } from "./helpers"

// Each `it()` in this file shares the same D1 storage (isolation is per test
// file, not per test), so every seed helper call below uses a slug unique to
// its own test to avoid UNIQUE constraint collisions between tests.
async function seedTentSleepover(slug: string) {
  const db = createDb(env.DB)
  const now = Date.now()
  const [pkg] = await db
    .insert(packages)
    .values({
      slug,
      name: "Tent Sleepover",
      tagline: "A tagline",
      description: "A description",
      tags: ["Indoor", "Sleepover"],
      inclusions: ["Tents"],
      capacity: "4-10 guests",
      spaceRequirement: "Indoor space",
      startingPriceCents: 8000,
      priceIsPlaceholder: false,
      damageDepositCents: null,
      bundleDiscount: null,
      featured: true,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  await db.insert(packageImages).values([
    { packageId: pkg.id, kind: "hero", url: "/media/hero.jpg", alt: "Hero", sortOrder: 0 },
    { packageId: pkg.id, kind: "card", url: "/media/card.jpg", alt: "Card", sortOrder: 0 },
  ])
  await db.insert(packageVariants).values([
    { packageId: pkg.id, kind: "theme", name: "Magical Unicorn", priceCents: 8000, isPriceOnRequest: false, imageUrl: null, description: ["A unicorn theme."], sortOrder: 0 },
    { packageId: pkg.id, kind: "theme", name: "Contact Theme", priceCents: null, isPriceOnRequest: true, imageUrl: null, description: null, sortOrder: 1 },
  ])
  await db.insert(packageFaqs).values([
    { packageId: pkg.id, question: "How much space is needed?", answer: "It varies by package.", sortOrder: 0 },
    { packageId: pkg.id, question: "What if I need to cancel?", answer: "See our cancellation policy.", sortOrder: 1 },
  ])

  return pkg
}

it("GET /api/packages includes the seeded package in the public shape", async () => {
  await seedTentSleepover("tent-sleepover-list")

  const response = await exports.default.fetch("https://example.com/api/packages")
  expect(response.status).toBe(200)

  const body = await readJson<{ success: boolean; data: { slug: string }[] }>(response)
  expect(body.success).toBe(true)
  const found = body.data.find((pkg) => pkg.slug === "tent-sleepover-list")
  expect(found).toMatchObject({
    slug: "tent-sleepover-list",
    startingPrice: 80,
    heroImage: { url: "/media/hero.jpg", alt: "Hero" },
    cardImage: { url: "/media/card.jpg", alt: "Card" },
  })
})

it("GET /api/packages/:slug formats fixed and on-request variant prices correctly", async () => {
  await seedTentSleepover("tent-sleepover-detail")

  const response = await exports.default.fetch("https://example.com/api/packages/tent-sleepover-detail")
  expect(response.status).toBe(200)

  const body = await readJson<{ data: { themes: unknown[] } }>(response)
  expect(body.data.themes).toEqual([
    { name: "Magical Unicorn", price: "$80.00", image: undefined, description: ["A unicorn theme."] },
    { name: "Contact Theme", price: "Contact us for price.", image: undefined, description: undefined },
  ])
})

it("GET /api/packages/:slug includes the package's own FAQs in sortOrder", async () => {
  await seedTentSleepover("tent-sleepover-faqs")

  const response = await exports.default.fetch("https://example.com/api/packages/tent-sleepover-faqs")
  expect(response.status).toBe(200)

  const body = await readJson<{ data: { faqs: { question: string; answer: string }[] } }>(response)
  expect(body.data.faqs).toEqual([
    { question: "How much space is needed?", answer: "It varies by package." },
    { question: "What if I need to cancel?", answer: "See our cancellation policy." },
  ])
})

it("GET /api/packages/:slug returns 404 for an unknown slug", async () => {
  const response = await exports.default.fetch("https://example.com/api/packages/does-not-exist")
  expect(response.status).toBe(404)

  const body = await readJson(response)
  expect(body).toEqual({ success: false, error: "Package not found." })
})
