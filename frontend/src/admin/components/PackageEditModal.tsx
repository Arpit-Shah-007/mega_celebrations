import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import {
  createPackageFaq,
  createPackageImage,
  createVariant,
  deletePackageFaq,
  deletePackageImage,
  deleteVariant,
  fetchAdminPackage,
  reorderPackageFaqs,
  updateAdminPackage,
  updatePackageFaq,
  updatePackageImage,
  updateVariant,
  uploadImage,
  reorderVariants,
  type AdminPackageFaqRow,
  type AdminPackageImageRow,
  type AdminPackageVariantRow,
  type AdminPackageRow,
} from "@/lib/adminApi"
import { ALL_PACKAGE_TAGS } from "@/types"
import { AdminButton, Card, Field, Input, TextArea } from "@/admin/components/AdminForm"
import { ImageUploadField } from "@/admin/components/ImageUploadField"
import { MediaStripField } from "@/admin/components/MediaStripField"

interface PackageEditModalProps {
  packageId: number
  onClose: () => void
  onSaved: () => void
}

type PackageEditTab = "details" | "images" | "themes" | "addons" | "faqs"

const TABS: { id: PackageEditTab; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "images", label: "Media" },
  { id: "themes", label: "Themes" },
  { id: "addons", label: "Popular Add-Ons" },
  { id: "faqs", label: "FAQs" },
]

