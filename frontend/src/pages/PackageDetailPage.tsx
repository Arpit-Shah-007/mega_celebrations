import { useState } from "react"
import { useParams } from "react-router-dom"
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
import { getTagIcon } from "@/components/packages/tagIcons"
import { getPackageBySlug, getRelatedPackages } from "@/data/packages"
import { getPackagePhoto, getPackageHeroPhoto } from "@/data/realPhotos"
import { getPackageGallery } from "@/data/packageGalleries"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import type { PackageVariant } from "@/types"

/**
 * Fixed 5-question set shown on every live package detail page (verified
 * across tent-sleepover, lace-teepee-sleepover, celebrations-picnic-adult,
 * spa-package and mega-glampout — identical questions on all of them, so
 * this is a shared policy FAQ, not package-specific content). Answers reuse
 * the site-wide FAQ copy where it already covers the question; "How is
 * everything cleaned?" has no site-wide equivalent so it's written fresh.
 */
const PACKAGE_FAQS = [
  {
    question: "How much space is needed?",
    answer:
      "The amount of space needed varies by package. Please see below for dimensions for each package:\nIndoor Sleepovers and Lounges\nTent Sleepover- Each A-Frame Tent set up requires approximately a 3ft by 6ft space\nLace Teepee Sleepover- Each Teepee set up requires approximately a 3.5ft by 6.5ft space\nOutdoor Sleepovers and Lounges\nStandard MEGALounge & MEGA GlampOut- 5M MEGATent- Requires a 25ft by 25ft grass area for staking (actual tent is 17ft diameter)\nDeluxe MEGALounge & MEGA GlampOut- 6M MEGATent- Requires a 32ft by 32ft grass area for staking (actual tent is 20ft in diameter)\nThe MEGATent must be set up on a flat grass surface. Non grass surfaces (pavement, stone, turf, sand, etc.) will require sandbags for an additional fee of $150. This must be disclosed at the time of booking.\nDining\nCelebrations Picnics- We recommend a 8ft x 10ft space for a table of 8. Please contact us for exact dimensions for larger parties.\nFarm Table Dining- Each Farm Table is 8ft x 3ft.\nDining in the Tent- 5M MEGATent requires a 25ft by 25ft grass area for staking (actual tent is 17ft diameter); 6M MEGATent requires a 32ft by 32ft grass area for staking (actual tent is 20ft in diameter)",
  },
  {
    question: "What if I don't have my final guest count yet?",
    answer:
      "We recommend booking for the maximum number of guests that you may have as we can not guarantee that additional items will be available. You have up until 2 weeks before your event (when your final payment is due) to make any changes.",
  },
  {
    question: "What if I need to cancel?",
    answer:
      "Cancellation 2 Weeks +\nIf you have to cancel or reschedule your event your 25% deposit may be used as a credit towards a new event within 13 months of your original event date. In addition, you are entitled to a refund of any amount paid above the 25% deposit.\nCancellations within 2 Weeks\nIf you are canceling your event within 2 weeks, your full payment may be used as a credit towards a new event within 13 months of your original event date.\nCancellations within 24 hours\nIf you are canceling your event within 24 hours of your scheduled delivery time, your full payment, minus a rescheduling fee, may be used as a credit towards a new event within 13 months of your original event date.",
  },
  {
    question: "When do you set up and pick up?",
    answer:
      "You will receive a confirmation email one week prior to your event with a 2 hour delivery and pick up window. We base our schedule on your event start/end time provided at time of booking, location, package, etc.\nDeliveries: Deliveries will begin at 8:00am for outdoor events and 9:00am for indoor events and go throughout the day. All sleepover packages will be set up by 4:00pm. Some deliveries may take place the day prior to your event depending on the schedule for that particular date.\nPick Ups: All Sleepover Packages- Pick ups will begin at 10:00am the next day and go throughout the day. All MEGATent Packages- Pick ups will begin at 8:00am the next day and go throughout the day. Picnic Packages- pick up scheduling depends on guest counts, package type, location, weather and other scheduled events. Guaranteed specific delivery/pick up times may incur additional fees and must be requested via email no later than 2 weeks before your event.",
  },
  {
    question: "How is everything cleaned?",
    answer:
      "Every item is thoroughly cleaned and sanitized between events: linens are freshly laundered, mattresses and cushions are wiped down and deodorized, and tents are fully disinfected. Everything arrives fresh and ready for your celebration.",
  },
]

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
  onOpenDetails,
}: {
  variants: PackageVariant[]
  namespace: string
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
}

export function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const pkg = slug ? getPackageBySlug(slug) : undefined
  const [activeVariant, setActiveVariant] = useState<ActiveVariant | null>(null)

  if (!pkg) {
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

  const relatedPackages = getRelatedPackages(pkg, 3)
  const Icon = getTagIcon(pkg.tags[0])
  const heroImage = pkg.images[0]
  const accentImage = pkg.images[1] ?? pkg.images[0]
  const gallery = getPackageGallery(pkg.slug)
  const fallbackPhoto = getPackagePhoto(pkg.slug)
  const galleryImages = gallery.length > 0 ? gallery : fallbackPhoto ? [fallbackPhoto] : []

  return (
    <>
      <PageHero
        title={pkg.name}
        variant="photo"
        photoHeightClassName="h-64 sm:h-72"
        titleWeightClassName="font-normal"
        photoOverlayClassName="bg-black/60"
        photoSeed={heroImage?.seed ?? pkg.slug}
        photoAlt={heroImage?.alt ?? pkg.name}
        photoIcon={Icon}
        photoSrc={getPackageHeroPhoto(pkg.slug)}
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
                {pkg.priceTiers.map((tier) => (
                  <li key={tier.label} className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="leading-snug text-body">
                      {tier.label}
                      {tier.price > 0 ? `: $${tier.price}` : ""}
                      {tier.note ? ` (${tier.note})` : ""}
                    </span>
                  </li>
                ))}
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

            {accentImage ? (
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
                  <PackageImageCarousel images={galleryImages} alt={accentImage.alt} seed={accentImage.seed} icon={Icon} />
                </div>
              </motion.div>
            ) : null}
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
              onOpenDetails={(variant) => setActiveVariant({ variant, namespace: `theme-${pkg.slug}`, label: "Theme" })}
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
              onOpenDetails={(variant) => setActiveVariant({ variant, namespace: `addon-${pkg.slug}`, label: "Add-On" })}
            />
            <div className="mt-8 flex justify-center">
              <Button kind="link" to="/packages/add-ons" variant="primary">
                View All Add-Ons
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-white bg-cover bg-center bg-no-repeat py-14 sm:py-20" style={{ backgroundImage: "url(/media/gray-bg-shapes.png)" }}>
        <Container>
          <SectionHeading title="Frequently Asked" scriptSuffix="Questions" />
          <div className="mx-auto mt-10 max-w-5xl">
            {PACKAGE_FAQS.map((faq) => (
              <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Container>
      </section>

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
        onClose={() => setActiveVariant(null)}
      />
    </>
  )
}
