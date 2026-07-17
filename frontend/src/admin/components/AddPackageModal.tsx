import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useMutation } from "@tanstack/react-query"
import { X } from "lucide-react"
import { createAdminPackage } from "@/lib/adminApi"
import { ALL_PACKAGE_TAGS } from "@/types"
import { slugify } from "@/lib/catalogItem"
import { AdminButton, Field, Input, TextArea } from "@/admin/components/AdminForm"

interface AddPackageModalProps {
  nextSortOrder: number
  onClose: () => void
  onCreated: (packageId: number) => void
}

/** Collects just the required fields to create a package row; images/pricing/themes are added afterward in PackageEditModal, which opens automatically on success. */
export function AddPackageModal({ nextSortOrder, onClose, onCreated }: AddPackageModalProps) {
  const [name, setName] = useState("")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [capacity, setCapacity] = useState("")
  const [spaceRequirement, setSpaceRequirement] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const mutation = useMutation({
    mutationFn: () =>
      createAdminPackage({
        slug: slugify(name),
        name,
        tagline,
        description,
        tags,
        inclusions: [],
        capacity,
        spaceRequirement,
        priceIsPlaceholder: true,
        damageDepositCents: null,
        bundleDiscount: null,
        featured: false,
        sortOrder: nextSortOrder,
      }),
    onSuccess: (created) => onCreated(created.id),
  })

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

  const toggleTag = (tag: string) => {
    setTags((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]))
  }

  const canSubmit = name.trim() && tagline.trim() && description.trim() && capacity.trim() && spaceRequirement.trim()

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add package"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden bg-white"
      >
        <div className="flex shrink-0 items-center justify-between bg-blue px-5 py-3">
          <span className="font-bold text-white">New Package</span>
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
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Tagline" required>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </Field>
          <Field label="Description" required>
            <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Capacity" required>
              <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Up to 10 guests" />
            </Field>
            <Field label="Space Requirement" required>
              <Input value={spaceRequirement} onChange={(e) => setSpaceRequirement(e.target.value)} placeholder="10ft x 10ft" />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3">
            {ALL_PACKAGE_TAGS.map((tag) => (
              <label key={tag} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" checked={tags.includes(tag)} onChange={() => toggleTag(tag)} />
                {tag}
              </label>
            ))}
          </div>

          {mutation.isError ? <p className="text-sm font-semibold text-red-600">{mutation.error.message}</p> : null}

          <p className="text-xs text-ui-gray">Media, pricing, themes, and FAQs can be added next, right after this is created.</p>

          <AdminButton type="submit" variant="primary" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? "Creating…" : "Create & Continue"}
          </AdminButton>
        </form>
      </div>
    </div>,
    document.body,
  )
}
