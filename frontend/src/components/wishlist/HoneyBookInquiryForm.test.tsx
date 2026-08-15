import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { HONEYBOOK_INQUIRY_FORM_URL, HoneyBookInquiryForm } from "./HoneyBookInquiryForm"

function frame() {
  return document.querySelector("iframe")
}

describe("HoneyBookInquiryForm", () => {
  it("embeds the hosted inquiry form in place, with an accessible frame title", () => {
    render(<HoneyBookInquiryForm items={[]} />)

    expect(frame()).toHaveAttribute("src", HONEYBOOK_INQUIRY_FORM_URL)
    expect(frame()).toHaveAttribute("title", "Mega Celebrations inquiry form")
  })

  // The placement widget this replaced only ever created a HoneyBook Contact, so a
  // stray reintroduction of that script would silently cost every lead its project.
  it("loads no website-placement widget script", () => {
    render(<HoneyBookInquiryForm items={[]} />)

    expect(document.querySelector('script[src*="websiteplacements"]')).toBeNull()
  })

  it("titles itself without a step number", () => {
    render(<HoneyBookInquiryForm items={[]} />)

    expect(screen.getByRole("heading", { name: "Request Your Custom Quote" })).toBeInTheDocument()
    expect(screen.queryByText("2")).not.toBeInTheDocument()
  })

  it("offers an escape hatch to open the form in its own tab", () => {
    render(<HoneyBookInquiryForm items={[]} />)

    const link = screen.getByRole("link", { name: /open it in a new tab/i })
    expect(link).toHaveAttribute("href", HONEYBOOK_INQUIRY_FORM_URL)
    expect(link).toHaveAttribute("target", "_blank")
  })
})
