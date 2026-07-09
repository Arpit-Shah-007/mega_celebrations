import { describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ToastProvider } from "./ToastContext"
import { useToast } from "./useToast"

function ShowToastButton() {
  const { showToast } = useToast()
  return (
    <button type="button" onClick={() => showToast("Saved to wishlist")}>
      Show toast
    </button>
  )
}

function ThrowsOutsideProvider() {
  useToast()
  return null
}

describe("ToastProvider / useToast", () => {
  it("shows a toast with the given message when showToast is called", async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ShowToastButton />
      </ToastProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Show toast" }))

    expect(await screen.findByText("Saved to wishlist")).toBeInTheDocument()
  })

  it("auto-dismisses the toast after roughly 3.2 seconds", async () => {
    vi.useFakeTimers()
    try {
      render(
        <ToastProvider>
          <ShowToastButton />
        </ToastProvider>,
      )

      fireEvent.click(screen.getByRole("button", { name: "Show toast" }))
      expect(screen.getByText("Saved to wishlist")).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(3200)
      })
    } finally {
      vi.useRealTimers()
    }

    await waitFor(() => {
      expect(screen.queryByText("Saved to wishlist")).not.toBeInTheDocument()
    })
  })

  it("dismisses the toast when the dismiss button is clicked", async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ShowToastButton />
      </ToastProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Show toast" }))
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }))

    await waitFor(() => {
      expect(screen.queryByText("Saved to wishlist")).not.toBeInTheDocument()
    })
  })

  it("throws when useToast is called outside a ToastProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<ThrowsOutsideProvider />)).toThrow("useToast must be used within a ToastProvider")

    consoleError.mockRestore()
  })
})
