import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Button } from "@/components/ui/Button"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import { realPhotos } from "@/data/realPhotos"
import { revealVariants, revealViewport } from "@/lib/animation"

/** Matches the live site's home page "About Us" teaser (short version; the full story lives on the About page). */
export function AboutTeaserSection() {
  return (
    <section className="relative bg-graytint py-12 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-8"
        style={{ backgroundImage: `url(${realPhotos.aboutBgTent})` }}
        aria-hidden="true"
      />
      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealVariants["fade-in"]}
        >
          <SectionHeading title="About" scriptSuffix="Us" align="left" />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-body">
            <p>
              Mega Celebrations was created with the intent to make every celebration extraordinary. Whether it is a birthday,
              graduation, bridal shower or wedding, our goal is to help our customers provide a one-of-a-kind experience for
              their event!
            </p>
            <p>
              As a Pinterest obsessed mom, I partnered with my DIY husband to create unforgettable event experiences. While I
              worked on creating themes and decor, Ty went to work in the wood shop building the perfect tents and tables. We
              have created so many wonderful memories since we started the business in 2018 and plan to continue making all
              our future events MEGA Celebrations!
            </p>
          </div>
          <Button kind="link" to="/about" className="mt-6">
            Learn More
          </Button>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealVariants["left-to-right"]}
          className="relative"
        >
          {/*
            Painted first (not via negative z-index) because a negative z-index child
            escapes behind non-positioned ancestors' backgrounds when no stacking context
            is established in between — it would render fully hidden behind the page,
            not just behind the photo. Natural DOM paint order keeps it reliably behind.
            Just two short segments at the corner, not a full frame around the photo.
          */}
          <div className="absolute -bottom-2 -right-2 h-32 w-2.5 bg-blue" aria-hidden="true" />
          <div className="absolute -bottom-2 -right-2 h-2.5 w-32 bg-blue" aria-hidden="true" />
          <div
            className="relative h-96 w-full overflow-hidden"
            style={{ clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)" }}
          >
            <PlaceholderPhoto
              seed="founders-family-photo"
              alt="Meg and Ty, the founders of Mega Celebrations, with their family"
              icon={Users}
              src={realPhotos.aboutFamily}
              className="h-full w-full"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
