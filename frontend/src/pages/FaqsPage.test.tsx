import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { FaqsPage } from "./FaqsPage"
import { faqCategories, faqs } from "@/data/faqs"

vi.setConfig({ testTimeout: 15000 })

function renderFaqsPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <FaqsPage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("FaqsPage", () => {
  it("renders the page hero title and every FAQ category with a question", () => {
    renderFaqsPage()

    expect(screen.getByRole("heading", { name: "FAQs", level: 1 })).toBeInTheDocument()

    for (const category of faqCategories) {
      const items = faqs.filter((faq) => faq.category === category)
      if (items.length === 0) continue
      expect(screen.getByRole("heading", { name: category, level: 2 })).toBeInTheDocument()
      expect(screen.getByText(items[0].question)).toBeInTheDocument()
    }
  })
})
