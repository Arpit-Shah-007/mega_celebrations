import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WishlistSummary } from "./WishlistSummary"
import type { WishlistItem } from "@/types"

const items: WishlistItem[] = [
  { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover", startingPrice: 80 },
  { slug: "lace-teepee-sleepover", name: "Lace Teepee Sleepover", imageSeed: "lace-teepee-sleepover", startingPrice: 120 },
]

describe("WishlistSummary", () => {
  it("renders the item count and each item's name", () => {
    render(<WishlistSummary items={items} onRemove={vi.fn()} />)

    expect(screen.getByText("2 items")).toBeInTheDocument()
    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    expect(screen.getByText("Lace Teepee Sleepover")).toBeInTheDocument()
  })

  it("uses singular \"item\" wording for exactly one item", () => {
    render(<WishlistSummary items={[items[0]]} onRemove={vi.fn()} />)

    expect(screen.getByText("1 item")).toBeInTheDocument()
  })

  it("renders the estimated total as the sum of starting prices", () => {
    render(<WishlistSummary items={items} onRemove={vi.fn()} />)

    expect(screen.getByText("$200+")).toBeInTheDocument()
  })

  it("shows $0+ when there are no items", () => {
    render(<WishlistSummary items={[]} onRemove={vi.fn()} />)

    expect(screen.getByText("0 items")).toBeInTheDocument()
    expect(screen.getByText("$0+")).toBeInTheDocument()
  })

  it("calls onRemove with the correct slug when a row's remove button is clicked", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<WishlistSummary items={items} onRemove={onRemove} />)

    await user.click(screen.getByRole("button", { name: "Remove Lace Teepee Sleepover from wishlist" }))
    expect(onRemove).toHaveBeenCalledWith("lace-teepee-sleepover")
  })
})
