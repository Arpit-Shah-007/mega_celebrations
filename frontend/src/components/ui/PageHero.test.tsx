import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { PageHero } from "./PageHero"

describe("PageHero", () => {
  it("renders the title in the navy variant by default", () => {
    render(<PageHero title="Our Packages" />)
    expect(screen.getByRole("heading", { level: 1, name: "Our Packages" })).toBeInTheDocument()
  })

  it("renders children content below the title", () => {
    render(
      <PageHero title="Our Packages">
        <p>Subheading text</p>
      </PageHero>,
    )
    expect(screen.getByText("Subheading text")).toBeInTheDocument()
  })

  it("renders a placeholder photo when variant is photo", () => {
    render(<PageHero title="Gallery" variant="photo" photoAlt="A festive party setup" />)
    expect(screen.getByRole("heading", { level: 1, name: "Gallery" })).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "A festive party setup" })).toBeInTheDocument()
  })

  it("renders a ReactNode title", () => {
    render(
      <PageHero
        title={
          <>
            Browse Our <span>Packages</span>
          </>
        }
      />,
    )
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Browse Our Packages")
  })
})
