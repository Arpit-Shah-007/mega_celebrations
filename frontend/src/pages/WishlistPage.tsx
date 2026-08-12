import { motion } from "framer-motion"
import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist"
import { WishlistPanel } from "@/components/wishlist/WishlistPanel"
import { HoneyBookInquiryForm } from "@/components/wishlist/HoneyBookInquiryForm"
import { useWishlist } from "@/context/useWishlist"

const ENTER = { duration: 0.45, ease: [0.16, 1, 0.3, 1] } as const

export function WishlistPage() {
  const { items, removeItem } = useWishlist()

  return (
    <>
      <PageHero variant="navy" title="Your Wishlist">
        <p className="mx-auto mt-3 max-w-md text-pretty px-6 text-sm text-white/75 sm:text-base">
          Review what you picked, then tell us about your event.
        </p>
      </PageHero>

      {/* Off-white ground so the white step cards read as raised surfaces — on a
          white page they would need heavier borders to separate at all. */}
      <section className="bg-offwhite py-12 sm:py-16">
        <Container className={items.length === 0 ? "max-w-3xl" : "max-w-6xl"}>
          {items.length === 0 ? (
            <EmptyWishlist />
          ) : (
            // Two numbered steps, stacked, each full width: the picks grid reads
            // across the page instead of down a narrow rail, and the embedded
            // form gets the whole container rather than a cramped column.
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={ENTER}>
                <WishlistPanel items={items} onRemove={removeItem} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ENTER, delay: 0.1 }}
              >
                <HoneyBookInquiryForm />
              </motion.div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
