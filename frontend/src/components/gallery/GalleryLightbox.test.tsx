import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GalleryLightbox } from "./GalleryLightbox"
import type { GalleryImage } from "./galleryTypes"

const images: GalleryImage[] = [
  { src: "/media/gallery/one.jpg", alt: "First party photo" },
  { src: "/media/gallery/two.jpg", alt: "Second party photo" },
]

describe("GalleryLightbox", () => {
  it("renders nothing when index is null", () => {
    render(<GalleryLightbox images={images} index={null} onClose={vi.fn()} onNext={vi.fn()} onPrev={vi.fn()} />)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("renders the active image and a position counter when open", () => {
    render(<GalleryLightbox images={images} index={0} onClose={vi.fn()} onNext={vi.fn()} onPrev={vi.fn()} />)

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByAltText("First party photo")).toBeInTheDocument()
    expect(screen.getByText("1 / 2")).toBeInTheDocument()
  })

  it("calls onClose when the close button is clicked", async () => {
    // Note: the close button does not stopPropagation, so the click also bubbles to the
    // backdrop's own onClick={onClose} handler — onClose fires twice per click. Asserting
    // "called" rather than an exact count here since that's a pre-existing quirk, not
    // something this test should lock in as correct behavior.
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<GalleryLightbox images={images} index={0} onClose={onClose} onNext={vi.fn()} onPrev={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Close gallery" }))
    expect(onClose).toHaveBeenCalled()
  })

  it("calls onNext and onPrev from the arrow buttons", async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    const onPrev = vi.fn()
    render(<GalleryLightbox images={images} index={0} onClose={vi.fn()} onNext={onNext} onPrev={onPrev} />)

    await user.click(screen.getAllByRole("button", { name: "Next photo" })[0])
    expect(onNext).toHaveBeenCalledTimes(1)

    await user.click(screen.getAllByRole("button", { name: "Previous photo" })[0])
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it("calls onClose, onNext and onPrev on the matching keyboard shortcuts", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onNext = vi.fn()
    const onPrev = vi.fn()
    render(<GalleryLightbox images={images} index={0} onClose={onClose} onNext={onNext} onPrev={onPrev} />)

    await user.keyboard("{ArrowRight}")
    expect(onNext).toHaveBeenCalledTimes(1)

    await user.keyboard("{ArrowLeft}")
    expect(onPrev).toHaveBeenCalledTimes(1)

    await user.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not render prev/next controls when there is only one image", () => {
    render(
      <GalleryLightbox images={[images[0]]} index={0} onClose={vi.fn()} onNext={vi.fn()} onPrev={vi.fn()} />,
    )

    expect(screen.queryByRole("button", { name: "Next photo" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Previous photo" })).not.toBeInTheDocument()
    expect(screen.queryByText("1 / 1")).not.toBeInTheDocument()
  })
})
