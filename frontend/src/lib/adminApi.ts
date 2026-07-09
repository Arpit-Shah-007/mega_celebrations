import { API_BASE_URL, request } from "@/lib/http"

export interface AdminPackageRow {
  id: number
  slug: string
  name: string
  tagline: string
  description: string
  tags: string[]
  inclusions: string[]
  capacity: string
  spaceRequirement: string
  startingPriceCents: number
  priceIsPlaceholder: boolean
  damageDepositCents: number | null
  bundleDiscount: string | null
  featured: boolean
  sortOrder: number
  createdAt: number
  updatedAt: number
}

export interface AdminPackageImageRow {
  id: number
  packageId: number
  kind: "hero" | "card" | "gallery"
  url: string
  alt: string
  sortOrder: number
}

export interface AdminPackagePriceTierRow {
  id: number
  packageId: number
  label: string
  priceCents: number
  note: string | null
  sortOrder: number
}

export interface AdminPackageVariantRow {
  id: number
  packageId: number
  kind: "theme" | "addon"
  name: string
  priceCents: number | null
  isPriceOnRequest: boolean
  imageUrl: string | null
  description: string[] | null
  sortOrder: number
}

export interface AdminFullPackage {
  package: AdminPackageRow
  images: AdminPackageImageRow[]
  priceTiers: AdminPackagePriceTierRow[]
  variants: AdminPackageVariantRow[]
}

export interface LabelValueRow {
  label: string
  value: string
}

export interface AdminAddonCategoryRow {
  id: number
  slug: string
  name: string
  tagline: string
  description: string
  heroImageUrl: string
  heroImageAlt: string
  cardImageUrl: string
  cardImageAlt: string
  sortOrder: number
}

export interface AdminCatalogItemRow {
  id: number
  placement: "a_la_carte" | "add_on_category"
  addonCategoryId: number | null
  slug: string
  name: string
  priceCents: number | null
  isPriceOnRequest: boolean
  categoryBreadcrumb: string
  imageUrl: string | null
  additionalImageUrls: string[] | null
  description: string[]
  details: LabelValueRow[] | null
  pricing: LabelValueRow[]
  sortOrder: number
}

export interface AdminQuoteInquiryRow {
  id: number
  name: string
  email: string
  phone: string
  eventDate: string
  venue: string
  guestCount: string
  notes: string | null
  status: "new" | "contacted" | "quoted" | "won" | "lost"
  createdAt: number
}

export interface AdminQuoteInquiryDetail extends AdminQuoteInquiryRow {
  items: { id: number; itemSlug: string; itemName: string; itemPriceCents: number | null; sortOrder: number }[]
}

export type PackageInput = Omit<AdminPackageRow, "id" | "startingPriceCents" | "createdAt" | "updatedAt">
export type PackageImageInput = Omit<AdminPackageImageRow, "id" | "packageId">
export type PackagePriceTierInput = Omit<AdminPackagePriceTierRow, "id" | "packageId">
export type PackageVariantInput = Omit<AdminPackageVariantRow, "id" | "packageId">
export type AddonCategoryInput = Omit<AdminAddonCategoryRow, "id">
export type CatalogItemInput = Omit<AdminCatalogItemRow, "id">

// --- Packages ---

export function fetchAdminPackages(): Promise<AdminPackageRow[]> {
  return request<AdminPackageRow[]>("/api/admin/packages")
}

export function fetchAdminPackage(id: number): Promise<AdminFullPackage> {
  return request<AdminFullPackage>(`/api/admin/packages/${id}`)
}

export function createAdminPackage(input: PackageInput): Promise<AdminPackageRow> {
  return request<AdminPackageRow>("/api/admin/packages", { method: "POST", body: JSON.stringify(input) })
}

export function updateAdminPackage(id: number, input: Partial<PackageInput>): Promise<AdminPackageRow> {
  return request<AdminPackageRow>(`/api/admin/packages/${id}`, { method: "PATCH", body: JSON.stringify(input) })
}

export function deleteAdminPackage(id: number): Promise<{ id: number }> {
  return request(`/api/admin/packages/${id}`, { method: "DELETE" })
}

export function createPackageImage(packageId: number, input: PackageImageInput): Promise<AdminPackageImageRow> {
  return request(`/api/admin/packages/${packageId}/images`, { method: "POST", body: JSON.stringify(input) })
}

export function updatePackageImage(imageId: number, input: Partial<PackageImageInput>): Promise<AdminPackageImageRow> {
  return request(`/api/admin/packages/images/${imageId}`, { method: "PATCH", body: JSON.stringify(input) })
}

export function deletePackageImage(imageId: number): Promise<{ id: number }> {
  return request(`/api/admin/packages/images/${imageId}`, { method: "DELETE" })
}

export function reorderPackageImages(packageId: number, orderedIds: number[]): Promise<{ reordered: number }> {
  return request(`/api/admin/packages/${packageId}/images/reorder`, { method: "PATCH", body: JSON.stringify({ orderedIds }) })
}

