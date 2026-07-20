import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { AddMoreButton } from "./AddMoreButton"

describe("AddMoreButton", () => {
  it("links to the given destination", () => {
    render(
      <MemoryRouter>
        <AddMoreButton to="/packages/a-la-carte" />
      </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: "Add More" })).toHaveAttribute("href", "/packages/a-la-carte")
  })
})
