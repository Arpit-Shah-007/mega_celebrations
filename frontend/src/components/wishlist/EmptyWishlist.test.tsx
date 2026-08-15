import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { EmptyWishlist } from "./EmptyWishlist"

describe("EmptyWishlist", () => {
  it("renders the empty-state heading with no explanatory copy under it", () => {
    render(
      <MemoryRouter>
        <EmptyWishlist />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: "Your wishlist is empty" })).toBeInTheDocument()
    expect(screen.queryByText(/Browse our packages and tap the heart/)).not.toBeInTheDocument()
  })

  it("renders a CTA linking to the packages page", () => {
    render(
      <MemoryRouter>
        <EmptyWishlist />
      </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: "Browse Packages" })).toHaveAttribute("href", "/packages")
  })
})
