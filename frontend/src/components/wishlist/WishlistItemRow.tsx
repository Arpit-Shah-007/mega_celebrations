import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import { getPackagePhoto } from "@/data/realPhotos"
import type { WishlistItem } from "@/types"

interface WishlistItemRowProps {
  item: WishlistItem
  onRemove: (slug: string) => void
}

export function WishlistItemRow({ item, onRemove }: WishlistItemRowProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-4 bg-white p-3 shadow-soft sm:gap-5 sm:p-4"
    >
      <PlaceholderPhoto
        seed={item.imageSeed}
        alt={`${item.name} preview`}
        src={getPackagePhoto(item.slug)}
        className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-navy sm:text-lg">{item.name}</h3>
        <p className="mt-0.5 text-sm text-body">
          {item.startingPrice > 0 ? `Starting at $${item.startingPrice.toLocaleString()}` : "Pricing coming soon"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.slug)}
        aria-label={`Remove ${item.name} from wishlist`}
        className="flex h-9 w-9 shrink-0 items-center justify-center text-body transition-colors hover:bg-pink/10 hover:text-pink-dark"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.li>
  )
}
