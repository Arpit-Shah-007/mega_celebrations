import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { changeAdminCredentials } from "@/lib/adminApi"
import { Card, Field, Input, AdminButton } from "@/admin/components/AdminForm"

export function AdminAccountPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const mutation = useMutation({
    mutationFn: () =>
      changeAdminCredentials({
        currentPassword,
        newUsername: newUsername.trim() || undefined,
        newPassword: newPassword || undefined,
      }),
    onSuccess: () => {
      setCurrentPassword("")
      setNewUsername("")
      setNewPassword("")
      setConfirmPassword("")
    },
  })

  const passwordsMismatch = newPassword.length > 0 && newPassword !== confirmPassword
  const hasNoChange = !newUsername.trim() && !newPassword
  const canSubmit = currentPassword.length > 0 && !hasNoChange && !passwordsMismatch

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Account</h1>

      <Card title="Login Credentials">
        <p className="mb-5 text-sm text-ui-gray">
          Update the username and/or password used to sign in to this admin portal. Leave a field blank to keep it
          unchanged.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
          className="flex max-w-md flex-col gap-4"
        >
          <Field label="Current Password">
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Field>

          <Field label="New Username (optional)">
            <Input
              autoComplete="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </Field>

          <Field label="New Password (optional)">
            <Input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>

          {newPassword ? (
            <Field label="Confirm New Password">
              <Input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>
          ) : null}

          {passwordsMismatch ? <p className="text-sm font-semibold text-red-600">New passwords do not match.</p> : null}
          {mutation.isError ? <p className="text-sm font-semibold text-red-600">{mutation.error.message}</p> : null}
          {mutation.isSuccess ? <p className="text-sm font-semibold text-blue">Login credentials updated.</p> : null}

          <div>
            <AdminButton type="submit" variant="primary" disabled={!canSubmit || mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save Changes"}
            </AdminButton>
          </div>
        </form>
      </Card>
    </div>
  )
}
