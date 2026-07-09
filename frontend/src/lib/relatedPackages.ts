import type { Package } from "@/types"

export function getRelatedPackages(current: Package, allPackages: Package[], count = 3): Package[] {
  const sharedTagMatches = allPackages
    .filter((item) => item.slug !== current.slug)
    .map((item) => ({ item, score: item.tags.filter((tag) => current.tags.includes(tag)).length }))
    .sort((a, b) => b.score - a.score)

  return sharedTagMatches.slice(0, count).map((entry) => entry.item)
}
