import { Hono } from "hono"
import { and, eq, getTableColumns } from "drizzle-orm"
import { createDb, type Database } from "@/db/client"
import { packageFaqs, packageImages, packages, packageVariants } from "@/db/schema"
import { packageFaqInputSchema, packageImageInputSchema, packageInputSchema, packageVariantInputSchema, reorderInputSchema } from "@/lib/validation"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const adminPackagesRoute = new Hono<{ Bindings: Env }>()

// Starting price is derived from the cheapest priced "theme" variant — themes are
// the only per-option pricing packages have now that price tiers are gone.
async function recomputeStartingPrice(db: Database, packageId: number) {
  const themes = await db
    .select()
    .from(packageVariants)
    .where(and(eq(packageVariants.packageId, packageId), eq(packageVariants.kind, "theme")))
  const pricedThemes = themes.filter((theme) => theme.priceCents != null && !theme.isPriceOnRequest)
  const startingPriceCents = pricedThemes.length > 0 ? Math.min(...pricedThemes.map((theme) => theme.priceCents as number)) : 0
  await db.update(packages).set({ startingPriceCents, updatedAt: Date.now() }).where(eq(packages.id, packageId))
}

async function loadFullPackage(db: Database, packageId: number) {
  const [row] = await db.select().from(packages).where(eq(packages.id, packageId)).limit(1)
  if (!row) return null
  const [imageRows, variantRows, faqRows] = await Promise.all([
    db.select().from(packageImages).where(eq(packageImages.packageId, packageId)),
    db.select().from(packageVariants).where(eq(packageVariants.packageId, packageId)),
    db.select().from(packageFaqs).where(eq(packageFaqs.packageId, packageId)),
  ])
  return { row, imageRows, variantRows, faqRows }
}

async function deletePackageCascade(db: Database, packageId: number) {
  await db.batch([
    db.delete(packageImages).where(eq(packageImages.packageId, packageId)),
    db.delete(packageVariants).where(eq(packageVariants.packageId, packageId)),
    db.delete(packageFaqs).where(eq(packageFaqs.packageId, packageId)),
    db.delete(packages).where(eq(packages.id, packageId)),
  ])
}

// Includes each package's "card" thumbnail alongside its own columns so the
// admin list view can show a photo without an N+1 fetch per row.
adminPackagesRoute.get("/", async (c) => {
  const db = createDb(c.env.DB)
  const rows = await db
    .select({ ...getTableColumns(packages), cardImageUrl: packageImages.url })
    .from(packages)
    .leftJoin(packageImages, and(eq(packageImages.packageId, packages.id), eq(packageImages.kind, "card")))
    .orderBy(packages.sortOrder)
  return ok(c, rows)
})

adminPackagesRoute.post("/", async (c) => {
  const parsed = packageInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const now = Date.now()
  const [inserted] = await db
    .insert(packages)
    .values({ ...parsed.data, startingPriceCents: 0, damageDepositCents: parsed.data.damageDepositCents ?? null, bundleDiscount: parsed.data.bundleDiscount ?? null, createdAt: now, updatedAt: now })
    .returning()

  return ok(c, inserted, 201)
})

// Returns raw rows (with ids) rather than the public serialized shape — the
// admin UI needs image/tier/variant ids to PATCH or DELETE them individually.
adminPackagesRoute.get("/:id", async (c) => {
  const packageId = Number(c.req.param("id"))
  const db = createDb(c.env.DB)
  const full = await loadFullPackage(db, packageId)
  if (!full) return fail(c, "Package not found.", 404)
  return ok(c, { package: full.row, images: full.imageRows, variants: full.variantRows, faqs: full.faqRows })
})

adminPackagesRoute.patch("/:id", async (c) => {
  const packageId = Number(c.req.param("id"))
  const parsed = packageInputSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const [updated] = await db
    .update(packages)
    .set({ ...parsed.data, updatedAt: Date.now() })
    .where(eq(packages.id, packageId))
    .returning()

  if (!updated) return fail(c, "Package not found.", 404)
  return ok(c, updated)
})

adminPackagesRoute.delete("/:id", async (c) => {
  const packageId = Number(c.req.param("id"))
  await deletePackageCascade(createDb(c.env.DB), packageId)
  return ok(c, { id: packageId })
})

// --- Images (hero/card are singletons per package; gallery is an ordered list) ---

adminPackagesRoute.post("/:id/images", async (c) => {
  const packageId = Number(c.req.param("id"))
  const parsed = packageImageInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  if (parsed.data.kind !== "gallery") {
    await db.delete(packageImages).where(and(eq(packageImages.packageId, packageId), eq(packageImages.kind, parsed.data.kind)))
  }

  const [inserted] = await db
    .insert(packageImages)
    .values({ ...parsed.data, packageId })
    .returning()

  return ok(c, inserted, 201)
})

