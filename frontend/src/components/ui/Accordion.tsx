import { AnimatePresence, motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { useId, useState } from "react"

interface AccordionItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

const URL_PATTERN = /https?:\/\/\S+/g

/** Some FAQ answers (e.g. a package's space-requirements PDF) embed a bare URL — render it as a real link instead of inert text. */
function renderAnswer(answer: string) {
  const parts = answer.split(URL_PATTERN)
  const urls = answer.match(URL_PATTERN) ?? []
  return parts.flatMap((part, index) => [
    part,
    urls[index] ? (
      <a
        key={index}
        href={urls[index]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue underline hover:no-underline"
      >
        {urls[index]}
      </a>
    ) : null,
  ])
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className="border-t border-blue/20 last:border-b">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
          open ? "bg-blue" : "bg-transparent"
        }`}
      >
        <span className={`font-bold ${open ? "text-white" : "text-navy"}`}>{question}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            open ? "bg-white text-blue" : "bg-blue text-white"
          }`}
        >
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden bg-white"
          >
            <p className="whitespace-pre-line px-5 pb-4 pt-4 leading-relaxed text-body">{renderAnswer(answer)}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
