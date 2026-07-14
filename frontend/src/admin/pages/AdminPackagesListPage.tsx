import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ImageOff } from "lucide-react"
import { createAdminPackage, deleteAdminPackage, fetchAdminPackages } from "@/lib/adminApi"
import { AdminButton, Badge } from "@/admin/components/AdminForm"
import { PageLoadingState } from "@/components/ui/PageLoadingState"

function currency(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

export function AdminPackagesListPage() {
  const queryClient = useQueryClient()
  const { data: packages, isPending } = useQuery({ queryKey: ["admin", "packages"], queryFn: fetchAdminPackages })

  const createMutation = useMutation({
    mutationFn: () =>
      createAdminPackage({
        slug: `new-package-${Date.now()}`,
        name: "New Package",
        tagline: "",
        description: "",
        tags: [],
        inclusions: [],
        capacity: "",
        spaceRequirement: "",
        priceIsPlaceholder: true,
        damageDepositCents: null,
        bundleDiscount: null,
        featured: false,
        sortOrder: packages?.length ?? 0,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "packages"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminPackage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "packages"] }),
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Packages</h1>
        <AdminButton variant="primary" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
          + New Package
        </AdminButton>
      </div>

      {isPending ? (
        <PageLoadingState />
      ) : (
        <div className="mt-6 overflow-x-auto border-t-4 border-blue bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-graytint text-left">
              <tr>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Photo</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Name</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Description</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Starting Price</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Featured</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {packages?.map((pkg) => (
                <tr key={pkg.id} className="border-t border-border/60 align-top hover:bg-offwhite">
                  <td className="p-3">
                    {pkg.cardImageUrl ? (
                      <img src={pkg.cardImageUrl} alt="" className="h-16 w-16 object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center bg-graytint text-ui-gray">
                        <ImageOff className="h-5 w-5" />
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-navy">{pkg.name}</p>
                    <p className="text-xs text-ui-gray">{pkg.slug}</p>
                  </td>
                  <td className="max-w-xs p-3 text-body">
                    <p className="line-clamp-2">{pkg.description || <span className="italic text-ui-gray">No description yet</span>}</p>
                  </td>
                  <td className="p-3 font-semibold text-navy">
                    {pkg.priceIsPlaceholder ? <Badge tone="pink">Coming Soon</Badge> : currency(pkg.startingPriceCents)}
                  </td>
                  <td className="p-3">{pkg.featured ? <Badge tone="blue">Featured</Badge> : null}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Link to={`/admin/packages/${pkg.id}`} className="mr-3 text-sm font-bold uppercase tracking-wide text-blue hover:text-navy">
                      Edit
                    </Link>
                    <AdminButton
                      variant="danger"
                      onClick={() => {
                        if (window.confirm(`Delete "${pkg.name}"? This cannot be undone.`)) {
                          deleteMutation.mutate(pkg.id)
                        }
                      }}
                    >
                      Delete
                    </AdminButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
