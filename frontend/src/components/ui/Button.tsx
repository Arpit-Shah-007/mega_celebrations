import { Link } from "react-router-dom"
import type { MouseEventHandler, ReactNode } from "react"

type Variant = "primary" | "outline"
type Size = "sm" | "md" | "lg"

const VARIANT_CLASSES: Record<Variant, string> = {
  // Matches the live site's own CSS: .menu-button > a hover background is rgb(11,93,155) (blue), not a darker pink.
  primary: "bg-pink text-white hover:bg-blue",
  outline: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-5 py-2 text-xs",
  md: "px-7 py-3 text-sm",
  lg: "px-9 py-4 text-base",
}

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide transition-colors duration-200 ease-out cursor-pointer"

interface BaseButtonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

interface LinkButtonProps extends BaseButtonProps {
  kind: "link"
  to: string
  external?: boolean
}

interface ActionButtonProps extends BaseButtonProps {
  kind?: "action"
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: "button" | "submit"
  disabled?: boolean
  ariaLabel?: string
}

type ButtonProps = LinkButtonProps | ActionButtonProps

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`

  if (props.kind === "link") {
    return props.external ? (
      <a href={props.to} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    ) : (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.ariaLabel}
      className={classes}
    >
      {children}
    </button>
  )
}
