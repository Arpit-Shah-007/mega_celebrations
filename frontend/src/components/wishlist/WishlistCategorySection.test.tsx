import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Package } from "lucide-react"
import type { WishlistItem } from "@/types"
import { WishlistCategorySection } from "./WishlistCategorySection"

const items: WishlistItem[] = [
  { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
]

function renderSection(props: Partial<React.ComponentProps<typeof WishlistCategorySection>> = {}) {
  return render(
    <MemoryRouter>
      <WishlistCategorySection
        label="Packages"
        icon={Package}
        items={[]}
        onRemove={vi.fn()}
        emptyMessage="Nothing picked yet."
        exploreLabel="Explore Packages"
        exploreTo="/packages"
        {...props}
      />
    </MemoryRouter>,
  )
}

describe("WishlistCategorySection", () => {
  it("renders the section label and item count", () => {
    renderSection({ items })

    expect(screen.getByText("Packages")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("renders each item's name when the category has items", () => {
    renderSection({ items })

    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
  })

  it("renders the empty state with an explore link when the category has no items", () => {
    renderSection({ items: [] })

    expect(screen.getByText("Nothing picked yet.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Explore Packages" })).toHaveAttribute("href", "/packages")
  })

  it("shows an Add More link pointing at the same explore destination when the category has items", () => {
    renderSection({ items })

    expect(screen.getByRole("link", { name: "Add More" })).toHaveAttribute("href", "/packages")
  })
})
