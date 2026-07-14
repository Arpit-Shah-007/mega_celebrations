import { Hono } from "hono"
import { z } from "zod"
import { lt, eq, count } from "drizzle-orm"
import { createDb } from "@/db/client"
import { adminLoginAttempts, adminCredentials } from "@/db/schema"
import type { Env } from "@/types"
import { ok, fail } from "@/lib/response"
import { createAdminSession, clearAdminSession, hasValidAdminSession, timingSafeEqual } from "@/lib/adminSession"
import { verifyPassword } from "@/lib/passwordHash"

const loginInputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

// Per-IP, not per-account: with a single shared admin login, a failed-attempt
// lockout on the account itself would let an attacker trivially lock out the
// real admin. Throttling by IP still stops scripted credential guessing.
const MAX_ATTEMPTS_PER_WINDOW = 10
const WINDOW_MS = 15 * 60 * 1000

export const adminAuthRoute = new Hono<{ Bindings: Env }>()

adminAuthRoute.post("/login", async (c) => {
  const parsed = loginInputSchema.safeParse(await c.req.json())
  if (!parsed.success) return fail(c, "Username and password are required.", 400)

  const db = createDb(c.env.DB)
  const ip = c.req.header("CF-Connecting-IP") ?? "unknown"
  const windowStart = Date.now() - WINDOW_MS

  // Prune first so an old burst can't count against a later legitimate attempt,
  // and so the table doesn't grow unbounded without a separate cron job.
  await db.delete(adminLoginAttempts).where(lt(adminLoginAttempts.createdAt, windowStart))

  const [{ recentAttempts }] = await db
    .select({ recentAttempts: count() })
    .from(adminLoginAttempts)
    .where(eq(adminLoginAttempts.ip, ip))
  if (recentAttempts >= MAX_ATTEMPTS_PER_WINDOW) {
    return fail(c, "Too many login attempts. Please try again in a few minutes.", 429)
  }

  const [credentials] = await db.select().from(adminCredentials).limit(1)
  if (!credentials) {
    return fail(c, "Admin login is not configured on this environment.", 500)
  }

  const validUsername = timingSafeEqual(parsed.data.username, credentials.username)
  const validPassword = await verifyPassword(parsed.data.password, credentials.passwordHash)
  if (!validUsername || !validPassword) {
    await db.insert(adminLoginAttempts).values({ ip, createdAt: Date.now() })
    return fail(c, "Invalid username or password.", 401)
  }

  await createAdminSession(c)
  return ok(c, { authenticated: true })
})

adminAuthRoute.post("/logout", (c) => {
  clearAdminSession(c)
  return ok(c, { authenticated: false })
})

adminAuthRoute.get("/me", async (c) => {
  return ok(c, { authenticated: await hasValidAdminSession(c) })
})
