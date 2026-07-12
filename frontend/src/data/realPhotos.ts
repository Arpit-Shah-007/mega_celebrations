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
import { MEDIA_BASE_URL } from "@/lib/media"

export const realPhotos = {
  logo: `${MEDIA_BASE_URL}/media/Mega_Celebrations_Logo.png`,
  heroBanner: `${MEDIA_BASE_URL}/media/Celebrations_Picnic_Kids_Hero.jpg`,
  aboutBg: `${MEDIA_BASE_URL}/media/About_Bg.png`,
  aboutFamily: `${MEDIA_BASE_URL}/media/About_Family_Photo.jpg`,
  aboutBgTent: `${MEDIA_BASE_URL}/media/About_Bg_Tent.jpg`,
  howToBookIcons: {
    findPackage: `${MEDIA_BASE_URL}/media/Icon_Find_Package.png`,
    confirm: `${MEDIA_BASE_URL}/media/Icon_Confirm.png`,
    setup: `${MEDIA_BASE_URL}/media/Icon_Setup.png`,
    pickup: `${MEDIA_BASE_URL}/media/Icon_Pickup.png`,
  },
  /** Card thumbnail on the homepage/packages "Choose a Package" chooser — a boho farm-table setup, distinct from the A La Carte page's own pink hero photo below. */
  aLaCarte: `${MEDIA_BASE_URL}/media/A_La_Carte_Card.jpg`,
  /** The live site's actual A La Carte page hero (verified 2026-07-06 by inspecting the page's background-image directly) — a pink-toned sleepover teepee setup, not the farm-table shot above. */
  aLaCarteHero: `${MEDIA_BASE_URL}/media/Tent_Sleepover_Hero.jpg`,
  /** The live Full Service Packages listing page's own hero (verified 2026-07-06 directly against mega-celebrations.com/packages/full-services-packages/) — not the same photo as the detail-page banners below. */
  packagesListingHero: `${MEDIA_BASE_URL}/media/Lace_Teepee_Sleepover_Hero.jpg`,
} as const
