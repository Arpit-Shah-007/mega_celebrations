import type { ReactNode } from "react"

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-300 px-5 sm:px-8 lg:px-15 ${className}`}>{children}</div>
}
