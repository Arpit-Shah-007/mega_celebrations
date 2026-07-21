import type { LucideIcon } from "lucide-react"
import { ShoppingBag, Sparkles } from "lucide-react"
import { WishlistCategorySection } from "@/components/wishlist/WishlistCategorySection"
import { WishlistPackageSection } from "@/components/wishlist/WishlistPackageSection"
import type { WishlistItem } from "@/types"

interface CategoryConfig {
  key: "a-la-carte" | "add-on"
  label: string
  icon: LucideIcon
  emptyMessage: string
  exploreLabel: string
  exploreTo: string
}

/** Fixed display order: Packages (with their themes nested inside), A La Carte, Add-Ons — matches the site's own catalog structure. */
const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    key: "a-la-carte",
    label: "A La Carte",
    icon: ShoppingBag,
    emptyMessage: "Nothing picked yet.",
    exploreLabel: "Explore A La Carte",
    exploreTo: "/packages/a-la-carte",
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
  const packages = items.filter((item) => item.category === "package")
  const themes = items.filter((item) => item.category === "theme")

  return (
    <div className="bg-graytint p-5 sm:p-8">
      <div className="border-b border-navy/15 pb-5">
        <p className="text-sm font-bold uppercase tracking-wide text-navy">Your Picks</p>
        <p className="text-xs text-body/80">Final pricing is confirmed in your custom quote.</p>
      </div>

      <div className="mt-6 space-y-6">
        <WishlistPackageSection packages={packages} themes={themes} onRemovePackage={onRemove} onRemoveTheme={onRemove} />
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
