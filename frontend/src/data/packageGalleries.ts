/**
 * Each package's detail-page photo slideshow, in the exact order the live
 * site's Avia slideshow shows them — verified 2026-07-08 by reading each
 * live package page's `.avia-slideshow img` src list directly. `megamovie-night`
 * has no entry because the live "Coming Soon" page has no slideshow, only a
 * single static image (handled by the existing `getPackagePhoto` fallback).
 */
export const packageGalleries: Record<string, string[]> = {
  "tent-sleepover": [
    "/media/File_00810.jpeg",
    "/media/File_0094.jpeg",
    "/media/IMG_0090.jpg",
    "/media/IMG_0645.jpg",
    "/media/IMG_4252.jpg",
    "/media/IMG_7241.jpg",
    "/media/1F136828-581A-460A-A025-3ED0D3A0C6BA.jpg",
    "/media/File_00020.jpeg",
    "/media/File_0087.jpeg",
  ],
  "lace-teepee-sleepover": [
    "/media/f2O4aFOQ.jpeg",
    "/media/fE__pIFA.jpeg",
    "/media/HQ_VMuuQ.jpeg",
    "/media/ILgPMotM.jpeg",
    "/media/OIJgWtdw.jpeg",
    "/media/uRl_a0ug.jpeg",
    "/media/xdX8EcIQ.jpeg",
    "/media/ybtilkFw.jpeg",
  ],
  "canopy-sleepover": [
    "/media/atJfzwgQ.jpeg",
    "/media/jnwAWkTA.jpeg",
    "/media/kxmup7EA.jpeg",
    "/media/LlUyEmyw.jpeg",
    "/media/zUys92gA.jpeg",
    "/media/5o2dP1rw.jpeg",
  ],
  "canopy-lounge": [
    "/media/IMG_3102-1.jpg",
    "/media/IMG_3104-1.jpg",
    "/media/IMG_4395.jpg",
    "/media/IMG_0431-1.jpg",
    "/media/MAIN-Canopy-Lounge.jpg",
    "/media/IMG_0954-scaled.jpg",
  ],
  megaglampout: [
    "/media/x-pHD0Iw.jpeg",
    "/media/7qBp3b-w.jpeg",
    "/media/8VxYWdag.jpeg",
    "/media/9Ltx6cow.jpeg",
    "/media/fInXlGLw.jpeg",
    "/media/FzcqVU5g.jpeg",
    "/media/sgAq_jQw.jpeg",
    "/media/sqElHfUw.jpeg",
  ],
  megalounge: [
    "/media/Xy64X13w.jpeg",
    "/media/zyJKgDRA.jpeg",
    "/media/1WU4X8tA.jpeg",
    "/media/4SrKwlEA.jpeg",
    "/media/49vDOaDA.jpeg",
    "/media/DBuJYcQQ.jpeg",
    "/media/GUSpOnjA.jpeg",
  ],
  "pamper-party": [
    "/media/nC0iEXyw.jpeg",
    "/media/u7JmlllA.jpeg",
    "/media/L4xpx1Ag.jpeg",
    "/media/GXl6JAPw.jpeg",
    "/media/PpprQ8Ug.jpeg",
  ],
  "celebrations-picnic-adult": [
    "/media/ZrjsLEJQ.jpeg",
    "/media/ART0jvw.jpeg",
    "/media/1JxQneQ.jpeg",
    "/media/BmZIKKyA.jpeg",
    "/media/EAAg-oIA.jpeg",
    "/media/JOhY1lZA.jpeg",
    "/media/p8M42NGg.jpeg",
    "/media/Ur2W3wug.jpeg",
  ],
  "celebrations-picnic-kids": [
    "/media/R9zarwaQ.jpeg",
    "/media/xTG4fEoY.jpeg",
    "/media/1rWXxjvA.jpeg",
    "/media/fkCy45bQ.jpeg",
  ],
  "dining-in-the-tent": ["/media/lNgyKKMA.jpeg", "/media/BOqMk0eg.jpeg"],
  "farm-table-dining": ["/media/T04ECJGg.jpeg", "/media/8AA5F4A4-9495-4CB3-BC7E-3CF870931455-1.jpg"],
}

export function getPackageGallery(slug: string): string[] {
  return packageGalleries[slug] ?? []
}
