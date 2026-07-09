import { useState } from "react"
import { useParams } from "react-router-dom"
import { Container } from "@/components/ui/Container"
import { PageHero } from "@/components/ui/PageHero"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { CatalogItemCard } from "@/components/packages/CatalogItemCard"
import { CatalogItemModal } from "@/components/packages/CatalogItemModal"
import { getAddOnBySlug } from "@/data/addOns"
import { getAddOnIcon } from "@/components/packages/tagIcons"
import { getAddOnPhoto } from "@/data/realPhotos"
import type { CatalogItem } from "@/types"

export function AddOnCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = slug ? getAddOnBySlug(slug) : undefined
  const [activeItem, setActiveItem] = useState<CatalogItem | null>(null)

  if (!category) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="text-3xl text-navy">Add-on category not found</h1>
        <p className="text-body">
          We couldn&apos;t find that category. It may have been renamed or is no longer offered.
        </p>
        <Button kind="link" to="/packages/add-ons" variant="primary">
          Browse all add-ons
        </Button>
      </Container>
    )
  }

  const Icon = getAddOnIcon(category.slug)

  return (
    <>
      <PageHero
        variant="photo"
        title={category.name}
        photoHeightClassName="h-64 sm:h-72"
        photoSeed={`addon-${category.slug}`}
        photoAlt={`${category.name} add-ons`}
        photoIcon={Icon}
        photoSrc={getAddOnPhoto(category.slug)}
        photoOverlayClassName="bg-black/50"
      />

      <section className="py-16 sm:py-20">
        <Container className="text-center">
          <SectionHeading align="center" title="About Our" scriptSuffix={category.name} description={category.description} />

          <div className="mx-auto mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {category.items.map((item, index) => (
              <CatalogItemCard
                key={item.slug}
                name={item.name}
                price={item.price}
                image={item.image}
                namespace={category.slug}
                delay={Math.min(index * 0.05, 0.3)}
                onOpenDetails={() => setActiveItem(item)}
              />
            ))}
          </div>
        </Container>
      </section>

      <CatalogItemModal item={activeItem} namespace={category.slug} onClose={() => setActiveItem(null)} />
    </>
  )
}
