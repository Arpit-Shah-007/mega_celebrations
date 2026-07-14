import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import { fetchAdminAuthStatus, logoutAdmin } from "@/lib/adminApi"
import { PageLoadingState } from "@/components/ui/PageLoadingState"
import logo from "@/assets/brand/mega-celebrations-logo.png"

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/packages", label: "Packages" },
  { to: "/admin/addon-categories", label: "Add-Ons" },
  { to: "/admin/a-la-carte", label: "A La Carte" },
  { to: "/admin/account", label: "Account" },
]

const NAV_LINK_BASE = "group relative py-2 text-sm font-semibold text-ui-gray transition-colors"

function TopHoverLine({ isActive = false }: { isActive?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-center bg-blue transition-transform duration-300 ease-out ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  )
}

export function AdminLayout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data, isPending } = useQuery({ queryKey: ["admin", "auth"], queryFn: fetchAdminAuthStatus })

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.setQueryData(["admin", "auth"], { authenticated: false })
      navigate("/admin/login", { replace: true })
    },
  })

  if (isPending) return <PageLoadingState />
  if (!data?.authenticated) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-offwhite text-body">
      <header className="sticky top-0 z-50 bg-white shadow-[0_4px_16px_-4px_rgba(2,40,67,0.18)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
          <img src={logo} alt="Mega Celebrations" className="h-14 w-auto shrink-0" width={261} height={98} />

          <nav className="flex flex-1 flex-wrap items-center gap-6" aria-label="Admin sections">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={NAV_LINK_BASE}>
                {({ isActive }) => (
                  <>
                    {item.label}
                    <TopHoverLine isActive={isActive} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex shrink-0 cursor-pointer items-center gap-2 bg-pink px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log Out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}
