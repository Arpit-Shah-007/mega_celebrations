# Mega Celebrations — Frontend Prototype (plan_v1)

UI-only **exact replica** of mega-celebrations.com. No backend, no database — see `../plan_v1.md` at the repo root for the full project blueprint, business requirements, and backend/database stack discussion. This folder is just the visual/UX prototype built while that decision is still being finalized.

This is deliberately a faithful replica, not a redesign: the client rejected an earlier reimagined version and asked for the real site's colors, fonts, and layout as the base. Every design token below was extracted directly from the live site (computed styles via a headless browser), not invented.

## Stack

Vite + React 19 + TypeScript + React Router v7 + Tailwind CSS v4 + Framer Motion + React Hook Form.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Real design system

- Colors: `navy` `#022843` (headings/nav text), `navy-deep` `#0b2d4d`, `blue` `#0b5d9b` (hover/links), `pink` `#d485ad` (primary buttons/accents), `pink-dark` `#c06a95`, `body` `#444444` (paragraph text). Plain white page background.
- Fonts: Lato (body/nav/headings) and the client's actual licensed script font, **Barcelony** (`src/assets/fonts/Barcelony.ttf`, provided directly by the client along with their WordPress media export), used for cursive accents like "Browse Our *Packages*".
- Logo: the client's real logo file (`src/assets/brand/mega-celebrations-logo.png`).

## What's real vs. mocked

