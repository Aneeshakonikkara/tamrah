import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// ── Lazy-Loaded Pages for Route-Level Code Splitting ─────────
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const OurCraftPage = lazy(() => import('./pages/OurCraftPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const BulkOrdersPage = lazy(() => import('./pages/BulkOrdersPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminCataloguePage = lazy(() => import('./pages/AdminCataloguePage'));

// ── Editorial Brand Loading Skeleton Fallback ────────────────
function PageLoadingFallback() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFCF9] py-24"
      aria-label="Loading page content"
      role="status"
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-[#E8E6E1]" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[#7C5A2A] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <span className="font-serif text-xs font-semibold text-[#1A1916]">T</span>
      </div>
      <p className="mt-4 font-serif text-xs uppercase tracking-[0.2em] text-[#928F89]">
        TAMRAH
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* ── Admin Management Routes ── */}
          <Route
            path="admin"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AdminCataloguePage />
              </Suspense>
            }
          />
          <Route
            path="admin/catalogue"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AdminCataloguePage />
              </Suspense>
            }
          />
          <Route
            path="admin/import"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AdminCataloguePage />
              </Suspense>
            }
          />
          <Route
            path="admin/export"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AdminCataloguePage />
              </Suspense>
            }
          />

          {/* ── Public Catalogue Pages ── */}
          <Route
            index
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="shop"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ShopPage />
              </Suspense>
            }
          />
          <Route
            path="collections"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ShopPage />
              </Suspense>
            }
          />
          <Route
            path="collections-overview"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <CollectionsPage />
              </Suspense>
            }
          />
          <Route
            path="collections/:slug"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <CollectionPage />
              </Suspense>
            }
          />
          <Route
            path="products/:slug"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ProductPage />
              </Suspense>
            }
          />

          {/* ── Brand & Information Pages ── */}
          <Route
            path="about"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="our-story"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="our-craft"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <OurCraftPage />
              </Suspense>
            }
          />
          <Route
            path="craft"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <OurCraftPage />
              </Suspense>
            }
          />
          <Route
            path="faq"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <FaqPage />
              </Suspense>
            }
          />
          <Route
            path="faqs"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <FaqPage />
              </Suspense>
            }
          />
          <Route
            path="bulk-orders"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <BulkOrdersPage />
              </Suspense>
            }
          />
          <Route
            path="business-enquiries"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <BulkOrdersPage />
              </Suspense>
            }
          />
          <Route
            path="trade"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <BulkOrdersPage />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ContactPage />
              </Suspense>
            }
          />

          {/* ── Stubs & Aliases ── */}
          <Route
            path="new-arrivals"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <CollectionsPage />
              </Suspense>
            }
          />
          <Route
            path="gifting"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <BulkOrdersPage />
              </Suspense>
            }
          />
          <Route
            path="corporate"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <BulkOrdersPage />
              </Suspense>
            }
          />
          <Route
            path="enquiry"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ContactPage />
              </Suspense>
            }
          />

          {/* ── 404 ── */}
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
