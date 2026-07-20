import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import type { WishlistItem } from "@/types"
import { WishlistPackageSection } from "./WishlistPackageSection"

const tentSleepover: WishlistItem = {
  slug: "tent-sleepover",
  name: "Tent Sleepover",
  imageSeed: "tent-sleepover-1",
  startingPrice: 80,
  category: "package",
}

const magicalUnicorn: WishlistItem = {
  slug: "theme-magical-unicorn",
  name: "Magical Unicorn",
  imageSeed: "theme-magical-unicorn",
  startingPrice: 0,
  category: "theme",
  packageSlug: "tent-sleepover",
}

function renderSection(props: Partial<React.ComponentProps<typeof WishlistPackageSection>> = {}) {
  return render(
    <MemoryRouter>
      <WishlistPackageSection
        packages={[]}
        themes={[]}
        onRemovePackage={vi.fn()}
        onRemoveTheme={vi.fn()}
        {...props}
      />
    </MemoryRouter>,
  )
}

describe("WishlistPackageSection", () => {
  it("renders the package count and name", () => {
    renderSection({ packages: [tentSleepover] })

    expect(screen.getByText("Packages")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("Tent Sleepover")).toBeInTheDocument()
  })

  it("nests a theme beneath its parent package", () => {
    renderSection({ packages: [tentSleepover], themes: [magicalUnicorn] })

    expect(screen.getByText("Magical Unicorn")).toBeInTheDocument()
  })

  it("does not show a theme belonging to a different package", () => {
    renderSection({ packages: [tentSleepover], themes: [{ ...magicalUnicorn, packageSlug: "other-package" }] })

    expect(screen.queryByText("Magical Unicorn")).not.toBeInTheDocument()
  })

  it("renders the empty state with an explore link pointing at the full-service packages listing", () => {
    renderSection()

    expect(screen.getByText("Nothing picked yet.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Explore Packages" })).toHaveAttribute(
      "href",
      "/packages/full-services-packages",
    )
  })

  it("shows an Add More link pointing at the full-service packages listing when packages are already saved", () => {
    renderSection({ packages: [tentSleepover] })

    expect(screen.getByRole("link", { name: "Add More" })).toHaveAttribute("href", "/packages/full-services-packages")
  })

  it("calls onRemovePackage and onRemoveTheme with the right slug", async () => {
    const { default: userEvent } = await import("@testing-library/user-event")
    const user = userEvent.setup()
    const onRemovePackage = vi.fn()
    const onRemoveTheme = vi.fn()
    renderSection({ packages: [tentSleepover], themes: [magicalUnicorn], onRemovePackage, onRemoveTheme })

    await user.click(screen.getByRole("button", { name: "Remove Magical Unicorn from wishlist" }))
    expect(onRemoveTheme).toHaveBeenCalledWith("theme-magical-unicorn")

    await user.click(screen.getByRole("button", { name: "Remove Tent Sleepover from wishlist" }))
    expect(onRemovePackage).toHaveBeenCalledWith("tent-sleepover")
  })
})
