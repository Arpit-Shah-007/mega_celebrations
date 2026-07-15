import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useMutation } from "@tanstack/react-query"
import { Plus, X } from "lucide-react"
import { createCatalogItem, updateCatalogItem, uploadImage, type AdminCatalogItemRow, type CatalogItemInput } from "@/lib/adminApi"
import { slugify } from "@/lib/catalogItem"
import { AdminButton, Field, Input, TextArea } from "@/admin/components/AdminForm"

const MAX_IMAGES = 10

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

function initialImages(item: AdminCatalogItemRow | undefined): string[] {
  if (!item) return []
  return [item.imageUrl, ...(item.additionalImageUrls ?? [])].filter((url): url is string => Boolean(url))
}

/** Single form for both creating and editing a catalog item (A La Carte or an add-on category's items) — name, media, description, and price up front, matching how packages are created/edited. */
export function CatalogItemModal({ item, createContext, onClose, onSaved }: CatalogItemModalProps) {
  const [name, setName] = useState(item?.name ?? "")
  const [priceDollars, setPriceDollars] = useState(item?.priceCents != null ? String(item.priceCents / 100) : "")
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(item?.isPriceOnRequest ?? false)
  const [images, setImages] = useState<string[]>(() => initialImages(item))
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
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

  async function handleAddImage(file: File) {
    setIsUploading(true)
    setUploadError(null)
    try {
      const { url } = await uploadImage(file)
      setImages((current) => [...current, url])
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setIsUploading(false)
    }
  }

  function handleRemoveImage(index: number) {
    setImages((current) => current.filter((_, i) => i !== index))
  }

  const mutation = useMutation({
    mutationFn: () => {
      const priceCents = isPriceOnRequest || priceDollars.trim() === "" ? null : Math.round(Number(priceDollars) * 100)
      const descriptionLines = description
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
      const [primaryImage, ...restImages] = images

      if (item) {
        return updateCatalogItem(item.id, {
          name,
          priceCents,
          isPriceOnRequest,
          imageUrl: primaryImage ?? null,
          additionalImageUrls: restImages.length > 0 ? restImages : null,
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
        imageUrl: primaryImage ?? null,
        additionalImageUrls: restImages.length > 0 ? restImages : null,
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

  const canSubmit =
    name.trim().length > 0 &&
    images.length > 0 &&
    description.trim().length > 0 &&
    (isPriceOnRequest || priceDollars.trim().length > 0)

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
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
          <Field label="Name" required>
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field label="Media" required>
            <div className="flex flex-wrap gap-3 bg-graytint p-3">
              {images.map((url, index) => (
                <div key={url} className="flex shrink-0 flex-col items-center gap-1">
                  <img src={url} alt="" className="h-16 w-16 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="cursor-pointer text-[11px] font-semibold text-red-600 transition-colors hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES ? (
                <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center border-2 border-dashed border-border bg-white text-ui-gray transition-colors hover:border-blue hover:text-blue">
                  <Plus className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleAddImage(file)
                      e.target.value = ""
                    }}
                  />
                </label>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-ui-gray">
              {isUploading ? "Uploading…" : `${images.length}/${MAX_IMAGES} photos`}
            </p>
            {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
          </Field>

          <Field label="Description (each line shows as a bullet point)" required>
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
              <input
                type="checkbox"
                checked={isPriceOnRequest}
                onChange={(e) => {
                  const checked = e.target.checked
                  setIsPriceOnRequest(checked)
                  if (checked) setPriceDollars("")
                }}
              />
              Call for price
            </label>
          </div>
          {isPriceOnRequest ? (
            <p className="-mt-2 text-xs text-ui-gray">Shows as "Contact us for price." on the site instead of a dollar amount.</p>
          ) : null}

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
