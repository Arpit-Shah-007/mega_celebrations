import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export interface LabelValueRow {
  label: string
  value: string
}

export const packages = sqliteTable("packages", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  inclusions: text("inclusions", { mode: "json" }).$type<string[]>().notNull(),
  capacity: text("capacity").notNull(),
  spaceRequirement: text("space_requirement").notNull(),
  startingPriceCents: integer("starting_price_cents", { mode: "number" }).notNull(),
  priceIsPlaceholder: integer("price_is_placeholder", { mode: "boolean" }).notNull().default(false),
  damageDepositCents: integer("damage_deposit_cents", { mode: "number" }),
  bundleDiscount: text("bundle_discount"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
  updatedAt: integer("updated_at", { mode: "number" }).notNull(),
})

/**
 * A package has exactly one 'hero' image (detail-page banner), one 'card'
 * image (listing-grid thumbnail, also the detail-page accent-photo fallback
 * when there's no gallery), and any number of ordered 'gallery' images (the
 * detail-page photo carousel). This replaces three previously-separate
 * static sources (realPhotos.packageHero/packageCards + packageGalleries.ts).
 */
export const packageImages = sqliteTable("package_images", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  packageId: integer("package_id", { mode: "number" })
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  kind: text("kind", { enum: ["hero", "card", "gallery"] }).notNull(),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),
})

export const packagePriceTiers = sqliteTable("package_price_tiers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  packageId: integer("package_id", { mode: "number" })
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  priceCents: integer("price_cents", { mode: "number" }).notNull(),
  note: text("note"),
  sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),
})

/** Covers both the "Choose Your Theme" and "Popular Add-Ons" grids on a package page. */
export const packageVariants = sqliteTable("package_variants", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  packageId: integer("package_id", { mode: "number" })
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  kind: text("kind", { enum: ["theme", "addon"] }).notNull(),
  name: text("name").notNull(),
  priceCents: integer("price_cents", { mode: "number" }),
  isPriceOnRequest: integer("is_price_on_request", { mode: "boolean" }).notNull().default(false),
  imageUrl: text("image_url"),
  /** Extra photos for a variant with more than one real product shot — shown as a switchable thumbnail strip in VariantDetailModal, matching catalogItems.additionalImageUrls. */
  additionalImageUrls: text("additional_image_urls", { mode: "json" }).$type<string[]>(),
  description: text("description", { mode: "json" }).$type<string[]>(),
  sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),
})

/**
 * The 3 add-on category landing pages: Decor, Activities & Crafts, Favors.
 * heroImage is the category detail page's banner; cardImage is the /packages/add-ons
 * hub grid's thumbnail — two distinct photos per category, same split as packages.
 */
export const addonCategories = sqliteTable("addon_categories", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  heroImageUrl: text("hero_image_url").notNull(),
  heroImageAlt: text("hero_image_alt").notNull(),
  cardImageUrl: text("card_image_url").notNull(),
  cardImageAlt: text("card_image_alt").notNull(),
  sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),
})

/** Covers both the standalone A La Carte list and the items inside each add-on category. */
export const catalogItems = sqliteTable("catalog_items", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  placement: text("placement", { enum: ["a_la_carte", "add_on_category"] }).notNull(),
  addonCategoryId: integer("addon_category_id", { mode: "number" }).references(() => addonCategories.id, {
    onDelete: "cascade",
  }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  priceCents: integer("price_cents", { mode: "number" }),
  isPriceOnRequest: integer("is_price_on_request", { mode: "boolean" }).notNull().default(false),
  categoryBreadcrumb: text("category_breadcrumb").notNull(),
  imageUrl: text("image_url"),
  additionalImageUrls: text("additional_image_urls", { mode: "json" }).$type<string[]>(),
  description: text("description", { mode: "json" }).$type<string[]>().notNull(),
  details: text("details", { mode: "json" }).$type<LabelValueRow[]>(),
  pricing: text("pricing", { mode: "json" }).$type<LabelValueRow[]>().notNull(),
  sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),
})

/** The /wishlist page's "Request My Custom Quote" form, persisted. */
export const quoteInquiries = sqliteTable("quote_inquiries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  eventDate: text("event_date").notNull(),
  venue: text("venue").notNull(),
  guestCount: text("guest_count").notNull(),
  notes: text("notes"),
  status: text("status", { enum: ["new", "contacted", "quoted", "won", "lost"] })
    .notNull()
    .default("new"),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
})

/** Snapshot of the customer's wishlist at submission time — not FK-linked to the catalog (see BACKEND_SPEC.md §5). */
export const quoteInquiryItems = sqliteTable("quote_inquiry_items", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  quoteInquiryId: integer("quote_inquiry_id", { mode: "number" })
    .notNull()
    .references(() => quoteInquiries.id, { onDelete: "cascade" }),
  itemSlug: text("item_slug").notNull(),
  itemName: text("item_name").notNull(),
  itemPriceCents: integer("item_price_cents", { mode: "number" }),
  sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),
})

/** One row per failed /api/admin/auth/login attempt, keyed by client IP — throttles brute-force guessing of the single admin credential pair. Rows older than the throttle window are pruned opportunistically on each check rather than via a cron. */
export const adminLoginAttempts = sqliteTable("admin_login_attempts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  ip: text("ip").notNull(),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
})

/** Single-row table holding the live admin username/password, so the credential pair can be changed from the admin portal itself instead of only via a `wrangler secret put` deploy-time command. `passwordHash` is a self-describing PBKDF2 string (see `lib/passwordHash.ts`), never a plaintext password. */
export const adminCredentials = sqliteTable("admin_credentials", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  updatedAt: integer("updated_at", { mode: "number" }).notNull(),
})
