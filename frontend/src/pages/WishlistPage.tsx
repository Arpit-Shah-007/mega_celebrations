import { useState } from "react"
import { motion } from "framer-motion"
import { PageHero } from "@/components/ui/PageHero"
import { Container } from "@/components/ui/Container"
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist"
import { WishlistSummary } from "@/components/wishlist/WishlistSummary"
import { QuoteForm } from "@/components/wishlist/QuoteForm"
import { QuoteSuccessPanel } from "@/components/wishlist/QuoteSuccessPanel"
import { useWishlist } from "@/context/useWishlist"
import { useToast } from "@/context/useToast"
import { submitQuoteInquiry } from "@/lib/api"
import type { QuoteFormValues } from "@/types"

export function WishlistPage() {
  const { items, removeItem, clear } = useWishlist()
  const { showToast } = useToast()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitQuote = async (values: QuoteFormValues) => {
    await submitQuoteInquiry(values, items)
    setSubmitted(true)
    clear()
    showToast("Your quote request has been sent!")
  }

  return (
    <>
      <PageHero variant="navy" title="Your Wishlist" />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          {submitted ? (
            <QuoteSuccessPanel />
          ) : items.length === 0 ? (
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
                <QuoteForm onSubmitQuote={handleSubmitQuote} />
              </motion.div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
