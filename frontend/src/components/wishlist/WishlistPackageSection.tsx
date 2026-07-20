import { Package } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { WishlistItemTile } from "@/components/wishlist/WishlistItemTile"
import { EmptyCategoryState } from "@/components/wishlist/EmptyCategoryState"
import { AddMoreButton } from "@/components/wishlist/AddMoreButton"
import type { WishlistItem } from "@/types"

const PACKAGES_EXPLORE_TO = "/packages/full-services-packages"

interface WishlistPackageSectionProps {
  packages: WishlistItem[]
  themes: WishlistItem[]
  onRemovePackage: (slug: string) => void
  onRemoveTheme: (slug: string) => void
}

/**
 * Packages shown together with the themes picked under them, instead of a separate flat
 * "Themes" section — a package only ever enters the wishlist because one of its themes was
 * picked, so this matches how the item actually got here.
 */
export function WishlistPackageSection({ packages, themes, onRemovePackage, onRemoveTheme }: WishlistPackageSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-navy/50" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-navy">Packages</h3>
        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-bold text-navy">{packages.length}</span>
      </div>

      <div className="mt-3">
        {packages.length > 0 ? (
          <>
            <ul className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {packages.map((pkg) => {
                  const pkgThemes = themes.filter((theme) => theme.packageSlug === pkg.slug)
                  return (
                    <WishlistItemTile key={pkg.slug} item={pkg} onRemove={onRemovePackage}>
                      {pkgThemes.length > 0 ? (
                        <ul className="ml-14 flex flex-col gap-2 border-l-2 border-navy/10 pl-3">
                          <AnimatePresence initial={false}>
                            {pkgThemes.map((theme) => (
                              <WishlistItemTile key={theme.slug} item={theme} onRemove={onRemoveTheme} />
                            ))}
                          </AnimatePresence>
                        </ul>
                      ) : null}
                    </WishlistItemTile>
                  )
                })}
              </AnimatePresence>
            </ul>
            <AddMoreButton to={PACKAGES_EXPLORE_TO} />
          </>
        ) : (
          <EmptyCategoryState icon={Package} message="Nothing picked yet." exploreLabel="Explore Packages" exploreTo={PACKAGES_EXPLORE_TO} />
        )}
      </div>
    </div>
  )
}
