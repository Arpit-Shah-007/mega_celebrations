import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { PackagesListingPage } from "./PackagesListingPage"
import { packages } from "@/data/packages"

vi.setConfig({ testTimeout: 15000 })

function renderPackagesListingPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <PackagesListingPage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("PackagesListingPage", () => {
  it("renders the page hero title and every package card", () => {
    renderPackagesListingPage()

    expect(screen.getByRole("heading", { name: "Packages", level: 1 })).toBeInTheDocument()
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
