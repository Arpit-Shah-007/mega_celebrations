import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useMutation } from "@tanstack/react-query"
import { X } from "lucide-react"
import { createCatalogItem, updateCatalogItem, type AdminCatalogItemRow, type CatalogItemInput } from "@/lib/adminApi"
import { slugify } from "@/lib/catalogItem"
import { AdminButton, Field, Input, TextArea } from "@/admin/components/AdminForm"
import { ImageUploadField } from "@/admin/components/ImageUploadField"

interface CreateContext {
  placement: "a_la_carte" | "add_on_category"
  addonCategoryId: number | null
  categoryBreadcrumb: string
  sortOrder: number
}

interface CatalogItemModalProps {
  item?: AdminCatalogItemRow
  createContext?: CreateContext
  onClose: () => void
  onSaved: () => void
}

/** Single form for both creating and editing a catalog item (A La Carte or an add-on category's items) — name, photo, description, and price up front, matching how packages are created/edited. */
export function CatalogItemModal({ item, createContext, onClose, onSaved }: CatalogItemModalProps) {
  const [name, setName] = useState(item?.name ?? "")
  const [priceDollars, setPriceDollars] = useState(item?.priceCents != null ? String(item.priceCents / 100) : "")
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(item?.isPriceOnRequest ?? false)
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "")
  const [description, setDescription] = useState((item?.description ?? []).join("\n"))

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
      const priceCents = isPriceOnRequest || priceDollars.trim() === "" ? null : Math.round(Number(priceDollars) * 100)
      const descriptionLines = description
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)

      if (item) {
        return updateCatalogItem(item.id, {
          name,
          priceCents,
          isPriceOnRequest,
          imageUrl: imageUrl || null,
          description: descriptionLines,
        })
      }

      if (!createContext) throw new Error("Missing create context")
      const input: CatalogItemInput = {
        placement: createContext.placement,
        addonCategoryId: createContext.addonCategoryId,
        slug: slugify(name),
        name,
        priceCents,
        isPriceOnRequest,
        categoryBreadcrumb: createContext.categoryBreadcrumb,
        imageUrl: imageUrl || null,
        additionalImageUrls: null,
        description: descriptionLines,
        details: null,
        pricing: [],
        sortOrder: createContext.sortOrder,
      }
      return createCatalogItem(input)
    },
    onSuccess: () => {
      onSaved()
      onClose()
    },
  })

  const canSubmit = name.trim().length > 0 && (isPriceOnRequest || priceDollars.trim().length > 0)

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item ? "Edit item" : "Add item"}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden bg-white"
      >
        <div className="flex shrink-0 items-center justify-between bg-blue px-5 py-3">
          <span className="font-bold text-white">{item ? "Edit Item" : "New Item"}</span>
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
          <Field label="Name">
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <ImageUploadField label="Photo" currentUrl={imageUrl} onUploaded={setImageUrl} />

          <Field label="Description (one bullet per line)">
            <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Field label="Price ($)">
                <Input
                  type="number"
                  disabled={isPriceOnRequest}
                  value={priceDollars}
                  onChange={(e) => setPriceDollars(e.target.value)}
                />
              </Field>
            </div>
            <label className="mb-2.5 flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={isPriceOnRequest} onChange={(e) => setIsPriceOnRequest(e.target.checked)} />
              Call for price
            </label>
          </div>

          {mutation.isError ? <p className="text-sm font-semibold text-red-600">{mutation.error.message}</p> : null}

          <AdminButton type="submit" variant="primary" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? "Saving…" : item ? "Save Changes" : "Add Item"}
          </AdminButton>
        </form>
      </div>
    </div>,
    document.body,
  )
}
