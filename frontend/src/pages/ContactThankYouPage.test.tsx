import { beforeEach, describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { WishlistProvider } from "@/context/WishlistContext"
import { ContactThankYouPage } from "./ContactThankYouPage"

const STORAGE_KEY = "mega-celebrations:wishlist"

function renderPage() {
  return render(
    <MemoryRouter>
      <WishlistProvider>
        <ContactThankYouPage />
      </WishlistProvider>
    </MemoryRouter>,
  )
}

describe("ContactThankYouPage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("shows a thank-you message", () => {
    renderPage()
    expect(screen.getByRole("heading", { name: "Your request is on its way to us" })).toBeInTheDocument()
  })

  it("clears the wishlist on mount", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ slug: "tent-sleepover", name: "Tent Sleepover", imageSeed: "tent-sleepover-1", startingPrice: 80 }]),
    )

    renderPage()

    await waitFor(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      expect(stored ? JSON.parse(stored) : []).toEqual([])
    })
  })

  it("links back to packages and home", () => {
    renderPage()
    expect(screen.getByRole("link", { name: "Keep Browsing Packages" })).toHaveAttribute("href", "/packages")
    expect(screen.getByRole("link", { name: "Back To Home" })).toHaveAttribute("href", "/")
  })
})
