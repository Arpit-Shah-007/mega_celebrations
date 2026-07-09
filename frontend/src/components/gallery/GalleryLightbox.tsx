import { useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { GalleryImage } from "@/components/gallery/galleryTypes"

interface GalleryLightboxProps {
  images: GalleryImage[]
  index: number | null
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function GalleryLightbox({ images, index, onClose, onNext, onPrev }: GalleryLightboxProps) {
  const isOpen = index !== null
  const activeImage = isOpen ? images[index] : null

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowRight") onNext()
      if (event.key === "ArrowLeft") onPrev()
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose, onNext, onPrev])

  return createPortal(
    <AnimatePresence>
      {isOpen && activeImage ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${activeImage.alt}`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 cursor-pointer text-white transition-opacity hover:opacity-70 sm:right-8 sm:top-8"
          >
            <X className="h-8 w-8" />
          </button>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onPrev()
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-white transition-opacity hover:opacity-70 sm:left-6"
            >
              <ChevronLeft className="h-14 w-14" strokeWidth={1.5} />
            </button>
          ) : null}

          <motion.div
            key={activeImage.src}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-full w-full items-center justify-center py-14 sm:py-20"
          >
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(event) => {
                    event.stopPropagation()
                    onPrev()
                  }}
                  className="absolute inset-y-0 left-0 z-0 w-1/2 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(event) => {
                    event.stopPropagation()
                    onNext()
                  }}
                  className="absolute inset-y-0 right-0 z-0 w-1/2 cursor-pointer"
                />
              </>
            ) : null}
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="pointer-events-none relative h-full w-full object-contain"
            />
          </motion.div>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onNext()
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-white transition-opacity hover:opacity-70 sm:right-6"
            >
              <ChevronRight className="h-14 w-14" strokeWidth={1.5} />
            </button>
          ) : null}

          {images.length > 1 && index !== null ? (
            <div className="absolute bottom-4 right-4 z-10 text-sm font-semibold text-white/80 sm:bottom-8 sm:right-8">
              {index + 1} / {images.length}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
