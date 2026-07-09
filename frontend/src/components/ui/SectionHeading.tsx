interface SectionHeadingProps {
  title: string
  /** Rendered in the pink script font, right after `title` (matches the live site's "Browse Our *Packages*" pattern). */
  scriptSuffix?: string
  /** Rendered in the title color, right after `scriptSuffix` (matches the live site's "About Our *A La Carte* Package" pattern). */
  titleSuffix?: string
  description?: string
  align?: "left" | "center"
  light?: boolean
}

export function SectionHeading({ title, scriptSuffix, titleSuffix, description, align = "center", light = false }: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left"
  const titleColor = light ? "text-white" : "text-navy"
  const scriptColor = light ? "text-white" : "text-pink"

  return (
    <div className={`max-w-2xl ${alignment}`}>
      <h2 className={`text-3xl sm:text-4xl ${titleColor}`}>
        {title} {scriptSuffix ? <span className={`font-script text-4xl sm:text-5xl ${scriptColor}`}>{scriptSuffix}</span> : null}
        {titleSuffix ? ` ${titleSuffix}` : null}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/85" : "text-body"}`}>{description}</p>
      ) : null}
    </div>
  )
}
