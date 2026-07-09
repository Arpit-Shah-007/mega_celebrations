import { useState } from "react"
import { uploadImage } from "@/lib/adminApi"
import { Field } from "@/admin/components/AdminForm"

interface ImageUploadFieldProps {
  label: string
  currentUrl: string
  onUploaded: (url: string) => void
}

export function ImageUploadField({ label, currentUrl, onUploaded }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setError(null)
    try {
      const { url } = await uploadImage(file)
      onUploaded(url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.")
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {currentUrl ? (
          <img src={currentUrl} alt="" className="h-16 w-16 object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center bg-slate-100 text-[10px] text-slate-400">
            No image
          </div>
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} disabled={isUploading} className="text-sm" />
        {isUploading ? <span className="text-xs text-slate-500">Uploading…</span> : null}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </Field>
  )
}
