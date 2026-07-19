import { afterEach, describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { HoneyBookEmbed } from "./HoneyBookEmbed"

const SCRIPT_SRC = "https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js"

function scriptTags() {
  return document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`)
}

afterEach(() => {
  scriptTags().forEach((tag) => tag.remove())
  delete (window as typeof window & { _HB_?: unknown })._HB_
})

describe("HoneyBookEmbed", () => {
  it("renders the HoneyBook placeholder div with the placement class", () => {
    const { container } = render(<HoneyBookEmbed />)
    expect(container.querySelector(".hb-p-5de351586567280cf9f3b1e7-7")).toBeInTheDocument()
  })

  it("renders the tracking pixel image", () => {
    const { container } = render(<HoneyBookEmbed />)
    const img = container.querySelector("img")
    expect(img).toHaveAttribute("src", "https://www.honeybook.com/p.png?pid=5de351586567280cf9f3b1e7")
    expect(img).toHaveAttribute("height", "1")
    expect(img).toHaveAttribute("width", "1")
  })

  it("injects the HoneyBook placement script once and sets the placement id", () => {
    render(<HoneyBookEmbed />)
    expect(scriptTags()).toHaveLength(1)
    expect((window as typeof window & { _HB_?: { pid?: string } })._HB_?.pid).toBe("5de351586567280cf9f3b1e7")
  })

  it("does not inject a second script tag if one is already present", () => {
    render(<HoneyBookEmbed />)
    render(<HoneyBookEmbed />)
    expect(scriptTags()).toHaveLength(1)
  })
})
