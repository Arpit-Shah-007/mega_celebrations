import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { NotFoundPage } from "./NotFoundPage"

vi.setConfig({ testTimeout: 15000 })

describe("NotFoundPage", () => {
  it("renders the 404 heading and a link back home", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument()
    expect(screen.getByText("We couldn't find that page.")).toBeInTheDocument()
    const link = screen.getByRole("link", { name: "Back to home" })
    expect(link).toHaveAttribute("href", "/")
  })
})
