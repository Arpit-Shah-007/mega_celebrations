import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import App from "./App"

vi.setConfig({ testTimeout: 20000 })

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.pushState({}, "", "/")
  })

  afterEach(() => {
    window.history.pushState({}, "", "/")
  })

  it("renders the home page at the root route", async () => {
    render(<App />)

    expect(
      await screen.findByRole("heading", { name: /Make Your Event.*a Mega Celebration/s }, { timeout: 15000 }),
    ).toBeInTheDocument()
  })

  it("renders the not-found page for an unknown route", async () => {
    window.history.pushState({}, "", "/nonexistent")
    render(<App />)

    expect(await screen.findByRole("heading", { name: "404" }, { timeout: 15000 })).toBeInTheDocument()
    expect(screen.getByText("We couldn't find that page.")).toBeInTheDocument()
  })
})
