import type { LucideIcon } from "lucide-react"
import { ShoppingBag, Sparkles } from "lucide-react"
import { WishlistCategorySection } from "@/components/wishlist/WishlistCategorySection"
import { WishlistPackageSection } from "@/components/wishlist/WishlistPackageSection"
import { WishlistStepCard } from "@/components/wishlist/WishlistStepCard"
import { ClearWishlistButton } from "@/components/wishlist/ClearWishlistButton"
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
  onClear: () => void
}

export function WishlistPanel({ items, onRemove, onClear }: WishlistPanelProps) {
  const packages = items.filter((item) => item.category === "package")
  const themes = items.filter((item) => item.category === "theme")
  // A package is never picked on its own — it rides along with a theme (see
  // WishlistContext's toggleItem), so counting it would double-count one choice.
  const pickCount = items.filter((item) => item.category !== "package").length

  return (
    <WishlistStepCard title="Your Picks" description="Final pricing is confirmed in your custom quote.">
      {/* Three columns side by side once there is room, so the card reads as one
          glance across the three categories instead of a long scroll. Below lg
          the columns would squeeze the item rows narrower than their thumbnail
          plus name, so they stack there. items-start keeps each column its own
          height rather than stretching all three to the tallest. */}
      <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
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

      {pickCount > 0 ? (
        <div className="mt-5 border-t border-navy/10 pt-2">
          <ClearWishlistButton count={pickCount} onClear={onClear} />
        </div>
      ) : null}
    </WishlistStepCard>
  )
}
