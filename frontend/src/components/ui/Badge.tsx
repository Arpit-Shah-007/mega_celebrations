import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  tone?: "pink" | "navy"
  className?: string
}

const TONE_CLASSES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  pink: "bg-pink text-white",
  navy: "bg-navy text-white",
}

export function Badge({ children, tone = "pink", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
