import { Hono } from "hono"
import { ok, fail } from "@/lib/response"
import type { Env } from "@/types"

export const adminUploadsRoute = new Hono<{ Bindings: Env }>()

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])
const MAX_BYTES = 5 * 1024 * 1024

adminUploadsRoute.post("/", async (c) => {
  const body = await c.req.parseBody().catch(() => null)
  const file = body?.["file"]

  if (!(file instanceof File)) {
    return fail(c, "Expected a multipart/form-data body with a 'file' field.", 400)
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return fail(c, "Only JPEG, PNG, or WebP images are allowed.", 400)
  }
  if (file.size > MAX_BYTES) {
    return fail(c, "Images must be 5MB or smaller.", 400)
  }

  const extension = file.type.split("/")[1]
  const key = `uploads/${crypto.randomUUID()}.${extension}`
  await c.env.MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } })

  return ok(c, { url: `${c.env.PUBLIC_MEDIA_BASE_URL}/${key}` }, 201)
})
