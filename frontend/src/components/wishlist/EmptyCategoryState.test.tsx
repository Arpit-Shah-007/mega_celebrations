import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Package } from "lucide-react"
import { EmptyCategoryState } from "./EmptyCategoryState"

function renderEmptyState(props: Partial<React.ComponentProps<typeof EmptyCategoryState>> = {}) {
  return render(
    <MemoryRouter>
      <EmptyCategoryState
        icon={Package}
        message="Nothing picked yet."
        exploreLabel="Explore Packages"
        exploreTo="/packages"
        {...props}
      />
    </MemoryRouter>,
  )
}

describe("EmptyCategoryState", () => {
  it("renders the empty message", () => {
    renderEmptyState()

    expect(screen.getByText("Nothing picked yet.")).toBeInTheDocument()
  })

  it("renders an explore link pointing at the given destination", () => {
    renderEmptyState({ exploreLabel: "Explore Add-Ons", exploreTo: "/packages/add-ons" })

    expect(screen.getByRole("link", { name: "Explore Add-Ons" })).toHaveAttribute("href", "/packages/add-ons")
  })
})
