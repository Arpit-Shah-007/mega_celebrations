import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import type { WishlistItem } from "@/types"

interface WishlistItemTileProps {
  item: WishlistItem
  onRemove: (slug: string) => void
  /** Nested content rendered below the name — used to show a package's picked themes as chips. */
  children?: ReactNode
}

/**
 * A single saved pick, as a card in the wishlist grid: photo on top, name and
 * quantity below. A wishlist card, not a priced cart line — pricing is settled
 * in the quote.
 *
 * The remove control stays faintly visible instead of appearing only on hover,
 * because hover never fires on touch and the old hover-only affordance left it
 * undiscoverable on phones.
 */
export function WishlistItemTile({ item, onRemove, children }: WishlistItemTileProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col border border-navy/10 bg-white shadow-soft transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lift"
    >
      <PlaceholderPhoto
        seed={item.imageSeed}
        alt={item.name}
        src={item.image ?? undefined}
        className="h-32 w-full outline outline-1 -outline-offset-1 outline-black/10 sm:h-36"
      />

      <button
        type="button"
        onClick={() => onRemove(item.slug)}
        aria-label={`Remove ${item.name} from wishlist`}
        className="absolute right-2 top-2 flex h-9 w-9 cursor-pointer items-center justify-center bg-white/90 text-navy opacity-75 shadow-soft transition-[background-color,color,opacity,transform] duration-150 ease-out hover:bg-red-600 hover:text-white focus-visible:opacity-100 active:scale-95 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-pretty text-sm font-semibold leading-snug text-navy">{item.name}</p>
          {item.quantity !== undefined ? (
            <span className="shrink-0 rounded-full bg-navy/10 px-2 py-0.5 text-xs font-bold tabular-nums text-navy">
              ×{item.quantity}
            </span>
          ) : null}
        </div>
        {children}
      </div>
    </motion.li>
  )
}
