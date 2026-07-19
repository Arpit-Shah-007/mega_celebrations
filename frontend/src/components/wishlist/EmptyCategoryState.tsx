import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface EmptyCategoryStateProps {
  icon: LucideIcon
  message: string
  exploreLabel: string
  exploreTo: string
}

export function EmptyCategoryState({ icon: Icon, message, exploreLabel, exploreTo }: EmptyCategoryStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-navy/20 bg-white/60 px-4 py-6 text-center">
      <Icon className="h-5 w-5 text-navy/30" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-sm text-body">{message}</p>
      <Button kind="link" to={exploreTo} variant="outline" size="sm">
        {exploreLabel}
      </Button>
    </div>
  )
}
