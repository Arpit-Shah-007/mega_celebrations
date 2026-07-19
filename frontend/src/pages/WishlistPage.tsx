import { motion } from "framer-motion"
import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist"
import { WishlistSummary } from "@/components/wishlist/WishlistSummary"
import { WishlistSelectionsSummary } from "@/components/wishlist/WishlistSelectionsSummary"
import { HoneyBookEmbed } from "@/components/wishlist/HoneyBookEmbed"
import { useWishlist } from "@/context/useWishlist"

export function WishlistPage() {
  const { items, removeItem } = useWishlist()

  return (
    <>
      <PageHero variant="navy" title="Your Wishlist" />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          {items.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <WishlistSummary items={items} onRemove={removeItem} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-xl sm:text-2xl">Request Your Custom Quote</h2>
                <p className="mt-2 text-sm text-body">
                  Tell us a bit about your event and we'll price out everything on your wishlist.
                </p>
                <div className="mt-6">
                  <WishlistSelectionsSummary items={items} />
                </div>
                <HoneyBookEmbed />
              </motion.div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
