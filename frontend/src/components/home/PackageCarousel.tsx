import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Reveal } from "@/components/ui/Reveal"
import { PackageCard } from "@/components/packages/PackageCard"
import { PageLoadingState, PageErrorState } from "@/components/ui/PageLoadingState"
import { fetchPackages } from "@/lib/api"

const VISIBLE = 4

/**
 * Matches the live site's home page "Browse Our Packages" carousel: arrows page through a
 * full set of 4 cards at a time, sliding the page in from one side and out the other. Loops
 * around at both ends (round scroll) instead of stopping at the first/last page.
 */
export function PackageCarousel() {
  const [start, setStart] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const { data: packages, isPending, isError } = useQuery({ queryKey: ["packages"], queryFn: fetchPackages })

  if (isPending) return <PageLoadingState />
  if (isError || !packages) return <PageErrorState />

  const pageCount = Math.ceil(packages.length / VISIBLE)
  const maxStart = (pageCount - 1) * VISIBLE

  const visible = packages.slice(start, start + VISIBLE)

  const goToPrevious = () => {
    setDirection(-1)
    setStart((s) => (s === 0 ? maxStart : s - VISIBLE))
  }

  const goToNext = () => {
    setDirection(1)
    setStart((s) => (s >= maxStart ? 0 : s + VISIBLE))
  }

  return (
    <section className="bg-white py-10 sm:py-16">
      <Container>
        <Reveal direction="bottom-to-top">
          <SectionHeading title="Browse Our" scriptSuffix="Packages" />

          {/* Outer wrapper hosts the arrows at its own (unpadded) edges. The card grid lives in
              an inner box that's padded in from those same edges by MORE than the arrow's own
              footprint (icon + button padding), so the two can never overlap — verified against
              each breakpoint's numbers below, not just eyeballed. */}
          <div className="relative mt-8">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous packages"
              className="absolute left-0 top-1/2 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center p-1 text-navy/40 transition hover:text-navy sm:p-1 lg:p-2"
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 lg:h-10 lg:w-10" strokeWidth={1.5} />
            </button>

            <div className="px-9 sm:px-10 lg:px-16">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={start}
                    initial={{ x: direction === 1 ? "100%" : "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction === 1 ? "-100%" : "100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    {visible.map((pkg) => (
                      <PackageCard key={pkg.slug} pkg={pkg} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next packages"
              className="absolute right-0 top-1/2 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center p-1 text-navy/40 transition hover:text-navy sm:p-1 lg:p-2"
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 lg:h-10 lg:w-10" strokeWidth={1.5} />
            </button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
