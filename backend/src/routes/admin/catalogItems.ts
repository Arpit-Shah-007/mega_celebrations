import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { createDb } from "@/db/client"
import { catalogItems } from "@/db/schema"
import { catalogItemCreateSchema, catalogItemInputSchema, reorderInputSchema } from "@/lib/validation"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const adminCatalogItemsRoute = new Hono<{ Bindings: Env }>()

adminCatalogItemsRoute.get("/", async (c) => {
  const db = createDb(c.env.DB)
  const placement = c.req.query("placement")
  const rows =
    placement === "a_la_carte" || placement === "add_on_category"
      ? await db.select().from(catalogItems).where(eq(catalogItems.placement, placement))
      : await db.select().from(catalogItems)
  return ok(c, rows)
})

adminCatalogItemsRoute.post("/", async (c) => {
  const parsed = catalogItemCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const { addonCategoryId, priceCents, imageUrl, additionalImageUrls, details, ...rest } = parsed.data
  const [inserted] = await createDb(c.env.DB)
    .insert(catalogItems)
    .values({
      ...rest,
      addonCategoryId: addonCategoryId ?? null,
      priceCents: priceCents ?? null,
      imageUrl: imageUrl ?? null,
      additionalImageUrls: additionalImageUrls ?? null,
      details: details ?? null,
    })
    .returning()

  return ok(c, inserted, 201)
})

adminCatalogItemsRoute.patch("/:id", async (c) => {
  const itemId = Number(c.req.param("id"))
  const parsed = catalogItemInputSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const [updated] = await createDb(c.env.DB).update(catalogItems).set(parsed.data).where(eq(catalogItems.id, itemId)).returning()
  if (!updated) return fail(c, "Catalog item not found.", 404)
  return ok(c, updated)
})

adminCatalogItemsRoute.delete("/:id", async (c) => {
  const itemId = Number(c.req.param("id"))
  await createDb(c.env.DB).delete(catalogItems).where(eq(catalogItems.id, itemId))
  return ok(c, { id: itemId })
})

adminCatalogItemsRoute.patch("/reorder", async (c) => {
  const parsed = reorderInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  await Promise.all(
    parsed.data.orderedIds.map((itemId, index) => db.update(catalogItems).set({ sortOrder: index }).where(eq(catalogItems.id, itemId))),
  )
  return ok(c, { reordered: parsed.data.orderedIds.length })
})
