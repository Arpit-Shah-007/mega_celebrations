import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Button } from "@/components/ui/Button"
import { PageHero } from "@/components/ui/PageHero"
import { AccordionItem } from "@/components/ui/Accordion"
import { PackageCard } from "@/components/packages/PackageCard"
import { CatalogItemCard } from "@/components/packages/CatalogItemCard"
import { VariantDetailModal } from "@/components/packages/VariantDetailModal"
import { PackageImageCarousel } from "@/components/packages/PackageImageCarousel"
import { PageLoadingState } from "@/components/ui/PageLoadingState"
import { getTagIcon } from "@/components/packages/tagIcons"
import { fetchPackageBySlug, fetchPackages } from "@/lib/api"
import { getRelatedPackages } from "@/lib/relatedPackages"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { MEDIA_BASE_URL } from "@/lib/media"
import type { PackageVariant, WishlistItemCategory } from "@/types"

/** Matches the live site's "What's Included"/"Pricing" bullet marker: a filled blue circle badge with a white check, not a plain checkmark glyph. */
function CheckBadge() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue">
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

function VariantGrid({
  variants,
  namespace,
  category,
  onOpenDetails,
}: {
  variants: PackageVariant[]
  namespace: string
  category: WishlistItemCategory
  onOpenDetails: (variant: PackageVariant) => void
}) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {variants.map((variant) => (
        <CatalogItemCard
          key={variant.name}
          name={variant.name}
          price={variant.price}
          image={variant.image}
          namespace={namespace}
          category={category}
          onOpenDetails={() => onOpenDetails(variant)}
        />
      ))}
    </div>
  )
}

interface ActiveVariant {
  variant: PackageVariant
  namespace: string
  label: string
  category: WishlistItemCategory
}

export function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activeVariant, setActiveVariant] = useState<ActiveVariant | null>(null)

  const {
    data: pkg,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["package", slug],
    queryFn: () => fetchPackageBySlug(slug!),
    enabled: Boolean(slug),
  })
  const { data: allPackages } = useQuery({ queryKey: ["packages"], queryFn: fetchPackages })

  if (isPending) return <PageLoadingState />

  if (isError || !pkg) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="text-3xl text-navy">Package not found</h1>
        <p className="text-body">
          We couldn&apos;t find that package. It may have been renamed or is no longer offered.
        </p>
        <Button kind="link" to="/packages/full-services-packages" variant="primary">
          Browse all packages
        </Button>
      </Container>
    )
  }

  const relatedPackages = allPackages ? getRelatedPackages(pkg, allPackages, 3) : []
  const Icon = getTagIcon(pkg.tags[0])
  const galleryImages = pkg.gallery.length > 0 ? pkg.gallery.map((image) => image.url) : [pkg.cardImage.url].filter(Boolean)
  const packageFaqs = pkg.faqs ?? []

  return (
    <>
      <PageHero
        title={pkg.name}
        variant="photo"
        photoHeightClassName="h-64 sm:h-72"
        titleWeightClassName="font-normal"
        photoOverlayClassName="bg-black/60"
        photoSeed={pkg.slug}
        photoAlt={pkg.heroImage.alt}
        photoIcon={Icon}
        photoSrc={pkg.heroImage.url || undefined}
      />

      <section className="py-10 sm:py-14">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <SectionHeading title="About this" scriptSuffix="Package" align="left" />
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
              <p className="leading-relaxed text-body">{pkg.description}</p>

              <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-navy">What&apos;s Included</h3>
              <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {pkg.inclusions.map((inclusion) => (
                  <li key={inclusion} className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="leading-snug text-body">{inclusion}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-navy">Pricing</h3>
              <ul className="mt-4 space-y-1.5">
                {!pkg.priceIsPlaceholder ? (
                  <li className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="leading-snug text-body">A travel fee will be charged for events more than 20 miles from Flemington, NJ.</span>
                  </li>
                ) : null}
                {pkg.damageDeposit ? (
                  <li className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="leading-snug text-body">A ${pkg.damageDeposit} damage deposit will be charged for this package.</span>
                  </li>
                ) : null}
                {pkg.bundleDiscount ? (
                  <li className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="leading-snug text-body">{pkg.bundleDiscount}</span>
                  </li>
                ) : null}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative self-start"
            >
              {/* Same "About Us" photo treatment: blue accent lines at the bottom-right corner, top-right corner clipped off — nothing else. Fixed (not stretched) height so smaller source photos don't get upscaled into blur. "self-start" above keeps this wrapper sized to its own content instead of stretching to match the taller text column, which is what kept pushing these corner lines below the actual photo. */}
              <div className="absolute -bottom-2 -right-2 h-24 w-2.5 bg-blue" aria-hidden="true" />
              <div className="absolute -bottom-2 -right-2 h-2.5 w-24 bg-blue" aria-hidden="true" />
              <div
                className="relative h-72 w-full overflow-hidden sm:h-96"
                style={{ clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)" }}
              >
                <PackageImageCarousel images={galleryImages} alt={pkg.cardImage.alt} seed={pkg.slug} icon={Icon} />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {pkg.themes && pkg.themes.length > 0 ? (
        <section className="bg-blue py-14 sm:py-20">
          <Container>
            <SectionHeading title="Choose Your" scriptSuffix="Theme" light />
            <VariantGrid
              variants={pkg.themes}
              namespace={`theme-${pkg.slug}`}
              category="theme"
              onOpenDetails={(variant) =>
                setActiveVariant({ variant, namespace: `theme-${pkg.slug}`, label: "Theme", category: "theme" })
              }
            />
          </Container>
        </section>
      ) : null}

      {pkg.popularAddOns && pkg.popularAddOns.length > 0 ? (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeading title="Popular" scriptSuffix="Add-Ons" />
            <VariantGrid
              variants={pkg.popularAddOns}
              namespace={`addon-${pkg.slug}`}
              category="add-on"
              onOpenDetails={(variant) =>
                setActiveVariant({ variant, namespace: `addon-${pkg.slug}`, label: "Add-On", category: "add-on" })
              }
            />
            <div className="mt-8 flex justify-center">
              <Button kind="link" to="/packages/add-ons" variant="primary">
                View All Add-Ons
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      {packageFaqs.length > 0 ? (
        <section
          className="bg-white bg-top bg-repeat-y py-14 sm:py-20"
          style={{ backgroundImage: `url(${MEDIA_BASE_URL}/media/Gray_Background_Shapes.png)`, backgroundSize: "100% auto" }}
        >
          <Container>
            <SectionHeading title="Frequently Asked" scriptSuffix="Questions" />
            <div className="mx-auto mt-10 max-w-5xl">
              {packageFaqs.map((faq) => (
                <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <TestimonialsSection />

      {relatedPackages.length > 0 ? (
        <section className="bg-offwhite py-14 sm:py-20">
          <Container>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <SectionHeading title="You Might Also Like" scriptSuffix="Related Packages" />
            </motion.div>
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedPackages.map((related) => (
                <PackageCard key={related.slug} pkg={related} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <VariantDetailModal
        variant={activeVariant?.variant ?? null}
        namespace={activeVariant?.namespace ?? ""}
        headingLabel={activeVariant?.label ?? ""}
        category={activeVariant?.category ?? "theme"}
        onClose={() => setActiveVariant(null)}
      />
    </>
  )
}
