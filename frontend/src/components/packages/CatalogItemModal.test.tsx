import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WishlistProvider } from "@/context/WishlistContext"
import { ToastProvider } from "@/context/ToastContext"
import { CatalogItemModal } from "./CatalogItemModal"
import type { CatalogItem } from "@/types"

const item: CatalogItem = {
  slug: "popcorn-machine",
  name: "Popcorn Machine",
  price: "$45.00",
  category: "A La Carte",
  image: "/media/popcorn.jpg",
  additionalImages: ["/media/popcorn-2.jpg"],
  description: ["Includes popcorn and butter for 25 servings.", "Delivered clean and ready to plug in."],
  pricing: [{ label: "Flat fee", value: "$45.00" }],
}

function renderModal(props: Partial<React.ComponentProps<typeof CatalogItemModal>> = {}) {
  const onClose = vi.fn()
  const utils = render(
    <ToastProvider>
      <WishlistProvider>
        <CatalogItemModal item={item} namespace="a-la-carte" category="a-la-carte" onClose={onClose} {...props} />
      </WishlistProvider>
    </ToastProvider>,
  )
  return { onClose, ...utils }
}

describe("CatalogItemModal", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("renders nothing when item is null", () => {
    render(
      <ToastProvider>
        <WishlistProvider>
          <CatalogItemModal item={null} namespace="a-la-carte" category="a-la-carte" onClose={vi.fn()} />
        </WishlistProvider>
      </ToastProvider>,
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("renders the item details when open", () => {
    renderModal()

    const dialog = screen.getByRole("dialog", { name: "Popcorn Machine" })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Popcorn Machine" })).toBeInTheDocument()
    expect(screen.getByText("Includes popcorn and butter for 25 servings.")).toBeInTheDocument()
  })

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()

    await user.click(screen.getByRole("button", { name: "Close item details" }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when the Escape key is pressed", async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()

    await user.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not call onClose when the backdrop is clicked", async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()

    await user.click(screen.getByRole("dialog"))
    expect(onClose).not.toHaveBeenCalled()
  })

  it("increments and decrements the quantity, never going below 1", async () => {
    const user = userEvent.setup()
    renderModal()

    const quantity = () => screen.getByText("1", { selector: "span" })
    expect(quantity()).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Decrease quantity" }))
    expect(screen.getByText("1", { selector: "span" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Increase quantity" }))
    expect(screen.getByText("2", { selector: "span" })).toBeInTheDocument()
  })

  it("shows a Remove From Wishlist control once the item is saved, alongside the persistent Add button", async () => {
    const user = userEvent.setup()
    renderModal()

    expect(screen.queryByRole("button", { name: "Remove From Wishlist" })).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))
    expect(screen.getByRole("button", { name: "Remove From Wishlist" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add To Wishlist" })).toBeInTheDocument()
  })

  it("removes the item entirely when Remove From Wishlist is clicked", async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))
    await user.click(screen.getByRole("button", { name: "Remove From Wishlist" }))

    expect(screen.queryByRole("button", { name: "Remove From Wishlist" })).not.toBeInTheDocument()
    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    expect(JSON.parse(raw as string)).toEqual([])
  })

  it("adds the chosen quantity, not just a single unit", async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole("button", { name: "Increase quantity" }))
    await user.click(screen.getByRole("button", { name: "Increase quantity" }))
    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))

    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    const parsed = JSON.parse(raw as string)
    expect(parsed[0].quantity).toBe(3)
  })

  it("accumulates quantity when adding the same item again instead of replacing it", async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))
    await user.click(screen.getByRole("button", { name: "Increase quantity" }))
    await user.click(screen.getByRole("button", { name: "Increase quantity" }))
    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))

    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    const parsed = JSON.parse(raw as string)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].quantity).toBe(4)
  })

  it("tags the saved item with the given category", async () => {
    const user = userEvent.setup()
    renderModal({ category: "add-on" })

    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))

    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    const parsed = JSON.parse(raw as string)
    expect(parsed[0].category).toBe("add-on")
  })

  it("saves the item's real photo url to the wishlist", async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))

    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    const parsed = JSON.parse(raw as string)
    expect(parsed[0].image).toBe("/media/popcorn.jpg")
  })

  it("switches the main photo when a thumbnail is clicked", async () => {
    const user = userEvent.setup()
    renderModal()

    const thumbnail = screen.getByRole("button", { name: "Show photo 2 of Popcorn Machine" })
    await user.click(thumbnail)

    expect(thumbnail).toHaveAttribute("aria-current", "true")
  })
})