export function createPriceTier(packageId: number, input: PackagePriceTierInput): Promise<AdminPackagePriceTierRow> {
  return request(`/api/admin/packages/${packageId}/price-tiers`, { method: "POST", body: JSON.stringify(input) })
}

export function updatePriceTier(tierId: number, input: Partial<PackagePriceTierInput>): Promise<AdminPackagePriceTierRow> {
  return request(`/api/admin/packages/price-tiers/${tierId}`, { method: "PATCH", body: JSON.stringify(input) })
}

export function deletePriceTier(tierId: number): Promise<{ id: number }> {
  return request(`/api/admin/packages/price-tiers/${tierId}`, { method: "DELETE" })
}

export function createVariant(packageId: number, input: PackageVariantInput): Promise<AdminPackageVariantRow> {
  return request(`/api/admin/packages/${packageId}/variants`, { method: "POST", body: JSON.stringify(input) })
}

export function updateVariant(variantId: number, input: Partial<PackageVariantInput>): Promise<AdminPackageVariantRow> {
  return request(`/api/admin/packages/variants/${variantId}`, { method: "PATCH", body: JSON.stringify(input) })
}

export function deleteVariant(variantId: number): Promise<{ id: number }> {
  return request(`/api/admin/packages/variants/${variantId}`, { method: "DELETE" })
}

export function reorderVariants(packageId: number, orderedIds: number[]): Promise<{ reordered: number }> {
  return request(`/api/admin/packages/${packageId}/variants/reorder`, { method: "PATCH", body: JSON.stringify({ orderedIds }) })
}

// --- Add-on categories ---

export function fetchAdminAddonCategories(): Promise<AdminAddonCategoryRow[]> {
  return request<AdminAddonCategoryRow[]>("/api/admin/addon-categories")
}

export function createAddonCategory(input: AddonCategoryInput): Promise<AdminAddonCategoryRow> {
  return request("/api/admin/addon-categories", { method: "POST", body: JSON.stringify(input) })
}

export function updateAddonCategory(id: number, input: Partial<AddonCategoryInput>): Promise<AdminAddonCategoryRow> {
  return request(`/api/admin/addon-categories/${id}`, { method: "PATCH", body: JSON.stringify(input) })
}

export function deleteAddonCategory(id: number): Promise<{ id: number }> {
  return request(`/api/admin/addon-categories/${id}`, { method: "DELETE" })
}

export function reorderAddonCategories(orderedIds: number[]): Promise<{ reordered: number }> {
  return request("/api/admin/addon-categories/reorder", { method: "PATCH", body: JSON.stringify({ orderedIds }) })
}

// --- Catalog items (A La Carte + add-on category items) ---

export function fetchAdminCatalogItems(placement?: "a_la_carte" | "add_on_category"): Promise<AdminCatalogItemRow[]> {
  const query = placement ? `?placement=${placement}` : ""
  return request<AdminCatalogItemRow[]>(`/api/admin/catalog-items${query}`)
}

export function createCatalogItem(input: CatalogItemInput): Promise<AdminCatalogItemRow> {
  return request("/api/admin/catalog-items", { method: "POST", body: JSON.stringify(input) })
}

export function updateCatalogItem(id: number, input: Partial<CatalogItemInput>): Promise<AdminCatalogItemRow> {
  return request(`/api/admin/catalog-items/${id}`, { method: "PATCH", body: JSON.stringify(input) })
}

export function deleteCatalogItem(id: number): Promise<{ id: number }> {
  return request(`/api/admin/catalog-items/${id}`, { method: "DELETE" })
}

export function reorderCatalogItems(orderedIds: number[]): Promise<{ reordered: number }> {
  return request("/api/admin/catalog-items/reorder", { method: "PATCH", body: JSON.stringify({ orderedIds }) })
}

// --- Uploads ---

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append("file", file)
  // Deliberately not using request() — it always sets Content-Type: application/json,
  // which would break the multipart boundary the browser sets for FormData bodies.
  const response = await fetch(`${API_BASE_URL}/api/admin/uploads`, { method: "POST", body: formData })
  const body = (await response.json()) as { success: true; data: { url: string } } | { success: false; error: string }
  if (!body.success) throw new Error(body.error)
  return body.data
}

// --- Quote inquiries ---

export function fetchAdminQuoteInquiries(): Promise<AdminQuoteInquiryRow[]> {
  return request<AdminQuoteInquiryRow[]>("/api/admin/quote-inquiries")
}

export function fetchAdminQuoteInquiry(id: number): Promise<AdminQuoteInquiryDetail> {
  return request<AdminQuoteInquiryDetail>(`/api/admin/quote-inquiries/${id}`)
}

export function updateQuoteInquiryStatus(id: number, status: AdminQuoteInquiryRow["status"]): Promise<AdminQuoteInquiryRow> {
  return request(`/api/admin/quote-inquiries/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
}