- **Real:** every page from the current live site, matched to the real layout (e.g. Packages is a 2-card hub linking to a separate filterable grid page, exactly like the live site, not a single merged page). Routing, filtering, the wishlist ("+"-button add, matching the live site's own copy), the gallery lightbox, the FAQ accordion, and the quote request form (full client-side validation via React Hook Form) are all fully functional.
- **Real photography, fully sorted and in use:** the client's entire WordPress media export (`media/` at the repo root, ~198 files, copied into `frontend/public/media/`) has been reviewed and wired in. Package hero photos, the 4 real "How to Book" step icons, the 3 add-on category photos, the About page family photo, and 7 package secondary/accent photos are mapped in `src/data/realPhotos.ts`. The remaining 149 real event photos (sleepovers, glamping tents, picnics, spa parties — everything with no natural package association) were individually viewed, given genuine descriptive filenames and alt text, and copied into `frontend/public/media/gallery/`; they're cataloged in `src/data/galleryPhotos.ts` and power the full `/gallery` page. 2 files with a baked-in "Coming Soon" text overlay and 1 personal family photo (no event content) were excluded as not gallery-appropriate. `PlaceholderPhoto` (`src/components/ui/PlaceholderPhoto.tsx`) — a deterministic on-brand gradient card — is now only a fallback for the rare case a package/page has no confident real-photo match (currently just Dining In The Tent and MEGAMovie Night's secondary images).
- **Known imperfect match, worth a second look:** `celebrations-picnic-adult`'s secondary photo (`Picnic.jpg` in `realPhotos.ts`) is a stylish outdoor dinner-table setup, not the low-table-and-floor-cushions format the actual package describes — it's a reasonable stylistic stand-in, not a literal match, since no better candidate was found in the export. Farm Table Dining's main photo (`banner-3.jpg`) is the same kind of approximation — there's no dedicated photo for that package in the export at all.
- **Real testimonials:** the 6 reviews on the home page are copied verbatim from the live site's testimonials section, styled to match its actual Google-review-card presentation (stars, Google "G" icon).
- **Real FAQ structure:** the 5 real categories and all ~26 real questions are used as-is. About 20 of the answers weren't recoverable from the live scrape (collapsed accordions) and are written from known policy facts rather than the client's exact wording — worth a pass against the real WordPress content later, now that admin access is available.
- **Mocked:** there is no backend. Submitting the quote request form on `/wishlist` simulates a network call and shows a success state, but nothing is actually sent anywhere or persisted server-side. Wiring this to a real API is Phase 1 of the plan in `../plan_v1.md`.
- **Content gaps carried over intentionally:** MEGAMovie Night, Dining In The Tent, and Farm Table Dining had no published pricing on the live site either; `priceIsPlaceholder: true` in `src/data/packages.ts` flags these with an inline note rather than inventing false certainty.
- **Content gap fixed:** the live site's Add-Ons category detail pages (Decor, Activities & Crafts, Favors) are empty shells on the real site. This prototype populates them with illustrative example items (`src/data/addOns.ts`) so they aren't dead ends — replace with the client's actual add-on catalog before launch.

## Structure

```
src/
  types/           shared TypeScript types
  data/            all content as data (packages, add-ons, FAQs, testimonials, nav, realPhotos)
  context/         WishlistContext (localStorage-backed), ToastContext
  components/
    ui/            shared primitives (Button, Container, Badge, Accordion, PlaceholderPhoto, WishlistButton, PageHero, SectionHeading)
    layout/        Header, Footer, Layout, ScrollToTop, FloatingWishlistWidget
    home/ packages/ gallery/ faqs/ about/ plan-a-party/ wishlist/
                   page-specific components, namespaced by page
  pages/           one file per route, composes the components above
public/media/      the client's real photos (static, served as-is for this prototype phase)
```

Routing lives in `src/App.tsx`. Design tokens (colors, fonts, shadows) are defined once in `src/index.css` via Tailwind v4's `@theme` block — change the palette there, not per-component. `src/data/realPhotos.ts` maps page/package slugs to specific real image files; `src/data/galleryPhotos.ts` is the flat catalog of all 149 general gallery photos.

## Known limitations worth knowing about

- **Scroll-reveal animations**: `whileInView` (Framer Motion) is used for section entrances. Always use the permissive default (`viewport={{ once: true }}`) — an earlier pass used stricter thresholds (`amount: 0.3/0.4` or negative `margin`) that, combined with the layout shift from async font loading, could leave near-the-fold content stuck at `opacity: 0` on first load. Verified fixed via a real incremental-scroll test against the production build (a static/`fullPage` screenshot doesn't trigger real scroll/intersection events for below-the-fold content and gives a false read either way).
- **`PlaceholderPhoto` + absolute positioning**: its base classes include `relative` for its internal decorative overlay; passing `absolute` via `className` used to silently lose to that (Tailwind resolves conflicting position utilities by stylesheet order, not by which class is last in the string), collapsing a full-bleed hero photo down to its flex-shrunk content size. Fixed — the component now detects an explicit position override in `className` and skips its own `relative` default — but keep this in mind if a similar sizing bug shows up elsewhere.
- **Unlayered CSS beats every Tailwind utility, always**: `src/index.css` had a plain `h1,h2,h3,h4 { color: navy }` rule outside any `@layer` block. Per the CSS Cascade Layers spec, unlayered CSS always wins over layered CSS (including Tailwind's `utilities` layer) regardless of specificity or source order — this silently broke every `text-white` heading override sitewide (e.g. the hero's "a Mega Celebration" rendered navy instead of white). Fixed by wrapping the rule in `@layer base { ... }`. If a heading's text color ever looks wrong despite the right class being applied, check this first.
- **Lazy-loaded `<img>` elements read as "broken" if you check `naturalWidth` before scrolling to them**: don't conclude images are broken from a script that checks `img.complete`/`naturalWidth` right after page load — do a real scroll-through first (same lesson as the animation note above applies to lazy-loaded images, not just `whileInView`).
- **The hero background video is not in WordPress at all**: it's hosted on the original vendor's ("Compete Now") own AWS S3 bucket, referenced by a public, unauthenticated URL embedded directly in the live site's Slider Revolution config. It's downloaded and stored at `frontend/public/media/hero-background-video.mp4` — if it ever needs replacing, there's no WordPress media library entry to look at, only that external URL (see `plan_v1.md` for the full URL on record).

## Not done yet

- Verbatim FAQ answers for the ~20 questions not recoverable from the live scrape (client now has admin access shared, worth a follow-up pass against the real WordPress content).
- Two known approximate (not literal) photo matches: Celebrations Picnic (Adult)'s secondary photo and Farm Table Dining's main photo — see above.
- Backend wiring for the quote request form (Stripe deposit, e-signature, admin dashboard — see `../plan_v1.md`, including the media hosting recommendation in section 5a).
- Route-level code splitting (`React.lazy`) — the gallery catalog pushed the JS bundle to ~160KB gzipped (Vite's build now warns about chunk size); still fine for a single-page load but worth revisiting once the backend adds more pages.
- Automated tests (none written yet for this prototype).
