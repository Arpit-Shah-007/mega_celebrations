import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { PackageCard } from "@/components/packages/PackageCard"
import { PageLoadingState, PageErrorState } from "@/components/ui/PageLoadingState"
import { getTagIcon } from "@/components/packages/tagIcons"
import { fetchPackages } from "@/lib/api"
import { realPhotos } from "@/data/realPhotos"
import { ALL_PACKAGE_TAGS } from "@/types"
import type { Package, PackageTag } from "@/types"

type TagFilter = PackageTag | "All Packages"

/**
 * Live site order for the Full Service Packages grid (mega-celebrations.com/packages/full-services-packages/).
 * The shared `packages` data array is ordered differently (grouped for the homepage carousel), so this
 * page re-sorts a copy to match the live listing without touching the shared array or PackageCarousel.
 * Any package not listed here (e.g. newly added) falls to the end, keeping it visible instead of dropped.
 */
const LISTING_ORDER: readonly string[] = [
  "tent-sleepover",
  "lace-teepee-sleepover",
  "canopy-sleepover",
  "canopy-lounge",
  "celebrations-picnic-adult",
  "celebrations-picnic-kids",
  "dining-in-the-tent",
  "farm-table-dining",
  "megaglampout",
  "megalounge",
  "megamovie-night",
  "pamper-party",
]

function getOrderedPackages(packages: Package[]) {
  const orderIndex = new Map(LISTING_ORDER.map((slug, index) => [slug, index]))
  return [...packages].sort((a, b) => {
    const aIndex = orderIndex.get(a.slug) ?? LISTING_ORDER.length
    const bIndex = orderIndex.get(b.slug) ?? LISTING_ORDER.length
    return aIndex - bIndex
  })
}

export function PackagesListingPage() {
  const [activeTag, setActiveTag] = useState<TagFilter>("All Packages")
  const { data: packages, isPending, isError } = useQuery({ queryKey: ["packages"], queryFn: fetchPackages })

  const orderedPackages = useMemo(() => getOrderedPackages(packages ?? []), [packages])

  const filteredPackages = useMemo(() => {
    if (activeTag === "All Packages") return orderedPackages
    return orderedPackages.filter((pkg) => pkg.tags.includes(activeTag))
  }, [activeTag, orderedPackages])

  if (isPending) return <PageLoadingState />
  if (isError) return <PageErrorState />

  return (
    <>
      <PageHero
        title="Packages"
        variant="photo"
        photoHeightClassName="h-56 sm:h-64"
        photoSeed="packages-listing-hero"
        photoAlt="Elegant white-draped outdoor dining cabana styled by Mega Celebrations"
        photoSrc={realPhotos.packagesListingHero}
        photoOverlayClassName="bg-black/50"
      />

      <section className="py-14 sm:py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-sm font-bold text-navy">Filter by Package Type</span>
            <FilterPill label="All Packages" isActive={activeTag === "All Packages"} onClick={() => setActiveTag("All Packages")} />
            {ALL_PACKAGE_TAGS.map((tag) => (
              <FilterPill
                key={tag}
                label={tag}
                icon={getTagIcon(tag)}
                isActive={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </motion.div>

          {filteredPackages.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.slug} pkg={pkg} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="border border-dashed border-navy/20 py-20 text-center">
              <p className="text-lg text-body">
                We don&apos;t have a package in this category just yet. Try a different filter, or browse all packages.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

interface FilterPillProps {
  label: string
  isActive: boolean
  onClick: () => void
  icon?: LucideIcon
}

function FilterPill({ label, isActive, onClick, icon: Icon }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
        isActive ? "bg-pink text-white" : "bg-white text-navy hover:text-pink"
      }`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {label}
    </button>
  )
}
