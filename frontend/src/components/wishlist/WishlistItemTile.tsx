import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import type { WishlistItem } from "@/types"

interface WishlistItemTileProps {
  item: WishlistItem
  onRemove: (slug: string) => void
  /** Nested content rendered below the row — used to show a package's picked themes as chips. */
  children?: ReactNode
}

/**
 * A single saved pick in the wishlist rail: small thumbnail beside its name.
 * Deliberately a compact row rather than a photo card — the rail is a running
 * reminder of what you chose, and every pixel it takes is a pixel the quote
 * form on the right does not get.
 *
 * The remove control stays faintly visible instead of appearing only on hover,
 * because hover never fires on touch and a hover-only affordance left it
 * undiscoverable on phones.
 */
export function WishlistItemTile({ item, onRemove, children }: WishlistItemTileProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border border-navy/8 bg-white py-2 pl-2 pr-9 transition-[border-color,box-shadow] duration-200 ease-out hover:border-navy/20 hover:shadow-soft"
    >
      <div className="flex items-center gap-3">
        <PlaceholderPhoto
          seed={item.imageSeed}
          alt={item.name}
          src={item.image ?? undefined}
          className="h-12 w-12 shrink-0 outline outline-1 -outline-offset-1 outline-black/10"
        />
        <p className="min-w-0 flex-1 text-pretty text-sm font-semibold leading-snug text-navy">{item.name}</p>
        {item.quantity !== undefined ? (
          <span className="shrink-0 rounded-full bg-navy/10 px-2 py-0.5 text-xs font-bold tabular-nums text-navy">
            ×{item.quantity}
          </span>
        ) : null}
      </div>

      {children ? <div className="mt-2 pl-15">{children}</div> : null}

      <button
        type="button"
        onClick={() => onRemove(item.slug)}
        aria-label={`Remove ${item.name} from wishlist`}
        className="absolute right-0 top-0 flex h-9 w-9 cursor-pointer items-center justify-center text-navy/45 opacity-70 transition-[color,opacity,transform] duration-150 ease-out hover:text-red-600 focus-visible:opacity-100 active:scale-90 group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.li>
  )
}
