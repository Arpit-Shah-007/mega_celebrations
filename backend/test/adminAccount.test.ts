import { exports } from "cloudflare:workers"
import { it, expect } from "vitest"
import { adminFetch, readJson } from "./helpers"

it("rejects fetching account info with no session cookie", async () => {
  const response = await exports.default.fetch("https://example.com/api/admin/account", {
    method: "GET",
  })
  expect(response.status).toBe(401)
})

it("returns the admin's name and username with a valid session", async () => {
  const response = await adminFetch("https://example.com/api/admin/account", { method: "GET" })
  const body = await readJson<{ data: { name: string; username: string } }>(response)
  expect(response.status).toBe(200)
  expect(body.data.username).toBe("test-admin")
  expect(body.data.name).toBeTruthy()
})

it("rejects a credentials-change request with no session cookie", async () => {
  const response = await exports.default.fetch("https://example.com/api/admin/account/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword: "test-password", newPassword: "irrelevant123" }),
  })
  expect(response.status).toBe(401)
})

it("rejects a credentials change with the wrong current password", async () => {
  const response = await adminFetch("https://example.com/api/admin/account/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword: "not-the-real-password", newPassword: "irrelevant123" }),
  })
  expect(response.status).toBe(401)
})

it("rejects a credentials change with no new password", async () => {
  const response = await adminFetch("https://example.com/api/admin/account/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword: "test-password" }),
  })
  expect(response.status).toBe(400)
})

it("rejects a new password shorter than 8 characters", async () => {
  const response = await adminFetch("https://example.com/api/admin/account/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword: "test-password", newPassword: "short" }),
  })
  expect(response.status).toBe(400)
})

it("changes the password, and the new password (not the old one) works on the next login", async () => {
  const changeResponse = await adminFetch("https://example.com/api/admin/account/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword: "test-password", newPassword: "brand-new-password-123" }),
  })
  expect(changeResponse.status).toBe(200)

  const oldPasswordLogin = await exports.default.fetch("https://example.com/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "test-admin", password: "test-password" }),
  })
  expect(oldPasswordLogin.status).toBe(401)

  const newPasswordLogin = await exports.default.fetch("https://example.com/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "test-admin", password: "brand-new-password-123" }),
  })
  expect(newPasswordLogin.status).toBe(200)

  // Restore the shared test-admin password so this test file's cached session
  // cookie (from test/helpers.ts) and any other file's assumptions stay valid.
  const restoreCookie = newPasswordLogin.headers.get("set-cookie")!.split(";")[0]
  const restoreResponse = await exports.default.fetch("https://example.com/api/admin/account/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: restoreCookie },
    body: JSON.stringify({ currentPassword: "brand-new-password-123", newPassword: "test-password" }),
  })
  expect(restoreResponse.status).toBe(200)
})
