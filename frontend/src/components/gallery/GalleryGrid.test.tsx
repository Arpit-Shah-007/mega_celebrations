import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GalleryGrid } from "./GalleryGrid"
import type { GalleryImage } from "./galleryTypes"

const images: GalleryImage[] = [
  { src: "/media/gallery/one.jpg", alt: "First party photo" },
  { src: "/media/gallery/two.jpg", alt: "Second party photo" },
]

describe("GalleryGrid", () => {
  it("renders one button per photo with an accessible label", () => {
    render(<GalleryGrid images={images} onSelect={vi.fn()} />)

    expect(screen.getByRole("button", { name: "View photo: First party photo" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "View photo: Second party photo" })).toBeInTheDocument()
  })

  it("calls onSelect with the clicked photo's index", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<GalleryGrid images={images} onSelect={onSelect} />)

    await user.click(screen.getByRole("button", { name: "View photo: Second party photo" }))

    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
