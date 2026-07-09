import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QuoteSuccessPanel } from "./QuoteSuccessPanel"

describe("QuoteSuccessPanel", () => {
  it("renders the success heading and confirmation copy", () => {
    render(
      <MemoryRouter>
        <QuoteSuccessPanel />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: "Your quote request is on its way to us" })).toBeInTheDocument()
    expect(screen.getByText(/We'll put together your custom quote/)).toBeInTheDocument()
  })

  it("renders links back to packages and home", () => {
    render(
      <MemoryRouter>
        <QuoteSuccessPanel />
      </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: "Keep Browsing Packages" })).toHaveAttribute("href", "/packages")
    expect(screen.getByRole("link", { name: "Back To Home" })).toHaveAttribute("href", "/")
  })
})
