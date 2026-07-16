export interface PackageFaqItem {
  question: string
  answer: string
}

/**
 * Every distinct FAQ question/answer the live site uses across its 12 package pages —
 * each package shows its own subset (4-6 of these), not the same fixed list. Answers
 * copied verbatim from the live pages' schema.org Question/Answer markup (or reused
 * from the site-wide FAQ page's identical policy copy where it already covers the
 * question — see frontend/src/data/faqs.ts).
 */
const FAQ_POOL = {
  space: {
    question: "How much space is needed?",
    answer:
      "The amount of space needed varies by package. Please see below for dimensions for each package:\nIndoor Sleepovers and Lounges\nTent Sleepover- Each A-Frame Tent set up requires approximately a 3ft by 6ft space\nLace Teepee Sleepover- Each Teepee set up requires approximately a 3.5ft by 6.5ft space\nOutdoor Sleepovers and Lounges\nStandard MEGALounge & MEGA GlampOut- 5M MEGATent- Requires a 25ft by 25ft grass area for staking (actual tent is 17ft diameter)\nDeluxe MEGALounge & MEGA GlampOut- 6M MEGATent- Requires a 32ft by 32ft grass area for staking (actual tent is 20ft in diameter)\nThe MEGATent must be set up on a flat grass surface. Non grass surfaces (pavement, stone, turf, sand, etc.) will require sandbags for an additional fee of $150. This must be disclosed at the time of booking.\nDining\nCelebrations Picnics- We recommend a 8ft x 10ft space for a table of 8. Please contact us for exact dimensions for larger parties.\nFarm Table Dining- Each Farm Table is 8ft x 3ft.\nDining in the Tent- 5M MEGATent requires a 25ft by 25ft grass area for staking (actual tent is 17ft diameter); 6M MEGATent requires a 32ft by 32ft grass area for staking (actual tent is 20ft in diameter)",
  },
  guestCount: {
    question: "What if I don't have my final guest count yet?",
    answer:
      "We recommend booking for the maximum number of guests that you may have as we can not guarantee that additional items will be available. You have up until 2 weeks before your event (when your final payment is due) to make any changes.",
  },
  cancel: {
    question: "What if I need to cancel?",
    answer:
      "Cancellation 2 Weeks +\nIf you have to cancel or reschedule your event your 25% deposit may be used as a credit towards a new event within 13 months of your original event date. In addition, you are entitled to a refund of any amount paid above the 25% deposit.\nCancellations within 2 Weeks\nIf you are canceling your event within 2 weeks, your full payment may be used as a credit towards a new event within 13 months of your original event date.\nCancellations within 24 hours\nIf you are canceling your event within 24 hours of your scheduled delivery time, your full payment, minus a rescheduling fee, may be used as a credit towards a new event within 13 months of your original event date.",
  },
  setupPickup: {
    question: "When do you set up and pick up?",
    answer:
      "You will receive a confirmation email one week prior to your event with a 2 hour delivery and pick up window. We base our schedule on your event start/end time provided at time of booking, location, package, etc.\nDeliveries: Deliveries will begin at 8:00am for outdoor events and 9:00am for indoor events and go throughout the day. All sleepover packages will be set up by 4:00pm. Some deliveries may take place the day prior to your event depending on the schedule for that particular date.\nPick Ups: All Sleepover Packages- Pick ups will begin at 10:00am the next day and go throughout the day. All MEGATent Packages- Pick ups will begin at 8:00am the next day and go throughout the day. Picnic Packages- pick up scheduling depends on guest counts, package type, location, weather and other scheduled events. Guaranteed specific delivery/pick up times may incur additional fees and must be requested via email no later than 2 weeks before your event.",
  },
  cleaning: {
    question: "How is everything cleaned?",
    answer:
      "Every item is thoroughly cleaned and sanitized between events: linens are freshly laundered, mattresses and cushions are wiped down and deodorized, and tents are fully disinfected. Everything arrives fresh and ready for your celebration.",
  },
  location: {
    question: "Where can I hold my event?",
    answer:
      "Currently, we are only servicing private residences or venues. We do not serve public parks or beaches at this time.\nIf you are looking to hold an event at a beach or park please check out our DIY Picnic Package.",
  },
  rain: {
    question: "What happens if it rains?",
    answer:
      "We highly suggest you have a backup plan for all outdoor events in case of inclement weather. Back up plans can include: Moving your picnic indoors, Set up your picnic under a covered area (provided by the client) such as a covered porch, canopy, pop-up tent, etc., Upgrade your package to one of our Dining in the Tent options (pending availability). You also do have the option to reschedule for another date pending availability. You must notify us a minimum of 24 hours before your scheduled delivery window in order to reschedule.",
  },
  depositReturn: {
    question: "When will I get my damage deposit back?",
    answer:
      "Your damage deposit will be refunded the Monday after your event as long as all inventory is returned free from any damage.\nDamage includes but is not limited to any of the following: stains, broken inventory, missing pieces, and water damage (including damage from tents being left open and items being left out in the rain and/or overnight).\nPlease note damage deposits are only charged for OUTDOOR events.",
  },
  themeColor: {
    question: "Can I choose my theme/color scheme?",
    answer:
      "Yes! We have several themes/color schemes for you to choose from. We can also put together a custom theme for your event. Additional fees may apply for custom themes. Price varies based on level of customization and size of event. Please contact us for a quote.",
  },
  stayForEvent: {
    question: "Do you stay for the event?",
    answer:
      "We do not stay for the event. We set up everything you need, leave you to enjoy your event and return the next day (or later that day upon request).",
  },
  guestKeepsakes: {
    question: "What do guests get to keep?",
    answer:
      "Each guest gets to keep their Spa Slippers, Spa Headband, Applicator Brush, and Facial Products (face wipes, face mask, lotion) and Mani/Pedi Products (bath bomb, toe separators, nail file, nail brush). Robes are for event use only, but personalized satin robes can be added as an option for guests to keep.",
  },
  power: {
    question: "Do you need access to power?",
    answer: "Yes, access to power is needed to run the projector. We will provide ample extension cords.",
  },
  movieProvided: {
    question: "Do you provide the movie?",
    answer:
      "While we do not provide the movie we will provide either a DVD/Blue Ray Player or FireStick. You are responsible for providing a DVD/Blue Ray or for streaming a movie through your own account (Netflix, Hulu, etc.). Please note that if you plan to stream a movie there must be a strong internet signal (wifi or data) available at the movie site.",
  },
} as const

