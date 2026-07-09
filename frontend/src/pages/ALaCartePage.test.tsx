import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { ALaCartePage } from "./ALaCartePage"
import aLaCarteItemsData from "@/data/aLaCarteItems.json"
import type { CatalogItem } from "@/types"

vi.setConfig({ testTimeout: 15000 })

const A_LA_CARTE_ITEMS = aLaCarteItemsData as CatalogItem[]

function renderALaCartePage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <ALaCartePage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("ALaCartePage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("renders the page hero, every catalog item, and the FAQ accordion", () => {
    renderALaCartePage()

    expect(screen.getByRole("heading", { name: /A La.*Carte/s, level: 1 })).toBeInTheDocument()
    for (const item of A_LA_CARTE_ITEMS) {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    }
    expect(screen.getByText("How does the a la carte option work?")).toBeInTheDocument()
  })

  it("adds an item to the wishlist when its add button is clicked", async () => {
    const user = userEvent.setup()
    renderALaCartePage()
    const firstItem = A_LA_CARTE_ITEMS[0]

    await user.click(screen.getByRole("button", { name: `Add ${firstItem.name} to wishlist` }))

    expect(screen.getByRole("button", { name: `Remove ${firstItem.name} from wishlist` })).toBeInTheDocument()
  })

  it("opens the item detail modal when an item name is clicked", async () => {
    const user = userEvent.setup()
    renderALaCartePage()
    const firstItem = A_LA_CARTE_ITEMS[0]

    await user.click(screen.getByRole("button", { name: firstItem.name }))

    expect(screen.getByText(firstItem.description[0])).toBeInTheDocument()
  })
})
