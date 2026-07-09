import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { PlanAPartyPage } from "./PlanAPartyPage"

vi.setConfig({ testTimeout: 15000 })

function renderPlanAPartyPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <PlanAPartyPage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("PlanAPartyPage", () => {
  it("renders the how-to-book section without the FAQs CTA and the choose-a-package options", () => {
    renderPlanAPartyPage()

    expect(screen.getByRole("heading", { name: /How to.*Book/s })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Read Our FAQs" })).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /Start by.*Choosing a Package/s })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Browse Full Service Packages/i })).toHaveAttribute(
      "href",
      "/packages/full-services-packages",
    )
  })
})
