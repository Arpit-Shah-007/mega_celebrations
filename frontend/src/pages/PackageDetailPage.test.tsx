import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { createTestQueryClient } from "@/test/queryClient"
import { PackageDetailPage } from "./PackageDetailPage"
import { fetchPackageBySlug, fetchPackages } from "@/lib/api"
import type { Package } from "@/types"

vi.setConfig({ testTimeout: 15000 })
vi.mock("@/lib/api")

const VALID_SLUG = "tent-sleepover"

const tentSleepover: Package = {
  slug: VALID_SLUG,
  name: "Tent Sleepover",
  tagline: "An extraordinary experience.",
  tags: ["Indoor", "Sleepover"],
  description: "Turn an ordinary sleepover into an extraordinary experience.",
  inclusions: ["A-Frame tents with themed decor", "Junior-size foam mattresses"],
  heroImage: { url: "/media/hero.jpg", alt: "Hero" },
  cardImage: { url: "/media/card.jpg", alt: "Card" },
  gallery: [],
  startingPrice: 80,
  capacity: "4-10 guests",
  spaceRequirement: "Indoor space",
  themes: [{ name: "Magical Unicorn - Tent Sleepover", price: "$80.00", description: ["A magical unicorn theme."] }],
}

function renderPackageDetailPage(slug: string) {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter initialEntries={[`/packages/${slug}`]}>
        <ToastProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/packages/:slug" element={<PackageDetailPage />} />
            </Routes>
          </WishlistProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("PackageDetailPage", () => {
  beforeEach(() => {
    vi.mocked(fetchPackages).mockResolvedValue([tentSleepover])
    vi.mocked(fetchPackageBySlug).mockImplementation((slug) =>
      slug === VALID_SLUG ? Promise.resolve(tentSleepover) : Promise.reject(new Error("Package not found.")),
    )
  })

  it("renders the package's hero title, description, and inclusions for a valid slug", async () => {
    renderPackageDetailPage(VALID_SLUG)

    expect(await screen.findByRole("heading", { name: tentSleepover.name, level: 1 })).toBeInTheDocument()
    expect(screen.getByText(tentSleepover.description)).toBeInTheDocument()
    for (const inclusion of tentSleepover.inclusions) {
      expect(screen.getByText(inclusion)).toBeInTheDocument()
    }
  })

  it("renders the Choose Your Theme section when the package has themes", async () => {
    renderPackageDetailPage(VALID_SLUG)

    expect(await screen.findByRole("heading", { name: /Choose Your.*Theme/s })).toBeInTheDocument()
    expect(screen.getByText(tentSleepover.themes![0].name)).toBeInTheDocument()
  })

  it("opens a detail modal with a wishlist action when a theme card is clicked", async () => {
    const user = userEvent.setup()
    renderPackageDetailPage(VALID_SLUG)
    const firstTheme = tentSleepover.themes![0]

    await user.click(await screen.findByRole("button", { name: firstTheme.name }))

    const dialog = await screen.findByRole("dialog", { name: firstTheme.name })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText("Theme")).toBeInTheDocument()
    expect(within(dialog).getByRole("button", { name: "Add To Wishlist" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Close details" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("shows a not-found message and a link back to packages for an invalid slug", async () => {
    renderPackageDetailPage("this-package-does-not-exist")

    expect(await screen.findByRole("heading", { name: "Package not found" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse all packages" })).toHaveAttribute(
      "href",
      "/packages/full-services-packages",
    )
  })
})
