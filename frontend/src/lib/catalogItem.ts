/**
 * Extracts a numeric dollar amount from a display price string, e.g. "$75.00"
 * or "Purchase price: $15.00" -> 75 / 15. Returns 0 when no amount is present
 * (e.g. "Contact us for price."), which WishlistItemRow already renders as
 * "Pricing coming soon" rather than "$0".
 */
export function parsePriceValue(price?: string): number {
  if (!price) return 0
  const match = price.match(/\$([\d,]+(?:\.\d+)?)/)
  return match ? Number(match[1].replace(/,/g, "")) : 0
}

/** Lowercase, hyphenated slug derived from a display name, used as a stable wishlist/list key for catalog items that don't have their own detail page. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
