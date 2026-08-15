# Mega Celebrations

Mega Celebrations is a New Jersey / Eastern PA event-rental business specializing in kids' and family party experiences — glamping tents, sleepovers, picnics, and lounge/spa setups. This repository is the company's website: a custom-built catalog and lead-capture site that showcases packages, add-ons, and à-la-carte rentals, and gives the Mega Celebrations team a private admin area to keep that catalog up to date.

**Final site:** https://www.mega-celebrations.com/ — the address the site runs on once the domain is pointed at it. Until then, that domain still serves the old website.

**Preview:** https://mega-celebrations-test.ashah10-b13.workers.dev — the pre-launch address, in review with the client. Same build, temporary URL.

## What the site does

- **Browse packages, add-ons, and à-la-carte items** — each with photos, descriptions, and pricing, organized the way a visitor actually shops: full-service party packages, themed add-on categories (Decor, Activities & Crafts, Favors), and standalone rental items.
- **Build a wishlist** — visitors save packages (with the theme they picked), à-la-carte rentals, and add-ons as they browse, with quantities where they apply. The wishlist lives in the visitor's own browser, so it survives a refresh or a return visit without anyone having to create an account.
- **Request a custom quote** — the wishlist page groups the picks into Packages, A La Carte, and Add-Ons, then puts the Honeybook inquiry form directly underneath them. A submitted form creates a project in Honeybook, so a lead lands in the team's existing workflow rather than in a separate inbox. Because the form is Honeybook's own hosted form, the picks cannot be written into it automatically; one button copies them as readable text for the visitor to paste into the form's free-text question. Booking, contracts, and payment continue to happen in Honeybook afterward.
- **Admin portal** — a private, login-protected area at `/admin` where the team manages packages and their themes, add-on categories and items, à-la-carte items, per-package FAQs, pricing, display order, and photo uploads. Edits are saved straight to the live database, so the public site reflects them immediately with no rebuild or developer involvement. The admin username and password can be changed from inside the portal itself.

## What it's built with

A modern, custom-coded stack — no page builder, no CMS subscription:

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Cloudflare Workers (Hono), Cloudflare D1 (database), Cloudflare R2 (media storage)
- **Hosting:** Cloudflare Workers, on their global network

## Repository layout

Two independent workspaces, each with its own dependencies, tests, and deploy:

- `frontend/` — the public site and the admin portal, one React app served by a Cloudflare Worker.
- `backend/` — the API: Hono routes, the Drizzle schema and migrations behind D1, and the R2 image uploads the admin portal writes to.

Both take `npm run dev` to work locally, `npm test` for the test suite, and `npm run deploy` to publish to Cloudflare. The frontend adds `npm run build` and `npm run lint`; the backend adds the D1 scripts (`db:generate`, `db:migrate:local` / `db:migrate:remote`, `seed:local` / `seed:remote`). Deploys are run deliberately rather than on push, so nothing reaches the live site until someone means it to.

## Going live

The build is complete and under client review on the preview URL. What is left is the switch itself:

1. Client testing on the preview URL, then any changes that come out of it.
2. Point https://www.mega-celebrations.com/ at the Cloudflare Worker, which replaces the old website.
3. Verify the live domain end to end — every page, the Honeybook inquiry form, and the admin login.
4. Only then decommission the previous hosting.

For the full technical spec and project handoff notes, see the private project documentation (not included in this public repository).
