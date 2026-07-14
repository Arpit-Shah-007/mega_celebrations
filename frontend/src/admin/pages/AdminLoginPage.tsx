import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginAdmin } from "@/lib/adminApi"
import { Field, Input } from "@/admin/components/AdminForm"
import { MEDIA_BASE_URL } from "@/lib/media"
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-5 py-16">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-10"
        src={`${MEDIA_BASE_URL}/media/Home_Banner_Video.mp4`}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
        className="relative w-full max-w-70 border-t-4 border-blue bg-white p-6 shadow-lift"
      >
        <span
          aria-hidden="true"
          className="absolute -top-5 -right-5 flex h-16 w-16 rotate-12 select-none items-center justify-center rounded-full border-2 border-dashed border-navy bg-pink text-center text-[10px] font-extrabold uppercase leading-tight tracking-wide text-white shadow-lift"
        >
          Admins
          <br />
          Only
        </span>

        <div className="flex justify-center">
          <img src={logo} alt="Mega Celebrations" className="h-14 w-auto" width={261} height={98} />
        </div>

        <h1 className="mt-4 -rotate-2 text-center font-script text-2xl leading-none text-pink-dark">
          Wait&hellip; are you an admin?
        </h1>

        <div className="mt-5 flex flex-col gap-3">
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
          <p className="mt-3 text-sm font-semibold text-red-600">{mutation.error.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending || !username || !password}
          className="mt-5 w-full cursor-pointer bg-pink px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? "Signing In…" : "Sign In"}
        </button>
      </form>
    </div>
  )
}
