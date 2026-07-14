import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchAdminQuoteInquiries } from "@/lib/adminApi"
import { Badge } from "@/admin/components/AdminForm"
import { PageLoadingState } from "@/components/ui/PageLoadingState"

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
}

const STATUS_TONE: Record<string, "neutral" | "pink" | "blue"> = {
  new: "blue",
  contacted: "blue",
  quoted: "blue",
  won: "pink",
  lost: "neutral",
}

export function AdminQuoteInquiriesPage() {
  const { data: inquiries, isPending } = useQuery({ queryKey: ["admin", "quote-inquiries"], queryFn: fetchAdminQuoteInquiries })

  return (
    <div>
      <h1 className="text-2xl font-bold">Quote Inquiries</h1>

      {isPending ? (
        <PageLoadingState />
      ) : inquiries && inquiries.length === 0 ? (
        <p className="mt-6 text-sm text-body">No quote inquiries yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border-t-4 border-blue bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-graytint text-left">
              <tr>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Name</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Event Date</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Status</th>
                <th className="p-3 font-bold uppercase tracking-wide text-navy">Submitted</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {inquiries?.map((inquiry) => (
                <tr key={inquiry.id} className="border-t border-border/60 hover:bg-offwhite">
                  <td className="p-3 font-bold text-navy">{inquiry.name}</td>
                  <td className="p-3 text-body">{inquiry.eventDate}</td>
                  <td className="p-3">
                    <Badge tone={STATUS_TONE[inquiry.status]}>{STATUS_LABEL[inquiry.status]}</Badge>
                  </td>
                  <td className="p-3 text-ui-gray">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Link to={`/admin/quote-inquiries/${inquiry.id}`} className="text-sm font-bold uppercase tracking-wide text-blue hover:text-navy">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
