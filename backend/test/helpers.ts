import { exports } from "cloudflare:workers"

/** `Response.json()` types as `unknown` under the generated Workers types — this just names the shape at the call site. */
export async function readJson<T = unknown>(response: Response): Promise<T> {
  return (await response.json()) as T
}

// Cached per test file (vitest-pool-workers isolates storage/module state per
// file), so one login covers every admin request the file makes.
let cachedSessionCookie: string | null = null

async function getSessionCookie(): Promise<string> {
  if (cachedSessionCookie) return cachedSessionCookie

  const response = await exports.default.fetch("https://example.com/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "test-admin", password: "test-password" }),
  })
  const setCookie = response.headers.get("set-cookie")
  if (!setCookie) {
    throw new Error("Admin login in test helper did not return a Set-Cookie header — check the seeded admin_credentials row in test/apply-migrations.ts.")
  }
  // Only the first "name=value" segment matters for the request Cookie header.
  cachedSessionCookie = setCookie.split(";")[0]
  return cachedSessionCookie
}

/** Same as `exports.default.fetch`, but authenticates as the test admin first and attaches the session cookie. */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const cookie = await getSessionCookie()
  return exports.default.fetch(input, {
    ...init,
    headers: { ...init.headers, Cookie: cookie },
  })
}
