import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AdminButton } from "@/admin/components/AdminForm"

interface ConfirmDeleteModalProps {
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void | Promise<void>
}

/** Small, generic yes/no dialog for destructive actions — replaces window.confirm() across admin so deletes look and feel consistent. */
export function ConfirmDeleteModal({ title, message, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel()
    }
    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onCancel])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div onClick={(event) => event.stopPropagation()} className="w-full max-w-sm bg-white p-6">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        <p className="mt-2 text-sm text-ui-gray">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <AdminButton onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AdminButton>
          <AdminButton
            variant="danger"
            disabled={isDeleting}
            onClick={async () => {
              setIsDeleting(true)
              await onConfirm()
            }}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </AdminButton>
        </div>
      </div>
    </div>,
    document.body,
  )
}
