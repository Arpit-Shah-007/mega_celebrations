import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { HowToBookSection } from "./HowToBookSection"

describe("HowToBookSection", () => {
  it("renders all four booking steps in order", () => {
    render(
      <MemoryRouter>
        <HowToBookSection />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Select your package and add it to your wishlist/)).toBeInTheDocument()
    expect(screen.getByText(/We will send over a customized quote/)).toBeInTheDocument()
    expect(screen.getByText(/we will arrive at your location to set up/)).toBeInTheDocument()
    expect(screen.getByText(/we return to pick up/)).toBeInTheDocument()
  })

  it("shows the FAQs CTA by default", () => {
    render(
      <MemoryRouter>
        <HowToBookSection />
      </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: "Read Our FAQs" })).toHaveAttribute("href", "/faqs")
  })

  it("hides the FAQs CTA when showFaqsCta is false", () => {
    render(
      <MemoryRouter>
        <HowToBookSection showFaqsCta={false} />
      </MemoryRouter>,
    )

    expect(screen.queryByRole("link", { name: "Read Our FAQs" })).not.toBeInTheDocument()
  })
})
