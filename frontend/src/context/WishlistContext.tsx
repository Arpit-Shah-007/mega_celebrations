import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import type { WishlistItem } from "@/types"
import { WishlistContext } from "@/context/wishlist-context-value"

const STORAGE_KEY = "mega-celebrations:wishlist"

function readStoredWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as WishlistItem[]) : []
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

  const removeItem = useCallback((slug: string) => {
    setItems((current) => current.filter((existing) => existing.slug !== slug))
  }, [])

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems((current) => {
      const exists = current.some((existing) => existing.slug === item.slug)
      return exists ? current.filter((existing) => existing.slug !== item.slug) : [...current, item]
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const isSaved = useCallback((slug: string) => items.some((item) => item.slug === slug), [items])

  const value = useMemo(
    () => ({ items, addItem, removeItem, toggleItem, clear, isSaved }),
    [items, addItem, removeItem, toggleItem, clear, isSaved],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
