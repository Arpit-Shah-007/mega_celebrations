import { Loader2 } from "lucide-react"

export function PageLoadingState() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-24 text-navy">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm text-body">Loading&hellip;</p>
    </div>
  )
}

export function PageErrorState({ message = "Something went wrong loading this page. Please try again." }: { message?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 py-24 text-center">
      <p className="text-body">{message}</p>
    </div>
  )
}
