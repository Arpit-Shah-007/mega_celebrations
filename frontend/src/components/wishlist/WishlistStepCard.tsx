import type { ReactNode } from "react"

interface WishlistStepCardProps {
  step: number
  title: string
  description?: ReactNode
  /** Shown as a pill beside the title — the number of picks, for the "Your Picks" step. */
  count?: number
  /**
   * Puts the header on a navy bar instead of white. Used for the step that
   * frames the embedded HoneyBook form: the form arrives as an unstyled
   * cross-origin iframe, so the bar is what gives it a top edge and stops it
   * floating loose on the page.
   */
  emphasis?: boolean
  children: ReactNode
}

/**
 * One numbered step in the wishlist's request flow. The whole page is two of
 * these stacked, so the visitor reads it as review-then-submit rather than as
 * two unrelated boxes.
 */
export function WishlistStepCard({ step, title, description, count, emphasis = false, children }: WishlistStepCardProps) {
  return (
    <section className="border border-navy/10 bg-white shadow-soft">
      <header className={emphasis ? "bg-navy px-5 py-5 sm:px-7" : "border-b border-navy/10 px-5 py-5 sm:px-7"}>
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${
              emphasis ? "bg-white text-navy" : "bg-pink text-white"
            }`}
          >
            {step}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className={`text-balance text-lg sm:text-xl ${emphasis ? "text-white" : ""}`}>{title}</h2>
              {count !== undefined ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                    emphasis ? "bg-white/15 text-white" : "bg-navy/10 text-navy"
                  }`}
                >
                  {count}
                </span>
              ) : null}
            </div>
            {description ? (
              <p className={`mt-1 text-pretty text-sm ${emphasis ? "text-white/70" : "text-body"}`}>{description}</p>
            ) : null}
          </div>
        </div>
      </header>

      <div className={emphasis ? "" : "px-5 py-6 sm:px-7"}>{children}</div>
    </section>
  )
}
