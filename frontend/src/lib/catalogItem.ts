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

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

/**
 * Derives the CatalogItemModal "Pricing" accordion rows from the same
 * price/isPriceOnRequest fields that drive the flat-rate display, so every
 * catalog item shows a consistent Pricing section instead of relying on a
 * separately hand-entered `pricing` array (the admin form previously left
 * this empty on create, so new items silently had no Pricing section).
 */
export function buildFlatFeePricingRows(priceCents: number | null, isPriceOnRequest: boolean): { label: string; value: string }[] {
  if (isPriceOnRequest || priceCents == null) return []
  return [{ label: "Flat fee", value: CURRENCY_FORMATTER.format(priceCents / 100) }]
}

/** Lowercase, hyphenated slug derived from a display name, used as a stable wishlist/list key for catalog items that don't have their own detail page. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
