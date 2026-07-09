import type { LucideIcon } from "lucide-react"
import { BedDouble, Gift, Home, Palette, Puzzle, Sofa, Sparkles, TreePine, Utensils } from "lucide-react"
import type { PackageTag } from "@/types"

const TAG_ICONS: Record<PackageTag, LucideIcon> = {
  Sleepover: BedDouble,
  Dining: Utensils,
  Lounge: Sofa,
  Indoor: Home,
  Outdoor: TreePine,
}

/** Deterministic icon per package tag, used across cards, filters and detail pages. */
export function getTagIcon(tag: PackageTag): LucideIcon {
  return TAG_ICONS[tag] ?? Sparkles
}

const ADD_ON_ICONS: Record<string, LucideIcon> = {
  decor: Palette,
  "activities-crafts": Puzzle,
  favors: Gift,
}

/** Deterministic icon per add-on category slug, falls back to a generic sparkle. */
export function getAddOnIcon(slug: string): LucideIcon {
  return ADD_ON_ICONS[slug] ?? Sparkles
}
