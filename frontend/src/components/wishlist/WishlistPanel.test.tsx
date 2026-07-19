import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import type { WishlistItem } from "@/types"
import { WishlistPanel } from "./WishlistPanel"

const items: WishlistItem[] = [
  { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
  { slug: "farm-table", name: "Farm Table", imageSeed: "farm-table-1", startingPrice: 125, category: "a-la-carte" },
  { slug: "theme-magical-unicorn", name: "Magical Unicorn", imageSeed: "theme-magical-unicorn", startingPrice: 0, category: "theme" },
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

  it("renders exactly four sections in a fixed order: Packages, A La Carte, Themes, Add-Ons", () => {
    renderPanel()

    const headings = screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)
    expect(headings).toEqual(["Packages", "A La Carte", "Themes", "Add-Ons"])
  })

  it("places each item under its own category section", () => {
    renderPanel()

    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    expect(screen.getByText("Farm Table")).toBeInTheDocument()
    expect(screen.getByText("Magical Unicorn")).toBeInTheDocument()
    expect(screen.getByText("Boho Umbrella")).toBeInTheDocument()
  })

  it("shows an empty state with an explore link for a category with no items", () => {
    renderPanel({ items: [] })

    expect(screen.getAllByText("Nothing picked yet.")).toHaveLength(4)
    expect(screen.getByRole("link", { name: "Explore Packages" })).toHaveAttribute("href", "/packages")
    expect(screen.getByRole("link", { name: "Explore A La Carte" })).toHaveAttribute("href", "/packages/a-la-carte")
    expect(screen.getByRole("link", { name: "Explore Add-Ons" })).toHaveAttribute("href", "/packages/add-ons")
  })

  it("points the Themes empty state at choosing a package when no package is wishlisted yet", () => {
    renderPanel({ items: [] })

    expect(screen.getByRole("link", { name: "Choose a Package to Find Themes" })).toHaveAttribute(
      "href",
      "/packages/full-services-packages",
    )
  })

  it("points the Themes empty state at that specific package when one is already wishlisted", () => {
    const packageOnly: WishlistItem[] = [
      { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
    ]
    renderPanel({ items: packageOnly })

    expect(screen.getByRole("link", { name: "Browse Themes for Tent Sleepover" })).toHaveAttribute(
      "href",
      "/packages/tent-sleepover",
    )
  })

  it("uses the first wishlisted package when more than one is saved", () => {
    const twoPackages: WishlistItem[] = [
      { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
      { slug: "mega-lounge", name: "MEGALounge", imageSeed: "mega-lounge", startingPrice: 695, category: "package" },
    ]
    renderPanel({ items: twoPackages })

    expect(screen.getByRole("link", { name: "Browse Themes for Tent Sleepover" })).toHaveAttribute(
      "href",
      "/packages/tent-sleepover",
    )
  })
})