type FaqKey = keyof typeof FAQ_POOL

const ALL_FAQ_KEYS = Object.keys(FAQ_POOL) as FaqKey[]

/**
 * Exact per-package FAQ selection and order, verified against each package's live
 * page at mega-celebrations.com (2026-07). Keyed by our own package slug, which
 * doesn't always match the live site's URL slug (e.g. "pamper-party" here is
 * "spa-package" there).
 */
const PACKAGE_FAQ_MAP: Record<string, FaqKey[]> = {
  "tent-sleepover": ["space", "guestCount", "cancel", "setupPickup", "cleaning"],
  "lace-teepee-sleepover": ["space", "guestCount", "cancel", "setupPickup", "cleaning"],
  "canopy-sleepover": ["space", "guestCount", "cancel", "setupPickup", "cleaning"],
  "canopy-lounge": ["space", "cancel", "setupPickup", "cleaning"],
  "celebrations-picnic-adult": ["location", "rain", "cancel", "setupPickup", "depositReturn", "themeColor"],
  "celebrations-picnic-kids": ["location", "rain", "cancel", "depositReturn", "setupPickup", "themeColor"],
  "dining-in-the-tent": ["space", "rain", "cancel", "setupPickup", "depositReturn", "themeColor"],
  "farm-table-dining": ["location", "rain", "cancel", "setupPickup", "depositReturn", "themeColor"],
  megaglampout: ["space", "rain", "cancel", "depositReturn", "setupPickup"],
  megalounge: ["space", "rain", "cancel", "setupPickup", "depositReturn", "themeColor"],
  "megamovie-night": ["rain", "setupPickup", "power", "movieProvided", "stayForEvent"],
  "pamper-party": ["stayForEvent", "guestKeepsakes", "cancel", "cleaning"],
}

/** Small deterministic hash so an unmapped package always gets the same random-looking FAQ set on every visit, instead of reshuffling on every render/reload. */
function hashSlug(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/** Seeded pseudo-random pick of 5-6 questions from the full pool, for any package slug not in PACKAGE_FAQ_MAP (i.e. a new package added after this list was written). Not database-driven by design — this is static frontend data, same as the rest of the FAQ content. */
function pickRandomFaqs(slug: string): FaqKey[] {
  const seed = hashSlug(slug)
  const count = 5 + (seed % 2)
  const keys = [...ALL_FAQ_KEYS]
  const picked: FaqKey[] = []
  let cursor = seed
  for (let i = 0; i < count && keys.length > 0; i++) {
    cursor = (cursor * 1103515245 + 12345) & 0x7fffffff
    const index = cursor % keys.length
    picked.push(keys[index])
    keys.splice(index, 1)
  }
  return picked
}

export function getPackageFaqs(slug: string): PackageFaqItem[] {
  const keys = PACKAGE_FAQ_MAP[slug] ?? pickRandomFaqs(slug)
  return keys.map((key) => FAQ_POOL[key])
}
