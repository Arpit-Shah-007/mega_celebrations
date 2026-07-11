# Mega Celebrations — Backend (Phase 1)

Hono API on Cloudflare Workers, backed by D1 (SQLite) via Drizzle ORM, R2 for media. See `../docs/making-claude/BACKEND_SPEC.md` for the full design (scope, schema, API surface).

Deployed via Cloudflare Workers Builds (Git integration) on push to `main`.

## Stack

Hono + Drizzle ORM + Cloudflare D1 + Cloudflare R2 + Zod + Wrangler + Vitest (`@cloudflare/vitest-pool-workers`).

## Local development

```bash
npm install
npx wrangler d1 migrations apply mega-celebrations --local   # creates the local D1 file and applies the schema
npm run seed:local                                            # loads scripts/seed.sql (the real catalog content)
npm run dev                                                   # starts the Worker at http://localhost:8787
```

The frontend (`../frontend`) expects this running at `http://localhost:8787` by default (override with `VITE_API_BASE_URL` in `frontend/.env`). With both `npm run dev` here and `npm run dev` in `frontend/` running, the public site and `/admin` are both fully functional against real local D1 data — no live Cloudflare account needed for local development.

`ACCESS_TEAM_DOMAIN` in `wrangler.jsonc` ships as a placeholder (`REPLACE_WITH_TEAM_NAME...`). While it's unconfigured, `/api/admin/*` skips Cloudflare Access JWT verification entirely (see `src/lib/auth.ts`) so `/admin` works locally without a real Access setup. This is intentional — do not "fix" it by removing the check, just don't forget to actually replace it before a real production deploy (see below).

## Testing

```bash
npm run typecheck
npm test
```

Tests run against the real Workers runtime (Miniflare, via `@cloudflare/vitest-pool-workers`), not a Node mock — every test file gets a fresh, migrated D1 instance (isolation is per test **file**, not per individual `it()`, so tests within one file that insert real rows use distinct slugs/ids to avoid unique-constraint collisions with each other).

## Database schema changes

```bash
# after editing src/db/schema.ts:
npm run db:generate                 # drizzle-kit generates a new SQL migration in migrations/
npx wrangler d1 migrations apply mega-celebrations --local   # apply it locally
```

## Deploying for real (requires your Cloudflare account — not done by this session)

1. `npx wrangler login`
2. `npx wrangler d1 create mega-celebrations` → paste the returned `database_id` into `wrangler.jsonc`
3. `npx wrangler r2 bucket create mega-celebrations-media`, then set up a public bucket domain (e.g. `media.mega-celebrations.com`) and update `PUBLIC_MEDIA_BASE_URL` in `wrangler.jsonc`
4. `npx wrangler d1 migrations apply mega-celebrations --remote`
5. `npm run seed:remote` (one-time — only needed the first time you stand up a fresh database)
6. In the Cloudflare dashboard: **Zero Trust → Access → Applications**, create a self-hosted application protecting `/admin/*` on the site's domain, email allow-list policy. Copy its **Application Audience (AUD) tag** and the team domain into `wrangler.jsonc`'s `ACCESS_AUD` / `ACCESS_TEAM_DOMAIN`.
7. `npx wrangler deploy`
8. Add a Worker Route so `/api/*` on the site's own domain (not a separate subdomain) hits this Worker, and deploy `frontend/` to Cloudflare Pages on that same domain. Keeping `/admin` (Pages) and `/api/admin/*` (this Worker) on the **same origin** matters — Cloudflare Access's session cookie is origin-scoped, and a cross-origin split would need extra work to carry the Access JWT over to API calls.

None of the above was run by this session — it requires your actual Cloudflare account credentials. Everything up to that point (schema, API, admin UI, seed data, tests) is built and verified locally.
