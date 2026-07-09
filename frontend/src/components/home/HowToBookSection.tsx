import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { realPhotos } from "@/data/realPhotos"
import { revealVariants, revealViewport } from "@/lib/animation"

const STEPS = [
  {
    icon: realPhotos.howToBookIcons.findPackage,
    text: 'Select your package and add it to your wishlist by clicking the "+" button. When you\'re done submit your wishlist with all your event details.',
  },
  {
    icon: realPhotos.howToBookIcons.confirm,
    text: "We will send over a customized quote and confirm all the details.",
  },
  {
    icon: realPhotos.howToBookIcons.setup,
    text: "On the day of your event we will arrive at your location to set up.",
  },
  {
    icon: realPhotos.howToBookIcons.pickup,
    text: "At the end of your event we return to pick up.",
  },
]

interface HowToBookSectionProps {
  /** The live site only shows this CTA on the homepage's "How to Book" section, not on Plan A Party's. */
  showFaqsCta?: boolean
}

/** Matches the live site's "How to Book" section (real step icons from the client's media), reused on Home and Plan A Party. */
export function HowToBookSection({ showFaqsCta = true }: HowToBookSectionProps) {
  return (
    <section
      className="bg-navy bg-cover bg-center py-14 sm:py-20"
      style={{ backgroundImage: "url(/media/how-to-book-background.png)" }}
    >
      <Container>
        <SectionHeading title="How to" scriptSuffix="Book" light />

        <div className="relative mt-16 grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.text}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={revealVariants["right-to-left"]}
              className="relative flex flex-col items-center text-center"
            >
              {index < STEPS.length - 1 ? (
                <div className="absolute left-1/2 top-12 hidden w-full items-center lg:flex" aria-hidden="true">
                  <div className="h-px flex-1 border-t border-dotted border-white/50" />
                  <ChevronRight className="mx-1 h-6 w-6 shrink-0 text-pink" strokeWidth={2.5} />
                  <div className="h-px flex-1 border-t border-dotted border-white/50" />
                </div>
              ) : null}
              <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white">
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 h-30 w-30 -translate-x-1/2 -translate-y-1/2"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="53"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="0.1 6"
                  />
                </svg>
                <img src={step.icon} alt="" className="h-12 w-auto object-contain" />
                <span className="absolute -right-1 -top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-pink text-sm font-bold text-white">
                  {index + 1}
                </span>
              </span>
              <p className="mt-6 max-w-72 text-sm leading-relaxed text-white/90 sm:text-base">{step.text}</p>
            </motion.div>
          ))}
        </div>

        {showFaqsCta ? (
          <div className="mt-16 flex justify-center">
            <Button kind="link" to="/faqs" size="lg">
              Read Our FAQs
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  )
}
