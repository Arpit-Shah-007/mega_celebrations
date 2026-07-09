/**
 * Maps to real media files the client exported from their WordPress media
 * library (dropped in project root `media/`, copied into `public/media/`
 * so they're served as static assets). Confident, name- and content-verified
 * mappings only. The bulk of the unlabeled export (the hash/UUID/IMG_####
 * camera-roll photos) has been sorted into `src/data/galleryPhotos.ts`
 * instead, since it has no natural package tie.
 *
 * Per-package and per-add-on-category photos (hero/card/gallery) moved to
 * the database as of the Phase 1 backend (see docs/making-claude/BACKEND_SPEC.md)
 * — those come from the API now (Package.heroImage/cardImage/gallery,
 * AddOnCategory.heroImage/cardImage), not from this file.
 */
export const realPhotos = {
  logo: "/media/mega-celebrations-logo.png",
  heroBanner: "/media/banner-4.jpg",
  aboutBg: "/media/about-bg.png",
  aboutFamily: "/media/about-family-photo.jpg",
  aboutBgTent: "/media/about-bg-tent.jpg",
  howToBookIcons: {
    findPackage: "/media/icon-find-package.png",
    confirm: "/media/icon-confirm.png",
    setup: "/media/icon-setup.png",
    pickup: "/media/icon-pickup.png",
  },
  /** Card thumbnail on the homepage/packages "Choose a Package" chooser — a boho farm-table setup, distinct from the A La Carte page's own pink hero photo below. */
  aLaCarte: "/media/A-la-Carte_.jpg",
  /** The live site's actual A La Carte page hero (verified 2026-07-06 by inspecting the page's background-image directly) — a pink-toned sleepover teepee setup, not the farm-table shot above. */
  aLaCarteHero: "/media/banner-9.jpg",
  /** The live Full Service Packages listing page's own hero (verified 2026-07-06 directly against mega-celebrations.com/packages/full-services-packages/) — not the same photo as the detail-page banners below. */
  packagesListingHero: "/media/BANNER-LT.jpg",
} as const
