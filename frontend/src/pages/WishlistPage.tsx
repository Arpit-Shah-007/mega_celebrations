import { motion } from "framer-motion"
import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist"
import { WishlistPanel } from "@/components/wishlist/WishlistPanel"
import { HoneyBookEmbed } from "@/components/wishlist/HoneyBookEmbed"
import { useWishlist } from "@/context/useWishlist"

export function WishlistPage() {
  const { items, removeItem } = useWishlist()

  return (
    <>
      <PageHero variant="navy" title="Your Wishlist" />

      <section className="py-16 sm:py-20">
        <Container className={items.length === 0 ? "max-w-3xl" : "max-w-6xl"}>
          {items.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[420px_minmax(0,1fr)]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <WishlistPanel items={items} onRemove={removeItem} />
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
                  <HoneyBookEmbed />
                </div>
              </motion.div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
