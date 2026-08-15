import { beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { WishlistProvider } from "@/context/WishlistContext"
import { HONEYBOOK_INQUIRY_FORM_URL } from "@/components/wishlist/HoneyBookInquiryForm"
import { WishlistPage } from "./WishlistPage"
import type { WishlistItem } from "@/types"

const STORAGE_KEY = "mega-celebrations:wishlist"

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

  it("shows the wishlist panel and the embedded HoneyBook inquiry form when items are saved", () => {
    seedWishlist([
      { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
    ])

    const { container } = renderWishlistPage()

    expect(screen.queryByText("Your wishlist is empty")).not.toBeInTheDocument()
    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Request Your Custom Quote" })).toBeInTheDocument()
    expect(container.querySelector("iframe")).toHaveAttribute("src", HONEYBOOK_INQUIRY_FORM_URL)
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

  it("stacks the wishlist panel above the quote form at every width", () => {
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
