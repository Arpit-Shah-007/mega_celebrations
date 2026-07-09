import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { createTestQueryClient } from "@/test/queryClient"
import { HomePage } from "./HomePage"
import { fetchPackages } from "@/lib/api"

vi.setConfig({ testTimeout: 15000 })
vi.mock("@/lib/api")
vi.mocked(fetchPackages).mockResolvedValue([])

function renderHomePage() {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <ToastProvider>
          <WishlistProvider>
            <HomePage />
          </WishlistProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("HomePage", () => {
  it("renders the hero heading and key sections without crashing", async () => {
    renderHomePage()

    expect(screen.getByRole("heading", { name: /Make Your Event.*a Mega Celebration/s })).toBeInTheDocument()
    expect(screen.getByText(/New Jersey's glamping, picnic and sleepover specialists/)).toBeInTheDocument()
    expect(await screen.findByRole("heading", { name: /Browse Our.*Packages/s })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /How to.*Book/s })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /Our Clients.*Testimonials/s })).toBeInTheDocument()
  })
})
