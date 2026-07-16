import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, ImageOff, Pencil, Trash2 } from "lucide-react"
import { deleteAdminPackage, fetchAdminPackages, type AdminPackageListRow } from "@/lib/adminApi"
import { AdminButton, Badge } from "@/admin/components/AdminForm"
import { PageLoadingState } from "@/components/ui/PageLoadingState"
import { AddPackageModal } from "@/admin/components/AddPackageModal"
import { PackageEditModal } from "@/admin/components/PackageEditModal"
import { ConfirmDeleteModal } from "@/admin/components/ConfirmDeleteModal"

function currency(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

export function AdminPackagesListPage() {
  const queryClient = useQueryClient()
  const { data: packages, isPending } = useQuery({ queryKey: ["admin", "packages"], queryFn: fetchAdminPackages })
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null)
  const [deletingPackage, setDeletingPackage] = useState<AdminPackageListRow | null>(null)

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: ["admin", "packages"] })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminPackage(id),
    onSuccess: invalidateList,
  })

  return (
    <div>
      <Link to="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ui-gray transition-colors hover:text-blue">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Packages</h1>
        <AdminButton variant="primary" onClick={() => setIsAddOpen(true)}>
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
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Media</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Name</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Description</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Starting Price</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Featured</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {packages?.map((pkg) => (
                <tr
                  key={pkg.id}
                  onClick={() => setEditingPackageId(pkg.id)}
                  className="cursor-pointer border-t border-border/60 align-top hover:bg-offwhite"
                >
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingPackageId(pkg.id)
                      }}
                      aria-label={`Edit ${pkg.name}`}
                      className="mr-3 cursor-pointer text-ui-gray transition-colors hover:text-blue"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeletingPackage(pkg)
                      }}
                      aria-label={`Delete ${pkg.name}`}
                      className="cursor-pointer text-ui-gray transition-colors hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAddOpen ? (
        <AddPackageModal
          nextSortOrder={packages?.length ?? 0}
          onClose={() => setIsAddOpen(false)}
          onCreated={(newId) => {
            setIsAddOpen(false)
            invalidateList()
            setEditingPackageId(newId)
          }}
        />
      ) : null}

      {editingPackageId != null ? (
        <PackageEditModal
          packageId={editingPackageId}
          onClose={() => setEditingPackageId(null)}
          onSaved={invalidateList}
        />
      ) : null}

      {deletingPackage ? (
        <ConfirmDeleteModal
          title="Delete package?"
          message={`Delete "${deletingPackage.name}"? This cannot be undone.`}
          onCancel={() => setDeletingPackage(null)}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(deletingPackage.id)
            setDeletingPackage(null)
          }}
        />
      ) : null}
    </div>
  )
}
