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
      <PageHero variant="navy" compact title="Your Wishlist">
        <p className="mx-auto mt-2 max-w-md text-pretty px-6 text-sm text-white/75">
          Review what you picked, then tell us about your event.
        </p>
      </PageHero>

      {/* Off-white ground so the white cards read as raised surfaces — on a white
          page they would need heavier borders to separate at all. */}
      {/* Tighter at the top than the bottom: the band above is a label for the
          picks right under it, so a wide gap there read as a break between two
          unrelated things. */}
      <section className="bg-offwhite pb-10 pt-5 sm:pb-14 sm:pt-7">
        {items.length === 0 ? (
          <Container className="max-w-3xl">
            <EmptyWishlist />
          </Container>
        ) : (
          // One column at every width: picks first, then the form. The same
          // order the page has always had on mobile, now kept on desktop too
          // rather than splitting into a rail beside the form.
          <div className="flex flex-col gap-6">
            {/* Picks run the full page width like the navy band above, instead of
                stopping at the container's 1200px — the three category columns
                inside want the room. Only the site's edge gutter is kept so the
                card still lines up with the header.

                Fade only, no vertical slide — a position offset here briefly puts
                the panel's remove buttons somewhere other than where they are about
                to render, so a click right after mount can land on the wrong one. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={ENTER}
              className="px-5 sm:px-8 lg:px-15"
            >
              <WishlistPanel items={items} onRemove={removeItem} onClear={clear} />
            </motion.div>

            <Container>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...ENTER, delay: 0.1 }}>
                <HoneyBookInquiryForm items={items} />
              </motion.div>
            </Container>
          </div>
        )}
      </section>
    </>
  )
}
