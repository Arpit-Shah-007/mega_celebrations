import type { LucideIcon } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { WishlistItemTile } from "@/components/wishlist/WishlistItemTile"
import { EmptyCategoryState } from "@/components/wishlist/EmptyCategoryState"
import { AddMoreButton } from "@/components/wishlist/AddMoreButton"
import type { WishlistItem } from "@/types"

interface WishlistCategorySectionProps {
  label: string
  icon: LucideIcon
  items: WishlistItem[]
  onRemove: (slug: string) => void
  emptyMessage: string
  exploreLabel: string
  exploreTo: string
}

export function WishlistCategorySection({
  label,
  icon: Icon,
  items,
  onRemove,
  emptyMessage,
  exploreLabel,
  exploreTo,
}: WishlistCategorySectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-navy/50" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-navy">{label}</h3>
        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-bold text-navy">{items.length}</span>
      </div>

      <div className="mt-3">
        {items.length > 0 ? (
          <>
            <ul className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <WishlistItemTile key={item.slug} item={item} onRemove={onRemove} />
                ))}
              </AnimatePresence>
            </ul>
            <AddMoreButton to={exploreTo} />
          </>
        ) : (
          <EmptyCategoryState icon={Icon} message={emptyMessage} exploreLabel={exploreLabel} exploreTo={exploreTo} />
        )}
      </div>
    </div>
  )
}
