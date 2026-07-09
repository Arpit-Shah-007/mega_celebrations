export interface ParsedPrice {
  priceCents: number | null
  isPriceOnRequest: boolean
}

/**
 * Parses the free-text price strings used throughout the old static data
 * files (e.g. "$80.00", "$1,600.00", "Contact us for price.") into the
 * cents + is-price-on-request shape the database uses. Seed-script only —
 * the admin UI sends price_cents directly as a number.
 */
export function parsePriceString(raw: string): ParsedPrice {
  const match = raw.match(/[\d,]+(?:\.\d+)?/)
  if (!match) {
    return { priceCents: null, isPriceOnRequest: true }
  }
  const dollars = Number.parseFloat(match[0].replace(/,/g, ""))
  return { priceCents: Math.round(dollars * 100), isPriceOnRequest: false }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

/**
 * Renders a variant/catalog-item price back into the exact display string
 * the frontend's PackageVariant/CatalogItem types have always used (e.g.
 * "$80.00", "Contact us for price.") so public API responses stay a drop-in
 * replacement for the old static data — see BACKEND_SPEC.md §7.
 */
export function formatPriceDisplay(priceCents: number | null, isPriceOnRequest: boolean): string {
  if (isPriceOnRequest || priceCents == null) {
    return "Contact us for price."
  }
  return CURRENCY_FORMATTER.format(priceCents / 100)
}

export function centsToDollars(cents: number): number {
  return Math.round(cents) / 100
}
