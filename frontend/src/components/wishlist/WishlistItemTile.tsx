import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import type { WishlistItem } from "@/types"

interface WishlistItemTileProps {
  item: WishlistItem
  onRemove: (slug: string) => void
  /** Nested content rendered below the row — used to show a package's picked themes beneath it. */
  children?: ReactNode
}

/** A single saved-item row in the wishlist panel: thumbnail + full name side by side, remove control revealed on hover — a wishlist row, not a priced cart line. */
export function WishlistItemTile({ item, onRemove, children }: WishlistItemTileProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white/70 py-2 pl-2 pr-9"
    >
      <div className="flex items-center gap-3">
        <PlaceholderPhoto seed={item.imageSeed} alt={item.name} src={item.image ?? undefined} className="h-14 w-14 shrink-0" />
        <p className="text-sm font-semibold leading-snug text-navy">{item.name}</p>
        <button
          type="button"
          onClick={() => onRemove(item.slug)}
          aria-label={`Remove ${item.name} from wishlist`}
          className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-navy text-white opacity-0 shadow-soft transition group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-red-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {children ? <div className="mt-2">{children}</div> : null}
    </motion.li>
  )
}
