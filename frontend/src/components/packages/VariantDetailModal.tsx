import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Minus, Plus, X } from "lucide-react"
import { useWishlist } from "@/context/useWishlist"
import { useToast } from "@/context/useToast"
import { parsePriceValue, slugify } from "@/lib/catalogItem"
import { ModalAccordionSection } from "@/components/packages/ModalAccordionSection"
import type { PackageContext } from "@/components/packages/CatalogItemCard"
import type { PackageVariant, WishlistItem, WishlistItemCategory } from "@/types"

interface VariantDetailModalProps {
  variant: PackageVariant | null
  /** Same namespace passed to the triggering CatalogItemCard, so the wishlist key matches. */
  namespace: string
  /** "Theme" or "Add-On" — shown in the blue header bar in place of a catalog category. */
  headingLabel: string
  /** Which wishlist panel section this item belongs to when saved — "theme" for the "Choose Your Theme" grid, "add-on" for "Popular Add-Ons". */
  category: WishlistItemCategory
  /** Set only for category="theme" — auto-adds/removes the parent package alongside the theme so the wishlist can group them together. */
  packageContext?: PackageContext
  onClose: () => void
}

/**
 * Detail modal for a package's theme/add-on variants, opened by clicking a
 * VariantGrid card. Matches CatalogItemModal's layout and functionality
 * exactly (blue header, switchable photo thumbnails, quantity stepper, Rate
 * row, price badge, wishlist CTA, Description accordion) — PackageVariant has
 * no category/pricing-breakdown fields, so only those two sections are omitted.
 */
export function VariantDetailModal({ variant, namespace, headingLabel, category, packageContext, onClose }: VariantDetailModalProps) {
  const { addItem, removeItem, isSaved } = useWishlist()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const isOpen = variant !== null

  useEffect(() => {
    if (!isOpen) return undefined
    setQuantity(1)
    setSelectedImageIndex(0)

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
  const images = [variant.image, ...(variant.additionalImages ?? [])].filter((src): src is string => Boolean(src))

  // Always additive: re-opening this modal for an already-saved variant and adding more should
  // accumulate onto its existing quantity (1 saved + 5 added here = 6), never replace it or
  // silently no-op the way a plain saved/unsaved toggle would.
  const handleAddClick = () => {
    const item: WishlistItem = {
      slug,
      name: variant.name,
      imageSeed: slug,
      image: variant.image,
      startingPrice: parsePriceValue(variant.price),
      category,
      ...(packageContext ? { packageSlug: packageContext.slug } : {}),
    }
    const relatedPackage: WishlistItem | undefined = packageContext
      ? {
          slug: packageContext.slug,
          name: packageContext.name,
          imageSeed: packageContext.slug,
          image: packageContext.image,
          startingPrice: packageContext.startingPrice,
          category: "package",
        }
      : undefined
    addItem(item, quantity, relatedPackage)
    showToast(`Added ${quantity} ${variant.name} to your wishlist`)
  }

  const handleRemoveClick = () => {
    removeItem(slug)
    showToast(`Removed ${variant.name} from your wishlist`)
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
                {images.length > 0 ? (
                  <div className="flex h-64 w-full items-center justify-center">
                    <img
                      src={images[selectedImageIndex]}
                      alt={variant.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-graytint">
                    <span className="text-sm text-body/70">No image available.</span>
                  </div>
                )}

                {images.length > 0 ? (
                  <div className="mt-3 flex gap-2">
                    {images.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        aria-label={`Show photo ${index + 1} of ${variant.name}`}
                        aria-current={index === selectedImageIndex}
                        className={`h-14 w-14 shrink-0 cursor-pointer overflow-hidden border-2 transition-colors ${
                          index === selectedImageIndex ? "border-pink" : "border-border hover:border-navy/40"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div>
                <h2 className="text-xl text-navy">{variant.name}</h2>
                <p className="mt-2 inline-block border border-blue px-2.5 py-1 font-bold text-blue">{variant.price}</p>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="font-bold text-navy">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      aria-label="Decrease quantity"
                      className="cursor-pointer text-navy transition-colors hover:text-pink"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 border border-border px-2 py-1 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                      aria-label="Increase quantity"
                      className="cursor-pointer text-navy transition-colors hover:text-pink"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="font-bold text-navy">Rate</span>
                  <span className="border border-border px-3 py-1.5 text-sm text-body">Flat-Fee &ndash; {variant.price}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddClick}
                  className="mt-4 w-full cursor-pointer bg-pink py-2.5 text-center font-bold uppercase tracking-wide text-white transition-colors hover:bg-pink-dark"
                >
                  Add To Wishlist
                </button>

                {saved ? (
                  <button
                    type="button"
                    onClick={handleRemoveClick}
                    className="mt-2 w-full cursor-pointer py-1 text-center text-sm font-bold uppercase tracking-wide text-navy/70 transition-colors hover:text-pink"
                  >
                    Remove From Wishlist
                  </button>
                ) : null}

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
