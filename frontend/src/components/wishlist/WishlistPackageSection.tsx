import { Package, X } from "lucide-react"
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
        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-bold tabular-nums text-navy">
          {packages.length}
        </span>
      </div>

      <div className="mt-3">
        {packages.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {packages.map((pkg) => {
                  const pkgThemes = themes.filter((theme) => theme.packageSlug === pkg.slug)
                  return (
                    <WishlistItemTile key={pkg.slug} item={pkg} onRemove={onRemovePackage}>
                      {/* Themes read as attributes of the package they were picked under, so
                          they sit inside its card as chips rather than as sibling cards that
                          would imply they were picked independently. */}
                      {pkgThemes.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {pkgThemes.map((theme) => (
                            <li key={theme.slug}>
                              <span className="flex items-center gap-1 bg-pink/12 py-1 pl-2 pr-1 text-xs font-semibold text-navy">
                                {theme.name}
                                <button
                                  type="button"
                                  onClick={() => onRemoveTheme(theme.slug)}
                                  aria-label={`Remove ${theme.name} from wishlist`}
                                  className="relative flex h-5 w-5 cursor-pointer items-center justify-center text-navy/60 transition-colors duration-150 ease-out before:absolute before:-inset-1 before:content-[''] hover:text-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            </li>
                          ))}
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
