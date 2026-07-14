import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchAdminQuoteInquiry, updateQuoteInquiryStatus, type AdminQuoteInquiryRow } from "@/lib/adminApi"
import { Card } from "@/admin/components/AdminForm"

const STATUSES: AdminQuoteInquiryRow["status"][] = ["new", "contacted", "quoted", "won", "lost"]

export function AdminQuoteInquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const inquiryId = Number(id)
  const queryClient = useQueryClient()
  const { data: inquiry, isPending } = useQuery({
    queryKey: ["admin", "quote-inquiry", inquiryId],
    queryFn: () => fetchAdminQuoteInquiry(inquiryId),
  })

  const statusMutation = useMutation({
    mutationFn: (status: AdminQuoteInquiryRow["status"]) => updateQuoteInquiryStatus(inquiryId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "quote-inquiry", inquiryId] })
      queryClient.invalidateQueries({ queryKey: ["admin", "quote-inquiries"] })
    },
  })

  if (isPending || !inquiry) return <p className="text-sm text-ui-gray">Loading…</p>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{inquiry.name}</h1>

      <Card title="Contact">
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ui-gray">Email</dt>
            <dd>{inquiry.email}</dd>
          </div>
          <div>
            <dt className="text-ui-gray">Phone</dt>
            <dd>{inquiry.phone}</dd>
          </div>
          <div>
            <dt className="text-ui-gray">Event Date</dt>
            <dd>{inquiry.eventDate}</dd>
          </div>
          <div>
            <dt className="text-ui-gray">Venue</dt>
            <dd>{inquiry.venue}</dd>
          </div>
          <div>
            <dt className="text-ui-gray">Guest Count</dt>
            <dd>{inquiry.guestCount}</dd>
          </div>
        </dl>
        {inquiry.notes ? (
          <div className="mt-3">
            <p className="text-ui-gray">Notes</p>
            <p className="whitespace-pre-wrap">{inquiry.notes}</p>
          </div>
        ) : null}
      </Card>

      <Card title="Status">
        <select
          value={inquiry.status}
          onChange={(e) => statusMutation.mutate(e.target.value as AdminQuoteInquiryRow["status"])}
          className="border border-border px-3 py-2 text-sm"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </Card>

      <Card title="Wishlist at Submission">
        <ul className="flex flex-col gap-2 text-sm">
          {inquiry.items.map((item) => (
            <li key={item.id} className="flex justify-between border-b border-border/60 pb-1">
              <span>{item.itemName}</span>
              <span className="text-ui-gray">{item.itemPriceCents != null ? `$${(item.itemPriceCents / 100).toFixed(2)}` : "Contact us"}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
