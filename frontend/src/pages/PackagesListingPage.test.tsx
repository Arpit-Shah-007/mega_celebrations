import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { createTestQueryClient } from "@/test/queryClient"
import { PackagesListingPage } from "./PackagesListingPage"
import { fetchPackages } from "@/lib/api"
import type { Package } from "@/types"

vi.setConfig({ testTimeout: 15000 })
vi.mock("@/lib/api")

function buildPackage(slug: string, tags: Package["tags"]): Package {
  return {
    slug,
    name: `Package ${slug}`,
    tagline: "A tagline",
    tags,
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

const packages: Package[] = [
  buildPackage("tent-sleepover", ["Indoor", "Sleepover"]),
  buildPackage("celebrations-picnic-adult", ["Dining", "Outdoor"]),
]

vi.mocked(fetchPackages).mockResolvedValue(packages)

function renderPackagesListingPage() {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <ToastProvider>
          <WishlistProvider>
            <PackagesListingPage />
          </WishlistProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("PackagesListingPage", () => {
  it("renders the page hero title and every package card", async () => {
    renderPackagesListingPage()

    expect(await screen.findByRole("heading", { name: "Packages", level: 1 })).toBeInTheDocument()
    for (const pkg of packages) {
      expect(screen.getByRole("link", { name: `View details for ${pkg.name}` })).toHaveAttribute(
        "href",
        `/packages/${pkg.slug}`,
      )
    }
  })

  it("filters packages by tag when a filter pill is clicked", async () => {
    const user = userEvent.setup()
    renderPackagesListingPage()
    await screen.findByRole("heading", { name: "Packages", level: 1 })

    const diningPackages = packages.filter((pkg) => pkg.tags.includes("Dining"))
    const nonDiningPackage = packages.find((pkg) => !pkg.tags.includes("Dining"))
    expect(nonDiningPackage).toBeDefined()

    await user.click(screen.getByRole("button", { name: "Dining" }))

    for (const pkg of diningPackages) {
      expect(screen.getByRole("link", { name: `View details for ${pkg.name}` })).toBeInTheDocument()
    }
    expect(screen.queryByRole("link", { name: `View details for ${nonDiningPackage!.name}` })).not.toBeInTheDocument()
  })
})
