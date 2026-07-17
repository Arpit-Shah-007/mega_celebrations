import { request } from "@/lib/http"
import type { AddOnCategory, CatalogItem, Package } from "@/types"

export function fetchPackages(): Promise<Package[]> {
  return request<Package[]>("/api/packages")
}

export function fetchPackageBySlug(slug: string): Promise<Package> {
  return request<Package>(`/api/packages/${encodeURIComponent(slug)}`)
}

export function fetchAddOnCategories(): Promise<AddOnCategory[]> {
  return request<AddOnCategory[]>("/api/addon-categories")
}

export function fetchAddOnCategoryBySlug(slug: string): Promise<AddOnCategory> {
  return request<AddOnCategory>(`/api/addon-categories/${encodeURIComponent(slug)}`)
}

export function fetchALaCarteItems(): Promise<CatalogItem[]> {
  return request<CatalogItem[]>("/api/catalog-items?placement=a_la_carte")
}
