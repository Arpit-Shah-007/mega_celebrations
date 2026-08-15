import type { ReactNode } from "react"

interface WishlistStepCardProps {
  title: string
  description?: ReactNode
  /**
   * Puts the header on a navy bar instead of white. Used for the card that
   * frames the embedded HoneyBook form: the form arrives as an unstyled
   * cross-origin iframe, so the bar is what gives it a top edge and stops it
   * floating loose on the page.
   */
  emphasis?: boolean
  children: ReactNode
}

/**
 * One card in the wishlist's request flow — review, then submit. Their order
 * is carried by position alone; an earlier version numbered them, which just
 * added chrome to a two-item sequence that reads fine without it.
 */
export function WishlistStepCard({ title, description, emphasis = false, children }: WishlistStepCardProps) {
  return (
    <section className="border border-navy/10 bg-white shadow-soft">
      <header className={emphasis ? "bg-navy px-5 py-4 sm:px-7" : "border-b border-navy/10 px-5 py-4 sm:px-7"}>
        <h2 className={`text-balance text-lg sm:text-xl ${emphasis ? "text-white" : ""}`}>{title}</h2>
        {description ? (
          <p className={`mt-1 text-pretty text-sm ${emphasis ? "text-white/70" : "text-body"}`}>{description}</p>
        ) : null}
      </header>

      <div className={emphasis ? "" : "px-5 py-5 sm:px-7"}>{children}</div>
    </section>
  )
}
