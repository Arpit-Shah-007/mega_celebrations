import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { AboutTeaserSection } from "./AboutTeaserSection"

describe("AboutTeaserSection", () => {
  it("renders the About Us heading and teaser copy", () => {
    render(
      <MemoryRouter>
        <AboutTeaserSection />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: /About\s+Us/ })).toBeInTheDocument()
    expect(screen.getByText(/Mega Celebrations was created with the intent/)).toBeInTheDocument()
  })

  it("renders a Learn More CTA linking to the About page", () => {
    render(
      <MemoryRouter>
        <AboutTeaserSection />
      </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: "Learn More" })).toHaveAttribute("href", "/about")
  })
})
