import type { Context } from "hono"
import type { ApiResponse } from "@/types"

export function ok<T>(c: Context, data: T, status: 200 | 201 = 200) {
  return c.json<ApiResponse<T>>({ success: true, data }, status)
}

export function fail(c: Context, error: string, status: 400 | 401 | 403 | 404 | 429 | 500 = 400) {
  return c.json<ApiResponse<never>>({ success: false, error }, status)
}
