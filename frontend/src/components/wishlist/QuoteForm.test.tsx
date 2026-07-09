import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QuoteForm } from "./QuoteForm"

describe("QuoteForm", () => {
  it("shows a required-field error for each empty required field on submit and does not call onSubmitQuote", async () => {
    const user = userEvent.setup()
    const onSubmitQuote = vi.fn()
    render(<QuoteForm onSubmitQuote={onSubmitQuote} />)

    await user.click(screen.getByRole("button", { name: "Request My Custom Quote" }))

    expect(await screen.findByText("Full name is required.")).toBeInTheDocument()
    expect(screen.getByText("Email is required.")).toBeInTheDocument()
    expect(screen.getByText("Phone is required.")).toBeInTheDocument()
    expect(screen.getByText("Event date is required.")).toBeInTheDocument()
    expect(screen.getByText("Venue / address is required.")).toBeInTheDocument()
    expect(screen.getByText("Guest count is required.")).toBeInTheDocument()
    expect(onSubmitQuote).not.toHaveBeenCalled()
  })

  it("shows an invalid-email error when the email does not match the expected pattern", async () => {
    const user = userEvent.setup()
    const onSubmitQuote = vi.fn()
    render(<QuoteForm onSubmitQuote={onSubmitQuote} />)

    await user.type(screen.getByLabelText("Email"), "not-an-email")
    await user.click(screen.getByRole("button", { name: "Request My Custom Quote" }))

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument()
    expect(onSubmitQuote).not.toHaveBeenCalled()
  })

  it("calls onSubmitQuote with the entered values when all required fields are valid", async () => {
    const user = userEvent.setup()
    const onSubmitQuote = vi.fn().mockResolvedValue(undefined)
    render(<QuoteForm onSubmitQuote={onSubmitQuote} />)

    await user.type(screen.getByLabelText("Full name"), "Jane Doe")
    await user.type(screen.getByLabelText("Email"), "jane@example.com")
    await user.type(screen.getByLabelText("Phone"), "9085550123")
    await user.type(screen.getByLabelText("Event date"), "2026-08-01")
    await user.type(screen.getByLabelText("Venue / address"), "Backyard")
    await user.type(screen.getByLabelText("Guest count"), "10 kids")
    await user.type(screen.getByLabelText(/Special requests or theme/), "Unicorn theme please")

    await user.click(screen.getByRole("button", { name: "Request My Custom Quote" }))

    expect(onSubmitQuote).toHaveBeenCalledTimes(1)
    expect(onSubmitQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "9085550123",
        eventDate: "2026-08-01",
        venue: "Backyard",
        guestCount: "10 kids",
        notes: "Unicorn theme please",
      }),
    )
  })
})
