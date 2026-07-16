import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Field } from "@/admin/components/AdminForm"

interface MediaStripFieldProps {
  label: string
  required?: boolean
  images: string[]
  maxImages: number
  onAdd: (file: File) => Promise<void>
  onRemove: (index: number) => void
}

/** Thumbnail-strip photo picker (thumbnail + remove X, plus an add tile) — matches the
 * media field used for A La Carte / Add-On item photos, reused here for package images. */
export function MediaStripField({ label, required, images, maxImages, onAdd, onRemove }: MediaStripFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      await onAdd(file)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Field label={label} required={required}>
      <div className="flex flex-wrap gap-3 bg-graytint p-3">
        {images.map((url, index) => (
          <div key={url} className="relative h-16 w-16 shrink-0">
            <img src={url} alt="" className="h-16 w-16 object-cover" />
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label="Remove photo"
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < maxImages ? (
          <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center border-2 border-dashed border-border bg-white text-ui-gray transition-colors hover:border-blue hover:text-blue">
            <Plus className="h-5 w-5" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleAdd(file)
                e.target.value = ""
              }}
            />
          </label>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-ui-gray">
        {isUploading ? "Uploading…" : `${images.length}/${maxImages} photo${maxImages === 1 ? "" : "s"}`}
      </p>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </Field>
  )
}
