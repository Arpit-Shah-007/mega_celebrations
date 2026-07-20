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

  const addItem = useCallback((item: WishlistItem) => {
    setItems((current) => (current.some((existing) => existing.slug === item.slug) ? current : [...current, item]))
  }, [])

  // A package only ever enters the wishlist because a theme under it was picked, so when the
  // last theme referencing a package is removed, the package is dropped too rather than left
  // behind as an empty row.
  const dropOrphanedPackage = useCallback((items: WishlistItem[], removed: WishlistItem): WishlistItem[] => {
    if (removed.category !== "theme" || !removed.packageSlug) return items
    const packageStillHasThemes = items.some(
      (existing) => existing.category === "theme" && existing.packageSlug === removed.packageSlug,
    )
    return packageStillHasThemes ? items : items.filter((existing) => existing.slug !== removed.packageSlug)
  }, [])

  const removeItem = useCallback(
    (slug: string) => {
      setItems((current) => {
        const removed = current.find((existing) => existing.slug === slug)
        const withoutItem = current.filter((existing) => existing.slug !== slug)
        return removed ? dropOrphanedPackage(withoutItem, removed) : withoutItem
      })
    },
    [dropOrphanedPackage],
  )

  const toggleItem = useCallback(
    (item: WishlistItem, relatedPackage?: WishlistItem) => {
      setItems((current) => {
        const exists = current.some((existing) => existing.slug === item.slug)
        if (exists) {
          return dropOrphanedPackage(
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
    [dropOrphanedPackage],
  )

  const clear = useCallback(() => setItems([]), [])

  const isSaved = useCallback((slug: string) => items.some((item) => item.slug === slug), [items])

  const value = useMemo(
    () => ({ items, addItem, removeItem, toggleItem, clear, isSaved }),
    [items, addItem, removeItem, toggleItem, clear, isSaved],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
