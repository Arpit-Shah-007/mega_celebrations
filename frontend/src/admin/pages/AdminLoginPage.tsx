import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Lock } from "lucide-react"
import { loginAdmin } from "@/lib/adminApi"
import { Field, Input } from "@/admin/components/AdminForm"
import logo from "@/assets/brand/mega-celebrations-logo.png"

export function AdminLoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const mutation = useMutation({
    mutationFn: () => loginAdmin(username, password),
    onSuccess: (status) => {
      queryClient.setQueryData(["admin", "auth"], status)
      navigate("/admin", { replace: true })
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-5 py-16">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
        className="w-full max-w-sm border-t-4 border-blue bg-white p-8 shadow-lift"
      >
        <div className="flex justify-center">
          <img src={logo} alt="Mega Celebrations" className="h-20 w-auto" width={261} height={98} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-navy">
          <Lock className="h-4 w-4" />
          <h1 className="text-lg font-bold uppercase tracking-wide">Team Sign In</h1>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <Field label="Username">
            <Input
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </div>

        {mutation.isError ? (
          <p className="mt-4 text-sm font-semibold text-red-600">{mutation.error.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending || !username || !password}
          className="mt-6 w-full cursor-pointer bg-pink px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? "Signing In…" : "Sign In"}
        </button>
      </form>
    </div>
  )
}
