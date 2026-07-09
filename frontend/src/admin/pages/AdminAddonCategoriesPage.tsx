import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCatalogItem,
  fetchAdminAddonCategories,
  fetchAdminCatalogItems,
  updateAddonCategory,
  type AdminAddonCategoryRow,
} from "@/lib/adminApi"
import { AdminButton, Card, Field, Input, TextArea } from "@/admin/components/AdminForm"
import { ImageUploadField } from "@/admin/components/ImageUploadField"
import { CatalogItemRow } from "@/admin/components/CatalogItemRow"

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
    return <p className="text-sm text-slate-500">Loading…</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Add-On Categories</h1>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          items={items.filter((item) => item.addonCategoryId === category.id)}
          onChanged={invalidate}
        />
      ))}
    </div>
  )
}

function CategoryCard({
  category,
  items,
  onChanged,
}: {
  category: AdminAddonCategoryRow
  items: import("@/lib/adminApi").AdminCatalogItemRow[]
  onChanged: () => void
}) {
  return (
    <Card title={category.name}>
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
          currentUrl={category.heroImageUrl}
          onUploaded={async (url) => {
            await updateAddonCategory(category.id, { heroImageUrl: url })
            onChanged()
          }}
        />
        <ImageUploadField
          label="Card (Add-Ons hub thumbnail)"
          currentUrl={category.cardImageUrl}
          onUploaded={async (url) => {
            await updateAddonCategory(category.id, { cardImageUrl: url })
            onChanged()
          }}
        />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Items ({items.length})</p>
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
                sortOrder: items.length,
              })
              onChanged()
            }}
          >
            + Add Item
          </AdminButton>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CatalogItemRow key={item.id} item={item} onChanged={onChanged} />
          ))}
        </div>
      </div>
    </Card>
  )
}
