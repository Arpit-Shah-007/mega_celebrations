import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react"

export function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-navy">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  "border border-border bg-white px-3 py-2 text-sm text-body outline-none transition-colors focus:border-blue"

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} ${props.className ?? ""}`} />
}

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
}

export function AdminButton({ variant = "secondary", className = "", ...rest }: AdminButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-pink text-white hover:bg-blue"
      : variant === "danger"
        ? "border border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
        : "border border-navy/30 text-navy hover:bg-navy hover:text-white"

  return (
    <button
      type="button"
      {...rest}
      className={`cursor-pointer px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${variantClass} ${className}`}
    />
  )
}

export function Card({ title, children, action }: { title: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="border-t-4 border-blue bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

/** Small uppercase pill for counts/statuses — used across admin tables and the dashboard. */
export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "pink" | "blue"; children: ReactNode }) {
  const toneClass =
    tone === "pink" ? "bg-pink/15 text-pink-dark" : tone === "blue" ? "bg-blue/10 text-blue" : "bg-graytint text-ui-gray"

  return <span className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${toneClass}`}>{children}</span>
}
