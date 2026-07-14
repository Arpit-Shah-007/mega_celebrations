import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createAddonCategory,
  createCatalogItem,
  deleteAddonCategory,
  fetchAdminAddonCategories,
  fetchAdminCatalogItems,
  reorderAddonCategories,
  reorderCatalogItems,
  updateAddonCategory,
  type AdminAddonCategoryRow,
} from "@/lib/adminApi"
import { AdminButton, Card, Field, Input, TextArea } from "@/admin/components/AdminForm"
import { ImageUploadField } from "@/admin/components/ImageUploadField"
import { CatalogItemRow } from "@/admin/components/CatalogItemRow"

/** Sentinel for a brand-new category's not-yet-uploaded hero/card photo — the DB column is NOT NULL, but ImageUploadField should still show its empty state rather than a broken <img>. */
const PENDING_IMAGE = "pending-upload"

export function AdminAddonCategoriesPage() {
  const queryClient = useQueryClient()
  const { data: categories, isPending: categoriesPending } = useQuery({
    queryKey: ["admin", "addon-categories"],
    queryFn: fetchAdminAddonCategories,
  })
  const { data: items, isPending: itemsPending } = useQuery({
    queryKey: ["admin", "catalog-items", "add_on_category"],
    queryFn: () => fetchAdminCatalogItems("add_on_category"),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "addon-categories"] })
    queryClient.invalidateQueries({ queryKey: ["admin", "catalog-items", "add_on_category"] })
  }

  if (categoriesPending || itemsPending || !categories || !items) {
    return <p className="text-sm text-ui-gray">Loading…</p>
  }

  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

  const moveCategory = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= sorted.length) return
    const reordered = [...sorted]
    ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]
    await reorderAddonCategories(reordered.map((category) => category.id))
    invalidate()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add-On Categories</h1>
        <AdminButton
          variant="primary"
          onClick={async () => {
            await createAddonCategory({
              slug: `new-category-${Date.now()}`,
              name: "New Category",
              tagline: "",
              description: "",
              heroImageUrl: PENDING_IMAGE,
              heroImageAlt: "New category hero image",
              cardImageUrl: PENDING_IMAGE,
              cardImageAlt: "New category card image",
              sortOrder: sorted.length,
            })
            invalidate()
          }}
        >
          + New Category
        </AdminButton>
      </div>
      {sorted.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          items={items.filter((item) => item.addonCategoryId === category.id)}
          onChanged={invalidate}
          onMove={(direction) => moveCategory(index, direction)}
          onDelete={async () => {
            if (window.confirm(`Delete "${category.name}"? This will also delete its ${items.filter((item) => item.addonCategoryId === category.id).length} item(s). This cannot be undone.`)) {
              await deleteAddonCategory(category.id)
              invalidate()
            }
          }}
          canMoveUp={index > 0}
          canMoveDown={index < sorted.length - 1}
        />
      ))}
    </div>
  )
}

function CategoryCard({
  category,
  items,
  onChanged,
  onMove,
  onDelete,
  canMoveUp,
  canMoveDown,
}: {
  category: AdminAddonCategoryRow
  items: import("@/lib/adminApi").AdminCatalogItemRow[]
  onChanged: () => void
  onMove: (direction: -1 | 1) => void
  onDelete: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  const moveItem = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= sortedItems.length) return
    const reordered = [...sortedItems]
    ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]
    await reorderCatalogItems(reordered.map((item) => item.id))
    onChanged()
  }

  return (
    <Card
      title={category.name}
      action={
        <div className="flex items-center gap-2">
          <AdminButton onClick={() => onMove(-1)} disabled={!canMoveUp}>
            ↑
          </AdminButton>
          <AdminButton onClick={() => onMove(1)} disabled={!canMoveDown}>
            ↓
          </AdminButton>
          <AdminButton variant="danger" onClick={onDelete}>
            Delete Category
          </AdminButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input
            defaultValue={category.name}
            onBlur={async (e) => {
              if (e.target.value !== category.name) {
                await updateAddonCategory(category.id, { name: e.target.value })
                onChanged()
              }
            }}
          />
        </Field>
        <Field label="Tagline">
          <Input
            defaultValue={category.tagline}
            onBlur={async (e) => {
              if (e.target.value !== category.tagline) {
                await updateAddonCategory(category.id, { tagline: e.target.value })
                onChanged()
              }
            }}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Description">
          <TextArea
            rows={2}
            defaultValue={category.description}
            onBlur={async (e) => {
              if (e.target.value !== category.description) {
                await updateAddonCategory(category.id, { description: e.target.value })
                onChanged()
              }
            }}
          />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ImageUploadField
          label="Hero (category page banner)"
          currentUrl={category.heroImageUrl === PENDING_IMAGE ? "" : category.heroImageUrl}
          onUploaded={async (url) => {
            await updateAddonCategory(category.id, { heroImageUrl: url })
            onChanged()
          }}
        />
        <ImageUploadField
          label="Card (Add-Ons hub thumbnail)"
          currentUrl={category.cardImageUrl === PENDING_IMAGE ? "" : category.cardImageUrl}
          onUploaded={async (url) => {
            await updateAddonCategory(category.id, { cardImageUrl: url })
            onChanged()
          }}
        />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-navy">Items ({items.length})</p>
          <AdminButton
            onClick={async () => {
              await createCatalogItem({
                placement: "add_on_category",
                addonCategoryId: category.id,
                slug: `new-item-${Date.now()}`,
                name: "New item",
                priceCents: 0,
                isPriceOnRequest: false,
                categoryBreadcrumb: category.name,
                imageUrl: null,
                additionalImageUrls: null,
                description: [],
                details: null,
                pricing: [],
                sortOrder: sortedItems.length,
              })
              onChanged()
            }}
          >
            + Add Item
          </AdminButton>
        </div>
        <div className="flex flex-col gap-3">
          {sortedItems.map((item, index) => (
            <CatalogItemRow
              key={item.id}
              item={item}
              onChanged={onChanged}
              onMove={(direction) => moveItem(index, direction)}
              canMoveUp={index > 0}
              canMoveDown={index < sortedItems.length - 1}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}
