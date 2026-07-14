# Mega Celebrations

Mega Celebrations is a New Jersey / Eastern PA event-rental business specializing in kids' and family party experiences — glamping tents, sleepovers, picnics, and lounge/spa setups. This repository is the company's website: a custom-built catalog and lead-capture site that showcases packages, add-ons, and à-la-carte rentals, and gives the Mega Celebrations team a private admin area to keep that catalog up to date.

**Live site:** https://mega-celebrations-test.ashah10-b13.workers.dev

## What the site does

- **Browse packages, add-ons, and à-la-carte items** — each with photos, descriptions, and pricing, organized the way a visitor actually shops: full-service party packages, themed add-on categories (Decor, Activities & Crafts, Favors), and standalone rental items.
- **Build a wishlist** — visitors can save items they're interested in as they browse.
- **Request a custom quote** — from the wishlist, a visitor submits their event details (date, venue, guest count, contact info) as a request. That's the extent of what happens on-site; actual booking, contracts, and payment are handled by the Mega Celebrations team afterward through their existing Honeybook workflow.
- **Admin portal** — a private, login-protected area where the team manages their own packages, add-ons, à-la-carte items, pricing, and photos day to day, without needing a developer for routine catalog updates.

## What it's built with

A modern, custom-coded stack — no page builder, no CMS subscription:

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Cloudflare Workers (Hono), Cloudflare D1 (database), Cloudflare R2 (media storage)
- **Hosting:** Cloudflare, with automatic deploys on every update

For the full technical spec and project handoff notes, see the private project documentation (not included in this public repository).
