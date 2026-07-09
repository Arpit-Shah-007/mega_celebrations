import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { AboutPage } from "./AboutPage"

vi.setConfig({ testTimeout: 15000 })

function renderAboutPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <AboutPage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("AboutPage", () => {
  it("renders the page hero title and founder story content", () => {
    renderAboutPage()

    expect(screen.getByRole("heading", { name: "About Us", level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/Mega Celebrations was created with the intent/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Little Buddies Soft Play" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse Packages" })).toHaveAttribute("href", "/packages")
  })
})
