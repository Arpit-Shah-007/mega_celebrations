import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ClipboardCopy } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { formatWishlistSummary } from "@/components/wishlist/wishlist-summary"
import type { WishlistItem } from "@/types"

/** Verbatim label (their wording, their spacing) of the form's own free-text question, quoted so it matches what the visitor reads inside the iframe. */
export const FREE_TEXT_QUESTION = "Any thing else you would like us to know?"

type CopyState = "idle" | "copied" | "manual"

interface WishlistHandoffProps {
  items: WishlistItem[]
}

/**
 * The wishlist cannot be written into the HoneyBook form by any automatic
 * means — it ignores URL parameters, names its fields with per-question UUIDs,
 * sits on another origin, and is reCAPTCHA-protected (all verified against the
 * live form). So the handoff is an explicit, visible copy step, and this makes
 * it look deliberate rather than like a workaround: it closes out the "Your
 * Picks" step and points at the exact question to paste into.
 */
export function WishlistHandoff({ items }: WishlistHandoffProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle")
  const summary = formatWishlistSummary(items)

  if (!summary) return null

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopyState("copied")
    } catch {
      // The Clipboard API is unavailable outside a secure context and blocked
      // in some in-app browsers — show the text so it can still be selected by
      // hand rather than leaving the button silently doing nothing.
      setCopyState("manual")
    }
  }

  const copied = copyState === "copied"

  return (
    <div className="border-b border-navy/10 bg-pink/8 px-5 py-4 sm:px-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy">Bring your picks into the form</p>
          <p className="mt-0.5 text-pretty text-sm text-body">
            Copy your wishlist, then paste it into the "{FREE_TEXT_QUESTION}" box near the bottom of the form — that way
            we quote exactly what you picked.
          </p>
        </div>

        <Button
          kind="action"
          onClick={handleCopy}
          className="shrink-0 transition-[background-color,transform,box-shadow] duration-150 ease-out hover:shadow-soft active:scale-[0.97]"
        >
          {/* Cross-faded rather than swapped outright, so the confirmation reads as the same
              control changing state instead of one button being replaced by another. */}
          <span className="relative flex h-4 w-4 items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={copied ? "check" : "copy"}
                initial={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.6, filter: "blur(2px)", transition: { duration: 0.12 } }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <ClipboardCopy className="h-4 w-4" aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </span>
          {copied ? "Copied" : "Copy My Wishlist"}
        </Button>
      </div>

      <p aria-live="polite" className="mt-2 text-xs text-body/80">
        {copied ? `Wishlist copied. Paste it into "${FREE_TEXT_QUESTION}" near the bottom of the form.` : ""}
      </p>

      {copyState === "manual" ? (
        <div className="mt-2">
          <label htmlFor="wishlist-summary" className="text-xs font-bold uppercase tracking-wide text-navy">
            Copying is blocked in this browser — select this text and copy it
          </label>
          <textarea
            id="wishlist-summary"
            readOnly
            rows={8}
            value={summary}
            className="mt-1 w-full border border-navy/15 bg-offwhite p-3 font-mono text-xs text-navy"
          />
        </div>
      ) : null}
    </div>
  )
}
