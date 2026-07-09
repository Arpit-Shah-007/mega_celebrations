import { useForm } from "react-hook-form"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { QuoteFormValues } from "@/types"

interface QuoteFormProps {
  onSubmitQuote: (values: QuoteFormValues) => Promise<void>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FieldConfig {
  name: keyof Omit<QuoteFormValues, "notes">
  label: string
  type: string
  placeholder: string
  autoComplete?: string
}

const REQUIRED_FIELDS: FieldConfig[] = [
  { name: "name", label: "Full name", type: "text", placeholder: "Jane Doe", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "jane@example.com", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "(908) 555-0123", autoComplete: "tel" },
  { name: "eventDate", label: "Event date", type: "date", placeholder: "" },
  { name: "venue", label: "Venue / address", type: "text", placeholder: "Backyard, park, or venue address" },
  { name: "guestCount", label: "Guest count", type: "text", placeholder: "e.g. 8 kids" },
]

export function QuoteForm({ onSubmitQuote }: QuoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({ mode: "onBlur" })

  const onSubmit = async (values: QuoteFormValues) => {
    await onSubmitQuote(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {REQUIRED_FIELDS.map((field) => {
          const errorId = `${field.name}-error`
          const fieldError = errors[field.name]
          return (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label htmlFor={field.name} className="text-sm font-bold text-navy">
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                aria-invalid={fieldError ? "true" : "false"}
                aria-describedby={fieldError ? errorId : undefined}
                className={`border bg-white px-4 py-2.5 text-navy outline-none transition-colors placeholder:text-body/50 focus:ring-2 focus:ring-pink/40 ${
                  fieldError ? "border-pink-dark" : "border-navy/20 focus:border-pink"
                }`}
                {...register(field.name, {
                  required: `${field.label} is required.`,
                  ...(field.name === "email"
                    ? { pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address." } }
                    : {}),
                })}
              />
              {fieldError ? (
                <p id={errorId} role="alert" className="text-sm text-pink-dark">
                  {fieldError.message}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-bold text-navy">
          Special requests or theme <span className="font-normal text-body">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={4}
          placeholder="Tell us about the theme, colors, or anything else on your wishlist..."
          className="resize-none border border-navy/20 bg-white px-4 py-2.5 text-navy outline-none transition-colors placeholder:text-body/50 focus:border-pink focus:ring-2 focus:ring-pink/40"
          {...register("notes")}
        />
      </div>

      <Button kind="action" type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending your request&hellip;
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Request My Custom Quote
          </>
        )}
      </Button>
    </form>
  )
}
