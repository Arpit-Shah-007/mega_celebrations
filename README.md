# Mega Celebrations

Mega Celebrations is a New Jersey / Eastern PA event-rental business specializing in kids' and family party experiences — glamping tents, sleepovers, picnics, and lounge/spa setups. This repository is the company's website: a custom-built catalog and lead-capture site that showcases packages, add-ons, and à-la-carte rentals, and gives the Mega Celebrations team a private admin area to keep that catalog up to date.

**Live site:** https://mega-celebrations-test.ashah10-b13.workers.dev — the pre-launch address, in review with the client. It moves to the mega-celebrations.com domain at launch.

## What the site does

- **Browse packages, add-ons, and à-la-carte items** — each with photos, descriptions, and pricing, organized the way a visitor actually shops: full-service party packages, themed add-on categories (Decor, Activities & Crafts, Favors), and standalone rental items.
- **Build a wishlist** — visitors save packages (with the theme they picked), à-la-carte rentals, and add-ons as they browse, with quantities where they apply. The wishlist lives in the visitor's own browser, so it survives a refresh or a return visit without anyone having to create an account.
- **Request a custom quote** — the wishlist page groups the picks into Packages, A La Carte, and Add-Ons, then puts the Honeybook inquiry form directly underneath them. A submitted form creates a project in Honeybook, so a lead lands in the team's existing workflow rather than in a separate inbox. Because the form is Honeybook's own hosted form, the picks cannot be written into it automatically; one button copies them as readable text for the visitor to paste into the form's free-text question. Booking, contracts, and payment continue to happen in Honeybook afterward.
- **Admin portal** — a private, login-protected area at `/admin` where the team manages packages and their themes, add-on categories and items, à-la-carte items, per-package FAQs, pricing, display order, and photo uploads. Edits are saved straight to the live database, so the public site reflects them immediately with no rebuild or developer involvement. The admin username and password can be changed from inside the portal itself.

## What it's built with

A modern, custom-coded stack — no page builder, no CMS subscription:

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Cloudflare Workers (Hono), Cloudflare D1 (database), Cloudflare R2 (media storage)
- **Hosting:** Cloudflare, with automatic deploys on every update

For the full technical spec and project handoff notes, see the private project documentation (not included in this public repository).
