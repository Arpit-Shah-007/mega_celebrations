import { describe, expect, it } from "vitest"
import { businessInfo, footerNav, primaryNav } from "./nav"

describe("primaryNav", () => {
  it("is a non-empty array of internal routes with labels", () => {
    expect(primaryNav.length).toBeGreaterThan(0)
    primaryNav.forEach((link) => {
      expect(link.label.trim().length).toBeGreaterThan(0)
      expect(link.to.startsWith("/")).toBe(true)
    })
  })
})

describe("footerNav", () => {
  it("is a non-empty array of internal routes with labels", () => {
    expect(footerNav.length).toBeGreaterThan(0)
    footerNav.forEach((link) => {
      expect(link.label.trim().length).toBeGreaterThan(0)
      expect(link.to.startsWith("/")).toBe(true)
    })
  })
})

describe("businessInfo", () => {
  it("has non-empty contact and service-area fields", () => {
    expect(businessInfo.phone.trim().length).toBeGreaterThan(0)
    expect(businessInfo.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(businessInfo.serviceArea.trim().length).toBeGreaterThan(0)
    expect(businessInfo.baseCity.trim().length).toBeGreaterThan(0)
  })

  it("has valid https URLs for every external link", () => {
    expect(businessInfo.instagram.startsWith("https://")).toBe(true)
    expect(businessInfo.facebook.startsWith("https://")).toBe(true)
    expect(businessInfo.consultationCallUrl.startsWith("https://")).toBe(true)
    expect(businessInfo.sisterCompany.url.startsWith("https://")).toBe(true)
  })

  it("has non-empty sister company copy", () => {
    expect(businessInfo.sisterCompany.name.trim().length).toBeGreaterThan(0)
    expect(businessInfo.sisterCompany.blurb.trim().length).toBeGreaterThan(0)
  })
})
