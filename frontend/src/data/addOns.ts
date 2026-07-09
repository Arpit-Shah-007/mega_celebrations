import type { AddOnCategory } from "@/types"

/**
 * Real category copy, taglines, and itemized products, confirmed 2026-07-07
 * by fetching the live site's actual add-on detail pages at
 * mega-celebrations.com/package/{slug}/ and opening each item's own detail
 * modal (GoodShuffle-powered). Category breadcrumb, photo, physical details,
 * and pricing all come directly from that modal. Descriptions are rephrased
 * (same rewrite treatment as the A La Carte catalog) for items that had real
 * copy, and written fresh for items the live site shows as "No description
 * available." — same as the A La Carte precedent, not fabricating specs
 * beyond what the name/category/price already convey.
 */
export const addOnCategories: AddOnCategory[] = [
  {
    slug: "decor",
    name: "Decor",
    tagline: "Wow your guests with stunning backdrops, balloon displays, teepees and more.",
    description:
      "Our decor add-ons will take your event to the next level. Wow your guests with stunning backdrops, balloon displays, teepees and more.",
    items: [
      {
        slug: "arched-walls",
        name: "Arched Walls",
        price: "Contact us for price.",
        category: "Decor > Backdrops",
        image: "/media/add-ons/arched-walls.jpg",
        description: [
          "A freestanding arched wall that makes a striking backdrop for photos, dessert tables, or your event entrance.",
        ],
        pricing: [],
      },
      {
        slug: "boho-umbrella",
        name: "Boho Umbrella",
        price: "$75.00",
        category: "Decor > Umbrellas & Parasols",
        image: "/media/add-ons/boho-umbrella.jpg",
        description: ["An oversized boho-style umbrella that adds shade and an earthy, relaxed accent to any outdoor setup."],
        pricing: [{ label: "Flat fee", value: "$75.00" }],
      },
      {
        slug: "draped-lights",
        name: "Draped Lights",
        price: "$75.00",
        category: "Lighting Decor > String Lights",
        image: "/media/add-ons/draped-lights.jpg",
        description: ["Soft overhead string lights that bring a warm, romantic glow to any evening event."],
        pricing: [{ label: "Flat fee", value: "$75.00" }],
      },
      {
        slug: "large-lace-teepee",
        name: "Large Lace Teepee",
        price: "$100.00",
        category: "Tents > Tents & Canopies",
        image: "/media/add-ons/large-lace-teepee.jpg",
        description: [
          "The perfect decor addition for any picnic setup.",
          "Includes a 7ft lace teepee, rug, throw pillows, and a floral garland.",
          "Balloons available for an additional fee.",
        ],
        pricing: [{ label: "Flat fee", value: "$100.00" }],
      },
      {
        slug: "peacock-throne-chair",
        name: "Peacock Throne Chair",
        price: "$125.00",
        category: "Furniture > Seating & Chairs",
        image: "/media/add-ons/peacock-throne-chair.jpg",
        description: ["An ornate peacock-style throne chair that makes a photo-ready seat of honor for any celebration."],
        pricing: [{ label: "Flat fee", value: "$125.00" }],
      },
      {
        slug: "pink-flower-wall",
        name: "Pink Flower Wall",
        price: "$300.00",
        category: "Decor > Backdrops",
        image: "/media/add-ons/pink-flower-wall.jpg",
        description: ["An 8x8ft wall covered in pink floral blooms — a lush backdrop for photos or a dessert table."],
        details: [
          { label: "Height", value: "8 ft." },
          { label: "Length", value: "8 ft." },
        ],
        pricing: [{ label: "Flat fee", value: "$300.00" }],
      },
      {
        slug: "white-pampas-wall",
        name: "White Pampas Wall",
        price: "$300.00",
        category: "Decor > Backdrops",
        image: "/media/add-ons/white-pampas-wall.jpg",
        description: ["An 8x8ft wall of white pampas grass — a soft, neutral backdrop that suits any event theme."],
        details: [
          { label: "Height", value: "8 ft." },
          { label: "Length", value: "8 ft." },
        ],
        pricing: [{ label: "Flat fee", value: "$300.00" }],
      },
    ],
  },
  {
    slug: "activities-crafts",
    name: "Activities & Crafts",
    tagline: "What's a celebration without activities? Let us take the planning off your plate.",
    description:
      "What's a celebration without activities? Let us take the planning off your plate. Choose from a variety of activity and craft stations designed to help keep your guests entertained. Whether you are looking for a bounce house or jewelry making station, we can help!",
    items: [
      {
        slug: "3-in-1-combo-bounce-house-slide-ball-pit",
        name: "3 in 1 Combo (Bounce House/Slide/Ball Pit)",
        price: "$750.00",
        category: "Inflatables > Combos",
        image: "/media/add-ons/combo-bounce-house-slide-ball-pit.jpg",
        description: ["A 3-in-1 inflatable combining a bounce house, slide, and ball pit for hours of active fun."],
        pricing: [{ label: "Flat fee", value: "$750.00" }],
      },
      {
        slug: "pillowcase-craft",
        name: "Pillowcase Craft",
        price: "$15.00",
        category: "Hospitality > Party Favors",
        image: "/media/add-ons/pillowcase-craft.jpg",
        description: ["A hands-on craft station where guests decorate their own pillowcase to take home."],
        pricing: [{ label: "Purchase Price", value: "$15.00" }],
      },
    ],
  },
  {
    slug: "favors",
    name: "Favors",
    tagline: "From personalized tumblers to matching pajamas we've got you covered.",
    description:
      "From personalized tumblers to matching pajamas we've got you covered. Send guests home with fun and personalized favors that they will use again and again.",
    items: [
      {
        slug: "personalized-robes",
        name: "Personalized Robes",
        price: "$25.00",
        category: "Hospitality > Party Favors",
        image: "/media/add-ons/personalized-robes.jpg",
        description: [
          "Soft satin robes personalized with each guest's name.",
          "Available in light pink, hot pink, black, white, and blue.",
        ],
        pricing: [{ label: "Purchase Price", value: "$25.00" }],
      },
      {
        slug: "personalized-tumblers",
        name: "Personalized Tumblers",
        price: "$12.00",
        category: "Entertainment & Games > Accessories",
        image: "/media/add-ons/personalized-tumblers.jpg",
        additionalImages: ["/media/add-ons/personalized-tumblers-clear.png"],
        description: ["Available in Clear Acrylic or Matte Dusty Rose finishes.", "Other colors available upon request."],
        pricing: [{ label: "Flat fee", value: "$12.00" }],
      },
    ],
  },
]

export function getAddOnBySlug(slug: string): AddOnCategory | undefined {
  return addOnCategories.find((item) => item.slug === slug)
}
