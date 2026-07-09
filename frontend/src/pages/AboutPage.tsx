import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { FounderStory } from "@/components/about/FounderStory"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"

export function AboutPage() {
  return (
    <>
      <PageHero variant="navy" title="About Us" />
      <FounderStory />
      <TestimonialsSection />

      <section
        className="bg-navy bg-cover bg-center py-10 sm:py-14"
        style={{ backgroundImage: "url(/media/how-to-book-background.png)" }}
      >
        <Container className="text-center">
          <h2 className="text-3xl sm:text-4xl text-white">
            <span className="block">Browse Our Packages to Find</span>
            <span className="mt-4 block">
              the Right <span className="font-script text-4xl sm:text-5xl text-white">Party for You!</span>
            </span>
          </h2>
          <div className="mt-10 flex justify-center">
            <Button kind="link" to="/packages" size="lg">
              Browse Packages
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
