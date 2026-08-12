import type { WishlistItem, WishlistItemCategory } from "@/types"

/**
 * HoneyBook's hosted inquiry form is a cross-origin iframe with reCAPTCHA and
 * per-question UUID field names, and it ignores URL query parameters — all
 * three verified against the live form — so there is no way to write the
 * wishlist into it programmatically. This renders the picks as plain text the
 * visitor pastes into the form's own free-text question instead, which is why
 * the output is deliberately readable rather than machine-parseable.
 */

const HEADING = "MY WISHLIST (from the Mega Celebrations website)"

const FLAT_SECTIONS: { heading: string; category: WishlistItemCategory }[] = [
  { heading: "A LA CARTE", category: "a-la-carte" },
  { heading: "ADD-ONS", category: "add-on" },
]

/** Only the catalog items carry a quantity, and a lone unit reads as noise, so "x1" is left off. */
function describe(item: WishlistItem): string {
  return item.quantity !== undefined && item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name
}

export function formatWishlistSummary(items: WishlistItem[]): string {
  if (items.length === 0) return ""

  const packages = items.filter((item) => item.category === "package")
  const themes = items.filter((item) => item.category === "theme")
  const lines = [HEADING]

  if (packages.length > 0) {
    lines.push("", "PACKAGES")
    for (const pkg of packages) {
      lines.push(`- ${describe(pkg)}`)
      for (const theme of themes.filter((theme) => theme.packageSlug === pkg.slug)) {
        lines.push(`    Theme: ${theme.name}`)
      }
    }
  }

  // A theme normally nests under the package it was picked from, but a wishlist
  // saved before that link existed can hold one with no matching package — list
  // it on its own rather than dropping it silently from the summary.
  const looseThemes = themes.filter((theme) => !packages.some((pkg) => pkg.slug === theme.packageSlug))
  if (looseThemes.length > 0) {
    lines.push("", "THEMES")
    for (const theme of looseThemes) lines.push(`- ${describe(theme)}`)
  }

  for (const section of FLAT_SECTIONS) {
    const group = items.filter((item) => item.category === section.category)
    if (group.length === 0) continue
    lines.push("", section.heading)
    for (const item of group) lines.push(`- ${describe(item)}`)
  }

  return lines.join("\n")
}
