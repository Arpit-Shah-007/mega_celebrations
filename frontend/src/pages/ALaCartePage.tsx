import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { AccordionItem } from "@/components/ui/Accordion"
import { CatalogItemCard } from "@/components/packages/CatalogItemCard"
import { CatalogItemModal } from "@/components/packages/CatalogItemModal"
import { PageLoadingState, PageErrorState } from "@/components/ui/PageLoadingState"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { realPhotos } from "@/data/realPhotos"
import { fetchALaCarteItems } from "@/lib/api"
import type { CatalogItem } from "@/types"

const A_LA_CARTE_NAMESPACE = "a-la-carte"

/**
 * A La Carte is a real itemized catalog on the live site (confirmed
 * 2026-07-05 by fetching mega-celebrations.com/packages/a-la-carte/
 * directly), not a conceptual bridge page as an earlier pass assumed. It has
 * its own hero photo, an "About Our A La Carte Package" intro, four rental
 * items with real names/pricing, and a 4-question FAQ accordion (answers
 * pulled from the page's own schema.org markup, since the accordions render
 * collapsed by default).
 */

const A_LA_CARTE_FAQS = [
  {
    question: "How does the a la carte option work?",
    answer:
      "A la carte is the perfect option if you aren't looking for one of our full service packages. Select just the items you are interested in to build your own package.",
  },
  {
    question: "Can I pick up the items?",
    answer:
      "Certain items are available for pick up. Due to the size of certain items they are only available for delivery. There is a $400 delivery minimum. The delivery and pick up options will be noted in the item description.",
  },
  {
    question: "Is all of your inventory available A La Carte?",
    answer: "No, only certain items are available a la carte. Much of our inventory is reserved for our full service packages.",
  },
  {
    question: "Is there a delivery fee?",
    answer: "A delivery fee will be charged for all a la carte orders based on location.",
  },
]

export function ALaCartePage() {
  const [activeItem, setActiveItem] = useState<CatalogItem | null>(null)
  const {
    data: items,
    isPending,
    isError,
  } = useQuery({ queryKey: ["catalog-items", "a_la_carte"], queryFn: fetchALaCarteItems })

  if (isPending) return <PageLoadingState />
  if (isError || !items) return <PageErrorState />

  return (
    <>
      <PageHero
        variant="photo"
        title="A La Carte"
        photoHeightClassName="h-56 sm:h-64"
        photoSeed="a-la-carte-hero"
        photoAlt="Pink-toned sleepover teepee setup with blush pillows and throws, available a la carte"
        photoSrc={realPhotos.aLaCarteHero}
        photoOverlayClassName="bg-black/50"
      />

      <section className="py-16 sm:py-20">
        <Container className="text-center">
          <SectionHeading
            align="center"
            title="About Our"
            scriptSuffix="A La Carte"
            titleSuffix="Package"
            description="Not looking for a full service package? Create your own package by choosing your items individually. $400 delivery minimum, some items are available for pick up."
          />

          <div className="mx-auto mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <CatalogItemCard
                key={item.slug}
                name={item.name}
                price={item.price}
                image={item.image}
                namespace={A_LA_CARTE_NAMESPACE}
                delay={Math.min(index * 0.05, 0.3)}
                onOpenDetails={() => setActiveItem(item)}
              />
            ))}
          </div>
        </Container>
      </section>

      <section
        className="bg-white bg-cover bg-center bg-no-repeat py-16 sm:py-20"
        style={{ backgroundImage: "url(/media/gray-bg-shapes.png)" }}
      >
        <Container>
          <SectionHeading align="center" title="Frequently Asked" scriptSuffix="Questions" />

          <div className="mx-auto mt-10 max-w-5xl">
            {A_LA_CARTE_FAQS.map((faq) => (
              <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Container>
      </section>

      <TestimonialsSection />

      <CatalogItemModal item={activeItem} namespace={A_LA_CARTE_NAMESPACE} onClose={() => setActiveItem(null)} />
    </>
  )
}
