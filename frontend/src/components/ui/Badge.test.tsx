import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge } from "./Badge"

describe("Badge", () => {
  it("renders the label content", () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("applies the pink tone classes by default", () => {
    render(<Badge>Default Tone</Badge>)
    expect(screen.getByText("Default Tone")).toHaveClass("bg-pink", "text-white")
  })

  it("applies the navy tone classes when tone is navy", () => {
    render(<Badge tone="navy">Navy Tone</Badge>)
    expect(screen.getByText("Navy Tone")).toHaveClass("bg-navy", "text-white")
  })

  it("applies an additional custom className", () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    expect(screen.getByText("Custom")).toHaveClass("custom-badge")
  })
})
