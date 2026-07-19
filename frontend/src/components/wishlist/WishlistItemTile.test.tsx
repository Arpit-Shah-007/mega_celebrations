import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { WishlistItem } from "@/types"
import { WishlistItemTile } from "./WishlistItemTile"

const item: WishlistItem = {
  slug: "tent-sleepover",
  name: "Tent Sleepover",
  imageSeed: "tent-sleepover-1",
  startingPrice: 80,
  category: "package",
}

describe("WishlistItemTile", () => {
  it("renders the item's name", () => {
    render(<WishlistItemTile item={item} onRemove={vi.fn()} />)

    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
  })

  it("calls onRemove with the item's slug when the remove control is clicked", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<WishlistItemTile item={item} onRemove={onRemove} />)

    await user.click(screen.getByRole("button", { name: "Remove Tent Sleepover from wishlist" }))

    expect(onRemove).toHaveBeenCalledWith("tent-sleepover")
  })
})
