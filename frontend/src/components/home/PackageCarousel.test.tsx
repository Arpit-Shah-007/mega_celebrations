import { describe, expect, it } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { PackageCarousel } from "./PackageCarousel"
import { packages } from "@/data/packages"

const VISIBLE = 4

describe("PackageCarousel", () => {
  it("renders the first page of package cards", () => {
    render(
      <MemoryRouter>
        <PackageCarousel />
      </MemoryRouter>,
    )

    for (const pkg of packages.slice(0, VISIBLE)) {
      expect(screen.getAllByText(pkg.name).length).toBeGreaterThan(0)
    }
  })

  it("renders previous/next controls", () => {
    render(
      <MemoryRouter>
        <PackageCarousel />
      </MemoryRouter>,
    )

    expect(screen.getByRole("button", { name: "Previous packages" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next packages" })).toBeInTheDocument()
  })

  it("advances to the next page of packages when Next is clicked", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <PackageCarousel />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole("button", { name: "Next packages" }))

    const nextPagePackage = packages[VISIBLE]
    await waitFor(() => {
      expect(screen.getAllByText(nextPagePackage.name).length).toBeGreaterThan(0)
    })
  })

  it("goes to the last page when Previous is clicked from the first page (round scroll)", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <PackageCarousel />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole("button", { name: "Previous packages" }))

    const pageCount = Math.ceil(packages.length / VISIBLE)
    const lastPageStart = (pageCount - 1) * VISIBLE
    const lastPagePackage = packages[lastPageStart]

    await waitFor(() => {
      expect(screen.getAllByText(lastPagePackage.name).length).toBeGreaterThan(0)
    })
  })

  it("scopes each rendered package card behind a link to its detail page", () => {
    render(
      <MemoryRouter>
        <PackageCarousel />
      </MemoryRouter>,
    )

    const firstPackage = packages[0]
    const heading = screen.getAllByText(firstPackage.name)[0]
    const card = heading.closest("article")
    expect(card).not.toBeNull()
    if (card) {
      expect(within(card).getAllByRole("link")[0]).toHaveAttribute("href", `/packages/${firstPackage.slug}`)
    }
  })
})
