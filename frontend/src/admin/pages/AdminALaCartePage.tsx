import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchAdminCatalogItems } from "@/lib/adminApi"
import { AdminButton } from "@/admin/components/AdminForm"
import { CatalogItemsTable } from "@/admin/components/CatalogItemsTable"
import { CatalogItemModal } from "@/admin/components/CatalogItemModal"
import { PageLoadingState } from "@/components/ui/PageLoadingState"

export function AdminALaCartePage() {
  const queryClient = useQueryClient()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { data: items, isPending } = useQuery({
    queryKey: ["admin", "catalog-items", "a_la_carte"],
    queryFn: () => fetchAdminCatalogItems("a_la_carte"),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "catalog-items", "a_la_carte"] })

  const sorted = [...(items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">A La Carte</h1>
        <AdminButton variant="primary" onClick={() => setIsAddOpen(true)}>
          + Add Item
        </AdminButton>
      </div>

      {isPending || !items ? (
        <PageLoadingState />
      ) : (
        <div className="mt-6">
          <CatalogItemsTable items={sorted} onChanged={invalidate} emptyMessage="No a la carte items yet." />
        </div>
      )}

      {isAddOpen ? (
        <CatalogItemModal
          createContext={{
            placement: "a_la_carte",
            addonCategoryId: null,
            categoryBreadcrumb: "A La Carte",
            sortOrder: sorted.length,
          }}
          onClose={() => setIsAddOpen(false)}
          onSaved={invalidate}
        />
      ) : null}
    </div>
  )
}
