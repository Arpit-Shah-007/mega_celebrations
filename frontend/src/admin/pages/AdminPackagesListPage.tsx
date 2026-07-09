import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAdminPackage, deleteAdminPackage, fetchAdminPackages } from "@/lib/adminApi"
import { AdminButton } from "@/admin/components/AdminForm"

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
        <p className="mt-6 text-sm text-slate-500">Loading…</p>
      ) : (
        <table className="mt-6 w-full border border-slate-200 bg-white text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Sort</th>
              <th className="p-3">Featured</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {packages?.map((pkg) => (
              <tr key={pkg.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{pkg.name}</td>
                <td className="p-3 text-slate-500">{pkg.slug}</td>
                <td className="p-3">{pkg.sortOrder}</td>
                <td className="p-3">{pkg.featured ? "Yes" : ""}</td>
                <td className="p-3 text-right">
                  <Link to={`/admin/packages/${pkg.id}`} className="mr-3 text-slate-700 underline">
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
      )}
    </div>
  )
}
