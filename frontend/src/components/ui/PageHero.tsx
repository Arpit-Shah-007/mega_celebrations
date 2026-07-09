import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"

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
      className="relative overflow-hidden bg-navy bg-cover bg-center py-12 text-center sm:py-14"
      style={{ backgroundImage: "url(/media/how-to-book-background.png)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {children}
      </motion.div>
    </section>
  )
}
