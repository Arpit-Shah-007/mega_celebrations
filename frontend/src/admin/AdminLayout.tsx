import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ExternalLink, LogOut, User } from "lucide-react"
import { fetchAdminAuthStatus, logoutAdmin } from "@/lib/adminApi"
import { PageLoadingState } from "@/components/ui/PageLoadingState"
import logo from "@/assets/brand/mega-celebrations-logo.png"

const ICON_LINK_BASE = "flex h-10 w-10 items-center justify-center text-ui-gray transition-colors hover:bg-graytint hover:text-navy"
const ICON_LINK_ACTIVE = "text-blue hover:text-blue"

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-8">
          <Link to="/admin" className="shrink-0">
            <img src={logo} alt="Mega Celebrations" className="h-10 w-auto sm:h-12 md:h-14" width={261} height={98} />
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Site"
              title="View Site"
              className={ICON_LINK_BASE}
            >
              <ExternalLink className="h-5 w-5" />
            </a>
            <NavLink
              to="/admin/account"
              aria-label="Account"
              className={({ isActive }) => `${ICON_LINK_BASE} ${isActive ? ICON_LINK_ACTIVE : ""}`}
            >
              <User className="h-5 w-5" />
            </NavLink>
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              aria-label="Log Out"
              className="flex shrink-0 cursor-pointer items-center gap-2 bg-pink px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue disabled:cursor-wait disabled:opacity-60 sm:px-4"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}
