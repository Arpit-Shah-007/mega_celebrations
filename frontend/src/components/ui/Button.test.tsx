import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { Button } from "./Button"

describe("Button", () => {
  it("renders an action button and fires onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button kind="action" onClick={onClick}>
        Click me
      </Button>,
    )

    await user.click(screen.getByRole("button", { name: "Click me" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("respects the disabled prop", () => {
    render(
      <Button kind="action" disabled>
        Disabled
      </Button>,
    )
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled()
  })

  it("renders an internal link button using react-router Link", () => {
    render(
      <MemoryRouter>
        <Button kind="link" to="/packages">
          View Packages
        </Button>
      </MemoryRouter>,
    )
    const link = screen.getByRole("link", { name: "View Packages" })
    expect(link).toHaveAttribute("href", "/packages")
  })

  it("renders an external link with target and rel attributes", () => {
    render(
      <Button kind="link" to="https://example.com" external>
        External
      </Button>,
    )
    const link = screen.getByRole("link", { name: "External" })
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noreferrer")
  })
})
