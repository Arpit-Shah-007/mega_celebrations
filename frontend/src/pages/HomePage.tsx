import { Hero } from "@/components/home/Hero"
import { PackageCarousel } from "@/components/home/PackageCarousel"
import { HowToBookSection } from "@/components/home/HowToBookSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { AboutTeaserSection } from "@/components/home/AboutTeaserSection"

export function HomePage() {
  return (
    <>
      <Hero />
      <PackageCarousel />
      <HowToBookSection />
      <TestimonialsSection />
      <AboutTeaserSection />
    </>
  )
}
