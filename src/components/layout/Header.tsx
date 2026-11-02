import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, MessageCircle, ArrowRight } from 'lucide-react';
import type { Product, Collection } from '../../types';
import { getCategories, getProducts } from '../../services/productService';
import { buildGeneralEnquiryUrl } from '../../config/whatsapp';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  /* Load active categories dynamically */
  useEffect(() => {
    getCategories().then(setCollectionsList).catch(console.warn);
  }, []);

  /* Close menus on route change */
  useEffect(() => {
    setMobileOpen(false);
    setCollectionsOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  /* Focus search input when search opened */
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  /* Scroll detection */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Prevent body scroll when drawer or search open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, searchOpen]);

  /* Dynamic search filtered items */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await getProducts({ searchQuery: searchQuery.trim(), pageSize: 5 });
        setSearchResults(res.data);
      } catch (err) {
        console.warn('Header search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const whatsappUrl = buildGeneralEnquiryUrl();

  return (
    <>
      {/* ── 1. ANNOUNCEMENT BAR ──────────────────────────────── */}
      <aside
        id="announcement-bar"
        aria-label="Announcement"
        className="w-full bg-[#141311] text-[#E5E0D8] text-[0.6875rem] tracking-[0.14em] uppercase py-2.5 px-4 text-center border-b border-[#2C2924] z-50 relative"
      >
        <div className="container-site flex items-center justify-center gap-3">
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#B8943F]/80"></span>
          <span className="font-medium">
            Discover handcrafted pieces for timeless spaces
          </span>
          <span className="hidden md:inline text-[#928F89]">• Andhra Pradesh Heritage Metalcraft</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#B8943F]/80"></span>
        </div>
      </aside>

      {/* ── 2. HEADER / NAVIGATION (Sticky) ──────────────────── */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FDFCF9]/95 backdrop-blur-md border-b border-[#E8E6E1] shadow-xs'
            : 'bg-[#FDFCF9] border-b border-[#E8E6E1]'
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-18 lg:h-22">

            {/* ── Brand Logo (Left) ── */}
            <Link
              to="/"
              className="flex flex-col items-start group text-decoration-none"
              aria-label="TAMRAH Home"
            >
              <span
                className="font-serif tracking-[0.24em] text-[#1A1916] text-2xl lg:text-[1.75rem] font-medium transition-colors group-hover:text-[#7C5A2A]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                TAMRAH
              </span>
              <span className="text-[0.5625rem] tracking-[0.28em] uppercase text-[#928F89] -mt-1 hidden sm:block">
                Handcrafted Metal Décor
              </span>
            </Link>

            {/* ── Desktop Navigation Links (Center) ── */}
            <nav className="hidden lg:flex items-center gap-9" aria-label="Main Navigation">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-item-link text-xs tracking-[0.12em] uppercase font-medium transition-colors ${
                    isActive ? 'text-[#1A1916] font-semibold active' : 'text-[#5E5B55] hover:text-[#1A1916]'
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `nav-item-link text-xs tracking-[0.12em] uppercase font-medium transition-colors ${
                    isActive ? 'text-[#1A1916] font-semibold active' : 'text-[#5E5B55] hover:text-[#1A1916]'
                  }`
                }
              >
                Shop
              </NavLink>

              {/* Collections with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="nav-item-link flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase font-medium bg-transparent border-0 cursor-pointer text-[#5E5B55] hover:text-[#1A1916]"
                  onClick={() => setCollectionsOpen((v) => !v)}
                  aria-expanded={collectionsOpen}
                  aria-haspopup="true"
                >
                  Collections
                  <ChevronDown
                    size={13}
                    className="transition-transform duration-200"
                    style={{ transform: collectionsOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>

                {collectionsOpen && (
                  <div
                    className="absolute top-full left-1/2 mt-3 bg-[#FDFCF9] border border-[#E8E6E1] shadow-lg py-3 w-64 z-50"
                    style={{
                      transform: 'translateX(-50%)',
                      animation: 'fadeInDown 150ms ease',
                    }}
                  >
                    <div className="px-5 py-1 mb-2 border-b border-[#E8E6E1]/60">
                      <span className="text-[0.625rem] uppercase tracking-[0.15em] text-[#928F89] font-medium">
                        Browse by Category
                      </span>
                    </div>
                    {collectionsList.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        className="block px-5 py-2 text-xs text-[#5E5B55] hover:text-[#1A1916] hover:bg-[#F8F6F1] transition-colors"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-[#E8E6E1]/60 px-5">
                      <Link
                        to="/shop"
                        className="text-[0.6875rem] tracking-[0.1em] uppercase text-[#7C5A2A] font-medium hover:underline inline-flex items-center gap-1"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        View All Collections <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-item-link text-xs tracking-[0.12em] uppercase font-medium transition-colors ${
                    isActive ? 'text-[#1A1916] font-semibold active' : 'text-[#5E5B55] hover:text-[#1A1916]'
                  }`
                }
              >
                About Us
              </NavLink>

              <NavLink
                to="/our-craft"
                className={({ isActive }) =>
                  `nav-item-link text-xs tracking-[0.12em] uppercase font-medium transition-colors ${
                    isActive ? 'text-[#1A1916] font-semibold active' : 'text-[#5E5B55] hover:text-[#1A1916]'
                  }`
                }
              >
                Our Craft
              </NavLink>

              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  `nav-item-link text-xs tracking-[0.12em] uppercase font-medium transition-colors ${
                    isActive ? 'text-[#1A1916] font-semibold active' : 'text-[#5E5B55] hover:text-[#1A1916]'
                  }`
                }
              >
                FAQ
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-item-link text-xs tracking-[0.12em] uppercase font-medium transition-colors ${
                    isActive ? 'text-[#1A1916] font-semibold active' : 'text-[#5E5B55] hover:text-[#1A1916]'
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* ── Right Actions (Search & WhatsApp Enquiry) ── */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#3A3834] hover:text-[#1A1916] transition-colors rounded-full hover:bg-[#F8F6F1]"
                aria-label="Search products"
                title="Search handcrafted pieces"
              >
                <Search size={19} strokeWidth={1.75} />
              </button>

              {/* WhatsApp Enquiry Link / Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs tracking-[0.08em] uppercase font-medium text-[#1A1916] border border-[#C8C5BF] hover:border-[#1A1916] hover:bg-[#F8F6F1] transition-all"
                title="Enquire directly on WhatsApp"
              >
                <MessageCircle size={15} className="text-[#25D366]" />
                <span className="hidden md:inline">WhatsApp Enquiry</span>
                <span className="md:hidden">Enquire</span>
              </a>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                className="lg:hidden p-2 text-[#1A1916] hover:bg-[#F8F6F1] transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={23} /> : <Menu size={23} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── SEARCH MODAL ───────────────────────────────────────── */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search Catalogue"
          className="fixed inset-0 z-50 bg-[#1A1916]/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 transition-opacity duration-200"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#FDFCF9] border border-[#E8E6E1] shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeInDown 200ms ease' }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1]">
              <div className="flex items-center gap-3 flex-1">
                <Search size={20} className="text-[#928F89]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search sculptures, wall panels, mirrors, lamps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base text-[#1A1916] placeholder-[#928F89] focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                    if (e.key === 'Enter') {
                      if (searchResults.length > 0) {
                        navigate(`/products/${searchResults[0].slug}`);
                      } else if (searchQuery.trim()) {
                        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      }
                      setSearchOpen(false);
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[#928F89] hover:text-[#1A1916] transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results or Suggestions */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div>
                  <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#928F89] mb-3">
                    Popular Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {collectionsList.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="px-3 py-1.5 text-xs bg-[#F8F6F1] text-[#3A3834] hover:bg-[#1A1916] hover:text-white transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : searchLoading ? (
                <div className="py-6 text-center text-xs text-[#928F89]">
                  Searching catalogue...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#928F89]">
                    Matching Pieces ({searchResults.length})
                  </p>
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 p-2 hover:bg-[#F8F6F1] transition-colors group"
                    >
                      <img
                        src={p.images[0]?.src || '/images/categories/sculptures.jpg'}
                        alt={p.name}
                        className="w-14 h-14 object-cover border border-[#E8E6E1]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-serif text-[#1A1916] group-hover:text-[#7C5A2A] transition-colors truncate">
                          {p.name}
                        </h4>
                        <p className="text-xs text-[#928F89] truncate">{p.shortDescription}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-[#1A1916]">{p.formattedPrice}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[#928F89]">
                  <p className="text-sm">No handcrafted pieces found matching "{searchQuery}".</p>
                  <p className="text-xs mt-1">Try searching for "Nataraja", "Ganesha", "Mandala", or "Mirror".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RESPONSIVE MOBILE NAVIGATION DRAWER ────────────────── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0E0D0B]/60 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          className="absolute right-0 top-0 bottom-0 bg-[#FDFCF9] flex flex-col shadow-2xl"
          style={{
            width: 'min(88vw, 380px)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Drawer Top */}
          <div className="flex items-center justify-between px-6 h-18 border-b border-[#E8E6E1]">
            <span
              className="font-serif tracking-[0.2em] text-xl font-medium text-[#1A1916]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              TAMRAH
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 -mr-2 text-[#5E5B55] hover:text-[#1A1916]"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Quick Search Button in Drawer */}
          <div className="p-4 border-b border-[#E8E6E1] bg-[#F8F6F1]">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-[#E8E6E1] text-xs text-[#928F89] text-left"
            >
              <Search size={15} />
              <span>Search handcrafted pieces...</span>
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-4" aria-label="Mobile navigation">
            <Link
              to="/"
              className="block text-sm font-medium tracking-[0.1em] uppercase text-[#1A1916] hover:text-[#7C5A2A] py-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="block text-sm font-medium tracking-[0.1em] uppercase text-[#1A1916] hover:text-[#7C5A2A] py-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Shop
            </Link>

            {/* Categories Accordion */}
            <div className="pt-2 pb-2">
              <p className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-[#928F89] mb-2">
                Collections & Categories
              </p>
              <div className="space-y-2 pl-2 border-l border-[#E8E6E1]">
                {collectionsList.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    className="block text-xs text-[#5E5B55] hover:text-[#1A1916] py-1 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              className="block text-sm font-medium tracking-[0.1em] uppercase text-[#1A1916] hover:text-[#7C5A2A] py-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              About Us
            </Link>

            <Link
              to="/our-craft"
              className="block text-sm font-medium tracking-[0.1em] uppercase text-[#1A1916] hover:text-[#7C5A2A] py-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Our Craft
            </Link>

            <Link
              to="/faq"
              className="block text-sm font-medium tracking-[0.1em] uppercase text-[#1A1916] hover:text-[#7C5A2A] py-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </Link>

            <Link
              to="/bulk-orders"
              className="block text-sm font-medium tracking-[0.1em] uppercase text-[#1A1916] hover:text-[#7C5A2A] py-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Bulk Orders & Trade
            </Link>

            <Link
              to="/contact"
              className="block text-sm font-medium tracking-[0.1em] uppercase text-[#1A1916] hover:text-[#7C5A2A] py-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </nav>

          {/* WhatsApp Enquiry CTA in Drawer */}
          <div className="p-6 border-t border-[#E8E6E1] bg-[#F8F6F1] space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full justify-center gap-2 py-3 text-xs"
              onClick={() => setMobileOpen(false)}
            >
              <MessageCircle size={16} className="text-[#25D366]" />
              WhatsApp Enquiry
            </a>
            <p className="text-[0.6875rem] text-center text-[#928F89]">
              Handcrafted in Andhra Pradesh • Direct Artisan Dialogue
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
