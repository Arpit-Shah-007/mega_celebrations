import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TestimonialsSection } from "./TestimonialsSection"
import { testimonials } from "@/data/testimonials"

// Mirrors the component's own (unexported) AUTO_SLIDE_INTERVAL_MS / SLIDE_DURATION_MS constants.
const AUTO_SLIDE_INTERVAL_MS = 4500
const SLIDE_DURATION_MS = 500

afterEach(() => {
  vi.useRealTimers()
})

describe("TestimonialsSection", () => {
  it("renders the section heading and testimonial content", () => {
    render(<TestimonialsSection />)

    expect(screen.getByRole("heading", { name: /Our Clients\s+Testimonials/ })).toBeInTheDocument()
    expect(screen.getAllByText(testimonials[0].quote).length).toBeGreaterThan(0)
  })

  it("renders one pagination dot per testimonial", () => {
    render(<TestimonialsSection />)

    const dots = testimonials.map((item) =>
      screen.getByRole("button", { name: `Show testimonial ${testimonials.indexOf(item) + 1}` }),
    )
    expect(dots).toHaveLength(testimonials.length)
  })

  it("marks the first dot as current on initial render", () => {
    render(<TestimonialsSection />)

    expect(screen.getByRole("button", { name: "Show testimonial 1" })).toHaveAttribute("aria-current", "true")
  })

  it("marks a different dot as current after clicking it", async () => {
    const user = userEvent.setup()
    render(<TestimonialsSection />)

    await user.click(screen.getByRole("button", { name: "Show testimonial 3" }))

    expect(screen.getByRole("button", { name: "Show testimonial 3" })).toHaveAttribute("aria-current", "true")
  })

  it("auto-advances on an interval and silently wraps back to the start after a full cycle", () => {
    vi.useFakeTimers()
    render(<TestimonialsSection />)

    // One full cycle = one auto-advance per testimonial, plus the post-wrap snap-back timeout.
    act(() => {
      vi.advanceTimersByTime(AUTO_SLIDE_INTERVAL_MS * testimonials.length + SLIDE_DURATION_MS)
    })

    expect(screen.getByRole("button", { name: "Show testimonial 1" })).toHaveAttribute("aria-current", "true")
  })
})
