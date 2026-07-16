import { Hono } from "hono"
import { eq, inArray } from "drizzle-orm"
import { createDb } from "@/db/client"
import { packageImages, packages, packageVariants } from "@/db/schema"
import { serializePackage } from "@/lib/serialize"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const publicPackagesRoute = new Hono<{ Bindings: Env }>()

publicPackagesRoute.get("/", async (c) => {
  const db = createDb(c.env.DB)
  const packageRows = await db.select().from(packages).orderBy(packages.sortOrder)
  if (packageRows.length === 0) {
    return ok(c, [])
  }

  const packageIds = packageRows.map((row) => row.id)
  const [imageRows, variantRows] = await Promise.all([
    db.select().from(packageImages).where(inArray(packageImages.packageId, packageIds)),
    db.select().from(packageVariants).where(inArray(packageVariants.packageId, packageIds)),
  ])

  const result = packageRows.map((row) =>
    serializePackage(
      row,
      imageRows.filter((image) => image.packageId === row.id),
      variantRows.filter((variant) => variant.packageId === row.id),
    ),
  )

  return ok(c, result)
})

publicPackagesRoute.get("/:slug", async (c) => {
  const db = createDb(c.env.DB)
  const [row] = await db.select().from(packages).where(eq(packages.slug, c.req.param("slug"))).limit(1)
  if (!row) {
    return fail(c, "Package not found.", 404)
  }

  const [imageRows, variantRows] = await Promise.all([
    db.select().from(packageImages).where(eq(packageImages.packageId, row.id)),
    db.select().from(packageVariants).where(eq(packageVariants.packageId, row.id)),
  ])

  return ok(c, serializePackage(row, imageRows, variantRows))
})
