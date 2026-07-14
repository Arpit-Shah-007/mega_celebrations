import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import { getTagIcon } from "@/components/packages/tagIcons"
import type { Package } from "@/types"

interface PackageCardProps {
  pkg: Package
  className?: string
}

/**
 * Package card: a portrait (2:3) photo with the name shown in a solid white
 * bar at the bottom by default. On hover, that bar is replaced by a taller
 * white panel that slides up from the bottom edge INSIDE the image (not below
 * it) to reveal the tagline and a "Read More" link — no wishlist icon here
 * (wishlist-adding lives on the package detail page instead).
 */
export function PackageCard({ pkg, className = "" }: PackageCardProps) {
  const [hovered, setHovered] = useState(false)
  const Icon = getTagIcon(pkg.tags[0])

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`group relative bg-white ${className}`}
    >
      <Link to={`/packages/${pkg.slug}`} className="absolute inset-0 z-20" aria-label={`View details for ${pkg.name}`} />

      <div className="relative aspect-2/3 w-full overflow-hidden">
        <PlaceholderPhoto
          seed={pkg.slug}
          alt={pkg.cardImage.alt}
          icon={Icon}
          src={pkg.cardImage.url || undefined}
          className="absolute inset-0 h-full w-full"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-white px-4 py-3 transition-opacity duration-200"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          <p className="truncate text-center text-base font-semibold uppercase tracking-wide text-navy">
            {pkg.name}
          </p>
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 z-30 flex h-2/5 flex-col justify-center overflow-hidden bg-white px-5 py-3 text-center transition-transform duration-1100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Link
            to={`/packages/${pkg.slug}`}
            className="relative z-30 inline-block cursor-pointer text-base font-semibold uppercase tracking-wide text-navy transition-colors hover:text-pink"
          >
            {pkg.name}
          </Link>
          <p className="mt-2 text-xs leading-relaxed text-body">{pkg.tagline}</p>
          <Link
            to={`/packages/${pkg.slug}`}
            className="relative z-30 mt-3 inline-block cursor-pointer text-xs font-bold uppercase tracking-wide text-navy transition-colors hover:text-pink"
          >
            Read More
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
