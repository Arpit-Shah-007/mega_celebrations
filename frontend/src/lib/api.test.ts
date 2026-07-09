import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import {
  fetchAddOnCategories,
  fetchAddOnCategoryBySlug,
  fetchALaCarteItems,
  fetchPackageBySlug,
  fetchPackages,
  submitQuoteInquiry,
} from "./api"
import type { AddOnCategory, CatalogItem, Package, QuoteFormValues, WishlistItem } from "@/types"

const API_BASE_URL = "http://localhost:8787"

const samplePackage: Package = {
  slug: "tent-sleepover",
  name: "Tent Sleepover",
  tagline: "A tagline",
  tags: ["Indoor", "Sleepover"],
  description: "A description",
  inclusions: ["Tents"],
  heroImage: { url: "/media/hero.jpg", alt: "Hero" },
  cardImage: { url: "/media/card.jpg", alt: "Card" },
  gallery: [],
  priceTiers: [{ label: "Per tent", price: 80 }],
  startingPrice: 80,
  capacity: "4-10 guests",
  spaceRequirement: "Indoor space",
}

const sampleCategory: AddOnCategory = {
  slug: "decor",
  name: "Decor",
  tagline: "Decor tagline",
  description: "Decor description",
  heroImage: { url: "/media/decor-hero.jpg", alt: "Decor hero" },
  cardImage: { url: "/media/decor-card.jpg", alt: "Decor card" },
  items: [],
}

const sampleCatalogItem: CatalogItem = {
  slug: "cross-back-chairs",
  name: "Cross Back Chairs",
  price: "$10.00",
  category: "Furniture > Seating & Chairs",
  image: "/media/chairs.jpg",
  description: ["A chair."],
  pricing: [{ label: "Flat fee", value: "$10.00" }],
}

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("api client", () => {
  it("fetchPackages returns the data array on success", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/packages`, () => HttpResponse.json({ success: true, data: [samplePackage] })),
    )

    await expect(fetchPackages()).resolves.toEqual([samplePackage])
  })

  it("fetchPackageBySlug requests the encoded slug and returns the package", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/packages/tent-sleepover`, () =>
        HttpResponse.json({ success: true, data: samplePackage }),
      ),
    )

    await expect(fetchPackageBySlug("tent-sleepover")).resolves.toEqual(samplePackage)
  })

  it("throws the server's error message when the response is a failure envelope", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/packages/does-not-exist`, () =>
        HttpResponse.json({ success: false, error: "Package not found." }, { status: 404 }),
      ),
    )

    await expect(fetchPackageBySlug("does-not-exist")).rejects.toThrow("Package not found.")
  })

  it("fetchAddOnCategories returns the data array on success", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/addon-categories`, () =>
        HttpResponse.json({ success: true, data: [sampleCategory] }),
      ),
    )

    await expect(fetchAddOnCategories()).resolves.toEqual([sampleCategory])
  })

  it("fetchAddOnCategoryBySlug returns a single category", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/addon-categories/decor`, () =>
        HttpResponse.json({ success: true, data: sampleCategory }),
      ),
    )

    await expect(fetchAddOnCategoryBySlug("decor")).resolves.toEqual(sampleCategory)
  })

  it("fetchALaCarteItems requests the a_la_carte placement filter", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/catalog-items`, ({ request }) => {
        const url = new URL(request.url)
        expect(url.searchParams.get("placement")).toBe("a_la_carte")
        return HttpResponse.json({ success: true, data: [sampleCatalogItem] })
      }),
    )

    await expect(fetchALaCarteItems()).resolves.toEqual([sampleCatalogItem])
  })

  it("submitQuoteInquiry posts the form values with items converted to price cents", async () => {
    const values: QuoteFormValues = {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "9085550123",
      eventDate: "2026-08-01",
      venue: "Backyard",
      guestCount: "8 kids",
      notes: "Unicorn theme",
    }
    const items: WishlistItem[] = [{ slug: "theme-tent-sleepover-unicorn", name: "Magical Unicorn", imageSeed: "x", startingPrice: 80 }]

    server.use(
      http.post(`${API_BASE_URL}/api/quote-inquiries`, async ({ request }) => {
        const body = await request.json()
        expect(body).toEqual({
          ...values,
          items: [{ slug: "theme-tent-sleepover-unicorn", name: "Magical Unicorn", priceCents: 8000 }],
        })
        return HttpResponse.json({ success: true, data: { id: 1 } }, { status: 201 })
      }),
    )

    await expect(submitQuoteInquiry(values, items)).resolves.toEqual({ id: 1 })
  })
})
