import { exports } from "cloudflare:workers"
import { it, expect } from "vitest"
import { adminFetch, readJson } from "./helpers"

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

it("rejects a credentials change with neither a new username nor a new password", async () => {
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

it("changes the username, and login requires the new username afterward", async () => {
  const changeResponse = await adminFetch("https://example.com/api/admin/account/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword: "test-password", newUsername: "renamed-test-admin" }),
  })
  const changeBody = await readJson<{ data: { username: string } }>(changeResponse)
  expect(changeResponse.status).toBe(200)
  expect(changeBody.data.username).toBe("renamed-test-admin")

  const oldUsernameLogin = await exports.default.fetch("https://example.com/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "test-admin", password: "test-password" }),
  })
  expect(oldUsernameLogin.status).toBe(401)

  const newUsernameLogin = await exports.default.fetch("https://example.com/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "renamed-test-admin", password: "test-password" }),
  })
  expect(newUsernameLogin.status).toBe(200)

  // Restore the shared test-admin username for other tests in this file/session.
  const restoreCookie = newUsernameLogin.headers.get("set-cookie")!.split(";")[0]
  const restoreResponse = await exports.default.fetch("https://example.com/api/admin/account/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: restoreCookie },
    body: JSON.stringify({ currentPassword: "test-password", newUsername: "test-admin" }),
  })
  expect(restoreResponse.status).toBe(200)
})
