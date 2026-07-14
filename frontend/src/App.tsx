import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Layout } from "@/components/layout/Layout"
import { WishlistProvider } from "@/context/WishlistContext"
import { ToastProvider } from "@/context/ToastContext"

const queryClient = new QueryClient()

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

const AdminLayout = lazy(() => import("@/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })))
const AdminLoginPage = lazy(() => import("@/admin/pages/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })))
const AdminHomePage = lazy(() => import("@/admin/pages/AdminHomePage").then((m) => ({ default: m.AdminHomePage })))
const AdminPackagesListPage = lazy(() =>
  import("@/admin/pages/AdminPackagesListPage").then((m) => ({ default: m.AdminPackagesListPage })),
)
const AdminPackageEditPage = lazy(() =>
  import("@/admin/pages/AdminPackageEditPage").then((m) => ({ default: m.AdminPackageEditPage })),
)
const AdminAddonCategoriesPage = lazy(() =>
  import("@/admin/pages/AdminAddonCategoriesPage").then((m) => ({ default: m.AdminAddonCategoriesPage })),
)
const AdminALaCartePage = lazy(() =>
  import("@/admin/pages/AdminALaCartePage").then((m) => ({ default: m.AdminALaCartePage })),
)
const AdminQuoteInquiriesPage = lazy(() =>
  import("@/admin/pages/AdminQuoteInquiriesPage").then((m) => ({ default: m.AdminQuoteInquiriesPage })),
)
const AdminQuoteInquiryDetailPage = lazy(() =>
  import("@/admin/pages/AdminQuoteInquiryDetailPage").then((m) => ({ default: m.AdminQuoteInquiryDetailPage })),
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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

              <Route path="admin/login" element={<AdminLoginPage />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminHomePage />} />
                <Route path="packages" element={<AdminPackagesListPage />} />
                <Route path="packages/:id" element={<AdminPackageEditPage />} />
                <Route path="addon-categories" element={<AdminAddonCategoriesPage />} />
                <Route path="a-la-carte" element={<AdminALaCartePage />} />
                <Route path="quote-inquiries" element={<AdminQuoteInquiriesPage />} />
                <Route path="quote-inquiries/:id" element={<AdminQuoteInquiryDetailPage />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
