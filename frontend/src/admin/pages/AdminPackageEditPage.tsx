import { useState } from "react"
import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createPackageImage,
  createPriceTier,
  createVariant,
  deletePackageImage,
  deletePriceTier,
  deleteVariant,
  fetchAdminPackage,
  reorderPackageImages,
  reorderVariants,
  updateAdminPackage,
  updatePackageImage,
  updatePriceTier,
  updateVariant,
  type AdminPackageImageRow,
  type AdminPackagePriceTierRow,
  type AdminPackageVariantRow,
} from "@/lib/adminApi"
import { ALL_PACKAGE_TAGS } from "@/types"
import { AdminButton, Card, Field, Input, TextArea } from "@/admin/components/AdminForm"
import { ImageUploadField } from "@/admin/components/ImageUploadField"

export function AdminPackageEditPage() {
  const { id } = useParams<{ id: string }>()
  const packageId = Number(id)
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({ queryKey: ["admin", "package", packageId], queryFn: () => fetchAdminPackage(packageId) })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "package", packageId] })

  if (isPending || !data) return <p className="text-sm text-ui-gray">Loading…</p>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{data.package.name}</h1>
      <PackageBaseForm packageId={packageId} initial={data.package} onSaved={invalidate} />
      <PackageImagesCard packageId={packageId} images={data.images} onChanged={invalidate} />
      <PriceTiersCard packageId={packageId} tiers={data.priceTiers} onChanged={invalidate} />
      <VariantsCard packageId={packageId} variants={data.variants} kind="theme" title="Themes" onChanged={invalidate} />
      <VariantsCard packageId={packageId} variants={data.variants} kind="addon" title="Popular Add-Ons" onChanged={invalidate} />
    </div>
  )
}

function PackageBaseForm({
  packageId,
  initial,
  onSaved,
}: {
  packageId: number
  initial: import("@/lib/adminApi").AdminPackageRow
  onSaved: () => void
}) {
  const [form, setForm] = useState(initial)
  const mutation = useMutation({
    mutationFn: () =>
      updateAdminPackage(packageId, {
        slug: form.slug,
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        tags: form.tags,
        inclusions: form.inclusions,
        capacity: form.capacity,
        spaceRequirement: form.spaceRequirement,
        priceIsPlaceholder: form.priceIsPlaceholder,
        damageDepositCents: form.damageDepositCents,
        bundleDiscount: form.bundleDiscount,
        featured: form.featured,
        sortOrder: form.sortOrder,
      }),
    onSuccess: onSaved,
  })

  const toggleTag = (tag: string) => {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((t) => t !== tag) : [...current.tags, tag],
    }))
  }

  return (
    <Card title="Details">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Slug">
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </Field>
        <Field label="Tagline">
          <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </Field>
        <Field label="Capacity">
          <Input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </Field>
        <Field label="Space Requirement">
          <Input value={form.spaceRequirement} onChange={(e) => setForm({ ...form, spaceRequirement: e.target.value })} />
        </Field>
        <Field label="Sort Order">
          <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </Field>
        <Field label="Damage Deposit ($, optional)">
          <Input
            type="number"
            value={form.damageDepositCents != null ? form.damageDepositCents / 100 : ""}
            onChange={(e) => setForm({ ...form, damageDepositCents: e.target.value === "" ? null : Math.round(Number(e.target.value) * 100) })}
          />
        </Field>
        <Field label="Bundle Discount note (optional)">
          <Input value={form.bundleDiscount ?? ""} onChange={(e) => setForm({ ...form, bundleDiscount: e.target.value || null })} />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Description">
          <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Inclusions (one per line)">
          <TextArea
            rows={4}
            value={form.inclusions.join("\n")}
            onChange={(e) => setForm({ ...form, inclusions: e.target.value.split("\n").filter(Boolean) })}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {ALL_PACKAGE_TAGS.map((tag) => (
          <label key={tag} className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={form.tags.includes(tag)} onChange={() => toggleTag(tag)} />
            {tag}
          </label>
        ))}
      </div>

      <div className="mt-4 flex gap-4">
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={form.priceIsPlaceholder}
            onChange={(e) => setForm({ ...form, priceIsPlaceholder: e.target.checked })}
          />
          Price is a placeholder ("coming soon")
        </label>
      </div>

      <div className="mt-4">
        <AdminButton variant="primary" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save Details"}
        </AdminButton>
      </div>
    </Card>
  )
}

