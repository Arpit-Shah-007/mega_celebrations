export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787"

interface ApiSuccess<T> {
  success: true
  data: T
}

interface ApiFailure {
  success: false
  error: string
}

type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  const body = (await response.json()) as ApiResponse<T>
  if (!body.success) {
    throw new Error(body.error)
  }
  return body.data
}
