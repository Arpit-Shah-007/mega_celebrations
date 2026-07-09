import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { createTestQueryClient } from "@/test/queryClient"
import { AddOnsPage } from "./AddOnsPage"
import { fetchAddOnCategories } from "@/lib/api"
import type { AddOnCategory } from "@/types"

vi.setConfig({ testTimeout: 15000 })
vi.mock("@/lib/api")

const categories: AddOnCategory[] = [
  {
    slug: "decor",
    name: "Decor",
    tagline: "Wow your guests with stunning backdrops.",
    description: "Our decor add-ons will take your event to the next level.",
    heroImage: { url: "/media/decor-hero.jpg", alt: "Decor hero" },
    cardImage: { url: "/media/decor-card.jpg", alt: "Decor card" },
    items: [],
  },
  {
    slug: "activities-crafts",
    name: "Activities & Crafts",
    tagline: "Let us take the planning off your plate.",
    description: "Choose from a variety of activity and craft stations.",
    heroImage: { url: "/media/activities-hero.jpg", alt: "Activities hero" },
    cardImage: { url: "/media/activities-card.jpg", alt: "Activities card" },
    items: [],
  },
]

vi.mocked(fetchAddOnCategories).mockResolvedValue(categories)

function renderAddOnsPage() {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <ToastProvider>
          <WishlistProvider>
            <AddOnsPage />
          </WishlistProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("AddOnsPage", () => {
  it("renders the page hero title and a card linking to each add-on category", async () => {
    renderAddOnsPage()

    expect(await screen.findByRole("heading", { name: "Add-Ons", level: 1 })).toBeInTheDocument()
    for (const category of categories) {
      expect(screen.getByRole("link", { name: `Browse ${category.name} add-ons` })).toHaveAttribute(
        "href",
        `/packages/add-ons/${category.slug}`,
      )
    }
  })

  it("reveals a card's tagline panel on hover/focus and hides it again on leave/blur", async () => {
    renderAddOnsPage()
    const firstCategory = categories[0]

    const article = (await screen.findByRole("link", { name: `Browse ${firstCategory.name} add-ons` })).closest(
      "article",
    ) as HTMLElement
    const revealPanel = screen.getByText(firstCategory.tagline).parentElement as HTMLElement

    expect(revealPanel).toHaveClass("translate-y-full")

    fireEvent.mouseEnter(article)
    expect(revealPanel).toHaveClass("translate-y-0")
    fireEvent.mouseLeave(article)
    expect(revealPanel).toHaveClass("translate-y-full")

    fireEvent.focus(article)
    expect(revealPanel).toHaveClass("translate-y-0")
    fireEvent.blur(article)
    expect(revealPanel).toHaveClass("translate-y-full")
  })
})
