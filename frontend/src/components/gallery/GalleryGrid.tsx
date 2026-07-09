import { motion } from "framer-motion"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import type { GalleryImage } from "@/components/gallery/galleryTypes"

interface GalleryGridProps {
  images: GalleryImage[]
  onSelect: (index: number) => void
}

export function GalleryGrid({ images, onSelect }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {images.map((image, index) => (
        <motion.button
          key={image.src}
          type="button"
          onClick={() => onSelect(index)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: (index % 6) * 0.05 }}
          className="group relative block aspect-6/5 w-full cursor-pointer overflow-hidden text-left"
          aria-label={`View photo: ${image.alt}`}
        >
          <PlaceholderPhoto
            seed={image.src}
            alt={image.alt}
            src={image.src}
            className="absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-200 group-hover:bg-white/50" />
        </motion.button>
      ))}
    </div>
  )
}
