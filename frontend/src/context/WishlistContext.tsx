import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import type { WishlistItem, WishlistItemCategory } from "@/types"
import { WishlistContext } from "@/context/wishlist-context-value"

const STORAGE_KEY = "mega-celebrations:wishlist"
const VALID_CATEGORIES: WishlistItemCategory[] = ["package", "add-on", "theme", "a-la-carte"]

/** Items saved before `category` existed (or with a value that's since been renamed/removed) fall back to "package" rather than disappearing from the wishlist. */
function normalizeItem(item: WishlistItem): WishlistItem {
  return VALID_CATEGORIES.includes(item.category) ? item : { ...item, category: "package" }
}

function readStoredWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as WishlistItem[]).map(normalizeItem) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => readStoredWishlist())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // A submission redirects the whole tab away to HoneyBook and back (see
  // ContactThankYouPage, which clears the wishlist there). Returning via the
  // browser's back button can restore this page instance from bfcache with
  // its pre-clear in-memory state still intact, even though localStorage was
  // already emptied on the page in between — so re-sync from storage on any
  // bfcache restore rather than trusting the frozen React state.
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) setItems(readStoredWishlist())
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  const addItem = useCallback((item: WishlistItem, quantity = 1, relatedPackage?: WishlistItem) => {
    setItems((current) => {
      // The package itself isn't quantity-tracked (it's an umbrella for its themes), so it's
      // inserted as-is rather than through the quantity-accumulate path below.
      const withPackage =
        relatedPackage && !current.some((existing) => existing.slug === relatedPackage.slug)
          ? [...current, relatedPackage]
          : current
      const existing = withPackage.find((entry) => entry.slug === item.slug)
      if (existing) {
        return withPackage.map((entry) =>
          entry.slug === item.slug ? { ...entry, quantity: (entry.quantity ?? 1) + quantity } : entry,
        )
      }
      return [...withPackage, { ...item, quantity }]
    })
  }, [])

  // A package and its themes are two sides of the same pick, so removing either side should
  // take the other with it: removing a theme drops its package once no sibling theme is left
  // referencing it, and removing a package directly drops every theme nested under it (they'd
  // otherwise linger in state with nowhere left to render).
  const dropRelatedItems = useCallback((items: WishlistItem[], removed: WishlistItem): WishlistItem[] => {
    if (removed.category === "theme" && removed.packageSlug) {
      const packageStillHasThemes = items.some(
        (existing) => existing.category === "theme" && existing.packageSlug === removed.packageSlug,
      )
      return packageStillHasThemes ? items : items.filter((existing) => existing.slug !== removed.packageSlug)
    }
    if (removed.category === "package") {
      return items.filter((existing) => !(existing.category === "theme" && existing.packageSlug === removed.slug))
    }
    return items
  }, [])

  const removeItem = useCallback(
    (slug: string) => {
      setItems((current) => {
        const removed = current.find((existing) => existing.slug === slug)
        const withoutItem = current.filter((existing) => existing.slug !== slug)
        return removed ? dropRelatedItems(withoutItem, removed) : withoutItem
      })
    },
    [dropRelatedItems],
  )

  const toggleItem = useCallback(
    (item: WishlistItem, relatedPackage?: WishlistItem) => {
      setItems((current) => {
        const exists = current.some((existing) => existing.slug === item.slug)
        if (exists) {
          return dropRelatedItems(
            current.filter((existing) => existing.slug !== item.slug),
            item,
          )
        }
        const withPackage =
          relatedPackage && !current.some((existing) => existing.slug === relatedPackage.slug)
            ? [...current, relatedPackage]
            : current
        return [...withPackage, item]
      })
    },
    [dropRelatedItems],
  )

  const clear = useCallback(() => setItems([]), [])

  const isSaved = useCallback((slug: string) => items.some((item) => item.slug === slug), [items])

  const value = useMemo(
    () => ({ items, addItem, removeItem, toggleItem, clear, isSaved }),
    [items, addItem, removeItem, toggleItem, clear, isSaved],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