adminPackagesRoute.patch("/images/:imageId", async (c) => {
  const imageId = Number(c.req.param("imageId"))
  const parsed = packageImageInputSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const [updated] = await db.update(packageImages).set(parsed.data).where(eq(packageImages.id, imageId)).returning()
  if (!updated) return fail(c, "Image not found.", 404)
  return ok(c, updated)
})

adminPackagesRoute.delete("/images/:imageId", async (c) => {
  const imageId = Number(c.req.param("imageId"))
  await createDb(c.env.DB).delete(packageImages).where(eq(packageImages.id, imageId))
  return ok(c, { id: imageId })
})

adminPackagesRoute.patch("/:id/images/reorder", async (c) => {
  const parsed = reorderInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const updates = parsed.data.orderedIds.map((imageId, index) =>
    db.update(packageImages).set({ sortOrder: index }).where(eq(packageImages.id, imageId)),
  )
  await db.batch(updates as [(typeof updates)[number], ...(typeof updates)[number][]])
  return ok(c, { reordered: parsed.data.orderedIds.length })
})

// --- Variants (themes + popular add-ons) ---

adminPackagesRoute.post("/:id/variants", async (c) => {
  const packageId = Number(c.req.param("id"))
  const parsed = packageVariantInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const [inserted] = await db
    .insert(packageVariants)
    .values({
      ...parsed.data,
      packageId,
      priceCents: parsed.data.priceCents ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      description: parsed.data.description ?? null,
    })
    .returning()
  await recomputeStartingPrice(db, packageId)

  return ok(c, inserted, 201)
})

adminPackagesRoute.patch("/variants/:variantId", async (c) => {
  const variantId = Number(c.req.param("variantId"))
  const parsed = packageVariantInputSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const [updated] = await db.update(packageVariants).set(parsed.data).where(eq(packageVariants.id, variantId)).returning()
  if (!updated) return fail(c, "Variant not found.", 404)
  await recomputeStartingPrice(db, updated.packageId)
  return ok(c, updated)
})

adminPackagesRoute.delete("/variants/:variantId", async (c) => {
  const variantId = Number(c.req.param("variantId"))
  const db = createDb(c.env.DB)
  const [deleted] = await db.delete(packageVariants).where(eq(packageVariants.id, variantId)).returning()
  if (deleted) await recomputeStartingPrice(db, deleted.packageId)
  return ok(c, { id: variantId })
})

adminPackagesRoute.patch("/:id/variants/reorder", async (c) => {
  const parsed = reorderInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const updates = parsed.data.orderedIds.map((variantId, index) =>
    db.update(packageVariants).set({ sortOrder: index }).where(eq(packageVariants.id, variantId)),
  )
  await db.batch(updates as [(typeof updates)[number], ...(typeof updates)[number][]])
  return ok(c, { reordered: parsed.data.orderedIds.length })
})

// --- FAQs (admin-managed per package, replaces the old static per-package FAQ selection) ---

adminPackagesRoute.post("/:id/faqs", async (c) => {
  const packageId = Number(c.req.param("id"))
  const parsed = packageFaqInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const [inserted] = await db
    .insert(packageFaqs)
    .values({ ...parsed.data, packageId })
    .returning()

  return ok(c, inserted, 201)
})

adminPackagesRoute.patch("/faqs/:faqId", async (c) => {
  const faqId = Number(c.req.param("faqId"))
  const parsed = packageFaqInputSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const [updated] = await db.update(packageFaqs).set(parsed.data).where(eq(packageFaqs.id, faqId)).returning()
  if (!updated) return fail(c, "FAQ not found.", 404)
  return ok(c, updated)
})

adminPackagesRoute.delete("/faqs/:faqId", async (c) => {
  const faqId = Number(c.req.param("faqId"))
  await createDb(c.env.DB).delete(packageFaqs).where(eq(packageFaqs.id, faqId))
  return ok(c, { id: faqId })
})

adminPackagesRoute.patch("/:id/faqs/reorder", async (c) => {
  const parsed = reorderInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const updates = parsed.data.orderedIds.map((faqId, index) => db.update(packageFaqs).set({ sortOrder: index }).where(eq(packageFaqs.id, faqId)))
  await db.batch(updates as [(typeof updates)[number], ...(typeof updates)[number][]])
  return ok(c, { reordered: parsed.data.orderedIds.length })
})
