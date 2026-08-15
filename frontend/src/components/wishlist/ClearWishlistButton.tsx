import { useState } from "react"
import { Trash2 } from "lucide-react"

interface ClearWishlistButtonProps {
  count: number
  onClear: () => void
}

/**
 * Emptying the wishlist throws away everything the visitor picked while
 * browsing, and there is no undo, so it asks first — inline rather than through
 * a modal or window.confirm, which would be heavier than this deserves.
 *
 * This exists because submitting the form no longer clears the wishlist:
 * HoneyBook's hosted form shows its own thank-you screen inside the iframe and
 * never navigates the top-level tab, so there is no event to hang an automatic
 * clear on.
 */
export function ClearWishlistButton({ count, onClear }: ClearWishlistButtonProps) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex cursor-pointer items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wide text-body/70 transition-colors duration-150 ease-out hover:text-red-600"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        Clear wishlist
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <p className="text-xs text-body">
        Remove all <span className="font-bold tabular-nums">{count}</span>?
      </p>
      <button
        type="button"
        onClick={() => {
          onClear()
          setConfirming(false)
        }}
        className="cursor-pointer py-2 text-xs font-bold uppercase tracking-wide text-red-600 underline decoration-red-600/40 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-red-600"
      >
        Yes, clear it
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="cursor-pointer py-2 text-xs font-bold uppercase tracking-wide text-body/70 transition-colors duration-150 ease-out hover:text-navy"
      >
        Cancel
      </button>
    </div>
  )
}
