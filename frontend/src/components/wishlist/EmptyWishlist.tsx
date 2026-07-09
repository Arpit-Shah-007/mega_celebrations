import { motion } from "framer-motion"
import { HeartCrack } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex max-w-lg flex-col items-center bg-graytint px-6 py-16 text-center sm:px-10"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink/12">
        <HeartCrack className="h-8 w-8 text-pink-dark" strokeWidth={1.5} />
      </div>
      <h2 className="mt-6 text-2xl sm:text-3xl">Your wishlist is empty</h2>
      <p className="mt-3 text-base leading-relaxed text-body">
        Browse our packages and tap the heart on anything you love — we'll keep it here so you can request a
        custom quote when you're ready.
      </p>
      <Button kind="link" to="/packages" size="lg" className="mt-8">
        Browse Packages
      </Button>
    </motion.div>
  )
}
