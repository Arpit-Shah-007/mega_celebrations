import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Container } from "./Container"

describe("Container", () => {
  it("renders its children", () => {
    render(
      <Container>
        <p>Inner content</p>
      </Container>,
    )
    expect(screen.getByText("Inner content")).toBeInTheDocument()
  })

  it("applies the base layout classes", () => {
    render(
      <Container>
        <span>Content</span>
      </Container>,
    )
    expect(screen.getByText("Content").parentElement).toHaveClass("mx-auto", "w-full", "max-w-300")
  })

  it("applies a passed className alongside the base classes", () => {
    render(
      <Container className="extra-class">
        <span>Content</span>
      </Container>,
    )
    expect(screen.getByText("Content").parentElement).toHaveClass("extra-class", "mx-auto")
  })
})
