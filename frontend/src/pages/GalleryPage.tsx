import { useState } from "react"
import { Container } from "@/components/ui/Container"
import { PageHero } from "@/components/ui/PageHero"
import { GalleryGrid } from "@/components/gallery/GalleryGrid"
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox"
import { galleryPhotos } from "@/data/galleryPhotos"

export function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  function handleNext() {
    setLightboxIndex((current) => {
      if (current === null) return current
      return (current + 1) % galleryPhotos.length
    })
  }

  function handlePrev() {
    setLightboxIndex((current) => {
      if (current === null) return current
      return (current - 1 + galleryPhotos.length) % galleryPhotos.length
    })
  }

  return (
    <>
      <PageHero variant="navy" title="Gallery" />

      <section className="py-16 sm:py-20">
        <Container>
          <GalleryGrid images={galleryPhotos} onSelect={setLightboxIndex} />
        </Container>
      </section>

      <GalleryLightbox
        images={galleryPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  )
}
