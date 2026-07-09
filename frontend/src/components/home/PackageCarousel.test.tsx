import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { PackageCarousel } from "./PackageCarousel"
import { createTestQueryClient } from "@/test/queryClient"
import type { Package } from "@/types"

const VISIBLE = 4

function buildPackage(index: number): Package {
  return {
    slug: `package-${index}`,
    name: `Package ${index}`,
    tagline: `Tagline ${index}`,
    tags: ["Indoor"],
    description: "A description",
    inclusions: [],
    heroImage: { url: "/media/hero.jpg", alt: "Hero" },
    cardImage: { url: "/media/card.jpg", alt: "Card" },
    gallery: [],
    priceTiers: [{ label: "Flat rate", price: 100 }],
    startingPrice: 100,
    capacity: "Up to 10 guests",
    spaceRequirement: "10x10ft",
  }
}

const packages = Array.from({ length: 10 }, (_, index) => buildPackage(index))

vi.mock("@/lib/api", () => ({
  fetchPackages: vi.fn(() => Promise.resolve(packages)),
}))

function renderCarousel() {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <PackageCarousel />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("PackageCarousel", () => {
  it("renders the first page of package cards", async () => {
    renderCarousel()

    for (const pkg of packages.slice(0, VISIBLE)) {
      expect((await screen.findAllByText(pkg.name)).length).toBeGreaterThan(0)
    }
  })

  it("renders previous/next controls", async () => {
    renderCarousel()

    expect(await screen.findByRole("button", { name: "Previous packages" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next packages" })).toBeInTheDocument()
  })

  it("advances to the next page of packages when Next is clicked", async () => {
    const user = userEvent.setup()
    renderCarousel()

    await user.click(await screen.findByRole("button", { name: "Next packages" }))

    const nextPagePackage = packages[VISIBLE]
    await waitFor(() => {
      expect(screen.getAllByText(nextPagePackage.name).length).toBeGreaterThan(0)
    })
  })

  it("goes to the last page when Previous is clicked from the first page (round scroll)", async () => {
    const user = userEvent.setup()
    renderCarousel()

    await user.click(await screen.findByRole("button", { name: "Previous packages" }))

    const pageCount = Math.ceil(packages.length / VISIBLE)
    const lastPageStart = (pageCount - 1) * VISIBLE
    const lastPagePackage = packages[lastPageStart]

    await waitFor(() => {
      expect(screen.getAllByText(lastPagePackage.name).length).toBeGreaterThan(0)
    })
  })

  it("scopes each rendered package card behind a link to its detail page", async () => {
    renderCarousel()

    const firstPackage = packages[0]
    const heading = (await screen.findAllByText(firstPackage.name))[0]
    const card = heading.closest("article")
    expect(card).not.toBeNull()
    if (card) {
      expect(within(card).getAllByRole("link")[0]).toHaveAttribute("href", `/packages/${firstPackage.slug}`)
    }
  })
})
