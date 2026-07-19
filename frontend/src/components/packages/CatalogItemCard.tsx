import type { LucideIcon } from "lucide-react"
import { Check, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import { useWishlist } from "@/context/useWishlist"
import { useToast } from "@/context/useToast"
import { parsePriceValue, slugify } from "@/lib/catalogItem"
import type { WishlistItemCategory } from "@/types"

interface CatalogItemCardProps {
  name: string
  price?: string
  /** Category slug or other namespace, combined with the item name into a stable wishlist key so items with the same name in different categories don't collide. */
  namespace: string
  /** Which wishlist panel section this item belongs to when saved. */
  category: WishlistItemCategory
  icon?: LucideIcon
  /** Real product photo. Falls back to the live site's own "No image available." placeholder box when absent — the catalog genuinely has no photo for every item, so a decorative gradient here would misrepresent it. */
  image?: string | null
  delay?: number
  /** Opens the item detail modal. Omitted for callers that don't support it yet. */
  onOpenDetails?: () => void
}

/**
 * Individual rental/purchase item card used on the A La Carte and Add-On
 * category pages, matching the live site's catalog cards: a photo with a
 * "+" wishlist toggle in the corner, name, and price. These items have no
 * detail page of their own, so they're added to the shared wishlist by a
 * locally-built slug rather than a package slug.
 */
export function CatalogItemCard({ name, price, namespace, category, icon, image, delay = 0, onOpenDetails }: CatalogItemCardProps) {
  const { toggleItem, isSaved } = useWishlist()
  const { showToast } = useToast()
  const slug = `${namespace}-${slugify(name)}`
  const saved = isSaved(slug)

  const handleClick = () => {
    toggleItem({ slug, name, imageSeed: slug, image, startingPrice: parsePriceValue(price), category })
    showToast(saved ? `Removed ${name} from your wishlist` : `Added ${name} to your wishlist`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col bg-white shadow-soft"
    >
      <div className="relative">
        {image ? (
          <PlaceholderPhoto seed={slug} alt={name} icon={icon} src={image} className="h-48 w-full sm:h-56" />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-graytint sm:h-56">
            <span className="text-sm text-body/70">No image available.</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleClick}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          className={`absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center transition-colors ${
            saved ? "bg-navy text-white" : "bg-pink text-white hover:bg-blue"
          }`}
        >
          {saved ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex flex-col gap-0.5 border-t-4 border-blue py-1.5 text-center">
        {onOpenDetails ? (
          <button
            type="button"
            onClick={onOpenDetails}
            className="cursor-pointer py-1 text-base font-bold leading-tight text-navy transition-colors hover:text-pink"
          >
            {name}
          </button>
        ) : (
          <p className="text-base font-bold leading-tight text-navy">{name}</p>
        )}
        {price ? <p className="text-sm font-semibold leading-tight text-blue">{price}</p> : null}
      </div>
    </motion.div>
  )
}
