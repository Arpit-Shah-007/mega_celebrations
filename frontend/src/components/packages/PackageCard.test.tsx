import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { PackageCard } from "./PackageCard"
import type { Package } from "@/types"

const pkg: Package = {
  slug: "tent-sleepover",
  name: "Tent Sleepover",
  tagline: "Turn an ordinary sleepover into an extraordinary experience.",
  tags: ["Indoor", "Sleepover"],
  description: "Full description",
  inclusions: [],
  images: [{ seed: "tent-sleepover-1", alt: "Row of decorated teepee tents" }],
  priceTiers: [{ label: "Per tent", price: 80 }],
  startingPrice: 80,
  capacity: "4-10 guests",
  spaceRequirement: "Indoor space",
}

describe("PackageCard", () => {
  it("renders the package name and links to its detail page", () => {
    render(
      <MemoryRouter>
        <PackageCard pkg={pkg} />
      </MemoryRouter>,
    )

    const links = screen.getAllByRole("link", { name: /Tent Sleepover|View details for Tent Sleepover/ })
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/packages/tent-sleepover")
    }
  })

  it("renders the package tagline", () => {
    render(
      <MemoryRouter>
        <PackageCard pkg={pkg} />
      </MemoryRouter>,
    )

    expect(screen.getByText(pkg.tagline)).toBeInTheDocument()
  })

  it("renders a Read More link to the detail page", () => {
    render(
      <MemoryRouter>
        <PackageCard pkg={pkg} />
      </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: "Read More" })).toHaveAttribute("href", "/packages/tent-sleepover")
  })

  it("reveals the tagline panel on hover and hides it again on mouse leave", () => {
    render(
      <MemoryRouter>
        <PackageCard pkg={pkg} />
      </MemoryRouter>,
    )

    const article = screen.getByRole("link", { name: "Read More" }).closest("article")
    expect(article).not.toBeNull()

    const revealPanel = screen.getByText(pkg.tagline).parentElement as HTMLElement
    expect(revealPanel).toHaveClass("translate-y-full")

    fireEvent.mouseEnter(article as HTMLElement)
    expect(revealPanel).toHaveClass("translate-y-0")

    fireEvent.mouseLeave(article as HTMLElement)
    expect(revealPanel).toHaveClass("translate-y-full")
  })

  it("reveals the tagline panel on focus and hides it again on blur", () => {
    render(
      <MemoryRouter>
        <PackageCard pkg={pkg} />
      </MemoryRouter>,
    )

    const article = screen.getByRole("link", { name: "Read More" }).closest("article") as HTMLElement
    const revealPanel = screen.getByText(pkg.tagline).parentElement as HTMLElement

    fireEvent.focus(article)
    expect(revealPanel).toHaveClass("translate-y-0")

    fireEvent.blur(article)
    expect(revealPanel).toHaveClass("translate-y-full")
  })
})
