import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WishlistHandoff } from "./WishlistHandoff"
import type { WishlistItem } from "@/types"

const ITEMS: WishlistItem[] = [
  { slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80, category: "package" },
  { slug: "balloons", name: "Balloons", imageSeed: "balloons", startingPrice: 75, category: "add-on", quantity: 2 },
]

describe("WishlistHandoff", () => {
  it("names the exact form question to paste into", () => {
    render(<WishlistHandoff items={ITEMS} />)

    expect(screen.getByText(/Any thing else you would like us to know\?/)).toBeInTheDocument()
  })

  it("copies the wishlist summary and confirms on the button alone", async () => {
    const user = userEvent.setup()
    render(<WishlistHandoff items={ITEMS} />)

    await user.click(screen.getByRole("button", { name: /copy my wishlist/i }))

    await expect(navigator.clipboard.readText()).resolves.toContain("- Tent Sleepover")
    await expect(navigator.clipboard.readText()).resolves.toContain("- Balloons x2")
    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument()
    // The confirmation sentence stays in the DOM for screen readers but is not shown.
    expect(screen.getByText(/Wishlist copied\. Paste it into/)).toHaveClass("sr-only")
  })

  it("shows the summary as selectable text when the clipboard is blocked", async () => {
    const user = userEvent.setup()
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("blocked")) },
    })
    render(<WishlistHandoff items={ITEMS} />)

    await user.click(screen.getByRole("button", { name: /copy my wishlist/i }))

    const fallback = await screen.findByLabelText(/select this text and copy it/i)
    expect((fallback as HTMLTextAreaElement).value).toContain("- Balloons x2")
  })

  it("renders nothing when there is no wishlist to hand over", () => {
    const { container } = render(<WishlistHandoff items={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
