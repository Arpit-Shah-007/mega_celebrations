import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { FounderStory } from "./FounderStory"

describe("FounderStory", () => {
  it("renders the founder story copy and signature", () => {
    render(<FounderStory />)

    expect(screen.getByText(/Mega Celebrations was created with the intent to make every celebration unforgettable/)).toBeInTheDocument()
    expect(screen.getByText("Meg & Ty")).toBeInTheDocument()
  })

  it("links to the sister company site in a new tab", () => {
    render(<FounderStory />)

    const link = screen.getByRole("link", { name: "Little Buddies Soft Play" })
    expect(link).toHaveAttribute("href", "https://littlebuddiessoftplay.com")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noreferrer")
  })
})
