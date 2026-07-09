import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { AddOnCategoryPage } from "./AddOnCategoryPage"
import { getAddOnBySlug } from "@/data/addOns"

vi.setConfig({ testTimeout: 15000 })

const VALID_SLUG = "decor"

function renderAddOnCategoryPage(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/packages/add-ons/${slug}`]}>
      <ToastProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/packages/add-ons/:slug" element={<AddOnCategoryPage />} />
          </Routes>
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("AddOnCategoryPage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("renders the category's hero title, description, and every item for a valid slug", () => {
    renderAddOnCategoryPage(VALID_SLUG)
    const category = getAddOnBySlug(VALID_SLUG)!

    expect(screen.getByRole("heading", { name: category.name, level: 1 })).toBeInTheDocument()
    expect(screen.getByText(category.description)).toBeInTheDocument()
    for (const item of category.items) {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    }
  })

  it("shows a not-found message and a link back to add-ons for an invalid slug", () => {
    renderAddOnCategoryPage("this-category-does-not-exist")

    expect(screen.getByRole("heading", { name: "Add-on category not found" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse all add-ons" })).toHaveAttribute("href", "/packages/add-ons")
  })
})
