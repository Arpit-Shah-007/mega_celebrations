import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Container } from "@/components/ui/Container"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import { Layers, UtensilsCrossed } from "lucide-react"
import { realPhotos } from "@/data/realPhotos"
import { MEDIA_BASE_URL } from "@/lib/media"

const OPTIONS = [
  {
    to: "/packages/full-services-packages",
    label: "Full Service Packages",
    tagline: "Let us do the work for you, all our packages include set up and take down.",
    seed: "choose-full-service",
    icon: Layers,
    // Matches the real site's own Full Service Packages tile photo (a sleepover
    // scene distinct from any single package's own card image) — a fixed design
    // choice for this hub tile, not admin-editable.
    src: `${MEDIA_BASE_URL}/media/Full_Service_Packages_Card.jpg`,
  },
  {
    to: "/packages/a-la-carte",
    label: "A La Carte",
    tagline: "Not looking for a full service package? Create your own package by choosing your items individually.",
    seed: "choose-a-la-carte",
    icon: UtensilsCrossed,
    src: realPhotos.aLaCarte,
  },
]

/** Matches the live site's "Start by Choosing a Package" section, reused on both the Packages hub and Plan A Party pages. */
export function ChooseAPackageSection({ background = "bg-white" }: { background?: string }) {
  return (
    <section
      className={`bg-top bg-repeat-y py-16 sm:py-20 ${background}`}
      style={{ backgroundImage: `url(${MEDIA_BASE_URL}/media/Gray_Background_Shapes.png)`, backgroundSize: "100% auto" }}
    >
      <Container>
        <SectionHeading title="Start by" scriptSuffix="Choosing a Package" />
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {OPTIONS.map((option, index) => (
            <ChooseAPackageCard key={option.to} option={option} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function ChooseAPackageCard({ option, index }: { option: (typeof OPTIONS)[number]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group relative bg-white shadow-soft"
    >
      <Link to={option.to} className="absolute inset-0 z-20" aria-label={`Browse ${option.label}`} />

      <div className="relative h-80 w-full overflow-hidden sm:h-96">
        <PlaceholderPhoto seed={option.seed} alt={option.label} icon={option.icon} src={option.src} className="absolute inset-0 h-full w-full" />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-white px-4 py-3 transition-opacity duration-200"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          <p className="truncate text-center text-lg font-bold uppercase tracking-wide text-navy">{option.label}</p>
        </div>

        {/* Same "white section opens upward" reveal as the homepage's Browse Our Packages cards. z-30 matters
            here: the translate-y transform makes this div its own stacking context, and without an explicit
            z-index it would rank below the full-card Link overlay (z-20) and silently eat its hover/clicks.
            Title keeps the exact same size as the static bar so the reveal reads as a pure slide, not a resize.
            Title and "View Packages" are each their own Link (independent hover, even though both go to the
            same place) — without a real Link here, this panel sits above (z-30) the full-card Link (z-20)
            and silently swallows every click inside it. A smaller h-2/5 panel with a fixed mt-3 gap (instead
            of h-1/2 + justify-between) keeps the slide-up short and the tagline-to-CTA gap tight. */}
        <div
          className={`absolute inset-x-0 bottom-0 z-30 flex h-2/5 flex-col items-center justify-center overflow-hidden bg-white px-5 py-3 text-center transition-transform duration-1100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Link to={option.to} className="relative z-30 inline-block cursor-pointer text-lg font-bold uppercase tracking-wide text-navy transition-colors hover:text-pink">
            {option.label}
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-body">{option.tagline}</p>
          <Link to={option.to} className="relative z-30 mt-1 cursor-pointer text-sm font-semibold uppercase tracking-wide text-navy transition-colors hover:text-pink">
            View Packages
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
