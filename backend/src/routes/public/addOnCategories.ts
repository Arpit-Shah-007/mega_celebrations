import { Hono } from "hono"
import { eq, inArray } from "drizzle-orm"
import { createDb } from "@/db/client"
import { addonCategories, catalogItems } from "@/db/schema"
import { serializeAddonCategory } from "@/lib/serialize"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const publicAddonCategoriesRoute = new Hono<{ Bindings: Env }>()

publicAddonCategoriesRoute.get("/", async (c) => {
  const db = createDb(c.env.DB)
  const categoryRows = await db.select().from(addonCategories).orderBy(addonCategories.sortOrder)
  if (categoryRows.length === 0) {
    return ok(c, [])
  }

  const categoryIds = categoryRows.map((row) => row.id)
  const itemRows = await db
    .select()
    .from(catalogItems)
    .where(inArray(catalogItems.addonCategoryId, categoryIds))

  const result = categoryRows.map((row) =>
    serializeAddonCategory(row, itemRows.filter((item) => item.addonCategoryId === row.id)),
  )

  return ok(c, result)
})

publicAddonCategoriesRoute.get("/:slug", async (c) => {
  const db = createDb(c.env.DB)
  const [row] = await db.select().from(addonCategories).where(eq(addonCategories.slug, c.req.param("slug"))).limit(1)
  if (!row) {
    return fail(c, "Add-on category not found.", 404)
  }

  const itemRows = await db.select().from(catalogItems).where(eq(catalogItems.addonCategoryId, row.id))
  return ok(c, serializeAddonCategory(row, itemRows))
})
