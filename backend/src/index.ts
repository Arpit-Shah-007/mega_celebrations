import { Hono } from "hono"
import { cors } from "hono/cors"
import type { Env } from "@/types"
import { requireAccess } from "@/lib/auth"
import { fail } from "@/lib/response"
import { publicPackagesRoute } from "@/routes/public/packages"
import { publicAddonCategoriesRoute } from "@/routes/public/addOnCategories"
import { publicCatalogItemsRoute } from "@/routes/public/catalogItems"
import { publicQuoteInquiriesRoute } from "@/routes/public/quoteInquiries"
import { adminPackagesRoute } from "@/routes/admin/packages"
import { adminAddonCategoriesRoute } from "@/routes/admin/addOnCategories"
import { adminCatalogItemsRoute } from "@/routes/admin/catalogItems"
import { adminUploadsRoute } from "@/routes/admin/uploads"
import { adminQuoteInquiriesRoute } from "@/routes/admin/quoteInquiries"

const app = new Hono<{ Bindings: Env }>()

// /admin (Pages) and /api/* (this Worker) are meant to be deployed under the
// same custom domain via a Worker Route on that zone (see backend/README.md
// "Deploying for real") so the Cloudflare Access session cookie is same-origin
// and no CORS is actually exercised in production. This origin list only
// matters for local dev, where the Vite dev server and `wrangler dev` run on
// different ports.
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  }),
)

app.route("/api/packages", publicPackagesRoute)
app.route("/api/addon-categories", publicAddonCategoriesRoute)
app.route("/api/catalog-items", publicCatalogItemsRoute)
app.route("/api/quote-inquiries", publicQuoteInquiriesRoute)

app.use("/api/admin/*", requireAccess)
app.route("/api/admin/packages", adminPackagesRoute)
app.route("/api/admin/addon-categories", adminAddonCategoriesRoute)
app.route("/api/admin/catalog-items", adminCatalogItemsRoute)
app.route("/api/admin/uploads", adminUploadsRoute)
app.route("/api/admin/quote-inquiries", adminQuoteInquiriesRoute)

app.notFound((c) => fail(c, "Not found.", 404))

export default app
