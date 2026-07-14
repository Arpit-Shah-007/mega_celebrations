import { getSignedCookie, setSignedCookie, deleteCookie } from "hono/cookie"
import type { Context, MiddlewareHandler } from "hono"
import type { Env } from "@/types"
import { fail } from "@/lib/response"

export const SESSION_COOKIE_NAME = "mc_admin_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

/**
 * Constant-time string comparison so login attempts can't be timed to
 * shortcut-guess the configured username/password character by character.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder()
  const bufA = encoder.encode(a)
  const bufB = encoder.encode(b)
  // Compare against a fixed-length buffer so early-return length checks alone
  // don't leak the real length via timing.
  const length = Math.max(bufA.length, bufB.length, 32)
  let diff = bufA.length ^ bufB.length
  for (let i = 0; i < length; i += 1) {
    diff |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0)
  }
  return diff === 0
}

export async function createAdminSession(c: Context<{ Bindings: Env }>): Promise<void> {
  // Secure cookies can only be set over HTTPS — production (and any deployed
  // preview) is always HTTPS, but `wrangler dev` over plain http needs the
  // relaxed pair to be able to set the cookie at all. SameSite=Lax still
  // reaches the frontend dev server cross-port on localhost since it's the
  // same registrable domain (SameSite is port-insensitive).
  const isHttps = new URL(c.req.url).protocol === "https:"
  await setSignedCookie(c, SESSION_COOKIE_NAME, "authenticated", c.env.SESSION_SECRET, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "None" : "Lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export function clearAdminSession(c: Context<{ Bindings: Env }>): void {
  deleteCookie(c, SESSION_COOKIE_NAME, { path: "/" })
}

export async function hasValidAdminSession(c: Context<{ Bindings: Env }>): Promise<boolean> {
  if (!c.env.SESSION_SECRET) return true // unconfigured — local dev only, mirrors requireAccess's dev skip
  const value = await getSignedCookie(c, c.env.SESSION_SECRET, SESSION_COOKIE_NAME)
  return value === "authenticated"
}

/**
 * Guards every /api/admin/* route except the auth endpoints themselves
 * (login needs to be reachable while logged out; me/logout report/clear
 * state regardless of it). Cloudflare Access (requireAccess) is meant to be
 * the edge-level gate once configured — this is the real boundary today
 * since ACCESS_TEAM_DOMAIN ships unconfigured (see lib/auth.ts).
 */
export const requireAdminSession: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  if (c.req.path.startsWith("/api/admin/auth/")) {
    await next()
    return
  }

  if (!(await hasValidAdminSession(c))) {
    return fail(c, "Not authenticated.", 401)
  }

  await next()
}
