import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { PackageDetailPage } from "./PackageDetailPage"
import { getPackageBySlug } from "@/data/packages"

vi.setConfig({ testTimeout: 15000 })

const VALID_SLUG = "tent-sleepover"

function renderPackageDetailPage(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/packages/${slug}`]}>
      <ToastProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/packages/:slug" element={<PackageDetailPage />} />
          </Routes>
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("PackageDetailPage", () => {
  it("renders the package's hero title, description, and inclusions for a valid slug", () => {
    renderPackageDetailPage(VALID_SLUG)
    const pkg = getPackageBySlug(VALID_SLUG)!

    expect(screen.getByRole("heading", { name: pkg.name, level: 1 })).toBeInTheDocument()
    expect(screen.getByText(pkg.description)).toBeInTheDocument()
    for (const inclusion of pkg.inclusions) {
      expect(screen.getByText(inclusion)).toBeInTheDocument()
    }
  })

  it("renders the Choose Your Theme section when the package has themes", () => {
    renderPackageDetailPage(VALID_SLUG)
    const pkg = getPackageBySlug(VALID_SLUG)!

    expect(screen.getByRole("heading", { name: /Choose Your.*Theme/s })).toBeInTheDocument()
    expect(screen.getByText(pkg.themes![0].name)).toBeInTheDocument()
  })

  it("opens a detail modal with a wishlist action when a theme card is clicked", async () => {
    const user = userEvent.setup()
    renderPackageDetailPage(VALID_SLUG)
    const pkg = getPackageBySlug(VALID_SLUG)!
    const firstTheme = pkg.themes![0]

    await user.click(screen.getByRole("button", { name: firstTheme.name }))

    const dialog = await screen.findByRole("dialog", { name: firstTheme.name })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText("Theme")).toBeInTheDocument()
    expect(within(dialog).getByRole("button", { name: "Add To Wishlist" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Close details" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("shows a not-found message and a link back to packages for an invalid slug", () => {
    renderPackageDetailPage("this-package-does-not-exist")

    expect(screen.getByRole("heading", { name: "Package not found" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse all packages" })).toHaveAttribute(
      "href",
      "/packages/full-services-packages",
    )
  })
})
