import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { WishlistItem } from "@/types"
import { WishlistProvider } from "./WishlistContext"
import { useWishlist } from "./useWishlist"

const STORAGE_KEY = "mega-celebrations:wishlist"

const itemA: WishlistItem = {
  slug: "canopy-lounge",
  name: "Canopy Lounge",
  imageSeed: "canopy-lounge-1",
  startingPrice: 675,
  category: "package",
}

const itemB: WishlistItem = {
  slug: "megalounge",
  name: "MEGALounge",
  imageSeed: "megalounge-1",
  startingPrice: 695,
  category: "add-on",
}

function WishlistHarness({ item }: { item: WishlistItem }) {
  const { items, addItem, removeItem, toggleItem, clear, isSaved } = useWishlist()
  return (
    <div>
      <p data-testid="count">{items.length}</p>
      <p data-testid="saved">{isSaved(item.slug) ? "saved" : "not-saved"}</p>
      <button type="button" onClick={() => addItem(item)}>
        Add
      </button>
      <button type="button" onClick={() => removeItem(item.slug)}>
        Remove
      </button>
      <button type="button" onClick={() => toggleItem(item)}>
        Toggle
      </button>
      <button type="button" onClick={() => clear()}>
        Clear
      </button>
    </div>
  )
}

function ThrowsOutsideProvider() {
  useWishlist()
  return null
}

describe("WishlistProvider / useWishlist", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("adds an item to the wishlist", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))

    expect(screen.getByTestId("count")).toHaveTextContent("1")
    expect(screen.getByTestId("saved")).toHaveTextContent("saved")
  })

  it("is idempotent when adding the same slug twice", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))
    await user.click(screen.getByRole("button", { name: "Add" }))

    expect(screen.getByTestId("count")).toHaveTextContent("1")
  })

  it("removes an item by slug", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))
    await user.click(screen.getByRole("button", { name: "Remove" }))

    expect(screen.getByTestId("count")).toHaveTextContent("0")
    expect(screen.getByTestId("saved")).toHaveTextContent("not-saved")
  })

  it("toggleItem adds the item when absent and removes it when present", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Toggle" }))
    expect(screen.getByTestId("saved")).toHaveTextContent("saved")
    expect(screen.getByTestId("count")).toHaveTextContent("1")

    await user.click(screen.getByRole("button", { name: "Toggle" }))
    expect(screen.getByTestId("saved")).toHaveTextContent("not-saved")
    expect(screen.getByTestId("count")).toHaveTextContent("0")
  })

  it("clear empties the wishlist", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))
    expect(screen.getByTestId("count")).toHaveTextContent("1")

    await user.click(screen.getByRole("button", { name: "Clear" }))
    expect(screen.getByTestId("count")).toHaveTextContent("0")
  })

  it("persists wishlist state to localStorage under the expected key", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))

    const raw = window.localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    const parsed: unknown = JSON.parse(raw as string)
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed).toEqual([itemA])
  })

  it("loads previously persisted items from localStorage on mount", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([itemB]))

    render(
      <WishlistProvider>
        <WishlistHarness item={itemB} />
      </WishlistProvider>,
    )

    expect(screen.getByTestId("count")).toHaveTextContent("1")
    expect(screen.getByTestId("saved")).toHaveTextContent("saved")
  })

  it("defaults a stored item's missing category to package on load", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ slug: "legacy-item", name: "Legacy Item", imageSeed: "legacy-item", startingPrice: 100 }]),
    )

    render(
      <WishlistProvider>
        <WishlistHarness item={{ ...itemA, slug: "legacy-item" }} />
      </WishlistProvider>,
    )

    expect(screen.getByTestId("count")).toHaveTextContent("1")
    expect(screen.getByTestId("saved")).toHaveTextContent("saved")
  })

  it("defaults a stored item's unrecognized category to package on load", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...itemA, slug: "legacy-item", category: "not-a-real-category" }]),
    )

    render(
      <WishlistProvider>
        <WishlistHarness item={{ ...itemA, slug: "legacy-item" }} />
      </WishlistProvider>,
    )

    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = JSON.parse(raw as string)
    expect(parsed[0].category).toBe("package")
  })

  it("throws when useWishlist is called outside a WishlistProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<ThrowsOutsideProvider />)).toThrow("useWishlist must be used within a WishlistProvider")

    consoleError.mockRestore()
  })
})
