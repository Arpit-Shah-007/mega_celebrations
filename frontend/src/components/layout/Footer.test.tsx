import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Footer } from "./Footer"
import { footerNav, businessInfo } from "@/data/nav"

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )
}

describe("Footer", () => {
  it("renders every quick link from the footer nav data", () => {
    renderFooter()

    for (const link of footerNav) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.to)
    }
  })

  it("renders the Facebook and Instagram social links", () => {
    renderFooter()

    expect(screen.getByRole("link", { name: "Mega Celebrations on Facebook" })).toHaveAttribute(
      "href",
      businessInfo.facebook,
    )
    expect(screen.getByRole("link", { name: "Mega Celebrations on Instagram" })).toHaveAttribute(
      "href",
      businessInfo.instagram,
    )
  })

  it("renders the copyright notice", () => {
    renderFooter()
    expect(screen.getByText(/Copyright/)).toHaveTextContent("Copyright © 2026 - Mega Celebrations. All Rights Reserved.")
  })

  it("renders the business email as a mailto link", () => {
    renderFooter()
    expect(screen.getByRole("link", { name: businessInfo.email })).toHaveAttribute(
      "href",
      `mailto:${businessInfo.email}`,
    )
  })
})
