import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import {
  createAddonCategory,
  deleteAddonCategory,
  fetchAdminAddonCategories,
  fetchAdminCatalogItems,
  reorderAddonCategories,
  updateAddonCategory,
  type AdminAddonCategoryRow,
} from "@/lib/adminApi"
import { AdminButton, Card, Field, Input, TextArea } from "@/admin/components/AdminForm"
import { ImageUploadField } from "@/admin/components/ImageUploadField"
import { CatalogItemsTable } from "@/admin/components/CatalogItemsTable"
import { CatalogItemModal } from "@/admin/components/CatalogItemModal"
import { ConfirmDeleteModal } from "@/admin/components/ConfirmDeleteModal"

/** Sentinel for a brand-new category's not-yet-uploaded hero/card photo — the DB column is NOT NULL, but ImageUploadField should still show its empty state rather than a broken <img>. */
const PENDING_IMAGE = "pending-upload"

/** Sentinel text for a brand-new category's not-yet-edited name/tagline/description — the DB columns are NOT NULL, but the admin should see a blank field to type into rather than placeholder-style text they have to select and delete first. */
const PENDING_NAME = "New Category"
const PENDING_TAGLINE = "New tagline — edit me"
const PENDING_DESCRIPTION = "New category description — edit me."

export function AdminAddonCategoriesPage() {
  const queryClient = useQueryClient()
  const [deletingCategory, setDeletingCategory] = useState<AdminAddonCategoryRow | null>(null)
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
      <Link to="/admin" className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ui-gray transition-colors hover:text-blue">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add-On Categories</h1>
        <AdminButton
          variant="primary"
          aria-label="New Category"
          onClick={async () => {
            try {
              await createAddonCategory({
                slug: `new-category-${Date.now()}`,
                name: PENDING_NAME,
                tagline: PENDING_TAGLINE,
                description: PENDING_DESCRIPTION,
                heroImageUrl: PENDING_IMAGE,
                heroImageAlt: "New category hero image",
                cardImageUrl: PENDING_IMAGE,
                cardImageAlt: "New category card image",
                sortOrder: sorted.length,
              })
              invalidate()
            } catch (error) {
              window.alert(error instanceof Error ? error.message : "Failed to create category.")
            }
          }}
        >
          <Plus className="h-4 w-4" />
        </AdminButton>
      </div>
      {sorted.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          items={items.filter((item) => item.addonCategoryId === category.id)}
          onChanged={invalidate}
          onMove={(direction) => moveCategory(index, direction)}
          onDelete={() => setDeletingCategory(category)}
          canMoveUp={index > 0}
          canMoveDown={index < sorted.length - 1}
        />
      ))}

      {deletingCategory ? (
        <ConfirmDeleteModal
          title="Delete category?"
          message={`Delete "${deletingCategory.name}"? This will also delete its ${items.filter((item) => item.addonCategoryId === deletingCategory.id).length} item(s). This cannot be undone.`}
          onCancel={() => setDeletingCategory(null)}
          onConfirm={async () => {
            await deleteAddonCategory(deletingCategory.id)
            invalidate()
            setDeletingCategory(null)
          }}
        />
      ) : null}
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
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isItemsExpanded, setIsItemsExpanded] = useState(true)
  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

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
          <AdminButton variant="danger" aria-label="Delete category" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </AdminButton>
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-label={isExpanded ? "Collapse category" : "Expand category"}
            aria-expanded={isExpanded}
            className="flex h-8 w-8 cursor-pointer items-center justify-center text-ui-gray transition-colors hover:bg-graytint hover:text-navy"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      }
    >
      {isExpanded ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <Input
                defaultValue={category.name === PENDING_NAME ? "" : category.name}
                placeholder="e.g. Decor"
                onBlur={async (e) => {
                  const value = e.target.value.trim()
                  if (value.length > 0 && value !== category.name) {
                    await updateAddonCategory(category.id, { name: value })
                    onChanged()
                  }
                }}
              />
            </Field>
            <Field label="Tagline" required>
              <Input
                defaultValue={category.tagline === PENDING_TAGLINE ? "" : category.tagline}
                placeholder="Short tagline shown on the category card"
                onBlur={async (e) => {
                  const value = e.target.value.trim()
                  if (value.length > 0 && value !== category.tagline) {
                    await updateAddonCategory(category.id, { tagline: value })
                    onChanged()
                  }
                }}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Description" required>
              <TextArea
                rows={2}
                defaultValue={category.description === PENDING_DESCRIPTION ? "" : category.description}
                placeholder="Category description"
                onBlur={async (e) => {
                  const value = e.target.value.trim()
                  if (value.length > 0 && value !== category.description) {
                    await updateAddonCategory(category.id, { description: value })
                    onChanged()
                  }
                }}
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageUploadField
              label="Hero (category page banner)"
              required
              currentUrl={category.heroImageUrl === PENDING_IMAGE ? "" : category.heroImageUrl}
              onUploaded={async (url) => {
                await updateAddonCategory(category.id, { heroImageUrl: url })
                onChanged()
              }}
            />
            <ImageUploadField
              label="Card (Add-Ons hub thumbnail)"
              required
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
              <div className="flex items-center gap-2">
                {isItemsExpanded ? (
                  <AdminButton aria-label="Add item" onClick={() => setIsAddItemOpen(true)}>
                    <Plus className="h-3.5 w-3.5" />
                  </AdminButton>
                ) : null}
                <button
                  type="button"
                  onClick={() => setIsItemsExpanded((current) => !current)}
                  aria-label={isItemsExpanded ? "Collapse items" : "Expand items"}
                  aria-expanded={isItemsExpanded}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center text-ui-gray transition-colors hover:bg-graytint hover:text-navy"
                >
                  {isItemsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {isItemsExpanded ? (
              <CatalogItemsTable items={sortedItems} onChanged={onChanged} emptyMessage="No items in this category yet." />
            ) : null}
          </div>
        </>
      ) : null}

      {isAddItemOpen ? (
        <CatalogItemModal
          createContext={{
            placement: "add_on_category",
            addonCategoryId: category.id,
            categoryBreadcrumb: category.name,
            sortOrder: sortedItems.length,
          }}
          onClose={() => setIsAddItemOpen(false)}
          onSaved={onChanged}
        />
      ) : null}
    </Card>
  )
}
