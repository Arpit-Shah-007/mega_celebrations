import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Package, Sparkles, ShoppingBag } from "lucide-react"
import { fetchAdminAddonCategories, fetchAdminCatalogItems, fetchAdminPackages } from "@/lib/adminApi"
import { PageLoadingState } from "@/components/ui/PageLoadingState"

interface StatTileProps {
  to: string
  label: string
  value: number
  icon: typeof Package
}

function StatTile({ to, label, value, icon: Icon }: StatTileProps) {
  return (
    <Link to={to} className="group flex items-center gap-4 border-t-4 border-blue bg-white p-5 shadow-soft transition-shadow hover:shadow-lift">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-blue/10 text-blue transition-colors group-hover:bg-blue group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-3xl font-bold text-navy">{value}</p>
        <p className="text-sm font-semibold uppercase tracking-wide text-ui-gray">{label}</p>
      </div>
    </Link>
  )
}

export function AdminHomePage() {
  const { data: packages, isPending: packagesPending } = useQuery({ queryKey: ["admin", "packages"], queryFn: fetchAdminPackages })
  const { data: addonCategories, isPending: addonCategoriesPending } = useQuery({
    queryKey: ["admin", "addon-categories"],
    queryFn: fetchAdminAddonCategories,
  })
  const { data: aLaCarteItems, isPending: aLaCarteItemsPending } = useQuery({
    queryKey: ["admin", "catalog-items", "a_la_carte"],
    queryFn: () => fetchAdminCatalogItems("a_la_carte"),
  })

  if (packagesPending || addonCategoriesPending || aLaCarteItemsPending) {
    return <PageLoadingState />
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile to="/admin/packages" label="Packages" value={packages?.length ?? 0} icon={Package} />
        <StatTile to="/admin/addon-categories" label="Add-On Categories" value={addonCategories?.length ?? 0} icon={Sparkles} />
        <StatTile to="/admin/a-la-carte" label="A La Carte Items" value={aLaCarteItems?.length ?? 0} icon={ShoppingBag} />
      </div>
    </div>
  )
}
