import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { WishlistSelectionsSummary } from "@/components/wishlist/WishlistSelectionsSummary"
import type { WishlistItem } from "@/types"

const items: WishlistItem[] = [
  { slug: "canopy-lounge", name: "Canopy Lounge", imageSeed: "canopy-lounge-1", startingPrice: 675 },
  { slug: "personalized-robes", name: "Personalized Robes", imageSeed: "robes-1", startingPrice: 40 },
]

describe("WishlistSelectionsSummary", () => {
  it("lists every wishlist item as a selection", () => {
    render(<WishlistSelectionsSummary items={items} />)

    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getByText("Canopy Lounge")).toBeInTheDocument()
    expect(screen.getByText("Personalized Robes")).toBeInTheDocument()
  })

  it("labels the card as a custom quote inquiry", () => {
    render(<WishlistSelectionsSummary items={items} />)

    expect(screen.getByText("Custom Quote Inquiry")).toBeInTheDocument()
  })

  it("tells the visitor to check the matching boxes in the form below", () => {
    render(<WishlistSelectionsSummary items={items} />)

    expect(
      screen.getByText("Check these same selections in the form below so your custom quote inquiry matches exactly what you picked."),
    ).toBeInTheDocument()
  })
})
