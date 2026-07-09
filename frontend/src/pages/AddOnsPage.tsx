import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import { PageLoadingState, PageErrorState } from "@/components/ui/PageLoadingState"
import { getAddOnIcon } from "@/components/packages/tagIcons"
import { fetchAddOnCategories } from "@/lib/api"
import type { AddOnCategory } from "@/types"

/** Same real "Canopy Lounge" shot used as that package's own secondary photo — a fixed design choice for this hub page's banner, not admin-editable catalog content. */
const ADD_ONS_HERO_PHOTO = "/media/MAIN-Canopy-Lounge-Copy.jpg"

export function AddOnsPage() {
  const { data: categories, isPending, isError } = useQuery({ queryKey: ["addon-categories"], queryFn: fetchAddOnCategories })

  if (isPending) return <PageLoadingState />
  if (isError || !categories) return <PageErrorState />

  return (
    <>
      {/* Real site uses a full-bleed photo hero here (same "Canopy Lounge" shot used as the package's secondary photo), not the solid navy band used on most interior pages. Overlay verified against the live site: plain black at 50% opacity, not a blue/navy tint. */}
      <PageHero
        variant="photo"
        title="Add-Ons"
        photoSeed="add-ons-hero"
        photoAlt="Lounge cushions and canopy draping from a Mega Celebrations setup"
        photoSrc={ADD_ONS_HERO_PHOTO}
        photoHeightClassName="h-56 sm:h-64"
        photoOverlayClassName="bg-black/50"
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <AddOnCard key={category.slug} category={category} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}

/** Same card component, hover-reveal style, and font treatment as the Packages page's "Choose a Package" cards. */
function AddOnCard({ category }: { category: AddOnCategory }) {
  const [hovered, setHovered] = useState(false)
  const Icon = getAddOnIcon(category.slug)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group relative bg-white shadow-soft"
    >
      <Link to={`/packages/add-ons/${category.slug}`} className="absolute inset-0 z-20" aria-label={`Browse ${category.name} add-ons`} />

      <div className="relative h-80 w-full overflow-hidden sm:h-96">
        <PlaceholderPhoto
          seed={`addon-${category.slug}`}
          alt={category.cardImage.alt}
          icon={Icon}
          src={category.cardImage.url || undefined}
          className="absolute inset-0 h-full w-full"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-white px-4 py-3 transition-opacity duration-200"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          <p className="truncate text-center text-lg font-bold uppercase tracking-wide text-navy">{category.name}</p>
        </div>

        {/* Title keeps the exact same size as the static bar so the reveal reads as a pure slide, not a resize.
            Title and "Read More" are each their own Link (independent hover, even though both go to the same
            place) — without a real Link here, this panel (z-30) sits above the full-card Link (z-20) and
            silently swallows every click inside it. A smaller h-2/5 panel with a fixed mt-1 gap (instead of
            h-1/2 + justify-between) keeps the slide-up short and the tagline-to-CTA gap tight. */}
        <div
          className={`absolute inset-x-0 bottom-0 z-30 flex h-2/5 flex-col items-center justify-center overflow-hidden bg-white px-5 py-3 text-center transition-transform duration-1100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Link
            to={`/packages/add-ons/${category.slug}`}
            className="relative z-30 inline-block cursor-pointer text-lg font-bold uppercase tracking-wide text-navy transition-colors hover:text-pink"
          >
            {category.name}
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-body">{category.tagline}</p>
          <Link
            to={`/packages/add-ons/${category.slug}`}
            className="relative z-30 mt-1 cursor-pointer text-sm font-semibold uppercase tracking-wide text-navy transition-colors hover:text-pink"
          >
            Read More
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
