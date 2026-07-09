import { useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useWishlist } from "@/context/useWishlist"
import { useToast } from "@/context/useToast"
import { parsePriceValue, slugify } from "@/lib/catalogItem"
import { ModalAccordionSection } from "@/components/packages/ModalAccordionSection"
import type { PackageVariant } from "@/types"

interface VariantDetailModalProps {
  variant: PackageVariant | null
  /** Same namespace passed to the triggering CatalogItemCard, so the wishlist key matches. */
  namespace: string
  /** "Theme" or "Add-On" — shown in the blue header bar in place of a catalog category. */
  headingLabel: string
  onClose: () => void
}

/**
 * Detail modal for a package's theme/add-on variants, opened by clicking a
 * VariantGrid card. Matches CatalogItemModal's layout (blue header, two-column
 * photo + details, price badge, wishlist CTA, Description accordion) since
 * PackageVariant carries no category/pricing breakdown, those sections are omitted.
 */
export function VariantDetailModal({ variant, namespace, headingLabel, onClose }: VariantDetailModalProps) {
  const { toggleItem, isSaved } = useWishlist()
  const { showToast } = useToast()
  const isOpen = variant !== null

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!variant) return null

  const slug = `${namespace}-${slugify(variant.name)}`
  const saved = isSaved(slug)

  const handleWishlistClick = () => {
    toggleItem({ slug, name: variant.name, imageSeed: slug, startingPrice: parsePriceValue(variant.price) })
    showToast(saved ? `Removed ${variant.name} from your wishlist` : `Added ${variant.name} to your wishlist`)
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={variant.name}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden bg-white"
          >
            <div className="flex shrink-0 items-center justify-between bg-blue px-5 py-3">
              <span className="font-bold text-white">{headingLabel}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="cursor-pointer text-white transition-opacity hover:opacity-70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6">
              <div>
                {variant.image ? (
                  <div className="flex h-64 w-full items-center justify-center">
                    <img src={variant.image} alt={variant.name} className="h-full w-full object-contain" />
                  </div>
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-graytint">
                    <span className="text-sm text-body/70">No image available.</span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl text-navy">{variant.name}</h2>
                <p className="mt-2 inline-block border border-blue px-2.5 py-1 font-bold text-blue">{variant.price}</p>

                <button
                  type="button"
                  onClick={handleWishlistClick}
                  className="mt-4 w-full cursor-pointer bg-pink py-2.5 text-center font-bold uppercase tracking-wide text-white transition-colors hover:bg-pink-dark"
                >
                  {saved ? "Remove From Wishlist" : "Add To Wishlist"}
                </button>

                {variant.description && variant.description.length > 0 ? (
                  <ModalAccordionSection title="Description">
                    <ul className="space-y-1.5">
                      {variant.description.map((line) => (
                        <li key={line} className="flex gap-2 text-xs leading-relaxed text-body">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-pink" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </ModalAccordionSection>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
