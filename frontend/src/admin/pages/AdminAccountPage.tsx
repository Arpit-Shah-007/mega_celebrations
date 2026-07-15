import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, X } from "lucide-react"
import { changeAdminCredentials, fetchAdminAccount } from "@/lib/adminApi"
import { AdminButton, Card, Field, Input } from "@/admin/components/AdminForm"

export function AdminAccountPage() {
  const { data: account, isPending } = useQuery({ queryKey: ["admin", "account"], queryFn: fetchAdminAccount })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Account</h1>

      <Card title="Login Credentials">
        {isPending || !account ? (
          <p className="text-sm text-ui-gray">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-1.5 border-border sm:border-r sm:pr-6">
              <span className="text-xs font-bold uppercase tracking-wide text-ui-gray">Name</span>
              <span className="text-lg text-body">{account.name}</span>
            </div>
            <div className="flex flex-col gap-1.5 border-border sm:border-r sm:pr-6">
              <span className="text-xs font-bold uppercase tracking-wide text-ui-gray">Username</span>
              <span className="text-lg text-body">{account.username}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-ui-gray">Password</span>
              <div className="flex items-center gap-3">
                <span className="text-lg tracking-widest text-body">••••••••</span>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  aria-label="Change password"
                  className="cursor-pointer text-ui-gray transition-colors hover:text-blue"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {isChangingPassword ? <ChangePasswordModal onClose={() => setIsChangingPassword(false)} /> : null}
    </div>
  )
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

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
    mutationFn: () => changeAdminCredentials({ currentPassword, newPassword }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "account"] })
      onClose()
    },
  })

  const passwordsMismatch = newPassword.length > 0 && newPassword !== confirmPassword
  const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && !passwordsMismatch

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Change password"
    >
      <div onClick={(event) => event.stopPropagation()} className="w-full max-w-sm bg-white">
        <div className="flex items-center justify-between bg-blue px-5 py-3">
          <span className="font-bold text-white">Change Password</span>
          <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer text-white transition-opacity hover:opacity-70">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
          className="flex flex-col gap-4 p-5 sm:p-6"
        >
          <Field label="Current Password">
            <Input
              autoFocus
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Field>
          <Field label="New Password">
            <Input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>
          <Field label="Confirm New Password">
            <Input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>

          {passwordsMismatch ? <p className="text-sm font-semibold text-red-600">New passwords do not match.</p> : null}
          {mutation.isError ? <p className="text-sm font-semibold text-red-600">{mutation.error.message}</p> : null}

          <AdminButton type="submit" variant="primary" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </AdminButton>
        </form>
      </div>
    </div>,
    document.body,
  )
}
