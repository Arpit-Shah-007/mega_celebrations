export interface Env {
  DB: D1Database
  MEDIA: R2Bucket
  ACCESS_TEAM_DOMAIN: string
  ACCESS_AUD: string
  PUBLIC_MEDIA_BASE_URL: string
  ADMIN_USERNAME: string
  ADMIN_PASSWORD: string
  SESSION_SECRET: string
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiFailure {
  success: false
  error: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure
