import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { createTestQueryClient } from "@/test/queryClient"
import { ALaCartePage } from "./ALaCartePage"
import { fetchALaCarteItems } from "@/lib/api"
import type { CatalogItem } from "@/types"

vi.setConfig({ testTimeout: 15000 })
vi.mock("@/lib/api")

const A_LA_CARTE_ITEMS: CatalogItem[] = [
  {
    slug: "cross-back-chairs",
    name: "Cross Back Chairs",
    price: "$10.00",
    category: "Furniture > Seating & Chairs",
    image: "/media/a-la-carte/cross-back-chairs.jpg",
    description: ["Classic wood dining chairs with a crossed-back design."],
    pricing: [{ label: "Flat fee", value: "$10.00" }],
  },
]

vi.mocked(fetchALaCarteItems).mockResolvedValue(A_LA_CARTE_ITEMS)

function renderALaCartePage() {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <ToastProvider>
          <WishlistProvider>
            <ALaCartePage />
          </WishlistProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("ALaCartePage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("renders the page hero, every catalog item, and the FAQ accordion", async () => {
    renderALaCartePage()

    expect(await screen.findByRole("heading", { name: /A La.*Carte/s, level: 1 })).toBeInTheDocument()
    for (const item of A_LA_CARTE_ITEMS) {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    }
    expect(screen.getByText("How does the a la carte option work?")).toBeInTheDocument()
  })

  it("adds an item to the wishlist when its add button is clicked", async () => {
    const user = userEvent.setup()
    renderALaCartePage()
    const firstItem = A_LA_CARTE_ITEMS[0]

    await user.click(await screen.findByRole("button", { name: `Add ${firstItem.name} to wishlist` }))

    expect(screen.getByRole("button", { name: `Remove ${firstItem.name} from wishlist` })).toBeInTheDocument()
  })

  it("opens the item detail modal when an item name is clicked", async () => {
    const user = userEvent.setup()
    renderALaCartePage()
    const firstItem = A_LA_CARTE_ITEMS[0]

    await user.click(await screen.findByRole("button", { name: firstItem.name }))

    expect(screen.getByText(firstItem.description[0])).toBeInTheDocument()
  })
})
