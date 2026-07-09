import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WishlistItemRow } from "./WishlistItemRow"
import type { WishlistItem } from "@/types"

describe("WishlistItemRow", () => {
  it("renders the item name and starting price when price is known", () => {
    const item: WishlistItem = { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover", startingPrice: 80 }
    render(<WishlistItemRow item={item} onRemove={vi.fn()} />)

    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    expect(screen.getByText("Starting at $80")).toBeInTheDocument()
  })

  it('shows "Pricing coming soon" when startingPrice is 0', () => {
    const item: WishlistItem = { slug: "mystery-item", name: "Mystery Item", imageSeed: "mystery-item", startingPrice: 0 }
    render(<WishlistItemRow item={item} onRemove={vi.fn()} />)

    expect(screen.getByText("Pricing coming soon")).toBeInTheDocument()
  })

  it("calls onRemove with the item's slug when the remove button is clicked", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const item: WishlistItem = { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover", startingPrice: 80 }
    render(<WishlistItemRow item={item} onRemove={onRemove} />)

    await user.click(screen.getByRole("button", { name: "Remove Tent Sleepover from wishlist" }))
    expect(onRemove).toHaveBeenCalledWith("tent-sleepover")
  })
})
