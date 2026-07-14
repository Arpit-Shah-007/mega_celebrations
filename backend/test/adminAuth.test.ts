import { exports } from "cloudflare:workers"
import { it, expect } from "vitest"
import { readJson } from "./helpers"

it("rejects a request to a protected admin route with no session cookie", async () => {
  const response = await exports.default.fetch("https://example.com/api/admin/packages")
  expect(response.status).toBe(401)
})

it("rejects login with the wrong password", async () => {
  const response = await exports.default.fetch("https://example.com/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "test-admin", password: "wrong-password" }),
  })
  expect(response.status).toBe(401)
})

it("logs in with the configured credentials, reads /me, then logs out", async () => {
  const loginResponse = await exports.default.fetch("https://example.com/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "test-admin", password: "test-password" }),
  })
  expect(loginResponse.status).toBe(200)
  const setCookie = loginResponse.headers.get("set-cookie")
  expect(setCookie).toBeTruthy()
  const cookie = setCookie!.split(";")[0]

  const meResponse = await exports.default.fetch("https://example.com/api/admin/auth/me", {
    headers: { Cookie: cookie },
  })
  const meBody = await readJson<{ data: { authenticated: boolean } }>(meResponse)
  expect(meBody.data.authenticated).toBe(true)

  const protectedResponse = await exports.default.fetch("https://example.com/api/admin/packages", {
    headers: { Cookie: cookie },
  })
  expect(protectedResponse.status).toBe(200)

  // Logout tells the browser to drop the cookie (Set-Cookie with an expired
  // Max-Age) — it doesn't revoke the signed cookie server-side, so a client
  // that ignores Set-Cookie and keeps resending the old value stays
  // authenticated until natural expiry. That's the accepted trade-off of a
  // stateless signed-cookie session for a single-admin internal tool. This
  // test only checks the real, browser-observable contract: the response
  // instructs the cookie to be cleared.
  const logoutResponse = await exports.default.fetch("https://example.com/api/admin/auth/logout", {
    method: "POST",
    headers: { Cookie: cookie },
  })
  expect(logoutResponse.status).toBe(200)
  const logoutSetCookie = logoutResponse.headers.get("set-cookie") ?? ""
  expect(logoutSetCookie).toMatch(/mc_admin_session=;/)
  expect(logoutSetCookie.toLowerCase()).toMatch(/max-age=0|expires=thu, 01 jan 1970/)
})

it("/me reports unauthenticated with no cookie", async () => {
  const response = await exports.default.fetch("https://example.com/api/admin/auth/me")
  const body = await readJson<{ data: { authenticated: boolean } }>(response)
  expect(body.data.authenticated).toBe(false)
})

it("throttles repeated failed logins from the same IP", async () => {
  // A dedicated RFC 5737 documentation IP so this test's attempt count is
  // isolated from the "unknown" bucket other tests in this file use.
  const ip = "203.0.113.5"
  const attempt = () =>
    exports.default.fetch("https://example.com/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": ip },
      body: JSON.stringify({ username: "test-admin", password: "wrong-password" }),
    })

  for (let i = 0; i < 10; i += 1) {
    const response = await attempt()
    expect(response.status).toBe(401)
  }

  const throttledResponse = await attempt()
  expect(throttledResponse.status).toBe(429)

  // A correct password is still rejected while the IP is throttled — the
  // limiter gates the endpoint, not just the "wrong password" branch.
  const correctPasswordResponse = await exports.default.fetch("https://example.com/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", "CF-Connecting-IP": ip },
    body: JSON.stringify({ username: "test-admin", password: "test-password" }),
  })
  expect(correctPasswordResponse.status).toBe(429)
})
