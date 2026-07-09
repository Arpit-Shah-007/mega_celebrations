import { Plus, Check } from "lucide-react"
import { useWishlist } from "@/context/useWishlist"
import { useToast } from "@/context/useToast"
import type { Package } from "@/types"

interface WishlistButtonProps {
  pkg: Package
  className?: string
}

/** Matches the live site's copy: "add it to your wishlist by clicking the '+' button." */
export function WishlistButton({ pkg, className = "" }: WishlistButtonProps) {
  const { toggleItem, isSaved } = useWishlist()
  const { showToast } = useToast()
  const saved = isSaved(pkg.slug)

  const handleClick = () => {
    toggleItem({
      slug: pkg.slug,
      name: pkg.name,
      imageSeed: pkg.slug,
      startingPrice: pkg.startingPrice,
    })
    showToast(saved ? `Removed ${pkg.name} from your wishlist` : `Added ${pkg.name} to your wishlist`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${pkg.name} from wishlist` : `Add ${pkg.name} to wishlist`}
      className={`flex h-9 w-9 items-center justify-center bg-white shadow-soft transition hover:bg-pink hover:text-white ${
        saved ? "bg-pink text-white" : "text-navy"
      } ${className}`}
    >
      {saved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  )
}
