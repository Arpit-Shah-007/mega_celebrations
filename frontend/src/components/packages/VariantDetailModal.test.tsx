import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WishlistProvider } from "@/context/WishlistContext"
import { ToastProvider } from "@/context/ToastContext"
import { VariantDetailModal } from "./VariantDetailModal"
import type { PackageVariant } from "@/types"

const variant: PackageVariant = {
  name: "Magical Unicorn",
  price: "$80.00",
  image: "/media/unicorn.jpg",
  additionalImages: ["/media/unicorn-2.jpg"],
  description: ["A magical unicorn theme with pastel decor."],
}

function renderModal(props: Partial<React.ComponentProps<typeof VariantDetailModal>> = {}) {
  const onClose = vi.fn()
  const utils = render(
    <ToastProvider>
      <WishlistProvider>
        <VariantDetailModal
          variant={variant}
          namespace="theme-tent-sleepover"
          headingLabel="Theme"
          category="theme"
          onClose={onClose}
          {...props}
        />
      </WishlistProvider>
    </ToastProvider>,
  )
  return { onClose, ...utils }
}

describe("VariantDetailModal", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("renders nothing when variant is null", () => {
    render(
      <ToastProvider>
        <WishlistProvider>
          <VariantDetailModal variant={null} namespace="theme-tent-sleepover" headingLabel="Theme" category="theme" onClose={vi.fn()} />
        </WishlistProvider>
      </ToastProvider>,
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("renders the variant details and heading label when open", () => {
    renderModal()

    const dialog = screen.getByRole("dialog", { name: "Magical Unicorn" })
    expect(within(dialog).getByText("Theme")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Magical Unicorn" })).toBeInTheDocument()
    expect(screen.getByText("A magical unicorn theme with pastel decor.")).toBeInTheDocument()
  })

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()

    await user.click(screen.getByRole("button", { name: "Close details" }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when the Escape key is pressed", async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()

    await user.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("toggles the item in the wishlist when the CTA is clicked", async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))
    expect(screen.getByRole("button", { name: "Remove From Wishlist" })).toBeInTheDocument()
  })

  it("tags the saved item with the given category", async () => {
    const user = userEvent.setup()
    renderModal({ category: "add-on", headingLabel: "Add-On" })

    await user.click(screen.getByRole("button", { name: "Add To Wishlist" }))

    const raw = window.localStorage.getItem("mega-celebrations:wishlist")
    const parsed = JSON.parse(raw as string)
    expect(parsed[0].category).toBe("add-on")
  })

  it("switches the main photo when a thumbnail is clicked", async () => {
    const user = userEvent.setup()
    renderModal()

    const thumbnail = screen.getByRole("button", { name: "Show photo 2 of Magical Unicorn" })
    await user.click(thumbnail)

    expect(thumbnail).toHaveAttribute("aria-current", "true")
  })
})
