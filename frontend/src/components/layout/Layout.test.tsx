import { beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { WishlistProvider } from "@/context/WishlistContext"
import { Layout } from "./Layout"

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <WishlistProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Page Content</div>} />
          </Route>
        </Routes>
      </WishlistProvider>
    </MemoryRouter>,
  )
}

describe("Layout", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("renders the routed page content inside the layout via Outlet", () => {
    renderLayout()
    expect(screen.getByText("Page Content")).toBeInTheDocument()
  })

  it("renders the Header and Footer alongside the page content", () => {
    renderLayout()
    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})
