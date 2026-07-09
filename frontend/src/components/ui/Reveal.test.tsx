import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Reveal } from "./Reveal"

describe("Reveal", () => {
  it("renders its children", () => {
    render(
      <Reveal>
        <p>Hello world</p>
      </Reveal>,
    )
    expect(screen.getByText("Hello world")).toBeInTheDocument()
  })

  it("applies the passed className", () => {
    render(
      <Reveal className="custom-class">
        <span>Content</span>
      </Reveal>,
    )
    expect(screen.getByText("Content").parentElement).toHaveClass("custom-class")
  })
})
