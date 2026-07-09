import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { revealVariants, revealViewport, type RevealDirection } from "@/lib/animation"

interface RevealProps {
  children: ReactNode
  direction?: RevealDirection
  className?: string
}

/** Scroll-triggered reveal matching the live site's Enfold animation, for sections with no existing motion element. */
export function Reveal({ children, direction = "fade-in", className }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={revealVariants[direction]}
      className={className}
    >
      {children}
    </motion.div>
  )
}
