import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-10 text-center">
      <h1 className="text-5xl text-navy">404</h1>
      <p className="text-body">We couldn&apos;t find that page.</p>
      <Link to="/" className="font-semibold text-pink underline">
        Back to home
      </Link>
    </div>
  )
}
