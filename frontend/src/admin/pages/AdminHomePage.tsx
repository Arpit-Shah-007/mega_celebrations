import { Link } from "react-router-dom"

const LINKS = [
  { to: "/admin/packages", label: "Packages", description: "Themes, add-ons, images, pricing" },
  { to: "/admin/addon-categories", label: "Add-Ons", description: "Decor, Activities & Crafts, Favors" },
  { to: "/admin/a-la-carte", label: "A La Carte", description: "The standalone rental catalog" },
  { to: "/admin/quote-inquiries", label: "Quote Inquiries", description: "Customer wishlist quote requests" },
]

export function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="border border-slate-200 bg-white p-5 transition-colors hover:border-slate-400">
            <p className="font-bold">{link.label}</p>
            <p className="mt-1 text-sm text-slate-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
