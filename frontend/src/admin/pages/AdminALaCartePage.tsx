import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createCatalogItem, fetchAdminCatalogItems } from "@/lib/adminApi"
import { AdminButton } from "@/admin/components/AdminForm"
import { CatalogItemRow } from "@/admin/components/CatalogItemRow"

export function AdminALaCartePage() {
  const queryClient = useQueryClient()
  const { data: items, isPending } = useQuery({
    queryKey: ["admin", "catalog-items", "a_la_carte"],
    queryFn: () => fetchAdminCatalogItems("a_la_carte"),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "catalog-items", "a_la_carte"] })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">A La Carte</h1>
        <AdminButton
          variant="primary"
          onClick={async () => {
            await createCatalogItem({
              placement: "a_la_carte",
              addonCategoryId: null,
              slug: `new-item-${Date.now()}`,
              name: "New item",
              priceCents: 0,
              isPriceOnRequest: false,
              categoryBreadcrumb: "",
              imageUrl: null,
              additionalImageUrls: null,
              description: [],
              details: null,
              pricing: [],
              sortOrder: items?.length ?? 0,
            })
            invalidate()
          }}
        >
          + Add Item
        </AdminButton>
      </div>

      {isPending || !items ? (
        <p className="mt-6 text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {items.map((item) => (
            <CatalogItemRow key={item.id} item={item} onChanged={invalidate} />
          ))}
        </div>
      )}
    </div>
  )
}
