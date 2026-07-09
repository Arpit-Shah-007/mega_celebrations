import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { createTestQueryClient } from "@/test/queryClient"
import { AddOnCategoryPage } from "./AddOnCategoryPage"
import { fetchAddOnCategoryBySlug } from "@/lib/api"
import type { AddOnCategory } from "@/types"

vi.setConfig({ testTimeout: 15000 })
vi.mock("@/lib/api")

const VALID_SLUG = "decor"

const decorCategory: AddOnCategory = {
  slug: "decor",
  name: "Decor",
  tagline: "Wow your guests.",
  description: "Our decor add-ons will take your event to the next level.",
  heroImage: { url: "/media/decor-hero.jpg", alt: "Decor hero" },
  cardImage: { url: "/media/decor-card.jpg", alt: "Decor card" },
  items: [
    {
      slug: "arched-walls",
      name: "Arched Walls",
      price: "Contact us for price.",
      category: "Decor > Backdrops",
      image: "/media/add-ons/arched-walls.jpg",
      description: ["A freestanding arched wall backdrop."],
      pricing: [],
    },
  ],
}

function renderAddOnCategoryPage(slug: string) {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter initialEntries={[`/packages/add-ons/${slug}`]}>
        <ToastProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/packages/add-ons/:slug" element={<AddOnCategoryPage />} />
            </Routes>
          </WishlistProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("AddOnCategoryPage", () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.mocked(fetchAddOnCategoryBySlug).mockImplementation((slug) =>
      slug === VALID_SLUG ? Promise.resolve(decorCategory) : Promise.reject(new Error("Add-on category not found.")),
    )
  })

  it("renders the category's hero title, description, and every item for a valid slug", async () => {
    renderAddOnCategoryPage(VALID_SLUG)

    expect(await screen.findByRole("heading", { name: decorCategory.name, level: 1 })).toBeInTheDocument()
    expect(screen.getByText(decorCategory.description)).toBeInTheDocument()
    for (const item of decorCategory.items) {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    }
  })

  it("shows a not-found message and a link back to add-ons for an invalid slug", async () => {
    renderAddOnCategoryPage("this-category-does-not-exist")

    expect(await screen.findByRole("heading", { name: "Add-on category not found" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse all add-ons" })).toHaveAttribute("href", "/packages/add-ons")
  })
})
