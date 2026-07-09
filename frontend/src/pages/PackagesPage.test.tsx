import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { PackagesPage } from "./PackagesPage"

vi.setConfig({ testTimeout: 15000 })

function renderPackagesPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <PackagesPage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("PackagesPage", () => {
  it("renders the page hero title and the choose-a-package options", () => {
    renderPackagesPage()

    expect(screen.getByRole("heading", { name: "Packages", level: 1 })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Browse Full Service Packages/i })).toHaveAttribute(
      "href",
      "/packages/full-services-packages",
    )
    expect(screen.getByRole("link", { name: /Browse A La Carte/i })).toHaveAttribute("href", "/packages/a-la-carte")
  })
})
