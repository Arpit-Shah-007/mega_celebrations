import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { Header } from "./Header"
import { primaryNav } from "@/data/nav"

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

describe("Header", () => {
  it("renders every primary nav link", () => {
    renderHeader()

    const primaryNavRegion = screen.getByRole("navigation", { name: "Primary" })
    for (const link of primaryNav) {
      expect(
        Array.from(primaryNavRegion.querySelectorAll("a")).some(
          (a) => a.textContent === link.label && a.getAttribute("href") === link.to,
        ),
      ).toBe(true)
    }
  })

  it("renders the Plan A Party call-to-action link", () => {
    renderHeader()
    const ctaLinks = screen.getAllByRole("link", { name: "Plan A Party" })
    expect(ctaLinks.length).toBeGreaterThan(0)
    expect(ctaLinks[0]).toHaveAttribute("href", "/plan-a-party")
  })

  it("hides the mobile menu by default", () => {
    renderHeader()
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false")
  })

  it("opens the mobile menu when the toggle button is clicked", async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole("button", { name: "Open menu" }))

    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true")
  })

  it("closes the mobile menu when the toggle button is clicked again", async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole("button", { name: "Open menu" }))
    await user.click(screen.getByRole("button", { name: "Close menu" }))

    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument()
  })
})
