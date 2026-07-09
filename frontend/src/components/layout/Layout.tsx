import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { FloatingWishlistWidget } from "@/components/layout/FloatingWishlistWidget"

function PageLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-pink" />
    </div>
  )
}

/**
 * No page-transition crossfade here on purpose: an AnimatePresence
 * mode="wait" wrapper keyed on pathname used to wrap <Outlet />, but nested
 * AnimatePresence instances further down the tree (e.g. the package grid's
 * own popLayout animation) could leave the incoming page's wrapper stuck at
 * its `initial` opacity of 0 forever — a real, reproduced bug where routes
 * like Full Service Packages rendered a blank page after client-side
 * navigation until a manual refresh. Rendering <Outlet /> directly removes
 * that whole failure class.
 */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingWishlistWidget />
    </div>
  )
}
