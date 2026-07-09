import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PackageImageCarousel } from "./PackageImageCarousel"

describe("PackageImageCarousel", () => {
  it("renders the PlaceholderPhoto fallback when no images are provided", () => {
    render(<PackageImageCarousel images={[]} alt="Tent Sleepover" seed="tent-sleepover" />)

    expect(screen.getByRole("img", { name: "Tent Sleepover" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Next photo" })).not.toBeInTheDocument()
  })

  it("does not render prev/next controls when only one image is provided", () => {
    render(<PackageImageCarousel images={["/media/one.jpg"]} alt="Tent Sleepover" seed="tent-sleepover" />)

    expect(screen.queryByRole("button", { name: "Next photo" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Previous photo" })).not.toBeInTheDocument()
  })

  it("cycles forward through images and wraps around to the first", async () => {
    const user = userEvent.setup()
    const images = ["/media/one.jpg", "/media/two.jpg", "/media/three.jpg"]
    render(<PackageImageCarousel images={images} alt="Tent Sleepover" seed="tent-sleepover" />)

    const image = () => screen.getByAltText("Tent Sleepover") as HTMLImageElement
    expect(image()).toHaveAttribute("src", images[0])

    await user.click(screen.getByRole("button", { name: "Next photo" }))
    await waitFor(() => expect(image()).toHaveAttribute("src", images[1]))

    await user.click(screen.getByRole("button", { name: "Next photo" }))
    await waitFor(() => expect(image()).toHaveAttribute("src", images[2]))

    await user.click(screen.getByRole("button", { name: "Next photo" }))
    await waitFor(() => expect(image()).toHaveAttribute("src", images[0]))
  })

  it("cycles backward through images and wraps around to the last", async () => {
    const user = userEvent.setup()
    const images = ["/media/one.jpg", "/media/two.jpg", "/media/three.jpg"]
    render(<PackageImageCarousel images={images} alt="Tent Sleepover" seed="tent-sleepover" />)

    const image = () => screen.getByAltText("Tent Sleepover") as HTMLImageElement

    await user.click(screen.getByRole("button", { name: "Previous photo" }))
    await waitFor(() => expect(image()).toHaveAttribute("src", images[2]))
  })
})
