import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { createDb } from "@/db/client"
import { catalogItems } from "@/db/schema"
import { serializeCatalogItem } from "@/lib/serialize"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const publicCatalogItemsRoute = new Hono<{ Bindings: Env }>()

/** GET /api/catalog-items?placement=a_la_carte — the flat A La Carte list. */
publicCatalogItemsRoute.get("/", async (c) => {
  const placement = c.req.query("placement")
  if (placement !== "a_la_carte") {
    return fail(c, "The only supported placement filter today is 'a_la_carte'.", 400)
  }

  const db = createDb(c.env.DB)
  const rows = await db.select().from(catalogItems).where(eq(catalogItems.placement, "a_la_carte"))
  const sorted = [...rows].sort((a, b) => a.sortOrder - b.sortOrder)
  return ok(c, sorted.map(serializeCatalogItem))
})
