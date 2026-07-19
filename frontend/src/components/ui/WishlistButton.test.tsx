import { beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactNode } from "react"
import { WishlistProvider } from "@/context/WishlistContext"
import { ToastProvider } from "@/context/ToastContext"
import type { Package } from "@/types"
import { WishlistButton } from "./WishlistButton"

const pkg: Package = {
  slug: "mega-lounge",
  name: "Mega Lounge",
  tagline: "A cozy lounge setup",
  tags: ["Lounge"],
  description: "A lounge package",
  inclusions: [],
  heroImage: { url: "/media/hero.jpg", alt: "Mega Lounge photo" },
  cardImage: { url: "/media/card.jpg", alt: "Mega Lounge photo" },
  gallery: [],
  startingPrice: 500,
  capacity: "10-20 guests",
  spaceRequirement: "200 sq ft",
}

function renderWithProviders(ui: ReactNode) {
  return render(
    <ToastProvider>
      <WishlistProvider>{ui}</WishlistProvider>
    </ToastProvider>,
  )
}

describe("WishlistButton", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("shows the unsaved state and label when the package is not in the wishlist", () => {
    renderWithProviders(<WishlistButton pkg={pkg} />)

    const button = screen.getByRole("button", { name: "Add Mega Lounge to wishlist" })
    expect(button).toHaveAttribute("aria-pressed", "false")
  })

  it("toggles to the saved state when clicked", async () => {
    const user = userEvent.setup()
    renderWithProviders(<WishlistButton pkg={pkg} />)

    await user.click(screen.getByRole("button", { name: "Add Mega Lounge to wishlist" }))

    expect(screen.getByRole("button", { name: "Remove Mega Lounge from wishlist" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("toggles back to the unsaved state when clicked a second time", async () => {
    const user = userEvent.setup()
    renderWithProviders(<WishlistButton pkg={pkg} />)

    const button = screen.getByRole("button", { name: "Add Mega Lounge to wishlist" })
    await user.click(button)
    await user.click(screen.getByRole("button", { name: "Remove Mega Lounge from wishlist" }))

    expect(screen.getByRole("button", { name: "Add Mega Lounge to wishlist" })).toHaveAttribute(
      "aria-pressed",
      "false",
    )
  })

  it("reflects an already-saved item on initial render", () => {
    window.localStorage.setItem(
      "mega-celebrations:wishlist",
      JSON.stringify([{ slug: "mega-lounge", name: "Mega Lounge", imageSeed: "mega-lounge", startingPrice: 500 }]),
    )

    renderWithProviders(<WishlistButton pkg={pkg} />)

    expect(screen.getByRole("button", { name: "Remove Mega Lounge from wishlist" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("tags the saved item with the package category", async () => {
    const user = userEvent.setup()
    renderWithProviders(<WishlistButton pkg={pkg} />)

    await user.click(screen.getByRole("button", { name: "Add Mega Lounge to wishlist" }))

    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    const parsed = JSON.parse(raw as string)
    expect(parsed[0].category).toBe("package")
  })

  it("shows a toast message after toggling", async () => {
    const user = userEvent.setup()
    renderWithProviders(<WishlistButton pkg={pkg} />)

    await user.click(screen.getByRole("button", { name: "Add Mega Lounge to wishlist" }))

    expect(await screen.findByText("Added Mega Lounge to your wishlist")).toBeInTheDocument()
  })
})
