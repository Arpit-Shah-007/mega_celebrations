import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WishlistProvider } from "@/context/WishlistContext"
import { ToastProvider } from "@/context/ToastContext"
import { CatalogItemCard } from "./CatalogItemCard"

function renderCard(props: Partial<React.ComponentProps<typeof CatalogItemCard>> = {}) {
  return render(
    <ToastProvider>
      <WishlistProvider>
        <CatalogItemCard name="Popcorn Machine" price="$45.00" namespace="a-la-carte" category="a-la-carte" {...props} />
      </WishlistProvider>
    </ToastProvider>,
  )
}

describe("CatalogItemCard", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("renders the item name and price", () => {
    renderCard()

    expect(screen.getByText("Popcorn Machine")).toBeInTheDocument()
    expect(screen.getByText("$45.00")).toBeInTheDocument()
  })

  it("renders the no-image placeholder copy when no image is provided", () => {
    renderCard()

    expect(screen.getByText("No image available.")).toBeInTheDocument()
  })

  it("adds the item to the wishlist when the toggle button is clicked", async () => {
    const user = userEvent.setup()
    renderCard()

    const toggle = screen.getByRole("button", { name: "Add Popcorn Machine to wishlist" })
    await user.click(toggle)

    expect(screen.getByRole("button", { name: "Remove Popcorn Machine from wishlist" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("tags the saved item with the given category", async () => {
    const user = userEvent.setup()
    renderCard({ category: "add-on" })

    await user.click(screen.getByRole("button", { name: "Add Popcorn Machine to wishlist" }))

    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    const parsed = JSON.parse(raw as string)
    expect(parsed[0].category).toBe("add-on")
  })

  it("saves the item's real photo url to the wishlist", async () => {
    const user = userEvent.setup()
    renderCard({ image: "/media/popcorn.jpg" })

    await user.click(screen.getByRole("button", { name: "Add Popcorn Machine to wishlist" }))

    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    const parsed = JSON.parse(raw as string)
    expect(parsed[0].image).toBe("/media/popcorn.jpg")
  })

  it("removes the item from the wishlist on a second click", async () => {
    const user = userEvent.setup()
    renderCard()

    const toggle = screen.getByRole("button", { name: "Add Popcorn Machine to wishlist" })
    await user.click(toggle)
    await user.click(screen.getByRole("button", { name: "Remove Popcorn Machine from wishlist" }))

    expect(screen.getByRole("button", { name: "Add Popcorn Machine to wishlist" })).toHaveAttribute(
      "aria-pressed",
      "false",
    )
  })

  it("calls onOpenDetails when the name is clicked and a handler is provided", async () => {
    const user = userEvent.setup()
    const onOpenDetails = vi.fn()
    renderCard({ onOpenDetails })

    await user.click(screen.getByRole("button", { name: "Popcorn Machine" }))
    expect(onOpenDetails).toHaveBeenCalledTimes(1)
  })

  it("renders the name as plain text when no onOpenDetails handler is given", () => {
    renderCard()

    expect(screen.queryByRole("button", { name: "Popcorn Machine" })).not.toBeInTheDocument()
    expect(screen.getByText("Popcorn Machine")).toBeInTheDocument()
  })
})
