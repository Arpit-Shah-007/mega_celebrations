import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import type { WishlistItem } from "@/types"
import { WishlistPanel } from "./WishlistPanel"

const items: WishlistItem[] = [
  { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
  { slug: "farm-table", name: "Farm Table", imageSeed: "farm-table-1", startingPrice: 125, category: "a-la-carte" },
  {
    slug: "theme-magical-unicorn",
    name: "Magical Unicorn",
    imageSeed: "theme-magical-unicorn",
    startingPrice: 0,
    category: "theme",
    packageSlug: "tent-sleepover",
  },
  { slug: "boho-umbrella", name: "Boho Umbrella", imageSeed: "boho-umbrella", startingPrice: 75, category: "add-on" },
]

function renderPanel(props: Partial<React.ComponentProps<typeof WishlistPanel>> = {}) {
  return render(
    <MemoryRouter>
      <WishlistPanel items={items} onRemove={vi.fn()} onClear={vi.fn()} {...props} />
    </MemoryRouter>,
  )
}

describe("WishlistPanel", () => {
  it("renders a pricing disclaimer instead of a computed total", () => {
    renderPanel()

    expect(screen.getByText("Your Picks")).toBeInTheDocument()
    expect(screen.getByText("Final pricing is confirmed in your custom quote.")).toBeInTheDocument()
    expect(screen.queryByText(/^\$/)).not.toBeInTheDocument()
  })

  it("renders exactly three sections in a fixed order: Packages, A La Carte, Add-Ons", () => {
    renderPanel()

    const headings = screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)
    expect(headings).toEqual(["Packages", "A La Carte", "Add-Ons"])
  })

  it("lays the three sections out side by side on wide screens", () => {
    const { container } = renderPanel()

    const sections = container.querySelector("div.grid")
    expect(sections).toHaveClass("lg:grid-cols-3")
    expect(sections?.children).toHaveLength(3)
  })

  it("nests a theme's item beneath its parent package instead of listing it separately", () => {
    renderPanel()

    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    expect(screen.getByText("Farm Table")).toBeInTheDocument()
    expect(screen.getByText("Magical Unicorn")).toBeInTheDocument()
    expect(screen.getByText("Boho Umbrella")).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Themes" })).not.toBeInTheDocument()
  })

  it("asks before emptying the wishlist, then clears it once confirmed", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    renderPanel({ onClear })

    await user.click(screen.getByRole("button", { name: /clear wishlist/i }))
    expect(onClear).not.toHaveBeenCalled()

    await user.click(screen.getByRole("button", { name: /yes, clear it/i }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it("lets the visitor back out of clearing the wishlist", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    renderPanel({ onClear })

    await user.click(screen.getByRole("button", { name: /clear wishlist/i }))
    await user.click(screen.getByRole("button", { name: /cancel/i }))

    expect(onClear).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: /clear wishlist/i })).toBeInTheDocument()
  })

  it("offers no clear control when there is nothing picked", () => {
    renderPanel({ items: [] })

    expect(screen.queryByRole("button", { name: /clear wishlist/i })).not.toBeInTheDocument()
  })

  it("shows an empty state with an explore link for a category with no items", () => {
    renderPanel({ items: [] })

    expect(screen.getAllByText("Nothing picked yet.")).toHaveLength(3)
    expect(screen.getByRole("link", { name: "Explore Packages" })).toHaveAttribute(
      "href",
      "/packages/full-services-packages",
    )
    expect(screen.getByRole("link", { name: "Explore A La Carte" })).toHaveAttribute("href", "/packages/a-la-carte")
    expect(screen.getByRole("link", { name: "Explore Add-Ons" })).toHaveAttribute("href", "/packages/add-ons")
  })
})
