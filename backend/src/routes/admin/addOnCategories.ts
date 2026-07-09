import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { createDb } from "@/db/client"
import { addonCategories, catalogItems } from "@/db/schema"
import { addonCategoryInputSchema, reorderInputSchema } from "@/lib/validation"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const adminAddonCategoriesRoute = new Hono<{ Bindings: Env }>()

adminAddonCategoriesRoute.get("/", async (c) => {
  const rows = await createDb(c.env.DB).select().from(addonCategories).orderBy(addonCategories.sortOrder)
  return ok(c, rows)
})

adminAddonCategoriesRoute.post("/", async (c) => {
  const parsed = addonCategoryInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const [inserted] = await createDb(c.env.DB).insert(addonCategories).values(parsed.data).returning()
  return ok(c, inserted, 201)
})

adminAddonCategoriesRoute.patch("/:id", async (c) => {
  const categoryId = Number(c.req.param("id"))
  const parsed = addonCategoryInputSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const [updated] = await createDb(c.env.DB).update(addonCategories).set(parsed.data).where(eq(addonCategories.id, categoryId)).returning()
  if (!updated) return fail(c, "Add-on category not found.", 404)
  return ok(c, updated)
})

adminAddonCategoriesRoute.delete("/:id", async (c) => {
  const categoryId = Number(c.req.param("id"))
  const db = createDb(c.env.DB)
  await db.delete(catalogItems).where(eq(catalogItems.addonCategoryId, categoryId))
  await db.delete(addonCategories).where(eq(addonCategories.id, categoryId))
  return ok(c, { id: categoryId })
})

adminAddonCategoriesRoute.patch("/reorder", async (c) => {
  const parsed = reorderInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  await Promise.all(
    parsed.data.orderedIds.map((categoryId, index) => db.update(addonCategories).set({ sortOrder: index }).where(eq(addonCategories.id, categoryId))),
  )
  return ok(c, { reordered: parsed.data.orderedIds.length })
})
