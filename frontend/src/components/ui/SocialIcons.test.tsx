import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { InstagramIcon, FacebookIcon } from "./SocialIcons"

describe("SocialIcons", () => {
  it("renders the InstagramIcon as an svg", () => {
    const { container } = render(<InstagramIcon data-testid="instagram-icon" />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24")
  })

  it("renders the FacebookIcon as an svg", () => {
    const { container } = render(<FacebookIcon data-testid="facebook-icon" />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24")
  })

  it("forwards additional SVG props such as className", () => {
    const { container } = render(<InstagramIcon className="h-4 w-4" />)
    expect(container.querySelector("svg")).toHaveClass("h-4", "w-4")
  })
})
