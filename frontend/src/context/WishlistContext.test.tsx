import { beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen, waitFor } from "@testing-library/react"
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

function WishlistHarness({
  item,
  relatedPackage,
  addQuantity = 1,
}: {
  item: WishlistItem
  relatedPackage?: WishlistItem
  addQuantity?: number
}) {
  const { items, addItem, removeItem, toggleItem, clear, isSaved } = useWishlist()
  const savedItem = items.find((existing) => existing.slug === item.slug)
  return (
    <div>
      <p data-testid="count">{items.length}</p>
      <p data-testid="names">{items.map((existing) => existing.name).join(",")}</p>
      <p data-testid="saved">{isSaved(item.slug) ? "saved" : "not-saved"}</p>
      <p data-testid="quantity">{savedItem?.quantity ?? ""}</p>
      <button type="button" onClick={() => addItem(item, addQuantity)}>
        Add
      </button>
      <button type="button" onClick={() => removeItem(item.slug)}>
        Remove
      </button>
      <button type="button" onClick={() => toggleItem(item, relatedPackage)}>
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

  it("adds an item to the wishlist with a default quantity of 1", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))

    expect(screen.getByTestId("count")).toHaveTextContent("1")
    expect(screen.getByTestId("saved")).toHaveTextContent("saved")
    expect(screen.getByTestId("quantity")).toHaveTextContent("1")
  })

  it("adding the same slug again accumulates quantity instead of creating a duplicate row", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))
    await user.click(screen.getByRole("button", { name: "Add" }))

    expect(screen.getByTestId("count")).toHaveTextContent("1")
    expect(screen.getByTestId("quantity")).toHaveTextContent("2")
  })

  it("adding 5 more to an existing 1 results in 6, not 5 or 1", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <WishlistProvider>
        <WishlistHarness item={itemA} addQuantity={1} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))
    expect(screen.getByTestId("quantity")).toHaveTextContent("1")

    rerender(
      <WishlistProvider>
        <WishlistHarness item={itemA} addQuantity={5} />
      </WishlistProvider>,
    )
    await user.click(screen.getByRole("button", { name: "Add" }))

    expect(screen.getByTestId("count")).toHaveTextContent("1")
    expect(screen.getByTestId("quantity")).toHaveTextContent("6")
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
    expect(parsed).toEqual([{ ...itemA, quantity: 1 }])
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

  it("toggleItem auto-adds the related package alongside a theme, then removes the package once the theme is toggled off again", async () => {
    const user = userEvent.setup()
    const theme: WishlistItem = {
      slug: "theme-batter-up",
      name: "Batter Up",
      imageSeed: "theme-batter-up",
      startingPrice: 80,
      category: "theme",
      packageSlug: "tent-sleepover",
    }
    const relatedPackage: WishlistItem = {
      slug: "tent-sleepover",
      name: "Tent Sleepover",
      imageSeed: "tent-sleepover-1",
      startingPrice: 80,
      category: "package",
    }
    render(
      <WishlistProvider>
        <WishlistHarness item={theme} relatedPackage={relatedPackage} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Toggle" }))
    expect(screen.getByTestId("count")).toHaveTextContent("2")
    expect(screen.getByTestId("names")).toHaveTextContent("Tent Sleepover,Batter Up")

    await user.click(screen.getByRole("button", { name: "Toggle" }))
    expect(screen.getByTestId("count")).toHaveTextContent("0")
  })

  it("removeItem also removes the parent package once its last theme is removed", async () => {
    const theme: WishlistItem = {
      slug: "theme-batter-up",
      name: "Batter Up",
      imageSeed: "theme-batter-up",
      startingPrice: 80,
      category: "theme",
      packageSlug: "tent-sleepover",
    }
    const relatedPackage: WishlistItem = {
      slug: "tent-sleepover",
      name: "Tent Sleepover",
      imageSeed: "tent-sleepover-1",
      startingPrice: 80,
      category: "package",
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([relatedPackage, theme]))
    const user = userEvent.setup()

    render(
      <WishlistProvider>
        <WishlistHarness item={theme} />
      </WishlistProvider>,
    )

    expect(screen.getByTestId("count")).toHaveTextContent("2")

    await user.click(screen.getByRole("button", { name: "Remove" }))
    expect(screen.getByTestId("count")).toHaveTextContent("0")
  })

  it("removeItem keeps the package if it still has another theme left", async () => {
    const themeA: WishlistItem = {
      slug: "theme-batter-up",
      name: "Batter Up",
      imageSeed: "theme-batter-up",
      startingPrice: 80,
      category: "theme",
      packageSlug: "tent-sleepover",
    }
    const themeB: WishlistItem = {
      slug: "theme-boho-chic",
      name: "Boho Chic",
      imageSeed: "theme-boho-chic",
      startingPrice: 80,
      category: "theme",
      packageSlug: "tent-sleepover",
    }
    const relatedPackage: WishlistItem = {
      slug: "tent-sleepover",
      name: "Tent Sleepover",
      imageSeed: "tent-sleepover-1",
      startingPrice: 80,
      category: "package",
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([relatedPackage, themeA, themeB]))
    const user = userEvent.setup()

    render(
      <WishlistProvider>
        <WishlistHarness item={themeA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Remove" }))
    expect(screen.getByTestId("count")).toHaveTextContent("2")
    expect(screen.getByTestId("names")).toHaveTextContent("Tent Sleepover,Boho Chic")
  })

  it("removeItem also removes every theme nested under a package when the package is removed directly", async () => {
    const themeA: WishlistItem = {
      slug: "theme-batter-up",
      name: "Batter Up",
      imageSeed: "theme-batter-up",
      startingPrice: 80,
      category: "theme",
      packageSlug: "tent-sleepover",
    }
    const themeB: WishlistItem = {
      slug: "theme-boho-chic",
      name: "Boho Chic",
      imageSeed: "theme-boho-chic",
      startingPrice: 80,
      category: "theme",
      packageSlug: "tent-sleepover",
    }
    const relatedPackage: WishlistItem = {
      slug: "tent-sleepover",
      name: "Tent Sleepover",
      imageSeed: "tent-sleepover-1",
      startingPrice: 80,
      category: "package",
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([relatedPackage, themeA, themeB]))
    const user = userEvent.setup()

    render(
      <WishlistProvider>
        <WishlistHarness item={relatedPackage} />
      </WishlistProvider>,
    )

    expect(screen.getByTestId("count")).toHaveTextContent("3")

    await user.click(screen.getByRole("button", { name: "Remove" }))
    expect(screen.getByTestId("count")).toHaveTextContent("0")
  })

  it("re-syncs from localStorage when the page is restored from bfcache, discarding stale in-memory state", async () => {
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    // Simulates another page (e.g. the post-submit thank-you page) clearing the wishlist
    // while this instance sat frozen in bfcache with its old, pre-clear state.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([itemB]))

    const pageShowEvent = new Event("pageshow") as PageTransitionEvent
    Object.defineProperty(pageShowEvent, "persisted", { value: true })
    act(() => window.dispatchEvent(pageShowEvent))

    await waitFor(() => expect(screen.getByTestId("names")).toHaveTextContent("MEGALounge"))
  })

  it("ignores a normal (non-bfcache) pageshow, leaving in-memory state alone", async () => {
    const user = userEvent.setup()
    render(
      <WishlistProvider>
        <WishlistHarness item={itemA} />
      </WishlistProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Add" }))
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([itemB]))

    const pageShowEvent = new Event("pageshow") as PageTransitionEvent
    Object.defineProperty(pageShowEvent, "persisted", { value: false })
    act(() => window.dispatchEvent(pageShowEvent))

    expect(screen.getByTestId("names")).toHaveTextContent("Canopy Lounge")
  })

  it("throws when useWishlist is called outside a WishlistProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<ThrowsOutsideProvider />)).toThrow("useWishlist must be used within a WishlistProvider")

    consoleError.mockRestore()
  })
})
