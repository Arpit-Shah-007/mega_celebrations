import { Hono } from "hono"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { createDb } from "@/db/client"
import { adminCredentials } from "@/db/schema"
import type { Env } from "@/types"
import { ok, fail } from "@/lib/response"
import { hashPassword, verifyPassword } from "@/lib/passwordHash"

const changeCredentialsSchema = z
  .object({
    currentPassword: z.string().min(1),
    newUsername: z.string().trim().min(1).max(64).optional(),
    newPassword: z.string().min(8).max(200).optional(),
  })
  .refine((data) => data.newUsername || data.newPassword, {
    message: "Provide a new username and/or a new password.",
  })

export const adminAccountRoute = new Hono<{ Bindings: Env }>()

// Mounted under /api/admin/account, so it's gated by the same requireAdminSession
// middleware as every other admin route (unlike /api/admin/auth/*, which is
// deliberately exempt so login itself stays reachable while logged out).
adminAccountRoute.post("/credentials", async (c) => {
  const parsed = changeCredentialsSchema.safeParse(await c.req.json())
  if (!parsed.success) {
    return fail(c, parsed.error.issues[0]?.message ?? "Invalid input.", 400)
  }

  const db = createDb(c.env.DB)
  const [current] = await db.select().from(adminCredentials).limit(1)
  if (!current) {
    return fail(c, "Admin login is not configured on this environment.", 500)
  }

  const validCurrentPassword = await verifyPassword(parsed.data.currentPassword, current.passwordHash)
  if (!validCurrentPassword) {
    return fail(c, "Current password is incorrect.", 401)
  }

  const nextUsername = parsed.data.newUsername ?? current.username
  const nextPasswordHash = parsed.data.newPassword ? await hashPassword(parsed.data.newPassword) : current.passwordHash

  await db
    .update(adminCredentials)
    .set({ username: nextUsername, passwordHash: nextPasswordHash, updatedAt: Date.now() })
    .where(eq(adminCredentials.id, current.id))

  return ok(c, { username: nextUsername })
})
