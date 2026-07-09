import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ScrollToTop } from "./ScrollToTop"

describe("ScrollToTop", () => {
  it("renders without crashing and produces no visible output", () => {
    const { container } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
