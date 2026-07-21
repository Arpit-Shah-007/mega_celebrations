import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { WishlistProvider } from "@/context/WishlistContext"
import { WishlistPage } from "./WishlistPage"
import type { WishlistItem } from "@/types"

const STORAGE_KEY = "mega-celebrations:wishlist"
const HONEYBOOK_SCRIPT_SRC =
  "https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js"

afterEach(() => {
  document.querySelectorAll(`script[src="${HONEYBOOK_SCRIPT_SRC}"]`).forEach((tag) => tag.remove())
})

function renderWishlistPage() {
  return render(
    <MemoryRouter>
      <WishlistProvider>
        <WishlistPage />
      </WishlistProvider>
    </MemoryRouter>,
  )
}

function seedWishlist(items: WishlistItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

describe("WishlistPage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("shows the empty state when there are no wishlist items", () => {
    renderWishlistPage()

    expect(screen.getByRole("heading", { name: "Your Wishlist", level: 1 })).toBeInTheDocument()
    expect(screen.getByText("Your wishlist is empty")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse Packages" })).toHaveAttribute("href", "/packages")
  })

  it("shows the wishlist panel and HoneyBook widget when items are saved", () => {
    seedWishlist([
      { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
    ])

    const { container } = renderWishlistPage()

    expect(screen.queryByText("Your wishlist is empty")).not.toBeInTheDocument()
    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Request Your Custom Quote" })).toBeInTheDocument()
    expect(container.querySelector(".hb-p-5de351586567280cf9f3b1e7-7")).toBeInTheDocument()
  })

  it("renders all three wishlist categories and a pricing disclaimer instead of a computed total", () => {
    seedWishlist([
      { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
    ])

    renderWishlistPage()

    expect(screen.getByText("Packages")).toBeInTheDocument()
    expect(screen.getByText("A La Carte")).toBeInTheDocument()
    expect(screen.getByText("Add-Ons")).toBeInTheDocument()
    expect(screen.getByText("Final pricing is confirmed in your custom quote.")).toBeInTheDocument()
    expect(screen.queryByText(/^\$/)).not.toBeInTheDocument()
  })

  it("places the wishlist panel before the quote form in DOM order (left column on desktop, top of the stack on mobile)", () => {
    seedWishlist([
      { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
    ])

    renderWishlistPage()

    const body = document.body.innerHTML
    expect(body.indexOf("Final pricing is confirmed")).toBeLessThan(body.indexOf("Request Your Custom Quote"))
  })

  it("lets the visitor remove an item from the wishlist", async () => {
    const user = userEvent.setup()
    seedWishlist([
      { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
    ])

    renderWishlistPage()

    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Remove Tent Sleepover from wishlist" }))

    expect(await screen.findByText("Your wishlist is empty")).toBeInTheDocument()
  })
})
