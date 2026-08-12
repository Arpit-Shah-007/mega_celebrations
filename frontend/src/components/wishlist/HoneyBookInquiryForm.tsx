import { ExternalLink } from "lucide-react"
import { WishlistStepCard } from "@/components/wishlist/WishlistStepCard"

export const HONEYBOOK_INQUIRY_FORM_URL = "https://megacelebrations.hbportal.co/public/inquiryform/1-Inquiry_form"

/**
 * Replaces the old HoneyBook "Website Placement" widget, which only ever
 * created a HoneyBook *Contact* — someone then had to promote each lead to a
 * project by hand. This embeds the account's hosted inquiry form instead,
 * which creates a real Project in the Inquiry stage (verified end to end with
 * a live test submission).
 *
 * A plain iframe rather than a script widget, because that form is a
 * standalone page on hbportal.co: it sends no X-Frame-Options or CSP
 * frame-ancestors and does not frame-bust, so it renders in place on our own
 * domain. Nothing inside it can be styled from here, so the surrounding step
 * card does the presentation work — a navy header bar for a top edge and a
 * footer strip so the form reads as part of the page instead of a bare
 * rectangle dropped onto it.
 *
 * Its height is fixed rather than fitted to the content: the page only posts
 * `hb_resize` to the parent from its embedded-widget code path, not from this
 * hosted flow app, so there is no height to listen for. It carries its own
 * sticky Submit bar and scrolls internally, which is what that fixed
 * viewport-relative box gives it.
 */
export function HoneyBookInquiryForm() {
  return (
    <WishlistStepCard
      step={2}
      title="Request Your Custom Quote"
      description="Tell us about your event and we'll price out everything on your wishlist."
      emphasis
    >
      <iframe
        title="Mega Celebrations inquiry form"
        src={HONEYBOOK_INQUIRY_FORM_URL}
        className="block h-[85vh] min-h-[640px] w-full border-0"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-navy/10 bg-offwhite px-5 py-3 sm:px-7">
        <p className="text-xs text-body/80">Your details go straight to the Mega Celebrations team.</p>
        <a
          href={HONEYBOOK_INQUIRY_FORM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy underline decoration-navy/30 underline-offset-4 transition-colors duration-150 ease-out hover:text-pink-dark hover:decoration-pink-dark"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Open it in a new tab
        </a>
      </div>
    </WishlistStepCard>
  )
}
