import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
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
      <WishlistPanel items={items} onRemove={vi.fn()} {...props} />
    </MemoryRouter>,
  )
}

describe("WishlistPanel", () => {
  it("renders the estimated total across all categories", () => {
    renderPanel()

    expect(screen.getByText("Estimated Total")).toBeInTheDocument()
    expect(screen.getByText("$280+")).toBeInTheDocument()
  })

  it("renders exactly three sections in a fixed order: Packages, A La Carte, Add-Ons", () => {
    renderPanel()

    const headings = screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)
    expect(headings).toEqual(["Packages", "A La Carte", "Add-Ons"])
  })

  it("nests a theme's item beneath its parent package instead of listing it separately", () => {
    renderPanel()

    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    expect(screen.getByText("Farm Table")).toBeInTheDocument()
    expect(screen.getByText("Magical Unicorn")).toBeInTheDocument()
    expect(screen.getByText("Boho Umbrella")).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Themes" })).not.toBeInTheDocument()
  })

  it("shows an empty state with an explore link for a category with no items", () => {
    renderPanel({ items: [] })

    expect(screen.getAllByText("Nothing picked yet.")).toHaveLength(3)
    expect(screen.getByRole("link", { name: "Explore Packages" })).toHaveAttribute("href", "/packages")
    expect(screen.getByRole("link", { name: "Explore A La Carte" })).toHaveAttribute("href", "/packages/a-la-carte")
    expect(screen.getByRole("link", { name: "Explore Add-Ons" })).toHaveAttribute("href", "/packages/add-ons")
  })
})
