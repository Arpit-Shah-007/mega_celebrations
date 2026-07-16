import { z } from "zod"

const PACKAGE_TAGS = ["Dining", "Indoor", "Lounge", "Outdoor", "Sleepover"] as const

const labelValueSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
})

export const packageInputSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.enum(PACKAGE_TAGS)),
  inclusions: z.array(z.string().min(1)),
  capacity: z.string().min(1),
  spaceRequirement: z.string().min(1),
  priceIsPlaceholder: z.boolean().optional().default(false),
  damageDepositCents: z.number().int().nonnegative().nullable().optional(),
  bundleDiscount: z.string().nullable().optional(),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
})
export type PackageInput = z.infer<typeof packageInputSchema>

export const packageImageInputSchema = z.object({
  kind: z.enum(["hero", "card", "gallery"]),
  url: z.string().min(1),
  alt: z.string().min(1),
  sortOrder: z.number().int().optional().default(0),
})

export const packageVariantInputSchema = z.object({
  kind: z.enum(["theme", "addon"]),
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative().nullable().optional(),
  isPriceOnRequest: z.boolean().optional().default(false),
  imageUrl: z.string().nullable().optional(),
  additionalImageUrls: z.array(z.string()).nullable().optional(),
  description: z.array(z.string().min(1)).nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
})

export const addonCategoryInputSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  heroImageUrl: z.string().min(1),
  heroImageAlt: z.string().min(1),
  cardImageUrl: z.string().min(1),
  cardImageAlt: z.string().min(1),
  sortOrder: z.number().int().optional().default(0),
})

export const catalogItemInputSchema = z.object({
  placement: z.enum(["a_la_carte", "add_on_category"]),
  addonCategoryId: z.number().int().nullable().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative().nullable().optional(),
  isPriceOnRequest: z.boolean().optional().default(false),
  categoryBreadcrumb: z.string().min(1),
  imageUrl: z.string().nullable().optional(),
  additionalImageUrls: z.array(z.string()).nullable().optional(),
  description: z.array(z.string().min(1)),
  details: z.array(labelValueSchema).nullable().optional(),
  pricing: z.array(labelValueSchema),
  sortOrder: z.number().int().optional().default(0),
})

/** Full-create validation (POST) — enforces the placement/addonCategoryId pairing. PATCH uses the base schema's .partial() instead, since a partial update may not touch either field. */
export const catalogItemCreateSchema = catalogItemInputSchema.refine(
  (value) => value.placement !== "add_on_category" || value.addonCategoryId != null,
  { message: "addonCategoryId is required when placement is 'add_on_category'.", path: ["addonCategoryId"] },
)

export const reorderInputSchema = z.object({
  orderedIds: z.array(z.number().int()).min(1),
})

export const quoteInquiryInputSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  eventDate: z.string().min(1),
  venue: z.string().min(1),
  guestCount: z.string().min(1),
  notes: z.string().nullable().optional(),
  items: z.array(
    z.object({
      slug: z.string().min(1),
      name: z.string().min(1),
      priceCents: z.number().int().nullable().optional(),
    }),
  ),
})

export const quoteInquiryStatusInputSchema = z.object({
  status: z.enum(["new", "contacted", "quoted", "won", "lost"]),
})
