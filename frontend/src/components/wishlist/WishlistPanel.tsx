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

/** Fixed display order: Packages, A La Carte, Themes, Add-Ons — matches the site's own catalog structure. Themes' explore destination is resolved dynamically in the component body below, since it depends on whether a package is already wishlisted. */
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
    // Placeholder — always overridden in the component body below, since the real destination
    // depends on whether a package is already wishlisted (that package's own page vs. the
    // full-service packages listing, since themes only exist inside a package's detail page).
    exploreLabel: "Choose a Package to Find Themes",
    exploreTo: "/packages/full-services-packages",
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

  // Themes only exist inside a package's own detail page, so send the visitor to the package
  // they've already wishlisted (the first one, if more than one) rather than a generic hub —
  // falling back to the full-service packages listing when nothing's been picked yet.
  const wishlistedPackage = items.find((item) => item.category === "package")
  const themeExplore = wishlistedPackage
    ? { exploreTo: `/packages/${wishlistedPackage.slug}`, exploreLabel: `Browse Themes for ${wishlistedPackage.name}` }
    : { exploreTo: "/packages/full-services-packages", exploreLabel: "Choose a Package to Find Themes" }

  return (
    <div className="bg-graytint p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4 border-b border-navy/15 pb-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-navy">Estimated Total</p>
          <p className="text-xs text-body/80">Final pricing is confirmed in your custom quote.</p>
        </div>
        <p className="text-2xl text-pink-dark sm:text-3xl">${total.toLocaleString()}+</p>
      </div>

      <div className="mt-6 space-y-6">
        {CATEGORY_CONFIG.map((config) => {
          const resolved = config.key === "theme" ? { ...config, ...themeExplore } : config
          return (
            <WishlistCategorySection
              key={resolved.key}
              label={resolved.label}
              icon={resolved.icon}
              items={items.filter((item) => item.category === resolved.key)}
              onRemove={onRemove}
              emptyMessage={resolved.emptyMessage}
              exploreLabel={resolved.exploreLabel}
              exploreTo={resolved.exploreTo}
            />
          )
        })}
      </div>
    </div>
  )
}
