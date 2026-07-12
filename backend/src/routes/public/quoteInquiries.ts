import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { createDb } from "@/db/client"
import { quoteInquiries, quoteInquiryItems } from "@/db/schema"
import { quoteInquiryInputSchema } from "@/lib/validation"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const publicQuoteInquiriesRoute = new Hono<{ Bindings: Env }>()

publicQuoteInquiriesRoute.post("/", async (c) => {
  const body = await c.req.json().catch(() => null)
  if (body === null) {
    return fail(c, "Request body must be JSON.", 400)
  }

  const parsed = quoteInquiryInputSchema.safeParse(body)
  if (!parsed.success) {
    return fail(c, parsed.error.issues.map((issue) => issue.message).join(" "), 400)
  }

  const db = createDb(c.env.DB)
  const { items, ...inquiry } = parsed.data
  const now = Date.now()

  const [inserted] = await db
    .insert(quoteInquiries)
    .values({ ...inquiry, notes: inquiry.notes ?? null, status: "new", createdAt: now })
    .returning()

  if (items.length > 0) {
    try {
      await db.insert(quoteInquiryItems).values(
        items.map((item, index) => ({
          quoteInquiryId: inserted.id,
          itemSlug: item.slug,
          itemName: item.name,
          itemPriceCents: item.priceCents ?? null,
          sortOrder: index,
        })),
      )
    } catch (error) {
      // Items insert depends on inserted.id, so it can't share a db.batch() with
      // the inquiry insert above — compensate manually instead of leaving an
      // orphaned inquiry row with no items.
      await db.delete(quoteInquiries).where(eq(quoteInquiries.id, inserted.id))
      return fail(c, "Failed to save quote inquiry items.", 500)
    }
  }

  return ok(c, { id: inserted.id }, 201)
})