/** Full package editor (details, images, themes, add-ons) as a modal — replaces the old dedicated /admin/packages/:id page so managing a package no longer means leaving the table. Tabbed instead of one long stacked scroll so each section is its own bounded view. */
export function PackageEditModal({ packageId, onClose, onSaved }: PackageEditModalProps) {
  const { data, isPending } = useQuery({ queryKey: ["admin", "package", packageId], queryFn: () => fetchAdminPackage(packageId) })
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<PackageEditTab>("details")

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "package", packageId] })
    onSaved()
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit package"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden bg-white"
      >
        <div className="flex shrink-0 items-center justify-between bg-blue px-5 py-3">
          <span className="font-bold text-white">{data ? data.package.name : "Edit Package"}</span>
          <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer text-white transition-opacity hover:opacity-70">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex shrink-0 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id}
              className={`cursor-pointer px-4 py-2.5 text-sm font-bold transition-colors ${
                activeTab === tab.id ? "border-b-2 border-pink text-navy" : "text-ui-gray hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto p-5 sm:p-6">
          {isPending || !data ? (
            <p className="text-sm text-ui-gray">Loading…</p>
          ) : (
            <>
              {activeTab === "details" ? <PackageBaseForm packageId={packageId} initial={data.package} onSaved={invalidate} /> : null}
              {activeTab === "images" ? <PackageImagesCard packageId={packageId} images={data.images} onChanged={invalidate} /> : null}
              {activeTab === "themes" ? (
                <VariantsCard packageId={packageId} variants={data.variants} kind="theme" title="Themes" onChanged={invalidate} />
              ) : null}
              {activeTab === "addons" ? (
                <VariantsCard packageId={packageId} variants={data.variants} kind="addon" title="Popular Add-Ons" onChanged={invalidate} />
              ) : null}
              {activeTab === "faqs" ? <FaqsCard packageId={packageId} faqs={data.faqs} onChanged={invalidate} /> : null}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function PackageBaseForm({ packageId, initial, onSaved }: { packageId: number; initial: AdminPackageRow; onSaved: () => void }) {
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
        <Field label="Name" required>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Slug" required>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </Field>
        <Field label="Tagline" required>
          <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </Field>
        <Field label="Capacity" required>
          <Input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </Field>
        <Field label="Space Requirement" required>
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
        <Field label="Description" required>
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

  const upsertSingleton = async (kind: "hero" | "card", existing: AdminPackageImageRow | undefined, file: File) => {
    const { url } = await uploadImage(file)
    if (existing) {
      await updatePackageImage(existing.id, { url })
    } else {
      await createPackageImage(packageId, { kind, url, alt: kind, sortOrder: 0 })
    }
    onChanged()
  }

  const removeSingleton = async (existing: AdminPackageImageRow | undefined) => {
    if (!existing) return
    await deletePackageImage(existing.id)
    onChanged()
  }

  const addGalleryImage = async (file: File) => {
    const { url } = await uploadImage(file)
    await createPackageImage(packageId, { kind: "gallery", url, alt: "", sortOrder: gallery.length })
    onChanged()
  }

  const removeGalleryImage = async (index: number) => {
    const image = gallery[index]
    if (!image) return
    await deletePackageImage(image.id)
    onChanged()
  }

  return (
    <Card title="Media">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MediaStripField
          label="Hero (detail-page banner)"
          required
          maxImages={1}
          images={hero ? [hero.url] : []}
          onAdd={(file) => upsertSingleton("hero", hero, file)}
          onRemove={() => removeSingleton(hero)}
        />
        <MediaStripField
          label="Card (listing thumbnail)"
          required
          maxImages={1}
          images={card ? [card.url] : []}
          onAdd={(file) => upsertSingleton("card", card, file)}
          onRemove={() => removeSingleton(card)}
        />
      </div>

      <div className="mt-5">
        <MediaStripField
          label={`Gallery (${gallery.length})`}
          maxImages={50}
          images={gallery.map((image) => image.url)}
          onAdd={addGalleryImage}
          onRemove={removeGalleryImage}
        />
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
              additionalImageUrls: null,
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
              <Field label="Name" required>
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
              <Field label="Price ($)" required={!variant.isPriceOnRequest}>
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
                label="Media"
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

            <div className="mt-2">
              <span className="text-sm font-semibold text-navy">Additional media (shown as switchable thumbnails on the variant's detail popup)</span>
              <div className="mt-1 flex flex-wrap items-end gap-3">
                {(variant.additionalImageUrls ?? []).map((url, index) => (
                  <div key={url} className="flex flex-col items-center gap-1">
                    <img src={url} alt="" className="h-16 w-16 object-cover" />
                    <AdminButton
                      variant="danger"
                      onClick={async () => {
                        const next = (variant.additionalImageUrls ?? []).filter((_, i) => i !== index)
                        await updateVariant(variant.id, { additionalImageUrls: next.length > 0 ? next : null })
                        onChanged()
                      }}
                    >
                      Remove
                    </AdminButton>
                  </div>
                ))}
                <ImageUploadField
                  label="Add media"
                  currentUrl=""
                  onUploaded={async (url) => {
                    const next = [...(variant.additionalImageUrls ?? []), url]
                    await updateVariant(variant.id, { additionalImageUrls: next })
                    onChanged()
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function FaqsCard({ packageId, faqs, onChanged }: { packageId: number; faqs: AdminPackageFaqRow[]; onChanged: () => void }) {
  const ordered = [...faqs].sort((a, b) => a.sortOrder - b.sortOrder)

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= ordered.length) return
    const reordered = [...ordered]
    ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]
    await reorderPackageFaqs(packageId, reordered.map((faq) => faq.id))
    onChanged()
  }

  return (
    <Card
      title="FAQs"
      action={
        <AdminButton
          onClick={async () => {
            await createPackageFaq(packageId, { question: "New question?", answer: "New answer.", sortOrder: ordered.length })
            onChanged()
          }}
        >
          + Add
        </AdminButton>
      }
    >
      <div className="flex flex-col gap-3">
        {ordered.map((faq, index) => (
          <div key={faq.id} className="border border-border/60 p-3">
            <div className="grid grid-cols-1 gap-2">
              <Field label="Question" required>
                <Input
                  defaultValue={faq.question}
                  onBlur={async (e) => {
                    if (e.target.value !== faq.question) {
                      await updatePackageFaq(faq.id, { question: e.target.value })
                      onChanged()
                    }
                  }}
                />
              </Field>
              <Field label="Answer" required>
                <TextArea
                  rows={3}
                  defaultValue={faq.answer}
                  onBlur={async (e) => {
                    if (e.target.value !== faq.answer) {
                      await updatePackageFaq(faq.id, { answer: e.target.value })
                      onChanged()
                    }
                  }}
                />
              </Field>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <AdminButton onClick={() => move(index, -1)} disabled={index === 0}>
                ↑
              </AdminButton>
              <AdminButton onClick={() => move(index, 1)} disabled={index === ordered.length - 1}>
                ↓
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={async () => {
                  await deletePackageFaq(faq.id)
                  onChanged()
                }}
              >
                Delete
              </AdminButton>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
