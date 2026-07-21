import { beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { WishlistProvider } from "@/context/WishlistContext"
import { FloatingWishlistWidget } from "./FloatingWishlistWidget"

function renderWidget(initialEntries: string[] = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <WishlistProvider>
        <FloatingWishlistWidget />
      </WishlistProvider>
    </MemoryRouter>,
  )
}

describe("FloatingWishlistWidget", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("shows a count of 0 when the wishlist is empty", () => {
    renderWidget()
    expect(screen.getByRole("link", { name: "View wishlist, 0 items" })).toBeInTheDocument()
  })

  it("reflects the number of saved items from localStorage", () => {
    window.localStorage.setItem(
      "mega-celebrations:wishlist",
      JSON.stringify([
        { slug: "addon-1", name: "Add-On One", imageSeed: "addon-1", startingPrice: 100, category: "add-on" },
        { slug: "addon-2", name: "Add-On Two", imageSeed: "addon-2", startingPrice: 200, category: "add-on" },
      ]),
    )

    renderWidget()

    expect(screen.getByRole("link", { name: "View wishlist, 2 items" })).toBeInTheDocument()
  })

  it("uses singular item wording when there is exactly one saved item", () => {
    window.localStorage.setItem(
      "mega-celebrations:wishlist",
      JSON.stringify([{ slug: "addon-1", name: "Add-On One", imageSeed: "addon-1", startingPrice: 100, category: "add-on" }]),
    )

    renderWidget()

    expect(screen.getByRole("link", { name: "View wishlist, 1 item" })).toBeInTheDocument()
  })

  it("does not count an auto-added package toward the shown total, since it's the same pick as its theme", () => {
    window.localStorage.setItem(
      "mega-celebrations:wishlist",
      JSON.stringify([
        { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover", startingPrice: 80, category: "package" },
        {
          slug: "theme-magical-unicorn",
          name: "Magical Unicorn",
          imageSeed: "theme-magical-unicorn",
          startingPrice: 0,
          category: "theme",
          packageSlug: "tent-sleepover",
        },
      ]),
    )

    renderWidget()

    expect(screen.getByRole("link", { name: "View wishlist, 1 item" })).toBeInTheDocument()
  })

  it("links to the wishlist page", () => {
    renderWidget()
    expect(screen.getByRole("link", { name: "View wishlist, 0 items" })).toHaveAttribute("href", "/wishlist")
  })

  it("is hidden when already on the wishlist page", () => {
    renderWidget(["/wishlist"])
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})
