import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { WishlistPage } from "./WishlistPage"
import type { WishlistItem } from "@/types"

vi.setConfig({ testTimeout: 15000 })

const API_BASE_URL = "http://localhost:8787"
const STORAGE_KEY = "mega-celebrations:wishlist"

const server = setupServer(
  http.post(`${API_BASE_URL}/api/quote-inquiries`, () => HttpResponse.json({ success: true, data: { id: 1 } })),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWishlistPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <WishlistPage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

function seedWishlist(items: WishlistItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

describe("WishlistPage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("shows the empty state when there are no wishlist items", () => {
    renderWishlistPage()

    expect(screen.getByRole("heading", { name: "Your Wishlist", level: 1 })).toBeInTheDocument()
    expect(screen.getByText("Your wishlist is empty")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse Packages" })).toHaveAttribute("href", "/packages")
  })

  it("shows the wishlist summary and quote form when items are saved", () => {
    seedWishlist([{ slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80 }])

    renderWishlistPage()

    expect(screen.queryByText("Your wishlist is empty")).not.toBeInTheDocument()
    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Request Your Custom Quote" })).toBeInTheDocument()
  })

  it("submits the quote, clears the wishlist, and shows the success panel", async () => {
    const user = userEvent.setup()
    seedWishlist([{ slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80 }])

    renderWishlistPage()

    await user.type(screen.getByLabelText("Full name"), "Jane Doe")
    await user.type(screen.getByLabelText("Email"), "jane@example.com")
    await user.type(screen.getByLabelText("Phone"), "9085550123")
    await user.type(screen.getByLabelText("Event date"), "2026-08-01")
    await user.type(screen.getByLabelText("Venue / address"), "Backyard")
    await user.type(screen.getByLabelText("Guest count"), "10 kids")
    await user.click(screen.getByRole("button", { name: "Request My Custom Quote" }))

    expect(
      await screen.findByRole("heading", { name: "Your quote request is on its way to us" }, { timeout: 3000 }),
    ).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Request Your Custom Quote" })).not.toBeInTheDocument()

    await waitFor(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      expect(stored ? JSON.parse(stored) : []).toEqual([])
    })
  })
})
