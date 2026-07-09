import { Hono } from "hono"
import { desc, eq } from "drizzle-orm"
import { createDb } from "@/db/client"
import { quoteInquiries, quoteInquiryItems } from "@/db/schema"
import { quoteInquiryStatusInputSchema } from "@/lib/validation"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const adminQuoteInquiriesRoute = new Hono<{ Bindings: Env }>()

adminQuoteInquiriesRoute.get("/", async (c) => {
  const rows = await createDb(c.env.DB).select().from(quoteInquiries).orderBy(desc(quoteInquiries.createdAt))
  return ok(c, rows)
})

adminQuoteInquiriesRoute.get("/:id", async (c) => {
  const inquiryId = Number(c.req.param("id"))
  const db = createDb(c.env.DB)
  const [row] = await db.select().from(quoteInquiries).where(eq(quoteInquiries.id, inquiryId)).limit(1)
  if (!row) return fail(c, "Quote inquiry not found.", 404)

  const items = await db.select().from(quoteInquiryItems).where(eq(quoteInquiryItems.quoteInquiryId, inquiryId))
  return ok(c, { ...row, items: [...items].sort((a, b) => a.sortOrder - b.sortOrder) })
})

adminQuoteInquiriesRoute.patch("/:id", async (c) => {
  const inquiryId = Number(c.req.param("id"))
  const parsed = quoteInquiryStatusInputSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const [updated] = await createDb(c.env.DB)
    .update(quoteInquiries)
    .set({ status: parsed.data.status })
    .where(eq(quoteInquiries.id, inquiryId))
    .returning()

  if (!updated) return fail(c, "Quote inquiry not found.", 404)
  return ok(c, updated)
})
