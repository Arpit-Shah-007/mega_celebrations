import type { ReactNode } from "react"
import { useState } from "react"
import { ChevronUp } from "lucide-react"

interface ModalAccordionSectionProps {
  title: string
  children: ReactNode
}

/** Collapsible section used inside item detail modals (Description, Details, Pricing). */
export function ModalAccordionSection({ title, children }: ModalAccordionSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between bg-graytint px-4 py-2.5 text-left"
      >
        <span className="font-bold text-navy">{title}</span>
        <ChevronUp className={`h-4 w-4 text-navy transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
      {open ? <div className="flex flex-col gap-2 px-4 py-3">{children}</div> : null}
    </div>
  )
}
