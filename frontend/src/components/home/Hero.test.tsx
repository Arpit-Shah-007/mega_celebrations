import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Hero } from "./Hero"

describe("Hero", () => {
  it("renders the headline and supporting copy", () => {
    render(<Hero />)

    expect(screen.getByRole("heading", { name: /Make Your Event\s*a Mega Celebration/ })).toBeInTheDocument()
    expect(screen.getByText(/New Jersey's glamping, picnic and sleepover specialists/)).toBeInTheDocument()
  })

  it("renders the background video muted and autoplaying", () => {
    const { container } = render(<Hero />)

    const video = container.querySelector("video")
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute("autoplay")
    expect(video).toHaveAttribute("loop")
  })
})
