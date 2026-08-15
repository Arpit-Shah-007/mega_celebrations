import { motion } from "framer-motion"
import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist"
import { WishlistPanel } from "@/components/wishlist/WishlistPanel"
import { HoneyBookInquiryForm } from "@/components/wishlist/HoneyBookInquiryForm"
import { useWishlist } from "@/context/useWishlist"

const ENTER = { duration: 0.45, ease: [0.16, 1, 0.3, 1] } as const

export function WishlistPage() {
  const { items, clear, removeItem } = useWishlist()

  return (
    <>
      <PageHero variant="navy" title="Your Wishlist">
        <p className="mx-auto mt-3 max-w-md text-pretty px-6 text-sm text-white/75 sm:text-base">
          Review what you picked, then tell us about your event.
        </p>
      </PageHero>

      {/* Off-white ground so the white cards read as raised surfaces — on a white
          page they would need heavier borders to separate at all. */}
      <section className="bg-offwhite py-10 sm:py-14">
        {items.length === 0 ? (
          <Container className="max-w-3xl">
            <EmptyWishlist />
          </Container>
        ) : (
          // Deliberately not Container: that caps at 1200px, and the embedded
          // HoneyBook form is a fixed cross-origin iframe whose usable width is
          // the one thing we can still give it. A wider wrapper with slimmer
          // gutters buys the form a few hundred pixels beside the picks rail.
          <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-8">
              {/* Fade only, no vertical slide — a position offset here briefly puts the
                  rail's remove buttons somewhere other than where they are about to
                  render, so a click right after mount can land on the wrong element. */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={ENTER}
                className="lg:sticky lg:top-24 lg:self-start"
              >
                <WishlistPanel items={items} onRemove={removeItem} onClear={clear} />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...ENTER, delay: 0.1 }}>
                <HoneyBookInquiryForm items={items} />
              </motion.div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
