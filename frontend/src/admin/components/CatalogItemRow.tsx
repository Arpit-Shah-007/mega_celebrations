import { deleteCatalogItem, updateCatalogItem, type AdminCatalogItemRow } from "@/lib/adminApi"
import { AdminButton, Field, Input, TextArea } from "@/admin/components/AdminForm"
import { ImageUploadField } from "@/admin/components/ImageUploadField"

interface CatalogItemRowProps {
  item: AdminCatalogItemRow
  onChanged: () => void
  onMove?: (direction: -1 | 1) => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export function CatalogItemRow({ item, onChanged, onMove, canMoveUp = false, canMoveDown = false }: CatalogItemRowProps) {
  return (
    <div className="border border-slate-100 p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr_1fr_auto_auto_auto_auto]">
        <Field label="Name">
          <Input
            defaultValue={item.name}
            onBlur={async (e) => {
              if (e.target.value !== item.name) {
                await updateCatalogItem(item.id, { name: e.target.value })
                onChanged()
              }
            }}
          />
        </Field>
        <Field label="Price ($)">
          <Input
            type="number"
            disabled={item.isPriceOnRequest}
            defaultValue={item.priceCents != null ? item.priceCents / 100 : ""}
            onBlur={async (e) => {
              const cents = e.target.value === "" ? null : Math.round(Number(e.target.value) * 100)
              if (cents !== item.priceCents) {
                await updateCatalogItem(item.id, { priceCents: cents })
                onChanged()
              }
            }}
          />
        </Field>
        <Field label="Category breadcrumb">
          <Input
            defaultValue={item.categoryBreadcrumb}
            onBlur={async (e) => {
              if (e.target.value !== item.categoryBreadcrumb) {
                await updateCatalogItem(item.id, { categoryBreadcrumb: e.target.value })
                onChanged()
              }
            }}
          />
        </Field>
        <label className="flex items-center gap-1.5 self-end text-xs">
          <input
            type="checkbox"
            checked={item.isPriceOnRequest}
            onChange={async (e) => {
              await updateCatalogItem(item.id, { isPriceOnRequest: e.target.checked })
              onChanged()
            }}
          />
          Call for price
        </label>
        {onMove ? (
          <>
            <AdminButton onClick={() => onMove(-1)} disabled={!canMoveUp}>
              ↑
            </AdminButton>
            <AdminButton onClick={() => onMove(1)} disabled={!canMoveDown}>
              ↓
            </AdminButton>
          </>
        ) : null}
        <AdminButton
          variant="danger"
          onClick={async () => {
            if (window.confirm(`Delete "${item.name}"?`)) {
              await deleteCatalogItem(item.id)
              onChanged()
            }
          }}
        >
          Delete
        </AdminButton>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <ImageUploadField
          label="Photo"
          currentUrl={item.imageUrl ?? ""}
          onUploaded={async (url) => {
            await updateCatalogItem(item.id, { imageUrl: url })
            onChanged()
          }}
        />
        <Field label="Description (one bullet per line)">
          <TextArea
            rows={2}
            defaultValue={item.description.join("\n")}
            onBlur={async (e) => {
              const lines = e.target.value.split("\n").filter(Boolean)
              await updateCatalogItem(item.id, { description: lines })
              onChanged()
            }}
          />
        </Field>
      </div>
    </div>
  )
}
