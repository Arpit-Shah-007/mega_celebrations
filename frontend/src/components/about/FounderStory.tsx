import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import { Container } from "@/components/ui/Container"
import { businessInfo } from "@/data/nav"
import { realPhotos } from "@/data/realPhotos"
import { revealVariants, revealViewport } from "@/lib/animation"

/** Matches the live site's About Us page body: verbatim founder copy, family photo, signed off by Meg & Ty. */
export function FounderStory() {
  return (
    <section className="relative bg-graytint py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-8"
        style={{ backgroundImage: `url(${realPhotos.aboutBgTent})` }}
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            variants={revealVariants["fade-in"]}
          >
            <div className="space-y-5 text-base leading-relaxed text-body">
              <p>
                Mega Celebrations was created with the intent to make every celebration unforgettable. Whether it is
                a birthday, graduation, bridal shower or wedding, our goal is to help our customers provide a
                one-of-a-kind experience for their event!
              </p>
              <p>
                As a long time party lover I knew I always wanted to get into event planning. One day while
                scrolling through Pinterest I discovered a new party trend, sleepover tents. I brought the idea to
                my very handy husband and asked him to help me build our first set of sleepover tents. After some
                convincing he agreed to help! While I worked on creating themes and decor, Ty went to work in the
                wood shop building the perfect tents (and eventually tables). Since then we have expanded to add
                picnics, glamping tents, movie nights and more.
              </p>
              <p>
                In 2021, we launched our sister company{" "}
                <a
                  href={businessInfo.sisterCompany.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-pink hover:text-pink-dark"
                >
                  Little Buddies Soft Play
                </a>{" "}
                as a way to provide BIG fun for even the smallest of guests. Little Buddies provides soft play, ball
                pits and bounce houses that can be booked on their own or combined with one of our Mega
                Celebrations Packages.
              </p>
              <p>
                Whether it is a party for your kids or yourself (because adults deserve awesome parties too!), we
                can&rsquo;t wait to help make your event a MEGA Celebration!
              </p>
            </div>
            <p className="mt-8 font-script text-4xl text-pink">Meg &amp; Ty</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            variants={revealVariants["left-to-right"]}
            className="relative"
          >
            <div className="absolute -bottom-2 -right-2 h-32 w-2.5 bg-blue" aria-hidden="true" />
            <div className="absolute -bottom-2 -right-2 h-2.5 w-32 bg-blue" aria-hidden="true" />
            <div
              className="relative h-96 w-full overflow-hidden sm:h-112"
              style={{ clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)" }}
            >
              <PlaceholderPhoto
                seed="about-page-family-photo"
                alt="Meg and Ty, the husband-and-wife founders of Mega Celebrations, with their family"
                icon={Users}
                src={realPhotos.aboutFamily}
                className="h-full w-full"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
