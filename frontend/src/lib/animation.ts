import type { Variants } from "framer-motion"

/**
 * Replicates the live site's Enfold theme scroll-reveal animations exactly (extracted from
 * its shipped @keyframes: avia-ttb/btt/ltr/rtl/fadein/avia_image_appear). Enfold triggers these
 * once per element the first time it scrolls into view, never repeating.
 */
const EASE_STANDARD = [0.175, 0.885, 0.32, 1.275] as const
const EASE_BOTTOM_TO_TOP = [0.165, 0.84, 0.44, 1] as const

export const revealVariants = {
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5, ease: "easeOut" } },
  },
  "pop-up": {
    hidden: { opacity: 0.1, scale: 0.7 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_STANDARD } },
  },
  "top-to-bottom": {
    hidden: { opacity: 0, y: "-10%" },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_STANDARD } },
  },
  "bottom-to-top": {
    hidden: { opacity: 0, y: "50%" },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_BOTTOM_TO_TOP } },
  },
  "left-to-right": {
    hidden: { opacity: 0, x: "-10%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_STANDARD } },
  },
  "right-to-left": {
    hidden: { opacity: 0, x: "10%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_STANDARD } },
  },
} satisfies Record<string, Variants>

export type RevealDirection = keyof typeof revealVariants

/** Enfold triggers the reveal a bit before the element's edge reaches the viewport edge, not exactly at it. */
export const revealViewport = { once: true, margin: "0px 0px -80px 0px" } as const
