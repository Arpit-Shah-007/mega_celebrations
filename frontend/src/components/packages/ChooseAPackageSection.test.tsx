import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ChooseAPackageSection } from "./ChooseAPackageSection"

describe("ChooseAPackageSection", () => {
  it("renders both package options with links to their listing pages", () => {
    render(
      <MemoryRouter>
        <ChooseAPackageSection />
      </MemoryRouter>,
    )

    const fullServiceLinks = screen.getAllByRole("link", { name: "Full Service Packages" })
    expect(fullServiceLinks[0]).toHaveAttribute("href", "/packages/full-services-packages")

    const aLaCarteLinks = screen.getAllByRole("link", { name: "A La Carte" })
    expect(aLaCarteLinks[0]).toHaveAttribute("href", "/packages/a-la-carte")
  })

  it("renders the section heading", () => {
    render(
      <MemoryRouter>
        <ChooseAPackageSection />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: /Start by\s+Choosing a Package/ })).toBeInTheDocument()
  })

  it("reveals a card's tagline panel on hover/focus and hides it again on leave/blur", () => {
    render(
      <MemoryRouter>
        <ChooseAPackageSection />
      </MemoryRouter>,
    )

    const article = screen.getByRole("link", { name: "Browse Full Service Packages" }).closest("article") as HTMLElement
    const revealPanel = screen.getByText(
      "Let us do the work for you, all our packages include set up and take down.",
    ).parentElement as HTMLElement

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
