import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { SectionHeading } from "./SectionHeading"

describe("SectionHeading", () => {
  it("renders the title as a level-2 heading", () => {
    render(<SectionHeading title="Browse Our" />)
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Browse Our")
  })

  it("renders the scriptSuffix alongside the title", () => {
    render(<SectionHeading title="Browse Our" scriptSuffix="Packages" />)
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Browse Our Packages")
  })

  it("renders the titleSuffix after the scriptSuffix", () => {
    render(<SectionHeading title="About Our" scriptSuffix="A La Carte" titleSuffix="Package" />)
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("About Our A La Carte Package")
  })

  it("renders the description when provided", () => {
    render(<SectionHeading title="Our Packages" description="Everything you need for a party." />)
    expect(screen.getByText("Everything you need for a party.")).toBeInTheDocument()
  })

  it("does not render a description paragraph when none is provided", () => {
    const { container } = render(<SectionHeading title="Our Packages" />)
    expect(container.querySelector("p")).not.toBeInTheDocument()
  })

  it("applies light-mode text classes when light is true", () => {
    render(<SectionHeading title="Our Packages" light />)
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("text-white")
  })
})