function PackageImagesCard({
  packageId,
  images,
  onChanged,
}: {
  packageId: number
  images: AdminPackageImageRow[]
  onChanged: () => void
}) {
  const hero = images.find((image) => image.kind === "hero")
  const card = images.find((image) => image.kind === "card")
  const gallery = [...images.filter((image) => image.kind === "gallery")].sort((a, b) => a.sortOrder - b.sortOrder)

  const upsertSingleton = async (kind: "hero" | "card", existing: AdminPackageImageRow | undefined, url: string) => {
    if (existing) {
      await updatePackageImage(existing.id, { url })
    } else {
      await createPackageImage(packageId, { kind, url, alt: kind, sortOrder: 0 })
    }
    onChanged()
  }

  const addGalleryImage = async (url: string) => {
    await createPackageImage(packageId, { kind: "gallery", url, alt: "", sortOrder: gallery.length })
    onChanged()
  }

  const moveGalleryImage = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= gallery.length) return
    const reordered = [...gallery]
    ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]
    await reorderPackageImages(packageId, reordered.map((image) => image.id))
    onChanged()
  }

  return (
    <Card title="Images">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ImageUploadField label="Hero (detail-page banner)" currentUrl={hero?.url ?? ""} onUploaded={(url) => upsertSingleton("hero", hero, url)} />
        <ImageUploadField label="Card (listing thumbnail)" currentUrl={card?.url ?? ""} onUploaded={(url) => upsertSingleton("card", card, url)} />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-navy">Gallery ({gallery.length})</p>
        <div className="flex flex-wrap gap-3">
          {gallery.map((image, index) => (
            <div key={image.id} className="relative w-24">
              <img src={image.url} alt="" className="h-24 w-24 object-cover" />
              <div className="mt-1 flex justify-between text-xs">
                <button type="button" onClick={() => moveGalleryImage(index, -1)} disabled={index === 0} className="disabled:opacity-30">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveGalleryImage(index, 1)}
                  disabled={index === gallery.length - 1}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deletePackageImage(image.id)
                    onChanged()
                  }}
                  className="text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 max-w-xs">
          <ImageUploadField label="Add gallery photo" currentUrl="" onUploaded={addGalleryImage} />
        </div>
      </div>
    </Card>
  )
}

function PriceTiersCard({
  packageId,
  tiers,
  onChanged,
}: {
  packageId: number
  tiers: AdminPackagePriceTierRow[]
  onChanged: () => void
}) {
  const sorted = [...tiers].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <Card
      title="Price Tiers"
      action={
        <AdminButton
          onClick={async () => {
            await createPriceTier(packageId, { label: "New tier", priceCents: 0, note: null, sortOrder: tiers.length })
            onChanged()
          }}
        >
          + Add Tier
        </AdminButton>
      }
    >
      <div className="flex flex-col gap-2">
        {sorted.map((tier) => (
          <div key={tier.id} className="grid grid-cols-[1fr_120px_1fr_auto] items-end gap-2">
            <Field label="Label">
              <Input
                defaultValue={tier.label}
                onBlur={async (e) => {
                  if (e.target.value !== tier.label) {
                    await updatePriceTier(tier.id, { label: e.target.value })
                    onChanged()
                  }
                }}
              />
            </Field>
            <Field label="Price ($)">
              <Input
                type="number"
                defaultValue={tier.priceCents / 100}
                onBlur={async (e) => {
                  const cents = Math.round(Number(e.target.value) * 100)
                  if (cents !== tier.priceCents) {
                    await updatePriceTier(tier.id, { priceCents: cents })
                    onChanged()
                  }
                }}
              />
            </Field>
            <Field label="Note">
              <Input
                defaultValue={tier.note ?? ""}
                onBlur={async (e) => {
                  if (e.target.value !== (tier.note ?? "")) {
                    await updatePriceTier(tier.id, { note: e.target.value || null })
                    onChanged()
                  }
                }}
              />
            </Field>
            <AdminButton
              variant="danger"
              onClick={async () => {
                await deletePriceTier(tier.id)
                onChanged()
              }}
            >
              Delete
            </AdminButton>
          </div>
        ))}
      </div>
    </Card>
  )
}

