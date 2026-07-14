import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"
import { Package, Sparkles, ShoppingBag, MessageCircle } from "lucide-react"
import {
  fetchAdminAddonCategories,
  fetchAdminCatalogItems,
  fetchAdminPackages,
  fetchAdminQuoteInquiries,
  type AdminQuoteInquiryRow,
} from "@/lib/adminApi"
import { PageLoadingState } from "@/components/ui/PageLoadingState"

const STATUS_ORDER: AdminQuoteInquiryRow["status"][] = ["new", "contacted", "quoted", "won", "lost"]
const STATUS_LABEL: Record<AdminQuoteInquiryRow["status"], string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
}
// Ordinal ramp (new → contacted → quoted) for the pipeline-in-progress stages, then
// the two fixed, reserved status colors for the terminal outcomes — never reused
// for anything else, so "won"/"lost" always reads the same way everywhere.
const STATUS_COLOR: Record<AdminQuoteInquiryRow["status"], string> = {
  new: "#5598e7",
  contacted: "#2a78d6",
  quoted: "#1c5cab",
  won: "#0ca30c",
  lost: "#d03b3b",
}

const CHART_INK = "#52514e"
const CHART_GRID = "#e1e0d9"

function currency(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

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
  const { data: addonItems, isPending: addonItemsPending } = useQuery({
    queryKey: ["admin", "catalog-items", "add_on_category"],
    queryFn: () => fetchAdminCatalogItems("add_on_category"),
  })
  const { data: quoteInquiries, isPending: quoteInquiriesPending } = useQuery({
    queryKey: ["admin", "quote-inquiries"],
    queryFn: fetchAdminQuoteInquiries,
  })

  if (packagesPending || addonCategoriesPending || aLaCarteItemsPending || addonItemsPending || quoteInquiriesPending) {
    return <PageLoadingState />
  }

  const catalogItemCount = (aLaCarteItems?.length ?? 0) + (addonItems?.length ?? 0)

  const statusData = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    count: quoteInquiries?.filter((inquiry) => inquiry.status === status).length ?? 0,
  }))

  // Packages still marked "pricing coming soon" have no real starting price yet
  // (startingPriceCents is a placeholder 0) — including them would show a
  // misleading near-invisible bar in a chart that's otherwise a real ranking.
  const pricedPackages = (packages ?? []).filter((pkg) => !pkg.priceIsPlaceholder)
  const placeholderCount = (packages?.length ?? 0) - pricedPackages.length
  const priceData = [...pricedPackages]
    .sort((a, b) => b.startingPriceCents - a.startingPriceCents)
    .map((pkg) => ({ name: pkg.name, price: pkg.startingPriceCents / 100 }))

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile to="/admin/packages" label="Packages" value={packages?.length ?? 0} icon={Package} />
        <StatTile to="/admin/addon-categories" label="Add-On Categories" value={addonCategories?.length ?? 0} icon={Sparkles} />
        <StatTile to="/admin/a-la-carte" label="Catalog Items" value={catalogItemCount} icon={ShoppingBag} />
        <StatTile to="/admin/quote-inquiries" label="Quote Inquiries" value={quoteInquiries?.length ?? 0} icon={MessageCircle} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="border-t-4 border-blue bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-bold text-navy">Quote Inquiries by Stage</h2>
          {quoteInquiries && quoteInquiries.length === 0 ? (
            <p className="mt-6 text-sm text-body">No quote inquiries yet — once customers submit requests, they'll show up here.</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid horizontal={false} stroke={CHART_GRID} />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: CHART_INK, fontSize: 12 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={90}
                    interval={0}
                    tick={{ fill: CHART_INK, fontSize: 13, fontWeight: 600 }}
                    axisLine={{ stroke: CHART_GRID }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(11,93,155,0.06)" }}
                    contentStyle={{ border: "1px solid #e1e0d9", fontSize: 13 }}
                    formatter={(value: number) => [value, "Inquiries"]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLOR[entry.status]} />
                    ))}
                    <LabelList dataKey="count" position="right" style={{ fill: "#0b0b0b", fontSize: 12, fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="border-t-4 border-blue bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-bold text-navy">Packages by Starting Price</h2>
          {placeholderCount > 0 ? (
            <p className="mt-1 text-xs text-ui-gray">
              Excludes {placeholderCount} package{placeholderCount === 1 ? "" : "s"} still marked "pricing coming soon".
            </p>
          ) : null}
          {priceData.length === 0 ? (
            <p className="mt-6 text-sm text-body">No priced packages yet.</p>
          ) : (
            <div className="mt-4" style={{ height: Math.max(220, priceData.length * 34) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceData} layout="vertical" margin={{ left: 8, right: 32 }}>
                  <CartesianGrid horizontal={false} stroke={CHART_GRID} />
                  <XAxis
                    type="number"
                    tick={{ fill: CHART_INK, fontSize: 12 }}
                    axisLine={{ stroke: CHART_GRID }}
                    tickLine={false}
                    tickFormatter={(value: number) => currency(value * 100)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    interval={0}
                    tick={{ fill: CHART_INK, fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: CHART_GRID }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(11,93,155,0.06)" }}
                    contentStyle={{ border: "1px solid #e1e0d9", fontSize: 13 }}
                    formatter={(value: number) => [currency(value * 100), "Starting price"]}
                  />
                  <Bar dataKey="price" fill="#2a78d6" radius={[0, 4, 4, 0]} maxBarSize={16}>
                    <LabelList
                      dataKey="price"
                      position="right"
                      style={{ fill: "#0b0b0b", fontSize: 11, fontWeight: 700 }}
                      formatter={(value: number) => currency(value * 100)}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
