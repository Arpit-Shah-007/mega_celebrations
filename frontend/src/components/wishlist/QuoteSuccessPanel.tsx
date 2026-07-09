import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function QuoteSuccessPanel() {
  return (
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
      <h2 className="mt-6 text-2xl text-white sm:text-3xl">Your quote request is on its way to us</h2>
      <p className="mt-3 max-w-md text-base leading-relaxed text-white/75">
        Thanks for sharing your wishlist! We'll put together your custom quote and send it to your inbox within
        1-2 business days.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button kind="link" to="/packages" variant="outline" className="border-white text-white hover:bg-white hover:text-navy">
          Keep Browsing Packages
        </Button>
        <Button kind="link" to="/">
          Back To Home
        </Button>
      </div>
    </motion.div>
  )
}
