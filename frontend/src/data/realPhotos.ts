/**
 * Maps to real media files the client exported from their WordPress media
 * library (dropped in project root `media/`, copied into `public/media/`
 * so they're served as static assets). Confident, name- and content-verified
 * mappings only — each entry below was visually checked against its package
 * description before being wired up. The bulk of the unlabeled export (the
 * hash/UUID/IMG_#### camera-roll photos) has been sorted into
 * `src/data/galleryPhotos.ts` instead, since it has no natural package tie.
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
  /** Each category's own detail-page hero banner (verified 2026-07-08 against each page's actual computed background-image). */
  addOns: {
    decor: "/media/banner-9.jpg",
    "activities-crafts": "/media/MAIN-ML-1.jpg",
    favors: "/media/MAIN-Canopy-Lounge-Copy.jpg",
  },
  /** The Add-Ons hub listing page's own card thumbnails — verified 2026-07-08 against the live grid's actual <img> src for each category link. Deliberately different photos than the `addOns` banners above, matching the same listing-vs-detail split as `packageCards`/`packageHero`. */
  addOnCards: {
    decor: "/media/Decor.jpg",
    "activities-crafts": "/media/Activities.jpg",
    favors: "/media/Favors.jpeg",
  },
  /** Card thumbnail on the homepage/packages "Choose a Package" chooser — a boho farm-table setup, distinct from the A La Carte page's own pink hero photo below. */
  aLaCarte: "/media/A-la-Carte_.jpg",
  /** The live site's actual A La Carte page hero (verified 2026-07-06 by inspecting the page's background-image directly) — a pink-toned sleepover teepee setup, not the farm-table shot above. */
  aLaCarteHero: "/media/banner-9.jpg",
  /** The live Full Service Packages listing page's own hero (verified 2026-07-06 directly against mega-celebrations.com/packages/full-services-packages/) — not the same photo as the detail-page banners below. */
  packagesListingHero: "/media/BANNER-LT.jpg",
  /**
   * Listing/carousel card thumbnails — verified 2026-07-06 against the live
   * Full Service Packages grid's actual <img> src for each package link.
   * The live site uses a DIFFERENT photo here than on each package's own
   * detail-page hero (see `packageHero` below), so this is deliberately a
   * separate map, not reused for the hero.
   */
  packageCards: {
    "tent-sleepover": "/media/MAIN-TS.jpeg",
    "lace-teepee-sleepover": "/media/MAIN-LT.jpg",
    "canopy-sleepover": "/media/canopy-sleepover.jpg",
    "canopy-lounge": "/media/IMG_3104-1.jpg",
    "celebrations-picnic-adult": "/media/MAIN-CPA.jpg",
    "celebrations-picnic-kids": "/media/MAIN-CPK-1.jpg",
    "dining-in-the-tent": "/media/MAIN-DT.jpg",
    "farm-table-dining": "/media/y1lhaDCg-scaled.jpeg",
    megaglampout: "/media/MAIN-MG.jpg",
    megalounge: "/media/hTF3LN_w-scaled.jpeg",
    // The live site's own listing card for this package: a marketing teaser
    // graphic with a baked-in "Coming Soon" banner, not real event
    // photography — intentional, since the package itself isn't live yet.
    "megamovie-night": "/media/MEGA-Movie-Night.png",
    "pamper-party": "/media/MAIN-Spa.jpg",
  },
  /**
   * Detail-page hero banners — verified 2026-07-06 against each package's
   * own page at mega-celebrations.com/package/<live-slug>/ by reading the
   * hero section's actual computed background-image.
   */
  packageHero: {
    "tent-sleepover": "/media/banner-9.jpg",
    "lace-teepee-sleepover": "/media/BANNER-LT.jpg",
    "canopy-sleepover": "/media/banner-1.jpg",
    "canopy-lounge": "/media/MAIN-Canopy-Lounge-Copy.jpg",
    "celebrations-picnic-adult": "/media/banner-3.jpg",
    "celebrations-picnic-kids": "/media/banner-4.jpg",
    "dining-in-the-tent": "/media/banner-5.jpg",
    "farm-table-dining": "/media/IMG_7217.jpg",
    megaglampout: "/media/banner-2.jpg",
    megalounge: "/media/MAIN-ML-1.jpg",
    // Coming-soon package: the live detail page still shows a real photo in
    // the hero even though the listing card uses the "Coming Soon" graphic.
    "megamovie-night": "/media/IMG-3676.jpg",
    "pamper-party": "/media/GXl6JAPw-1-scaled.jpeg",
  },
} as const

/** Listing/carousel card photo — also used as the detail page's secondary "accent" photo, since it's a real, distinct-from-the-hero image for every package. */
export function getPackagePhoto(slug: string): string | undefined {
  return (realPhotos.packageCards as Record<string, string>)[slug]
}

/** Detail-page hero banner. */
export function getPackageHeroPhoto(slug: string): string | undefined {
  return (realPhotos.packageHero as Record<string, string>)[slug]
}

export function getAddOnPhoto(slug: string): string | undefined {
  return (realPhotos.addOns as Record<string, string>)[slug]
}

/** Hub listing card thumbnail — distinct from the category's own banner, per `addOnCards` above. */
export function getAddOnCardPhoto(slug: string): string | undefined {
  return (realPhotos.addOnCards as Record<string, string>)[slug]
}
