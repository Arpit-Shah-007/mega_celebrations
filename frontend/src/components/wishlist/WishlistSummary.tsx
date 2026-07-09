import { AnimatePresence } from "framer-motion"
import { WishlistItemRow } from "@/components/wishlist/WishlistItemRow"
import type { WishlistItem } from "@/types"

interface WishlistSummaryProps {
  items: WishlistItem[]
  onRemove: (slug: string) => void
}

export function WishlistSummary({ items, onRemove }: WishlistSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.startingPrice, 0)

  return (
    <div className="bg-graytint p-5 shadow-soft sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl sm:text-2xl">Your Wishlist</h2>
        <span className="text-sm text-body">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <WishlistItemRow key={item.slug} item={item} onRemove={onRemove} />
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-navy/15 pt-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-navy">Estimated Total</p>
          <p className="text-xs text-body/80">Final pricing is confirmed in your custom quote.</p>
        </div>
        <p className="text-2xl text-pink-dark sm:text-3xl">${total.toLocaleString()}+</p>
      </div>
    </div>
  )
}
