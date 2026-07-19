import { ListChecks } from "lucide-react"
import type { WishlistItem } from "@/types"

interface WishlistSelectionsSummaryProps {
  items: WishlistItem[]
}

export function WishlistSelectionsSummary({ items }: WishlistSelectionsSummaryProps) {
  return (
    <div className="relative overflow-hidden bg-navy p-6 shadow-lift sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink/15 via-transparent to-transparent" />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pink">
          <ListChecks className="h-4 w-4" aria-hidden="true" />
          Custom Quote Inquiry
        </div>
        <h3 className="mt-2 text-lg font-bold text-white sm:text-xl">Your Selections</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item.slug} className="bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-inset ring-white/20">
              {item.name}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-white/70">
          Check these same selections in the form below so your custom quote inquiry matches exactly what you picked.
        </p>
      </div>
    </div>
  )
}
