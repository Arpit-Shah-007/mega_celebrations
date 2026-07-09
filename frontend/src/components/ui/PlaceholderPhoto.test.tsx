import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ImageIcon, Sparkles } from "lucide-react"
import { PlaceholderPhoto } from "./PlaceholderPhoto"

describe("PlaceholderPhoto", () => {
  it("renders a fallback gradient block with an accessible label when no src is given", () => {
    render(<PlaceholderPhoto seed="package-1" alt="A festive balloon setup" />)

    const placeholder = screen.getByRole("img", { name: "A festive balloon setup" })
    expect(placeholder.tagName).toBe("DIV")
  })

  it("renders an actual img element when src is provided", () => {
    render(<PlaceholderPhoto seed="package-1" alt="Real photo" src="/media/real-photo.jpg" />)

    const image = screen.getByRole("img", { name: "Real photo" })
    expect(image.tagName).toBe("IMG")
    expect(image).toHaveAttribute("src", "/media/real-photo.jpg")
  })

  it("renders the optional label text when provided", () => {
    render(<PlaceholderPhoto seed="package-1" alt="Placeholder" label="Coming Soon" />)
    expect(screen.getByText("Coming Soon")).toBeInTheDocument()
  })

  it("uses the default ImageIcon when no icon is passed", () => {
    const { container } = render(<PlaceholderPhoto seed="package-1" alt="Placeholder" />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("is deterministic: the same seed always produces the same gradient classes", () => {
    const { container: first } = render(<PlaceholderPhoto seed="same-seed" alt="First" />)
    const { container: second } = render(<PlaceholderPhoto seed="same-seed" alt="Second" />)

    const firstDiv = first.querySelector('[role="img"]')
    const secondDiv = second.querySelector('[role="img"]')
    expect(firstDiv?.className).toBe(secondDiv?.className)
  })

  it("accepts a custom icon prop", () => {
    const { container } = render(<PlaceholderPhoto seed="package-1" alt="Placeholder" icon={Sparkles} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("omits the relative position class when caller supplies a position override", () => {
    const { container } = render(<PlaceholderPhoto seed="package-1" alt="Placeholder" className="absolute inset-0" icon={ImageIcon} />)
    const el = container.querySelector('[role="img"]')
    expect(el).toHaveClass("absolute")
    expect(el).not.toHaveClass("relative")
  })
})
