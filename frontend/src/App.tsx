import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { WishlistProvider } from "@/context/WishlistContext"
import { ToastProvider } from "@/context/ToastContext"

const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })))
const PackagesPage = lazy(() => import("@/pages/PackagesPage").then((m) => ({ default: m.PackagesPage })))
const PackagesListingPage = lazy(() =>
  import("@/pages/PackagesListingPage").then((m) => ({ default: m.PackagesListingPage })),
)
const PackageDetailPage = lazy(() =>
  import("@/pages/PackageDetailPage").then((m) => ({ default: m.PackageDetailPage })),
)
const ALaCartePage = lazy(() => import("@/pages/ALaCartePage").then((m) => ({ default: m.ALaCartePage })))
const AddOnsPage = lazy(() => import("@/pages/AddOnsPage").then((m) => ({ default: m.AddOnsPage })))
const AddOnCategoryPage = lazy(() =>
  import("@/pages/AddOnCategoryPage").then((m) => ({ default: m.AddOnCategoryPage })),
)
const GalleryPage = lazy(() => import("@/pages/GalleryPage").then((m) => ({ default: m.GalleryPage })))
const FaqsPage = lazy(() => import("@/pages/FaqsPage").then((m) => ({ default: m.FaqsPage })))
const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })))
const PlanAPartyPage = lazy(() => import("@/pages/PlanAPartyPage").then((m) => ({ default: m.PlanAPartyPage })))
const WishlistPage = lazy(() => import("@/pages/WishlistPage").then((m) => ({ default: m.WishlistPage })))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })))

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="packages/full-services-packages" element={<PackagesListingPage />} />
              <Route path="packages/a-la-carte" element={<ALaCartePage />} />
              <Route path="packages/add-ons" element={<AddOnsPage />} />
              <Route path="packages/add-ons/:slug" element={<AddOnCategoryPage />} />
              <Route path="packages/:slug" element={<PackageDetailPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="faqs" element={<FaqsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="plan-a-party" element={<PlanAPartyPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
