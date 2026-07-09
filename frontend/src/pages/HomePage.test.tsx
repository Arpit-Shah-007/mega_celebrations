import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { HomePage } from "./HomePage"

vi.setConfig({ testTimeout: 15000 })

function renderHomePage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <HomePage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("HomePage", () => {
  it("renders the hero heading and key sections without crashing", () => {
    renderHomePage()

    expect(screen.getByRole("heading", { name: /Make Your Event.*a Mega Celebration/s })).toBeInTheDocument()
    expect(screen.getByText(/New Jersey's glamping, picnic and sleepover specialists/)).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /Browse Our.*Packages/s })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /How to.*Book/s })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /Our Clients.*Testimonials/s })).toBeInTheDocument()
  })
})
