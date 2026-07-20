import { createContext } from "react"
import type { WishlistItem } from "@/types"

export interface WishlistContextValue {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (slug: string) => void
  /** `relatedPackage` auto-adds/removes a theme's parent package alongside it, so a package only ever appears in the wishlist because one of its themes was picked. */
  toggleItem: (item: WishlistItem, relatedPackage?: WishlistItem) => void
  clear: () => void
  isSaved: (slug: string) => boolean
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)
