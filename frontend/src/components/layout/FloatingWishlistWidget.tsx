import { Heart } from "lucide-react"
import { useLocation } from "react-router-dom"
import { useWishlist } from "@/context/useWishlist"

export function FloatingWishlistWidget() {
  const { items } = useWishlist()
  const { pathname } = useLocation()

  // Hide on the wishlist page itself — a "view your wishlist" shortcut is
  // redundant there, and on short mobile viewports the fixed bottom-right
  // position overlaps page content (e.g. the empty state's CTA button).
  if (pathname === "/wishlist") return null

  // A "package" item is never picked on its own — it's auto-added alongside
  // a theme (see WishlistContext's toggleItem) and removed once its last
  // theme is. Counting it separately would double-count a single selection,
  // so the badge reflects only what the user actually picked.
  const selectionCount = items.filter((item) => item.category !== "package").length

  return (
    // A plain anchor (not React Router's Link) forces a full page load on
    // the wishlist page, which the embedded HoneyBook widget script requires —
    // it only initializes once per page load and can't remount via client-side
    // navigation alone.
    <a
      href="/wishlist"
      aria-label={`View wishlist, ${selectionCount} item${selectionCount === 1 ? "" : "s"}`}
      className="fixed bottom-6 right-4 z-40 flex h-12 w-11 flex-col items-center justify-center rounded-sm bg-pink text-white shadow-lift transition hover:bg-pink-dark"
    >
      <span className="absolute -top-1.5 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
        {selectionCount}
      </span>
      <Heart className="h-5 w-5" fill="currentColor" />
    </a>
  )
}
