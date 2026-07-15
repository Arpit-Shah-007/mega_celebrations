import { useState } from "react"
import { ImageOff, Pencil, Trash2 } from "lucide-react"
import { deleteCatalogItem, type AdminCatalogItemRow } from "@/lib/adminApi"
import { CatalogItemModal } from "@/admin/components/CatalogItemModal"

function currency(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

interface CatalogItemsTableProps {
  items: AdminCatalogItemRow[]
  onChanged: () => void
  emptyMessage: string
}

/** Shared table for A La Carte items and each add-on category's items — mirrors the packages table, with a pencil to edit (in a modal) and a bin to delete per row. */
export function CatalogItemsTable({ items, onChanged, emptyMessage }: CatalogItemsTableProps) {
  const [editingItem, setEditingItem] = useState<AdminCatalogItemRow | null>(null)

  if (items.length === 0) {
    return <p className="border border-dashed border-border/60 p-6 text-center text-sm text-ui-gray">{emptyMessage}</p>
  }

  return (
    <>
      <div className="overflow-x-auto border-t-4 border-blue bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-graytint text-left">
            <tr>
              <th className="p-3 font-bold uppercase tracking-wide text-navy">Photo</th>
              <th className="p-3 font-bold uppercase tracking-wide text-navy">Name</th>
              <th className="p-3 font-bold uppercase tracking-wide text-navy">Description</th>
              <th className="p-3 font-bold uppercase tracking-wide text-navy">Price</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => setEditingItem(item)}
                className="cursor-pointer border-t border-border/60 align-top hover:bg-offwhite"
              >
                <td className="p-3">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-16 w-16 object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center bg-graytint text-ui-gray">
                      <ImageOff className="h-5 w-5" />
                    </div>
                  )}
                </td>
                <td className="p-3 font-bold text-navy">{item.name}</td>
                <td className="max-w-xs p-3 text-body">
                  <p className="line-clamp-2">
                    {item.description[0] || <span className="italic text-ui-gray">No description yet</span>}
                  </p>
                </td>
                <td className="p-3 font-semibold text-navy">
                  {item.isPriceOnRequest ? "Call for price" : item.priceCents != null ? currency(item.priceCents) : "—"}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingItem(item)
                    }}
                    aria-label={`Edit ${item.name}`}
                    className="mr-3 cursor-pointer text-ui-gray transition-colors hover:text-blue"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation()
                      if (window.confirm(`Delete "${item.name}"?`)) {
                        await deleteCatalogItem(item.id)
                        onChanged()
                      }
                    }}
                    aria-label={`Delete ${item.name}`}
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

      {editingItem ? <CatalogItemModal item={editingItem} onClose={() => setEditingItem(null)} onSaved={onChanged} /> : null}
    </>
  )
}
