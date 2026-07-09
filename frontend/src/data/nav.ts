export interface NavLink {
  label: string
  to: string
}

/** Matches the live site's exact header nav order (Packages, FAQs, Gallery, About Us). */
export const primaryNav: NavLink[] = [
  { label: "Packages", to: "/packages" },
  { label: "FAQs", to: "/faqs" },
  { label: "Gallery", to: "/gallery" },
  { label: "About Us", to: "/about" },
]

/** Matches the live site's footer "Quick Links" column. */
export const footerNav: NavLink[] = [
  { label: "About Us", to: "/about" },
  { label: "Packages", to: "/packages" },
  { label: "Add-Ons", to: "/packages/add-ons" },
  { label: "Gallery", to: "/gallery" },
  { label: "How it Works", to: "/plan-a-party" },
  { label: "FAQs", to: "/faqs" },
]

export const businessInfo = {
  phone: "908-340-6316",
  email: "hello@mega-celebrations.com",
  serviceArea: "Serving New Jersey and Eastern PA",
  baseCity: "Flemington, NJ",
  instagram: "https://instagram.com/megacelebrations",
  facebook: "https://facebook.com/megacelebrations",
  consultationCallUrl: "https://calendly.com/megacelebrations/consultation",
  sisterCompany: {
    name: "Little Buddies",
    blurb:
      "Little Buddies offers fun, engaging soft play and ball pit rentals specifically designed for the youngest party guests. Toddlers will love exploring, climbing and bouncing at any celebration.",
    url: "https://littlebuddiessoftplay.com",
  },
}
