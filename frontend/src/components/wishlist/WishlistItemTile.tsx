import { motion } from "framer-motion"
import { X } from "lucide-react"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import type { WishlistItem } from "@/types"

interface WishlistItemTileProps {
  item: WishlistItem
  onRemove: (slug: string) => void
}

/** A single saved-item tile in the wishlist panel: thumbnail + name, remove control revealed on hover — a mood-board tile, not a priced cart line. */
export function WishlistItemTile({ item, onRemove }: WishlistItemTileProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-20 shrink-0"
    >
      <PlaceholderPhoto seed={item.imageSeed} alt={item.name} className="h-20 w-20" />
      <button
        type="button"
        onClick={() => onRemove(item.slug)}
        aria-label={`Remove ${item.name} from wishlist`}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
      <p className="mt-1.5 truncate text-center text-xs font-semibold text-navy" title={item.name}>
        {item.name}
      </p>
    </motion.li>
  )
}
