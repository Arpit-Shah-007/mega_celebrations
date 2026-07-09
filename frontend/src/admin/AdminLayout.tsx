import { NavLink, Outlet } from "react-router-dom"

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/packages", label: "Packages" },
  { to: "/admin/addon-categories", label: "Add-Ons" },
  { to: "/admin/a-la-carte", label: "A La Carte" },
  { to: "/admin/quote-inquiries", label: "Quote Inquiries" },
]

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <span className="text-sm font-bold uppercase tracking-wide">Mega Celebrations Admin</span>
          <nav className="flex gap-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-slate-900 underline" : "text-slate-500 hover:text-slate-900"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
