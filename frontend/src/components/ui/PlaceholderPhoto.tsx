import type { LucideIcon } from "lucide-react"
import { ImageIcon } from "lucide-react"
import { hashSeed } from "@/lib/hash"

const GRADIENTS = ["from-navy/90 via-blue/80 to-navy-deep/90", "from-pink/90 via-pink-dark/80 to-navy/85"]

interface PlaceholderPhotoProps {
  seed: string
  alt: string
  icon?: LucideIcon
  className?: string
  label?: string
  /** Once real photography is available, pass its imported URL here and this renders a real <img> instead of a placeholder. */
  src?: string
}

/**
 * Stands in for real product photography, which does not exist yet for
 * this rebuild (see plan_v1.md). Deterministic per-seed gradient + icon so
 * the same package always renders the same placeholder, styled to look
 * intentional rather than a broken image. Pass `src` once a real photo is
 * available to swap this for an actual <img> with no other changes needed.
 */
export function PlaceholderPhoto({ seed, alt, icon: Icon = ImageIcon, className = "", label, src }: PlaceholderPhotoProps) {
  if (src) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />
  }

  const gradient = GRADIENTS[hashSeed(seed) % GRADIENTS.length]
  // Tailwind resolves conflicting position utilities by stylesheet order, not
  // by which class appears last in the string, so a caller passing "absolute"
  // (e.g. for a full-bleed hero) would silently lose to this component's own
  // "relative" and collapse to its content size instead of filling the parent.
  // Only default to "relative" when the caller hasn't specified a position.
  const hasPositionOverride = /(^|\s)(absolute|fixed|sticky|static)(\s|$)/.test(className)

  return (
    <div
      role="img"
      aria-label={alt}
      className={`${hasPositionOverride ? "" : "relative"} flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 35%)",
        }}
      />
      <Icon className="relative h-10 w-10 text-white/90 drop-shadow-sm" strokeWidth={1.5} />
      {label ? <span className="relative mt-2 px-4 text-center text-sm font-semibold text-white/90">{label}</span> : null}
    </div>
  )
}
