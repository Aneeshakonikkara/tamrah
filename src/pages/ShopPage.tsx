import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Check,
  PackageOpen,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { Product, Collection } from '../types';
import {
  getProducts,
  getCategories,
  getCategoryProductCounts,
} from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import SEO from '../components/common/SEO';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';
type PriceFilter = 'all' | 'under-10k' | '10k-15k' | '15k-20k' | 'above-20k';
type AvailabilityFilter = 'all' | 'in-stock' | 'made-to-order';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const priceOptions: { value: PriceFilter; label: string }[] = [
  { value: 'all', label: 'All Prices' },
  { value: 'under-10k', label: 'Under ₹10,000' },
  { value: '10k-15k', label: '₹10,000 – ₹15,000' },
  { value: '15k-20k', label: '₹15,000 – ₹20,000' },
  { value: 'above-20k', label: 'Above ₹20,000' },
];

const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
  { value: 'all', label: 'All Items' },
  { value: 'in-stock', label: 'In Stock (Ready to Dispatch)' },
  { value: 'made-to-order', label: 'Made to Order' },
];

function ProductCardSkeleton() {
  return (
    <div className="product-card flex flex-col h-full bg-white border border-[#E8E6E1] animate-pulse">
      <div className="relative w-full pb-[100%] bg-[#F2EFE9]" />
      <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between bg-white space-y-3">
        <div className="space-y-2">
          <div className="h-2.5 bg-[#E8E6E1] rounded-xs w-1/3" />
          <div className="h-4 bg-[#E8E6E1] rounded-xs w-3/4" />
          <div className="h-3 bg-[#F2EFE9] rounded-xs w-full" />
          <div className="h-3 bg-[#F2EFE9] rounded-xs w-2/3" />
        </div>
        <div className="pt-3 border-t border-[#E8E6E1]/60 flex items-end justify-between">
          <div className="space-y-1 w-1/3">
            <div className="h-2 bg-[#E8E6E1] rounded-xs w-1/2" />
            <div className="h-4 bg-[#E8E6E1] rounded-xs w-full" />
          </div>
          <div className="h-7 w-20 bg-[#F2EFE9] rounded-xs" />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL query parameters
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = (searchParams.get('sort') as SortOption) || 'featured';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSort);
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(initialPage > 0 ? initialPage : 1);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Data states
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({ all: 0 });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);

  // Debounce search query to prevent spamming DB queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync state if URL query params change (e.g. from header search or nav link)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
    const search = searchParams.get('search') || '';
    if (search !== searchQuery) setSearchQuery(search);
    const page = parseInt(searchParams.get('page') || '1', 10);
    if (page > 0 && page !== currentPage) setCurrentPage(page);
  }, [searchParams]);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  // Load dynamic categories & count totals on initial mount
  useEffect(() => {
    let isCancelled = false;
    async function loadMetadata() {
      try {
        const [cats, counts] = await Promise.all([
          getCategories(),
          getCategoryProductCounts(),
        ]);
        if (!isCancelled) {
          setCollectionsList(cats);
          setCategoryCounts(counts);
        }
      } catch (err) {
        console.warn('[TAMRAH] Failed to load categories or counts:', err);
      }
    }
    loadMetadata();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Fetch paginated, filtered products from Supabase (or fallback)
  useEffect(() => {
    let isCancelled = false;

    async function fetchCatalogue() {
      setLoading(true);
      setError(null);

      let minPrice: number | undefined;
      let maxPrice: number | undefined;
      if (selectedPrice === 'under-10k') {
        maxPrice = 10000;
      } else if (selectedPrice === '10k-15k') {
        minPrice = 10000;
        maxPrice = 15000;
      } else if (selectedPrice === '15k-20k') {
        minPrice = 15000;
        maxPrice = 20000;
      } else if (selectedPrice === 'above-20k') {
        minPrice = 20000;
      }

      const sortByMap: Record<SortOption, 'featured' | 'price_asc' | 'price_desc' | 'newest'> = {
        featured: 'featured',
        'price-asc': 'price_asc',
        'price-desc': 'price_desc',
        newest: 'newest',
      };

      try {
        const result = await getProducts({
          page: currentPage,
          pageSize: 12,
          categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
          searchQuery: debouncedSearch.trim() || undefined,
          sortBy: sortByMap[selectedSort],
          availability: selectedAvailability === 'all' ? undefined : selectedAvailability,
          minPrice,
          maxPrice,
        });

        if (!isCancelled) {
          setProductsList(result.data);
          setTotalCount(result.totalCount);
          setTotalPages(result.totalPages);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('[TAMRAH DB] Catalogue fetch error:', err);
          setError('Unable to retrieve catalogue items from the database. Please try again.');
          setLoading(false);
        }
      }
    }

    fetchCatalogue();

    return () => {
      isCancelled = true;
    };
  }, [
    selectedCategory,
    selectedSort,
    selectedPrice,
    selectedAvailability,
    debouncedSearch,
    currentPage,
    retryTrigger,
  ]);

  // Handle Category selection & URL update
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // Handle Search Input & URL update
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      newParams.set('search', query.trim());
    } else {
      newParams.delete('search');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // Handle Pagination change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', newPage.toString());
    }
    setSearchParams(newParams);

    // Scroll back to top of product grid smoothly
    const gridElement = document.getElementById('catalogue-grid-section');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Clear all filters
  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedSort('featured');
    setSelectedPrice('all');
    setSelectedAvailability('all');
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const isFiltered =
    selectedCategory !== 'all' ||
    selectedPrice !== 'all' ||
    selectedAvailability !== 'all' ||
    selectedSort !== 'featured' ||
    searchQuery.trim() !== '';

  const activeCategoryObject = collectionsList.find((c) => c.id === selectedCategory);

  return (
    <>
      <SEO
        title={
          activeCategoryObject
            ? `${activeCategoryObject.name} Collection — Handcrafted Metal Décor`
            : 'Explore Our Collection — Handcrafted Black-Metal Décor'
        }
        description={
          activeCategoryObject
            ? `${activeCategoryObject.description || activeCategoryObject.shortDescription} Handcrafted in Andhra Pradesh.`
            : "Browse TAMRAH's complete catalogue of handcrafted black-metal sculptures, sacred idols, architectural wall décor, and lamps forged in Andhra Pradesh."
        }
        canonicalUrl="https://tamrah.in/shop"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
          ...(activeCategoryObject
            ? [{ name: activeCategoryObject.name, url: `/collections/${activeCategoryObject.id}` }]
            : []),
        ]}
      />

      {/* ── 1. PAGE HEADER & BREADCRUMB ──────────────────────── */}
      <div className="bg-[#FAF8F5] border-b border-[#E8E6E1] py-8 sm:py-12">
        <div className="container-site">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumbs" className="mb-4">
            <ol className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-[#928F89]">
              <li>
                <Link to="/" className="hover:text-[#1A1916] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-[#1A1916] font-medium">Shop</li>
              {activeCategoryObject && (
                <>
                  <li>/</li>
                  <li className="text-[#7C5A2A] font-medium">{activeCategoryObject.name}</li>
                </>
              )}
            </ol>
          </nav>

          {/* Heading & Intro */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[0.6875rem] uppercase tracking-[0.24em] text-[#7C5A2A] font-medium block mb-2">
                Catalogue Repertoire
              </span>
              <h1
                className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1916] font-light tracking-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {activeCategoryObject ? activeCategoryObject.name : 'Explore Our Collection'}
              </h1>
              <p className="text-xs sm:text-sm text-[#5E5B55] font-light mt-3 leading-relaxed">
                {activeCategoryObject
                  ? activeCategoryObject.description
                  : 'Masterworks in deep matte-black metal, individually cast and hand-chiseled in Andhra Pradesh. Each piece is made to order or crafted in limited studio batches.'}
              </p>
            </div>

            {/* Dynamic Product Count Indicator */}
            <div className="shrink-0 bg-white border border-[#E8E6E1] px-4 py-2 self-start md:self-end">
              <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-[#928F89] block">
                Catalogue Count
              </span>
              <span className="text-sm sm:text-base font-serif font-medium text-[#1A1916]">
                {loading ? 'Updating…' : `${totalCount} ${totalCount === 1 ? 'Handcrafted Piece' : 'Handcrafted Pieces'}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. CATEGORY NAVIGATION (Tabs) ────────────────────── */}
      <div className="sticky top-18 lg:top-22 z-30 bg-[#FDFCF9]/95 backdrop-blur-md border-b border-[#E8E6E1] shadow-xs">
        <div className="container-site">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`px-3 sm:px-4 py-3 text-xs tracking-[0.1em] uppercase font-medium whitespace-nowrap transition-all border-b-2 ${
                  selectedCategory === 'all'
                    ? 'border-[#1A1916] text-[#1A1916] font-semibold'
                    : 'border-transparent text-[#5E5B55] hover:text-[#1A1916]'
                }`}
              >
                All Products ({categoryCounts.all || 0})
              </button>

              {collectionsList.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleCategoryChange(col.id)}
                  className={`px-3 sm:px-4 py-3 text-xs tracking-[0.1em] uppercase font-medium whitespace-nowrap transition-all border-b-2 ${
                    selectedCategory === col.id
                      ? 'border-[#1A1916] text-[#1A1916] font-semibold'
                      : 'border-transparent text-[#5E5B55] hover:text-[#1A1916]'
                  }`}
                >
                  {col.name} ({categoryCounts[col.id] || 0})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. FILTER, SEARCH & SORT CONTROLS ─────────────────── */}
      <div className="bg-[#FDFCF9] py-5 border-b border-[#E8E6E1]">
        <div className="container-site">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

            {/* Search Input Bar (Supports name and SKU) */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#928F89]"
              />
              <input
                type="text"
                placeholder="Search by piece name, SKU (e.g. TMR-SC-001)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-white border border-[#E8E6E1] pl-9 pr-9 py-2.5 text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none focus:border-[#1A1916]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#928F89] hover:text-[#1A1916]"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Desktop Filters (Price & Availability & Sort) */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Price Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedPrice}
                  onChange={(e) => {
                    setSelectedPrice(e.target.value as PriceFilter);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by price range"
                  className="appearance-none bg-white border border-[#E8E6E1] text-xs font-medium text-[#1A1916] pl-3.5 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-[#1A1916]"
                >
                  {priceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#928F89] pointer-events-none"
                />
              </div>

              {/* Availability Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedAvailability}
                  onChange={(e) => {
                    setSelectedAvailability(e.target.value as AvailabilityFilter);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by availability"
                  className="appearance-none bg-white border border-[#E8E6E1] text-xs font-medium text-[#1A1916] pl-3.5 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-[#1A1916]"
                >
                  {availabilityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#928F89] pointer-events-none"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value as SortOption);
                    setCurrentPage(1);
                  }}
                  aria-label="Sort products"
                  className="appearance-none bg-white border border-[#E8E6E1] text-xs font-medium text-[#1A1916] pl-3.5 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-[#1A1916]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sort: {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#928F89] pointer-events-none"
                />
              </div>

              {/* Clear all active filters */}
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-[0.1em] text-[#7C5A2A] hover:text-[#1A1916] transition-colors"
                  title="Clear all active filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Mobile Filter Trigger Button */}
            <div className="flex lg:hidden items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-[#E8E6E1] px-4 py-2.5 text-xs font-medium text-[#1A1916]"
              >
                <SlidersHorizontal size={14} />
                <span>Filters & Sort {isFiltered && '• Active'}</span>
              </button>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="p-2.5 bg-white border border-[#E8E6E1] text-[#7C5A2A]"
                  aria-label="Reset all filters"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {isFiltered && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#E8E6E1]/60">
              <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-[#928F89] mr-1">
                Active filters:
              </span>

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#E8E6E1] px-2.5 py-1 text-xs text-[#1A1916]">
                  <span>Category: {activeCategoryObject?.name || selectedCategory}</span>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('all')}
                    className="text-[#928F89] hover:text-[#1A1916]"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedPrice !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#E8E6E1] px-2.5 py-1 text-xs text-[#1A1916]">
                  <span>{priceOptions.find((p) => p.value === selectedPrice)?.label}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPrice('all')}
                    className="text-[#928F89] hover:text-[#1A1916]"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedAvailability !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#E8E6E1] px-2.5 py-1 text-xs text-[#1A1916]">
                  <span>{availabilityOptions.find((a) => a.value === selectedAvailability)?.label}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedAvailability('all')}
                    className="text-[#928F89] hover:text-[#1A1916]"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#E8E6E1] px-2.5 py-1 text-xs text-[#1A1916]">
                  <span>Search: "{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="text-[#928F89] hover:text-[#1A1916]"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleClearAll}
                className="text-[0.6875rem] uppercase tracking-[0.1em] text-[#7C5A2A] hover:underline font-medium ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── 4. PRODUCT GRID & ERROR / LOADING / EMPTY STATES ─── */}
      <section
        id="catalogue-grid-section"
        className="section-padding bg-[#FDFCF9] min-h-[500px]"
        aria-label="Product Catalogue"
      >
        <div className="container-site">
          {/* Error State */}
          {error && (
            <div className="mb-8 p-5 bg-[#FAF5F0] border border-[#E8D7C8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-[#7C5A2A]">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs sm:text-sm font-light text-[#5E5B55]">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setRetryTrigger((prev) => prev + 1)}
                className="btn btn-secondary px-4 py-2 text-xs uppercase tracking-[0.12em] shrink-0 inline-flex items-center gap-2"
              >
                <RefreshCw size={12} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : productsList.length > 0 ? (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {productsList.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    aspectRatio="1/1"
                    showCollection={selectedCategory === 'all'}
                  />
                ))}
              </div>

              {/* ── 5. SERVER-SIDE PAGINATION CONTROLS ──────── */}
              {totalPages > 1 && (
                <nav
                  aria-label="Catalogue pagination"
                  className="mt-14 pt-8 border-t border-[#E8E6E1] flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <p className="text-xs text-[#928F89] font-light order-2 sm:order-1">
                    Showing {(currentPage - 1) * 12 + 1}–{Math.min(currentPage * 12, totalCount)} of {totalCount} Handcrafted Pieces
                  </p>

                  <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-2 text-xs uppercase tracking-[0.1em] font-medium border border-[#E8E6E1] bg-white text-[#1A1916] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] transition-colors"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      if (
                        p === 1 ||
                        p === totalPages ||
                        (p >= currentPage - 1 && p <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handlePageChange(p)}
                            className={`w-9 h-9 text-xs font-medium border transition-colors ${
                              p === currentPage
                                ? 'border-[#1A1916] bg-[#1A1916] text-[#FDFCF9]'
                                : 'border-[#E8E6E1] bg-white text-[#5E5B55] hover:bg-[#FAF8F5]'
                            }`}
                            aria-current={p === currentPage ? 'page' : undefined}
                          >
                            {p}
                          </button>
                        );
                      }
                      if (p === currentPage - 2 || p === currentPage + 2) {
                        return (
                          <span key={p} className="px-1 text-xs text-[#928F89]">
                            …
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-2 text-xs uppercase tracking-[0.1em] font-medium border border-[#E8E6E1] bg-white text-[#1A1916] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] transition-colors"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </>
          ) : (
            /* No Results State */
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E6E1] flex items-center justify-center mx-auto mb-4 text-[#928F89]">
                <PackageOpen size={28} strokeWidth={1.5} />
              </div>
              <h3
                className="font-serif text-2xl text-[#1A1916] mb-2 font-normal"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                No Matching Pieces Found
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed mb-6">
                We couldn't find any handcrafted works matching your current criteria. Try expanding your filters or search keywords.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="btn btn-primary px-6 py-2.5 text-xs uppercase tracking-[0.14em]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 6. MOBILE FILTER & SORT DRAWER ───────────────────── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0E0D0B]/60 backdrop-blur-xs"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-over Drawer Panel */}
        <div
          className="absolute right-0 top-0 bottom-0 bg-[#FDFCF9] flex flex-col shadow-2xl"
          style={{
            width: 'min(90vw, 380px)',
            transform: mobileDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Drawer Top */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#E8E6E1]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} />
              <span className="font-serif text-lg font-medium text-[#1A1916]">
                Filters & Sorting
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="p-2 text-[#5E5B55] hover:text-[#1A1916]"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Sort Section */}
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-[#928F89] font-medium mb-3">
                Sort By
              </p>
              <div className="space-y-1.5">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedSort(opt.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 text-xs text-left border transition-colors ${
                      selectedSort === opt.value
                        ? 'border-[#1A1916] bg-[#FAF8F5] text-[#1A1916] font-medium'
                        : 'border-[#E8E6E1] text-[#5E5B55] hover:bg-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedSort === opt.value && <Check size={14} className="text-[#B8943F]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-[#928F89] font-medium mb-3">
                Category
              </p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full flex items-center justify-between p-2.5 text-xs text-left border transition-colors ${
                    selectedCategory === 'all'
                      ? 'border-[#1A1916] bg-[#FAF8F5] text-[#1A1916] font-medium'
                      : 'border-[#E8E6E1] text-[#5E5B55] hover:bg-white'
                  }`}
                >
                  <span>All Collections ({categoryCounts.all || 0})</span>
                  {selectedCategory === 'all' && <Check size={14} className="text-[#B8943F]" />}
                </button>
                {collectionsList.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => handleCategoryChange(col.id)}
                    className={`w-full flex items-center justify-between p-2.5 text-xs text-left border transition-colors ${
                      selectedCategory === col.id
                        ? 'border-[#1A1916] bg-[#FAF8F5] text-[#1A1916] font-medium'
                        : 'border-[#E8E6E1] text-[#5E5B55] hover:bg-white'
                    }`}
                  >
                    <span>{col.name} ({categoryCounts[col.id] || 0})</span>
                    {selectedCategory === col.id && <Check size={14} className="text-[#B8943F]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-[#928F89] font-medium mb-3">
                Price Range
              </p>
              <div className="space-y-1.5">
                {priceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedPrice(opt.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 text-xs text-left border transition-colors ${
                      selectedPrice === opt.value
                        ? 'border-[#1A1916] bg-[#FAF8F5] text-[#1A1916] font-medium'
                        : 'border-[#E8E6E1] text-[#5E5B55] hover:bg-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedPrice === opt.value && <Check size={14} className="text-[#B8943F]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-[#928F89] font-medium mb-3">
                Availability
              </p>
              <div className="space-y-1.5">
                {availabilityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedAvailability(opt.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 text-xs text-left border transition-colors ${
                      selectedAvailability === opt.value
                        ? 'border-[#1A1916] bg-[#FAF8F5] text-[#1A1916] font-medium'
                        : 'border-[#E8E6E1] text-[#5E5B55] hover:bg-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedAvailability === opt.value && <Check size={14} className="text-[#B8943F]" />}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Drawer Bottom Actions */}
          <div className="p-4 border-t border-[#E8E6E1] bg-[#FAF8F5] flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex-1 py-3 text-xs uppercase tracking-[0.12em] font-medium text-[#1A1916] border border-[#C8C5BF] hover:bg-white transition-colors"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex-1 py-3 bg-[#1A1916] text-white text-xs uppercase tracking-[0.12em] font-medium hover:bg-black transition-colors"
            >
              Show {totalCount} Pieces
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
