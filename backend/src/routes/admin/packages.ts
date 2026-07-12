import { Hono } from "hono"
import { and, eq } from "drizzle-orm"
import { createDb, type Database } from "@/db/client"
import { packageImages, packagePriceTiers, packages, packageVariants } from "@/db/schema"
import {
  packageImageInputSchema,
  packageInputSchema,
  packagePriceTierInputSchema,
  packageVariantInputSchema,
  reorderInputSchema,
} from "@/lib/validation"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const adminPackagesRoute = new Hono<{ Bindings: Env }>()

async function recomputeStartingPrice(db: Database, packageId: number) {
  const tiers = await db.select().from(packagePriceTiers).where(eq(packagePriceTiers.packageId, packageId))
  const startingPriceCents = tiers.length > 0 ? Math.min(...tiers.map((tier) => tier.priceCents)) : 0
  await db.update(packages).set({ startingPriceCents, updatedAt: Date.now() }).where(eq(packages.id, packageId))
}

async function loadFullPackage(db: Database, packageId: number) {
  const [row] = await db.select().from(packages).where(eq(packages.id, packageId)).limit(1)
  if (!row) return null
  const [imageRows, tierRows, variantRows] = await Promise.all([
    db.select().from(packageImages).where(eq(packageImages.packageId, packageId)),
    db.select().from(packagePriceTiers).where(eq(packagePriceTiers.packageId, packageId)),
    db.select().from(packageVariants).where(eq(packageVariants.packageId, packageId)),
  ])
  return { row, imageRows, tierRows, variantRows }
}

async function deletePackageCascade(db: Database, packageId: number) {
  await db.batch([
    db.delete(packageImages).where(eq(packageImages.packageId, packageId)),
    db.delete(packagePriceTiers).where(eq(packagePriceTiers.packageId, packageId)),
    db.delete(packageVariants).where(eq(packageVariants.packageId, packageId)),
    db.delete(packages).where(eq(packages.id, packageId)),
  ])
}

adminPackagesRoute.get("/", async (c) => {
  const db = createDb(c.env.DB)
  const rows = await db.select().from(packages).orderBy(packages.sortOrder)
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
  return ok(c, { package: full.row, images: full.imageRows, priceTiers: full.tierRows, variants: full.variantRows })
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

// --- Price tiers ---

adminPackagesRoute.post("/:id/price-tiers", async (c) => {
  const packageId = Number(c.req.param("id"))
  const parsed = packagePriceTierInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const [inserted] = await db
    .insert(packagePriceTiers)
    .values({ ...parsed.data, note: parsed.data.note ?? null, packageId })
    .returning()
  await recomputeStartingPrice(db, packageId)
  return ok(c, inserted, 201)
})

adminPackagesRoute.patch("/price-tiers/:tierId", async (c) => {
  const tierId = Number(c.req.param("tierId"))
  const parsed = packagePriceTierInputSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const [updated] = await db.update(packagePriceTiers).set(parsed.data).where(eq(packagePriceTiers.id, tierId)).returning()
  if (!updated) return fail(c, "Price tier not found.", 404)
  await recomputeStartingPrice(db, updated.packageId)
  return ok(c, updated)
})

adminPackagesRoute.delete("/price-tiers/:tierId", async (c) => {
  const tierId = Number(c.req.param("tierId"))
  const db = createDb(c.env.DB)
  const [deleted] = await db.delete(packagePriceTiers).where(eq(packagePriceTiers.id, tierId)).returning()
  if (deleted) await recomputeStartingPrice(db, deleted.packageId)
  return ok(c, { id: tierId })
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
  return ok(c, updated)
})

adminPackagesRoute.delete("/variants/:variantId", async (c) => {
  const variantId = Number(c.req.param("variantId"))
  await createDb(c.env.DB).delete(packageVariants).where(eq(packageVariants.id, variantId))
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
