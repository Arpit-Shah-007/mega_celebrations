import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import { MEDIA_BASE_URL } from "@/lib/media"

interface PageHeroProps {
  title: ReactNode
  /** Real site uses a solid navy band for most interior pages, but a full-bleed photo for a few (home, package detail, full-service listing, add-ons). */
  variant?: "navy" | "photo"
  photoSeed?: string
  photoAlt?: string
  photoIcon?: LucideIcon
  photoSrc?: string
  /** Override the photo variant's default height (h-72 sm:h-96) — e.g. a shorter band for Add-Ons. */
  photoHeightClassName?: string
  /** Override the photo variant's default darkening overlay (bg-navy/35) — e.g. a darker one for Add-Ons. */
  photoOverlayClassName?: string
  /** Override the photo variant's default title weight (font-bold) — e.g. font-semibold for Package Detail. */
  titleWeightClassName?: string
  /**
   * Shorter navy band with a smaller title. For pages where the band is only a
   * label and the content below it is what the visitor came for — the wishlist,
   * where a full-height banner just pushes the picks and the quote form down.
   */
  compact?: boolean
  children?: ReactNode
}

export function PageHero({
  title,
  variant = "navy",
  photoSeed,
  photoAlt,
  photoIcon,
  photoSrc,
  photoHeightClassName = "h-72 sm:h-96",
  photoOverlayClassName = "bg-navy/35",
  titleWeightClassName = "font-bold",
  compact = false,
  children,
}: PageHeroProps) {
  if (variant === "photo") {
    return (
      <section className={`relative flex items-center justify-center overflow-hidden ${photoHeightClassName}`}>
        <PlaceholderPhoto
          seed={photoSeed ?? "page-hero"}
          alt={photoAlt ?? "Page hero photo"}
          icon={photoIcon}
          src={photoSrc}
          className="absolute inset-0 h-full w-full"
        />
        <div className={`absolute inset-0 ${photoOverlayClassName}`} aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center"
        >
          <h1 className={`text-4xl text-white sm:text-5xl ${titleWeightClassName}`}>{title}</h1>
          {children}
        </motion.div>
      </section>
    )
  }

  return (
    <section
      className={`relative overflow-hidden bg-navy bg-cover bg-center text-center ${compact ? "py-7 sm:py-9" : "py-12 sm:py-14"}`}
      style={{ backgroundImage: `url(${MEDIA_BASE_URL}/media/Navy_Background_Pattern.png)` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <h1 className={`font-bold text-white ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>{title}</h1>
        {children}
      </motion.div>
    </section>
  )
}
