import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"

interface PackageImageCarouselProps {
  images: string[]
  alt: string
  seed: string
  icon?: LucideIcon
}

/**
 * Matches the live site's package-detail photo slideshow: fades between real
 * photos with blue left/right arrow controls that appear once there's more
 * than one photo. Falls back to the existing placeholder treatment for a
 * package with no real photography at all.
 */
export function PackageImageCarousel({ images, alt, seed, icon }: PackageImageCarouselProps) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return <PlaceholderPhoto seed={seed} alt={alt} icon={icon} className="h-full w-full" />
  }

  const goToPrevious = () => setIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  const goToNext = () => setIndex((current) => (current === images.length - 1 ? 0 : current + 1))

  return (
    <div className="group relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-blue/80 text-white opacity-0 transition-opacity duration-200 hover:bg-blue group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-blue/80 text-white opacity-0 transition-opacity duration-200 hover:bg-blue group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
    </div>
  )
}
