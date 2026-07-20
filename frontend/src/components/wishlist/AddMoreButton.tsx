import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface AddMoreButtonProps {
  to: string
}

/** Small CTA shown below a wishlist category's items, linking back to that category's browse page to add another. */
export function AddMoreButton({ to }: AddMoreButtonProps) {
  return (
    <Button kind="link" to={to} variant="outline" size="sm" className="mt-2">
      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      Add More
    </Button>
  )
}
