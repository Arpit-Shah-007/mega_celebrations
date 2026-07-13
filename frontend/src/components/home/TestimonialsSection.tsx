import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Reveal } from "@/components/ui/Reveal"
import { testimonials } from "@/data/testimonials"

const AUTO_SLIDE_INTERVAL_MS = 4500
const SLIDE_DURATION_MS = 500

function GoogleG({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24z"
      />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38z" />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  )
}

/** How many cards are visible at once, responsive to viewport width. */
function useVisibleCount() {
  const [count, setCount] = useState(3)
  useEffect(() => {
    function update() {
      const width = window.innerWidth
      setCount(width < 640 ? 1 : width < 1024 ? 2 : 3)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return count
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  return (
    <div className="relative flex h-64 flex-col items-center gap-3 rounded-2xl border border-border bg-white p-5 text-center shadow-soft">
      <GoogleG className="absolute right-3 top-3 h-4 w-4" />
      <div className="flex gap-0.5 text-blue">
        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
          <Star key={starIndex} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="line-clamp-5 text-sm leading-relaxed text-body">{testimonial.quote}</p>
      <p className="mt-auto text-sm font-bold uppercase tracking-wide text-navy">{testimonial.name}</p>
    </div>
  )
}

/**
 * Matches the live site's "Our Clients Testimonials" section: a round (infinite) slider
 * showing several cards at once, advancing smoothly one card at a time — one card leaves
 * from the left edge while the next one enters from the right — auto-sliding, with dot
 * pagination (no arrows), same sliding mechanic as the "Browse Our Packages" carousel.
 */
export function TestimonialsSection() {
  const visible = useVisibleCount()
  // extended = [tail clones][real items][head clones], so the strip can slide seamlessly
  // past either end and then jump back without animation once it lands in the clone zone.
  const extended = [...testimonials.slice(-visible), ...testimonials, ...testimonials.slice(0, visible)]
  const [index, setIndex] = useState(visible)
  const [animated, setAnimated] = useState(true)

  // Reset to a clean starting position whenever the responsive card count changes.
  useEffect(() => {
    setAnimated(false)
    setIndex(visible)
  }, [visible])

  useEffect(() => {
    const id = setInterval(() => {
      setAnimated(true)
      setIndex((current) => current + 1)
    }, AUTO_SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  // After sliding into the cloned zone at either end, snap back invisibly to the matching
  // real position once the transition has finished.
  useEffect(() => {
    if (index >= testimonials.length + visible) {
      const timer = setTimeout(() => {
        setAnimated(false)
        setIndex(index - testimonials.length)
      }, SLIDE_DURATION_MS)
      return () => clearTimeout(timer)
    }
    if (index < visible) {
      const timer = setTimeout(() => {
        setAnimated(false)
        setIndex(index + testimonials.length)
      }, SLIDE_DURATION_MS)
      return () => clearTimeout(timer)
    }
  }, [index, visible])

  // Re-enable the transition on the next frame after a silent snap.
  useEffect(() => {
    if (!animated) {
      const raf = requestAnimationFrame(() => setAnimated(true))
      return () => cancelAnimationFrame(raf)
    }
  }, [animated])

  const activeDot = (((index - visible) % testimonials.length) + testimonials.length) % testimonials.length

  const goTo = (dotIndex: number) => {
    setAnimated(true)
    setIndex(visible + dotIndex)
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <Reveal direction="bottom-to-top">
          <SectionHeading title="Our Clients" scriptSuffix="Testimonials" />

          <div className="relative mt-12 overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${index * (100 / visible)}%)`,
                transition: animated ? `transform ${SLIDE_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)` : "none",
              }}
            >
              {extended.map((testimonial, position) => (
                <div key={position} className="shrink-0 px-3" style={{ width: `${100 / visible}%` }}>
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-0">
            {testimonials.map((item, dotIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Show testimonial ${dotIndex + 1}`}
                aria-current={dotIndex === activeDot}
                className="cursor-pointer p-1"
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full transition ${dotIndex === activeDot ? "bg-pink" : "bg-navy/20 hover:bg-navy/40"}`}
                />
              </button>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
