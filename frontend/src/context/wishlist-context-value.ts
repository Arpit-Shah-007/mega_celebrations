import { createContext } from "react"
import type { WishlistItem } from "@/types"

export interface WishlistContextValue {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (slug: string) => void
  toggleItem: (item: WishlistItem) => void
  clear: () => void
  isSaved: (slug: string) => boolean
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)
