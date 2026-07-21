import { createContext } from "react"
import type { WishlistItem } from "@/types"

export interface WishlistContextValue {
  items: WishlistItem[]
  /** Adds `item` with the given quantity (default 1), or adds it to the existing quantity when that slug is already saved — so re-adding the same item accumulates rather than replacing or no-op'ing. */
  addItem: (item: WishlistItem, quantity?: number) => void
  removeItem: (slug: string) => void
  /** `relatedPackage` auto-adds/removes a theme's parent package alongside it, so a package only ever appears in the wishlist because one of its themes was picked. */
  toggleItem: (item: WishlistItem, relatedPackage?: WishlistItem) => void
  clear: () => void
  isSaved: (slug: string) => boolean
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)
