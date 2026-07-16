import { centsToDollars, formatPriceDisplay } from "@/lib/money"
import type { addonCategories, catalogItems, packageImages, packages, packageVariants } from "@/db/schema"

type PackageRow = typeof packages.$inferSelect
type PackageImageRow = typeof packageImages.$inferSelect
type PackageVariantRow = typeof packageVariants.$inferSelect
type AddonCategoryRow = typeof addonCategories.$inferSelect
type CatalogItemRow = typeof catalogItems.$inferSelect

function byId<T extends { sortOrder: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sortOrder - b.sortOrder)
}

/** Display shape for a theme/popular-add-on card — price rendered back to a display string (see money.ts). */
export function serializeVariant(row: PackageVariantRow) {
  return {
    name: row.name,
    price: formatPriceDisplay(row.priceCents, row.isPriceOnRequest),
    image: row.imageUrl ?? undefined,
    additionalImages: row.additionalImageUrls ?? undefined,
    description: row.description ?? undefined,
  }
}

/**
 * Assembles the full public Package shape from its base row plus child rows.
 * Matches frontend/src/types/index.ts's Package interface exactly, so pages
 * consuming this need only swap their data source, not their rendering code.
 */
export function serializePackage(pkg: PackageRow, images: PackageImageRow[], variants: PackageVariantRow[]) {
  const hero = images.find((image) => image.kind === "hero")
  const card = images.find((image) => image.kind === "card")
  const gallery = byId(images.filter((image) => image.kind === "gallery"))
  const themes = byId(variants.filter((variant) => variant.kind === "theme")).map(serializeVariant)
  const popularAddOns = byId(variants.filter((variant) => variant.kind === "addon")).map(serializeVariant)

  return {
    slug: pkg.slug,
    name: pkg.name,
    tagline: pkg.tagline,
    tags: pkg.tags,
    description: pkg.description,
    inclusions: pkg.inclusions,
    heroImage: hero ? { url: hero.url, alt: hero.alt } : { url: "", alt: pkg.name },
    cardImage: card ? { url: card.url, alt: card.alt } : { url: "", alt: pkg.name },
    gallery: gallery.map((image) => ({ url: image.url, alt: image.alt })),
    startingPrice: centsToDollars(pkg.startingPriceCents),
    priceIsPlaceholder: pkg.priceIsPlaceholder,
    capacity: pkg.capacity,
    spaceRequirement: pkg.spaceRequirement,
    damageDeposit: pkg.damageDepositCents != null ? centsToDollars(pkg.damageDepositCents) : undefined,
    bundleDiscount: pkg.bundleDiscount ?? undefined,
    featured: pkg.featured,
    themes: themes.length > 0 ? themes : undefined,
    popularAddOns: popularAddOns.length > 0 ? popularAddOns : undefined,
  }
}

/** Matches frontend/src/types/index.ts's CatalogItem interface exactly. */
export function serializeCatalogItem(row: CatalogItemRow) {
  return {
    slug: row.slug,
    name: row.name,
    price: formatPriceDisplay(row.priceCents, row.isPriceOnRequest),
    category: row.categoryBreadcrumb,
    image: row.imageUrl ?? null,
    additionalImages: row.additionalImageUrls ?? undefined,
    description: row.description,
    details: row.details ?? undefined,
    pricing: row.pricing,
  }
}

/** Matches frontend/src/types/index.ts's AddOnCategory interface exactly. */
export function serializeAddonCategory(row: AddonCategoryRow, items: CatalogItemRow[]) {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    heroImage: { url: row.heroImageUrl, alt: row.heroImageAlt },
    cardImage: { url: row.cardImageUrl, alt: row.cardImageAlt },
    items: byId(items).map(serializeCatalogItem),
  }
}
