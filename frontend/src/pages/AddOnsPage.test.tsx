import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { AddOnsPage } from "./AddOnsPage"
import { addOnCategories } from "@/data/addOns"

vi.setConfig({ testTimeout: 15000 })

function renderAddOnsPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <AddOnsPage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("AddOnsPage", () => {
  it("renders the page hero title and a card linking to each add-on category", () => {
    renderAddOnsPage()

    expect(screen.getByRole("heading", { name: "Add-Ons", level: 1 })).toBeInTheDocument()
    for (const category of addOnCategories) {
      expect(screen.getByRole("link", { name: `Browse ${category.name} add-ons` })).toHaveAttribute(
        "href",
        `/packages/add-ons/${category.slug}`,
      )
    }
  })

  it("reveals a card's tagline panel on hover/focus and hides it again on leave/blur", () => {
    renderAddOnsPage()
    const firstCategory = addOnCategories[0]

    const article = screen
      .getByRole("link", { name: `Browse ${firstCategory.name} add-ons` })
      .closest("article") as HTMLElement
    const revealPanel = screen.getByText(firstCategory.tagline).parentElement as HTMLElement

    expect(revealPanel).toHaveClass("translate-y-full")

    fireEvent.mouseEnter(article)
    expect(revealPanel).toHaveClass("translate-y-0")
    fireEvent.mouseLeave(article)
    expect(revealPanel).toHaveClass("translate-y-full")

    fireEvent.focus(article)
    expect(revealPanel).toHaveClass("translate-y-0")
    fireEvent.blur(article)
    expect(revealPanel).toHaveClass("translate-y-full")
  })
})
