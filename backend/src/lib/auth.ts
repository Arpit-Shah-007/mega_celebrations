import { createRemoteJWKSet, jwtVerify } from "jose"
import type { MiddlewareHandler } from "hono"
import type { Env } from "@/types"
import { fail } from "@/lib/response"

const ACCESS_JWT_HEADER = "Cf-Access-Jwt-Assertion"

// wrangler.jsonc ships this placeholder until the real Access application is
// created (see BACKEND_SPEC.md / README "Deploying for real"). Local dev and
// tests run against the placeholder, so verification is skipped rather than
// requiring a live Cloudflare Access setup just to run `wrangler dev`.
const UNCONFIGURED_TEAM_DOMAIN = "https://REPLACE_WITH_TEAM_NAME.cloudflareaccess.com"

// One JWKS cache per isolate — createRemoteJWKSet handles its own key rotation/refresh.
let cachedJwks: ReturnType<typeof createRemoteJWKSet> | null = null
let cachedTeamDomain: string | null = null

function getJwks(teamDomain: string) {
  if (!cachedJwks || cachedTeamDomain !== teamDomain) {
    cachedJwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`))
    cachedTeamDomain = teamDomain
  }
  return cachedJwks
}

/**
 * Re-verifies the Cloudflare Access JWT on every /api/admin/* request. The
 * Access policy already blocks unauthenticated browsers from reaching the
 * /admin UI, but that's a UI-layer convenience — this middleware is the real
 * boundary, since the API is reachable directly by anyone who tries.
 */
export const requireAccess: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  if (c.env.ACCESS_TEAM_DOMAIN === UNCONFIGURED_TEAM_DOMAIN) {
    console.warn("[auth] ACCESS_TEAM_DOMAIN is unconfigured — skipping Access verification (local dev only).")
    await next()
    return
  }

  const token = c.req.header(ACCESS_JWT_HEADER)
  if (!token) {
    return fail(c, "Missing Cloudflare Access assertion.", 401)
  }

  try {
    const jwks = getJwks(c.env.ACCESS_TEAM_DOMAIN)
    await jwtVerify(token, jwks, {
      issuer: c.env.ACCESS_TEAM_DOMAIN,
      audience: c.env.ACCESS_AUD,
    })
  } catch {
    return fail(c, "Invalid or expired Cloudflare Access assertion.", 403)
  }

  await next()
}
