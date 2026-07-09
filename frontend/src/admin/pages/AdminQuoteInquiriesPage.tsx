import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchAdminQuoteInquiries } from "@/lib/adminApi"

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
}

export function AdminQuoteInquiriesPage() {
  const { data: inquiries, isPending } = useQuery({ queryKey: ["admin", "quote-inquiries"], queryFn: fetchAdminQuoteInquiries })

  return (
    <div>
      <h1 className="text-2xl font-bold">Quote Inquiries</h1>

      {isPending ? (
        <p className="mt-6 text-sm text-slate-500">Loading…</p>
      ) : inquiries && inquiries.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No quote inquiries yet.</p>
      ) : (
        <table className="mt-6 w-full border border-slate-200 bg-white text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Event Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Submitted</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {inquiries?.map((inquiry) => (
              <tr key={inquiry.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{inquiry.name}</td>
                <td className="p-3">{inquiry.eventDate}</td>
                <td className="p-3">{STATUS_LABEL[inquiry.status]}</td>
                <td className="p-3 text-slate-500">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <Link to={`/admin/quote-inquiries/${inquiry.id}`} className="text-slate-700 underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
