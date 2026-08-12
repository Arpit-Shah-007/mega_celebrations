import { useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { useWishlist } from "@/context/useWishlist"

/**
 * The old HoneyBook placement widget redirected the whole browser tab here on
 * a successful submission, which is why clearing the wishlist lives on this
 * page. The wishlist page now embeds the hosted inquiry form in an iframe, and
 * that form shows its own thank-you screen inside the frame without ever
 * navigating the top-level tab — so nothing routes here automatically anymore
 * and the wishlist survives a submission. Kept as a working destination for
 * the HoneyBook redirect setting, should it be pointed back at this path.
 */
export function ContactThankYouPage() {
  const { clear } = useWishlist()

  useEffect(() => {
    clear()
  }, [clear])

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex max-w-xl flex-col items-center bg-navy px-6 py-14 text-center text-white sm:px-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-pink/20"
          >
            <CheckCircle2 className="h-9 w-9 text-pink" strokeWidth={1.5} />
          </motion.div>
          <h1 className="mt-6 text-2xl text-white sm:text-3xl">Your request is on its way to us</h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-white/75">
            Thanks for reaching out! We'll review your event details and get back to you soon.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              kind="link"
              to="/packages"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-navy"
            >
              Keep Browsing Packages
            </Button>
            <Button kind="link" to="/">
              Back To Home
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
