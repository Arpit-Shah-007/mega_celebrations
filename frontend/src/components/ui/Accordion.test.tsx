import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AccordionItem } from "./Accordion"

describe("AccordionItem", () => {
  it("renders the question and keeps the answer collapsed by default", () => {
    render(<AccordionItem question="What is included?" answer="Tables and chairs." />)

    const trigger = screen.getByRole("button", { name: "What is included?" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Tables and chairs.")).not.toBeInTheDocument()
  })

  it("renders expanded when defaultOpen is true", () => {
    render(<AccordionItem question="What is included?" answer="Tables and chairs." defaultOpen />)

    const trigger = screen.getByRole("button", { name: "What is included?" })
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Tables and chairs.")).toBeInTheDocument()
  })

  it("expands and shows the answer when clicked", async () => {
    const user = userEvent.setup()
    render(<AccordionItem question="How do I book?" answer="Contact us via the form." />)

    await user.click(screen.getByRole("button", { name: "How do I book?" }))

    expect(screen.getByRole("button", { name: "How do I book?" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Contact us via the form.")).toBeInTheDocument()
  })

  it("collapses again when clicked a second time", async () => {
    const user = userEvent.setup()
    render(<AccordionItem question="How do I book?" answer="Contact us via the form." defaultOpen />)

    await user.click(screen.getByRole("button", { name: "How do I book?" }))

    expect(screen.getByRole("button", { name: "How do I book?" })).toHaveAttribute("aria-expanded", "false")
  })

  it("renders a bare URL inside the answer as a clickable link", () => {
    render(
      <AccordionItem
        question="How much space is needed?"
        answer={"Please see the layout here: https://pub-example.r2.dev/media/Layout.pdf\nMore text after."}
        defaultOpen
      />,
    )

    const link = screen.getByRole("link", { name: "https://pub-example.r2.dev/media/Layout.pdf" })
    expect(link).toHaveAttribute("href", "https://pub-example.r2.dev/media/Layout.pdf")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(screen.getByText(/More text after\./)).toBeInTheDocument()
  })

  it("renders plain answers with no links unchanged", () => {
    render(<AccordionItem question="Plain?" answer="No links here." defaultOpen />)

    expect(screen.getByText("No links here.")).toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("associates the trigger with the panel via aria-controls", () => {
    render(<AccordionItem question="Panel link?" answer="Answer text" defaultOpen />)

    const trigger = screen.getByRole("button", { name: "Panel link?" })
    const panel = screen.getByRole("region")
    expect(trigger).toHaveAttribute("aria-controls", panel.id)
  })
})
