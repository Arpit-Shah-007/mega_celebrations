import type { LucideIcon } from "lucide-react"
import { Package, ShoppingBag, Palette, Sparkles } from "lucide-react"
import { WishlistCategorySection } from "@/components/wishlist/WishlistCategorySection"
import type { WishlistItem, WishlistItemCategory } from "@/types"

interface CategoryConfig {
  key: WishlistItemCategory
  label: string
  icon: LucideIcon
  emptyMessage: string
  exploreLabel: string
  exploreTo: string
}

/** Fixed display order: Packages, A La Carte, Themes, Add-Ons — matches the site's own catalog structure. Themes has no standalone browse page (themes only exist inside a package's own detail page), so its explore link points at Packages instead. */
const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    key: "package",
    label: "Packages",
    icon: Package,
    emptyMessage: "Nothing picked yet.",
    exploreLabel: "Explore Packages",
    exploreTo: "/packages",
  },
  {
    key: "a-la-carte",
    label: "A La Carte",
    icon: ShoppingBag,
    emptyMessage: "Nothing picked yet.",
    exploreLabel: "Explore A La Carte",
    exploreTo: "/packages/a-la-carte",
  },
  {
    key: "theme",
    label: "Themes",
    icon: Palette,
    emptyMessage: "Nothing picked yet.",
    exploreLabel: "Browse Packages to find themes",
    exploreTo: "/packages",
  },
  {
    key: "add-on",
    label: "Add-Ons",
    icon: Sparkles,
    emptyMessage: "Nothing picked yet.",
    exploreLabel: "Explore Add-Ons",
    exploreTo: "/packages/add-ons",
  },
]

interface WishlistPanelProps {
  items: WishlistItem[]
  onRemove: (slug: string) => void
}

export function WishlistPanel({ items, onRemove }: WishlistPanelProps) {
  const total = items.reduce((sum, item) => sum + item.startingPrice, 0)

  return (
    <div className="bg-graytint p-5 shadow-soft sm:p-8 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between gap-4 border-b border-navy/15 pb-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-navy">Estimated Total</p>
          <p className="text-xs text-body/80">Final pricing is confirmed in your custom quote.</p>
        </div>
        <p className="text-2xl text-pink-dark sm:text-3xl">${total.toLocaleString()}+</p>
      </div>

      <div className="mt-6 space-y-6">
        {CATEGORY_CONFIG.map((config) => (
          <WishlistCategorySection
            key={config.key}
            label={config.label}
            icon={config.icon}
            items={items.filter((item) => item.category === config.key)}
            onRemove={onRemove}
            emptyMessage={config.emptyMessage}
            exploreLabel={config.exploreLabel}
            exploreTo={config.exploreTo}
          />
        ))}
      </div>
    </div>
  )
}