function VariantsCard({
  packageId,
  variants,
  kind,
  title,
  onChanged,
}: {
  packageId: number
  variants: AdminPackageVariantRow[]
  kind: "theme" | "addon"
  title: string
  onChanged: () => void
}) {
  const filtered = [...variants.filter((variant) => variant.kind === kind)].sort((a, b) => a.sortOrder - b.sortOrder)

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= filtered.length) return
    const reordered = [...filtered]
    ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]
    await reorderVariants(packageId, reordered.map((variant) => variant.id))
    onChanged()
  }

  return (
    <Card
      title={title}
      action={
        <AdminButton
          onClick={async () => {
            await createVariant(packageId, {
              kind,
              name: "New item",
              priceCents: 0,
              isPriceOnRequest: false,
              imageUrl: null,
              description: null,
              sortOrder: filtered.length,
            })
            onChanged()
          }}
        >
          + Add
        </AdminButton>
      }
    >
      <div className="flex flex-col gap-3">
        {filtered.map((variant, index) => (
          <div key={variant.id} className="border border-border/60 p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr_auto_auto_auto_auto]">
              <Field label="Name">
                <Input
                  defaultValue={variant.name}
                  onBlur={async (e) => {
                    if (e.target.value !== variant.name) {
                      await updateVariant(variant.id, { name: e.target.value })
                      onChanged()
                    }
                  }}
                />
              </Field>
              <Field label="Price ($)">
                <Input
                  type="number"
                  disabled={variant.isPriceOnRequest}
                  defaultValue={variant.priceCents != null ? variant.priceCents / 100 : ""}
                  onBlur={async (e) => {
                    const cents = e.target.value === "" ? null : Math.round(Number(e.target.value) * 100)
                    if (cents !== variant.priceCents) {
                      await updateVariant(variant.id, { priceCents: cents })
                      onChanged()
                    }
                  }}
                />
              </Field>
              <label className="flex items-center gap-1.5 self-end text-xs">
                <input
                  type="checkbox"
                  checked={variant.isPriceOnRequest}
                  onChange={async (e) => {
                    await updateVariant(variant.id, { isPriceOnRequest: e.target.checked })
                    onChanged()
                  }}
                />
                Call for price
              </label>
              <AdminButton onClick={() => move(index, -1)} disabled={index === 0}>
                ↑
              </AdminButton>
              <AdminButton onClick={() => move(index, 1)} disabled={index === filtered.length - 1}>
                ↓
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={async () => {
                  await deleteVariant(variant.id)
                  onChanged()
                }}
              >
                Delete
              </AdminButton>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ImageUploadField
                label="Photo"
                currentUrl={variant.imageUrl ?? ""}
                onUploaded={async (url) => {
                  await updateVariant(variant.id, { imageUrl: url })
                  onChanged()
                }}
              />
              <Field label="Description (one bullet per line)">
                <TextArea
                  rows={2}
                  defaultValue={(variant.description ?? []).join("\n")}
                  onBlur={async (e) => {
                    const lines = e.target.value.split("\n").filter(Boolean)
                    await updateVariant(variant.id, { description: lines.length > 0 ? lines : null })
                    onChanged()
                  }}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
