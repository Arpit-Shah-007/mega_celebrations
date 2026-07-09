import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { ToastProvider } from "@/context/ToastContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { GalleryPage } from "./GalleryPage"
import { galleryPhotos } from "@/data/galleryPhotos"

vi.setConfig({ testTimeout: 15000 })

function renderGalleryPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <WishlistProvider>
          <GalleryPage />
        </WishlistProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe("GalleryPage", () => {
  it("renders the page hero title and every gallery photo", () => {
    renderGalleryPage()

    expect(screen.getByRole("heading", { name: "Gallery", level: 1 })).toBeInTheDocument()
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(galleryPhotos.length)
  })

  it("opens the lightbox on a photo, cycles next/prev, and closes it", async () => {
    const user = userEvent.setup()
    renderGalleryPage()

    await user.click(screen.getByRole("button", { name: `View photo: ${galleryPhotos[0].alt}` }))

    const dialog = screen.getByRole("dialog")
    expect(within(dialog).getByAltText(galleryPhotos[0].alt)).toBeInTheDocument()

    await user.click(within(dialog).getAllByRole("button", { name: "Next photo" })[0])
    expect(within(screen.getByRole("dialog")).getByAltText(galleryPhotos[1].alt)).toBeInTheDocument()

    await user.click(within(screen.getByRole("dialog")).getAllByRole("button", { name: "Previous photo" })[0])
    expect(within(screen.getByRole("dialog")).getByAltText(galleryPhotos[0].alt)).toBeInTheDocument()

    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Close gallery" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
})
