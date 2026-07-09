/** Matches the live site's exact filter pills: "Filter by Package Type: All Packages, Dining, Indoor, Lounge, Outdoor, Sleepover". */
export type PackageTag = "Dining" | "Indoor" | "Lounge" | "Outdoor" | "Sleepover"

export interface PriceTier {
  label: string
  price: number
  note?: string
}

export interface PackageImage {
  seed: string
  alt: string
}

export interface PackageVariant {
  name: string
  price: string
  /** Real product photo scraped from the live GoodShuffle widget — absent for variants the live site itself shows with no photo. */
  image?: string
  /** Short blurb shown in the variant's detail modal. The live site's theme/add-on descriptions load through a JS-rendered catalog widget we can't scrape, so these are written in-house from the variant name rather than copied. */
  description?: string[]
}

export interface Package {
  slug: string
  name: string
  tagline: string
  tags: PackageTag[]
  description: string
  inclusions: string[]
  images: PackageImage[]
  priceTiers: PriceTier[]
  startingPrice: number
  priceIsPlaceholder?: boolean
  capacity: string
  spaceRequirement: string
  damageDeposit?: number
  bundleDiscount?: string
  featured?: boolean
  /** The live site's "Choose Your Theme" grid — real bookable variants (decor themes, guest-count tiers, chair options, etc). Omitted entirely for packages verified to have none rather than inventing placeholder options. */
  themes?: PackageVariant[]
  /** The live site's "Popular Add-ons" grid on this package's own page — a small, package-specific subset of the full add-on catalog, distinct per package. */
  popularAddOns?: PackageVariant[]
}

export interface AddOnCategory {
  slug: string
  name: string
  tagline: string
  description: string
  items: CatalogItem[]
}

export interface Testimonial {
  id: string
  name: string
  quote: string
  event?: string
  rating: number
}

export interface FaqItem {
  question: string
  answer: string
  category: "Booking An Event" | "Event Location" | "Set Up & Pick Up" | "Weather" | "Policies"
}

export interface CatalogPricingRow {
  label: string
  value: string
}

/**
 * A single rentable line item (A La Carte, and eventually Add-Ons) sourced
 * from JSON today as a stand-in for the admin-managed database planned next.
 */
export interface CatalogItem {
  slug: string
  name: string
  price: string
  category: string
  image: string | null
  /** Extra photos for items with more than one real product shot (e.g. distinct color/finish variants) — shown as a thumbnail strip alongside the primary image. */
  additionalImages?: string[]
  description: string[]
  /** Physical specs (e.g. Height, Length) shown between Description and Pricing — only some items have these on the live site. */
  details?: CatalogPricingRow[]
  pricing: CatalogPricingRow[]
}

export interface WishlistItem {
  slug: string
  name: string
  imageSeed: string
  startingPrice: number
}

export interface QuoteFormValues {
  name: string
  email: string
  phone: string
  eventDate: string
  venue: string
  guestCount: string
  notes: string
}
