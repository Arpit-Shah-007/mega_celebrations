import { env, exports } from "cloudflare:workers"
import { it, expect } from "vitest"
import { createDb } from "@/db/client"
import { quoteInquiries, quoteInquiryItems } from "@/db/schema"
import { readJson } from "./helpers"

const VALID_PAYLOAD = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "9085550123",
  eventDate: "2026-08-01",
  venue: "Backyard",
  guestCount: "8 kids",
  notes: "Unicorn theme please",
  items: [{ slug: "theme-tent-sleepover-unicorn", name: "Magical Unicorn", priceCents: 8000 }],
}

it("POST /api/quote-inquiries persists the inquiry and its wishlist snapshot", async () => {
  const response = await exports.default.fetch("https://example.com/api/quote-inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(VALID_PAYLOAD),
  })
  expect(response.status).toBe(201)

  const body = await readJson<{ success: boolean; data: { id: number } }>(response)
  expect(body.success).toBe(true)
  const inquiryId = body.data.id

  const db = createDb(env.DB)
  const rows = await db.select().from(quoteInquiries)
  expect(rows).toHaveLength(1)
  expect(rows[0]).toMatchObject({ id: inquiryId, name: "Jane Doe", email: "jane@example.com", status: "new" })

  const items = await db.select().from(quoteInquiryItems)
  expect(items).toHaveLength(1)
  expect(items[0]).toMatchObject({ quoteInquiryId: inquiryId, itemName: "Magical Unicorn", itemPriceCents: 8000 })
})

it("POST /api/quote-inquiries rejects a payload missing required fields", async () => {
  const { name: _name, ...missingName } = VALID_PAYLOAD
  const response = await exports.default.fetch("https://example.com/api/quote-inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(missingName),
  })
  expect(response.status).toBe(400)

  const body = await readJson<{ success: boolean }>(response)
  expect(body.success).toBe(false)
})

it("POST /api/quote-inquiries rejects an invalid email", async () => {
  const response = await exports.default.fetch("https://example.com/api/quote-inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...VALID_PAYLOAD, email: "not-an-email" }),
  })
  expect(response.status).toBe(400)
})
