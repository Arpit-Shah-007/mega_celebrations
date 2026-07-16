import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useMutation } from "@tanstack/react-query"
import { X } from "lucide-react"
import { createAddonCategory, type AddonCategoryInput } from "@/lib/adminApi"
import { slugify } from "@/lib/catalogItem"
import { AdminButton, Field, Input, TextArea } from "@/admin/components/AdminForm"
import { ImageUploadField } from "@/admin/components/ImageUploadField"

interface AddonCategoryModalProps {
  sortOrder: number
  onClose: () => void
  onSaved: (createdId: number) => void
}

/** Add-only form for a new Add-On Category — nothing is written until "Add Category" is
 * clicked, matching CatalogItemModal's create/edit flow instead of writing a placeholder
 * row straight to the database on a single click. */
export function AddonCategoryModal({ sortOrder, onClose, onSaved }: AddonCategoryModalProps) {
  const [name, setName] = useState("")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [heroImageUrl, setHeroImageUrl] = useState("")
  const [cardImageUrl, setCardImageUrl] = useState("")

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const mutation = useMutation({
    mutationFn: () => {
      const input: AddonCategoryInput = {
        slug: `${slugify(name)}-${Date.now()}`,
        name,
        tagline,
        description,
        heroImageUrl,
        heroImageAlt: `${name} hero image`,
        cardImageUrl,
        cardImageAlt: `${name} card image`,
        sortOrder,
      }
      return createAddonCategory(input)
    },
    onSuccess: (created) => {
      onSaved(created.id)
      onClose()
    },
  })

  const canSubmit =
    name.trim().length > 0 &&
    tagline.trim().length > 0 &&
    description.trim().length > 0 &&
    heroImageUrl.length > 0 &&
    cardImageUrl.length > 0

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add category"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden bg-white"
      >
        <div className="flex shrink-0 items-center justify-between bg-blue px-5 py-3">
          <span className="font-bold text-white">New Category</span>
          <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer text-white transition-opacity hover:opacity-70">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
          className="flex flex-col gap-4 overflow-y-auto p-5 sm:p-6"
        >
          <Field label="Name" required>
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Decor" />
          </Field>

          <Field label="Tagline" required>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Short tagline shown on the category card"
            />
          </Field>

          <Field label="Description" required>
            <TextArea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Category description" />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageUploadField label="Hero (category page banner)" required currentUrl={heroImageUrl} onUploaded={setHeroImageUrl} />
            <ImageUploadField label="Card (Add-Ons hub thumbnail)" required currentUrl={cardImageUrl} onUploaded={setCardImageUrl} />
          </div>

          {mutation.isError ? <p className="text-sm font-semibold text-red-600">{mutation.error.message}</p> : null}

          <AdminButton type="submit" variant="primary" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Add Category"}
          </AdminButton>
        </form>
      </div>
    </div>,
    document.body,
  )
}
