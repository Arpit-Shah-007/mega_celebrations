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
      <section className="bg-offwhite py-10 sm:py-14">
        {items.length === 0 ? (
          <Container className="max-w-3xl">
            <EmptyWishlist />
          </Container>
        ) : (
          // One column at every width: picks first, then the form. The same
          // order the page has always had on mobile, now kept on desktop too
          // rather than splitting into a rail beside the form.
          <Container>
            <div className="flex flex-col gap-6">
              {/* Fade only, no vertical slide — a position offset here briefly puts the
                  panel's remove buttons somewhere other than where they are about to
                  render, so a click right after mount can land on the wrong element. */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ENTER}>
                <WishlistPanel items={items} onRemove={removeItem} onClear={clear} />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...ENTER, delay: 0.1 }}>
                <HoneyBookInquiryForm items={items} />
              </motion.div>
            </div>
          </Container>
        )}
      </section>
    </>
  )
}
