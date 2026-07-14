import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createCatalogItem, fetchAdminCatalogItems, reorderCatalogItems } from "@/lib/adminApi"
import { AdminButton } from "@/admin/components/AdminForm"
import { CatalogItemRow } from "@/admin/components/CatalogItemRow"

export function AdminALaCartePage() {
  const queryClient = useQueryClient()
  const { data: items, isPending } = useQuery({
    queryKey: ["admin", "catalog-items", "a_la_carte"],
    queryFn: () => fetchAdminCatalogItems("a_la_carte"),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "catalog-items", "a_la_carte"] })

  const sorted = [...(items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)

  const moveItem = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= sorted.length) return
    const reordered = [...sorted]
    ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]
    await reorderCatalogItems(reordered.map((item) => item.id))
    invalidate()
  }

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
              sortOrder: sorted.length,
            })
            invalidate()
          }}
        >
          + Add Item
        </AdminButton>
      </div>

      {isPending || !items ? (
        <p className="mt-6 text-sm text-ui-gray">Loading…</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {sorted.map((item, index) => (
            <CatalogItemRow
              key={item.id}
              item={item}
              onChanged={invalidate}
              onMove={(direction) => moveItem(index, direction)}
              canMoveUp={index > 0}
              canMoveDown={index < sorted.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
