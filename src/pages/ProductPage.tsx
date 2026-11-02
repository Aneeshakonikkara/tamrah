import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageCircle,
  Mail,
  Minus,
  Plus,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Package,
  Sparkles,
  ChevronDown,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import type { Product, Collection } from '../types';
import {
  getProductBySlug,
  getCategories,
  getRelatedProducts,
} from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import { buildWhatsAppEnquiryUrl, buildEmailEnquiryUrl } from '../config/enquiry';
import SEO from '../components/common/SEO';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  // Async product state
  const [product, setProduct] = useState<Product | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Accordion open/close state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
    shipping: false,
    packaging: false,
    care: false,
  });

  // Fetch product by slug whenever slug changes
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadProductData() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const p = await getProductBySlug(slug);
        if (isCancelled) return;

        if (p) {
          setProduct(p);

          // Fetch category and related pieces concurrently
          const [categories, related] = await Promise.all([
            getCategories(),
            getRelatedProducts(p.id, p.collectionId, 4),
          ]);

          if (!isCancelled) {
            const cat = categories.find((c) => c.id === p.collectionId) || null;
            setCollection(cat);
            setRelatedProducts(related);
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('[TAMRAH DB] Error loading product by slug:', err);
        if (!isCancelled) setProduct(null);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadProductData();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  // Handle lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen || !product) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % product.images.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, product]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="section-padding py-16 bg-[#FDFCF9] min-h-[70vh]">
        <div className="container-site">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-[#E8E6E1] rounded-xs w-64 mb-8 animate-pulse" />

          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="w-full pb-[100%] bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
              <div className="flex gap-3 mt-4">
                <div className="w-20 h-20 bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
                <div className="w-20 h-20 bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
                <div className="w-20 h-20 bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5 animate-pulse">
              <div className="h-3 bg-[#E8E6E1] rounded-xs w-28" />
              <div className="h-8 bg-[#E8E6E1] rounded-xs w-3/4" />
              <div className="h-6 bg-[#E8E6E1] rounded-xs w-32" />
              <div className="h-16 bg-[#F2EFE9] rounded-xs w-full" />
              <div className="h-12 bg-[#1A1916]/20 rounded-xs w-full" />
              <div className="h-12 bg-[#E8E6E1] rounded-xs w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If product not found (or draft/archived), render a graceful not-found state
  if (!product) {
    return (
      <div className="section-padding py-28 text-center min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF8F5]">
        <SEO
          title="Product Not Found"
          description="The requested handcrafted metal décor piece is either unavailable, has been archived, or does not exist in our catalogue."
          noIndex={true}
        />
        <div className="w-16 h-16 rounded-full bg-white border border-[#E8E6E1] flex items-center justify-center text-[#7C5A2A] mb-5 shadow-xs">
          <HelpCircle size={28} />
        </div>
        <h1
          className="font-serif text-3xl sm:text-4xl text-[#1A1916] mb-3 font-normal"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Product Not Found
        </h1>
        <p className="text-sm text-[#5E5B55] max-w-md mx-auto font-light leading-relaxed mb-8">
          The requested handcrafted piece is either unavailable, has been archived from our catalogue, or does not exist.
        </p>
        <Link
          to="/shop"
          className="btn btn-primary px-8 py-3 text-xs uppercase tracking-[0.14em]"
        >
          Return to Shop Catalogue
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images
    : [{ src: '/images/products/ganesha.jpg', alt: product.name, isPrimary: true }];

  const currentImage = images[activeImageIndex] || images[0];

  // Toggle Accordion
  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Build WhatsApp and Email enquiry links
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const waUrl = buildWhatsAppEnquiryUrl({
    productName: product.name,
    productSku: product.sku,
    quantity,
    formattedPrice: product.formattedPrice,
    productUrl: currentUrl,
  });

  const mailUrl = buildEmailEnquiryUrl({
    productName: product.name,
    productSku: product.sku,
    quantity,
    productUrl: currentUrl,
  });

  // Check if any genuine specification field exists (Hide fields without data)
  const hasAnySpec = Boolean(
    product.material ||
    product.finish ||
    product.dimensions ||
    product.weight ||
    product.colour ||
    product.technique ||
    product.careInstructions
  );

  return (
    <>
      <SEO
        title={product.seoTitle || `${product.name} — Handcrafted Solid Black-Metal Décor`}
        description={
          product.seoDescription ||
          product.shortDescription ||
          `${product.name} handcrafted in solid black-metal by Andhra Pradesh master artisans.`
        }
        canonicalUrl={`https://tamrah.in/products/${product.slug}`}
        ogType="product"
        ogImage={images[0]?.src}
        productData={{
          name: product.name,
          description: product.description || product.shortDescription,
          image: images[0]?.src || '/images/products/ganesha.jpg',
          sku: product.sku || '',
          price: product.price || 0,
          currency: 'INR',
          availability: Boolean(product.inStock),
          category: collection?.name || product.collectionId,
          material: product.material,
          finish: product.finish,
          url: `https://tamrah.in/products/${product.slug}`,
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
          { name: collection?.name || 'Collection', url: `/collections/${product.collectionId}` },
          { name: product.name, url: `/products/${product.slug}` },
        ]}
      />

      {/* ── 1. BREADCRUMB NAVIGATION ─────────────────────────── */}
      <div className="bg-[#FAF8F5] border-b border-[#E8E6E1] py-4">
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[0.6875rem] uppercase tracking-[0.14em] text-[#928F89]">
              <li>
                <Link to="/" className="hover:text-[#1A1916] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/shop" className="hover:text-[#1A1916] transition-colors">
                  Shop
                </Link>
              </li>
              {collection && (
                <>
                  <li>/</li>
                  <li>
                    <Link
                      to={`/shop?category=${collection.id}`}
                      className="hover:text-[#1A1916] transition-colors"
                    >
                      {collection.name}
                    </Link>
                  </li>
                </>
              )}
              <li>/</li>
              <li className="text-[#1A1916] font-medium truncate max-w-[200px] sm:max-w-none">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── MAIN PRODUCT SECTION ─────────────────────────────── */}
      <section className="section-padding bg-[#FDFCF9]" aria-label={product.name}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* ── 2. PRODUCT IMAGE GALLERY (Left, 7 cols) ───────── */}
            <div className="lg:col-span-7 lg:sticky lg:top-28">
              {/* Primary Image Viewport */}
              <div className="relative overflow-hidden bg-[#F8F6F1] border border-[#E8E6E1] group shadow-xs">
                <div style={{ paddingBottom: '100%', position: 'relative' }}>
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt || `${product.name} — Handcrafted black metal décor by TAMRAH`}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>

                {/* Badges Overlay */}
                <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
                  {product.isNew && (
                    <span className="text-[0.625rem] font-medium tracking-[0.14em] uppercase bg-[#1A1916] text-white px-2.5 py-1 shadow-sm">
                      New Arrival
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="text-[0.625rem] font-medium tracking-[0.14em] uppercase bg-[#B8943F] text-white px-2.5 py-1 shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {product.isFeatured && !product.isNew && !product.isBestseller && (
                    <span className="text-[0.625rem] font-medium tracking-[0.14em] uppercase bg-[#7C5A2A] text-white px-2.5 py-1 shadow-sm">
                      Featured Piece
                    </span>
                  )}
                </div>

                {/* Zoom prompt icon */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-[#1A1916] border border-[#E8E6E1] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                  aria-label="Zoom image"
                  title="Click to zoom in lightbox"
                >
                  <Maximize2 size={15} />
                </button>
              </div>

              {/* Thumbnails Row (Only if multiple images exist) */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative overflow-hidden border transition-all duration-200 aspect-square ${
                        idx === activeImageIndex
                          ? 'border-[#1A1916] ring-1 ring-[#1A1916]'
                          : 'border-[#E8E6E1] hover:border-[#928F89] opacity-75 hover:opacity-100'
                      }`}
                      aria-label={`View image ${idx + 1} of ${images.length}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt || `${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Value guarantees band */}
              <div className="mt-8 pt-6 border-t border-[#E8E6E1] grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#7C5A2A] mb-2 border border-[#E8E6E1]">
                    <Sparkles size={14} />
                  </div>
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[#1A1916]">
                    Centuries-Old Craft
                  </span>
                  <span className="text-[0.625rem] text-[#928F89] mt-0.5">Andhra Pradesh Foundry</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#7C5A2A] mb-2 border border-[#E8E6E1]">
                    <Truck size={14} />
                  </div>
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[#1A1916]">
                    Insured Transit
                  </span>
                  <span className="text-[0.625rem] text-[#928F89] mt-0.5">Complimentary Pan-India</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#7C5A2A] mb-2 border border-[#E8E6E1]">
                    <Package size={14} />
                  </div>
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[#1A1916]">
                    Museum Packaging
                  </span>
                  <span className="text-[0.625rem] text-[#928F89] mt-0.5">Foam-Lined Protection</span>
                </div>
              </div>
            </div>

            {/* ── 3. PRODUCT INFORMATION & ENQUIRY (Right, 5 cols) ─── */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Category & SKU row */}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium">
                    {collection ? collection.name : product.collectionId.replace(/-/g, ' ')}
                  </span>
                  <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89] font-mono">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Product Name */}
                <h1
                  className="font-serif text-3xl sm:text-4xl text-[#1A1916] font-light tracking-tight leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#E8E6E1]">
                  <span className="font-serif text-2xl sm:text-3xl text-[#1A1916] font-medium">
                    {product.formattedPrice}
                  </span>
                  {product.formattedOriginalPrice && (
                    <span className="text-sm sm:text-base text-[#928F89] line-through font-light">
                      {product.formattedOriginalPrice}
                    </span>
                  )}
                  <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-[#928F89] ml-1">
                    • Inclusive of GST & Insured Transit
                  </span>
                </div>

                {/* Availability Badge */}
                <div className="mb-6 flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      product.inStock ? 'bg-[#2E7D32]' : 'bg-[#C8A96B]'
                    }`}
                  />
                  <span className="text-xs font-medium text-[#1A1916]">
                    {product.inStock
                      ? 'In Stock — Dispatched within 2–4 business days'
                      : 'Made to Order — Individually cast in 14–21 business days'}
                  </span>
                </div>

                {/* Description */}
                <div className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed mb-8 space-y-3">
                  <p>{product.shortDescription}</p>
                  {product.description && product.description !== product.shortDescription && (
                    <p className="text-xs text-[#7A7771] pt-1">{product.description}</p>
                  )}
                </div>

                {/* ── QUANTITY SELECTOR & ENQUIRY CTAS ──────────────── */}
                <div className="bg-[#FAF8F5] border border-[#E8E6E1] p-5 sm:p-6 mb-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.14em] text-[#1A1916] font-medium">
                      Select Quantity
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center border border-[#C8C5BF] bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-[#1A1916] disabled:opacity-30 hover:bg-[#FAF8F5] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-xs font-medium text-[#1A1916]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#1A1916] hover:bg-[#FAF8F5] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Primary WhatsApp Enquiry CTA */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full justify-center gap-2 py-3.5 text-xs tracking-[0.14em] uppercase bg-[#1A1916] text-white hover:bg-[#128C7E] hover:border-[#128C7E] transition-all shadow-sm"
                  >
                    <MessageCircle size={16} className="text-[#25D366]" />
                    <span>Enquire on WhatsApp</span>
                  </a>

                  {/* Secondary Email Enquiry CTA */}
                  <a
                    href={mailUrl}
                    className="btn btn-secondary w-full justify-center gap-2 py-3 text-xs tracking-[0.12em] uppercase font-medium hover:bg-white"
                  >
                    <Mail size={15} />
                    <span>Email Studio Inquiry</span>
                  </a>

                  <p className="text-[0.625rem] text-center text-[#928F89] pt-1">
                    Direct artisan enquiry • No online payment required • Review in WhatsApp before sending
                  </p>

                  <div className="pt-2 mt-2 text-center border-t border-[#E8E6E1]/60">
                    <Link
                      to="/bulk-orders"
                      className="text-[0.6875rem] uppercase tracking-[0.1em] text-[#7C5A2A] hover:text-[#1A1916] inline-flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>Need 10+ pieces? Enquire for Bulk & Corporate Gifting</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* ── 4. PRODUCT SPECIFICATIONS TABLE (Hide fields without data) ── */}
                {hasAnySpec && (
                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-[#1A1916] mb-4 pb-2 border-b border-[#E8E6E1]">
                      Product Specifications
                    </h3>

                    <dl className="divide-y divide-[#E8E6E1]/70 text-xs">
                      {product.material && (
                        <div className="py-2.5 flex justify-between gap-4">
                          <dt className="text-[#928F89] font-light">Material</dt>
                          <dd className="text-[#1A1916] font-medium text-right">{product.material}</dd>
                        </div>
                      )}

                      {product.finish && (
                        <div className="py-2.5 flex justify-between gap-4">
                          <dt className="text-[#928F89] font-light">Finish</dt>
                          <dd className="text-[#1A1916] font-medium text-right">{product.finish}</dd>
                        </div>
                      )}

                      {product.dimensions && (
                        <div className="py-2.5 flex justify-between gap-4">
                          <dt className="text-[#928F89] font-light">Dimensions</dt>
                          <dd className="text-[#1A1916] font-medium text-right">{product.dimensions}</dd>
                        </div>
                      )}

                      {product.weight && (
                        <div className="py-2.5 flex justify-between gap-4">
                          <dt className="text-[#928F89] font-light">Weight</dt>
                          <dd className="text-[#1A1916] font-medium text-right">{product.weight}</dd>
                        </div>
                      )}

                      {product.colour && (
                        <div className="py-2.5 flex justify-between gap-4">
                          <dt className="text-[#928F89] font-light">Colour</dt>
                          <dd className="text-[#1A1916] font-medium text-right">{product.colour}</dd>
                        </div>
                      )}

                      {product.technique && (
                        <div className="py-2.5 flex justify-between gap-4">
                          <dt className="text-[#928F89] font-light">Manufacturing Technique</dt>
                          <dd className="text-[#1A1916] font-medium text-right max-w-xs">{product.technique}</dd>
                        </div>
                      )}

                      {product.careInstructions && (
                        <div className="py-2.5 flex justify-between gap-4">
                          <dt className="text-[#928F89] font-light">Care Instructions</dt>
                          <dd className="text-[#1A1916] font-light text-right max-w-xs">{product.careInstructions}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* ── 5. EXPANDABLE ACCORDIONS ──────────────────────── */}
                <div className="border-t border-[#E8E6E1] divide-y divide-[#E8E6E1]">
                  {/* Accordion 1: Details & Provenance */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('details')}
                      className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.14em] font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors"
                      aria-expanded={openAccordions.details}
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles size={14} className="text-[#B8943F]" />
                        Product Details & Provenance
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openAccordions.details ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openAccordions.details && (
                      <div className="pb-4 text-xs text-[#5E5B55] font-light leading-relaxed space-y-2">
                        <p>
                          Every TAMRAH work is sand-cast or lost-wax cast by hereditary metal artisans in Andhra Pradesh. No two pieces possess identical surface markings; slight irregularities in the patina and chiseled edges are marks of hand craftsmanship, not defects.
                        </p>
                        <p>
                          Cast from solid high-density metal alloy and treated with natural mineral-based blackening solutions to produce our signature velvety charcoal finish.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Accordion 2: Shipping */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('shipping')}
                      className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.14em] font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors"
                      aria-expanded={openAccordions.shipping}
                    >
                      <span className="flex items-center gap-2">
                        <Truck size={14} className="text-[#B8943F]" />
                        Shipping & Lead Times
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openAccordions.shipping ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openAccordions.shipping && (
                      <div className="pb-4 text-xs text-[#5E5B55] font-light leading-relaxed space-y-2">
                        <p>
                          • <strong>In-Stock Items:</strong> Dispatched within 2 to 4 business days.
                        </p>
                        <p>
                          • <strong>Made-to-Order Pieces:</strong> Hand-cast and finished in 14 to 21 business days.
                        </p>
                        <p>
                          • <strong>Pan-India Delivery:</strong> Complimentary insured courier transit with tracking updates delivered via WhatsApp and email.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Accordion 3: Packaging */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('packaging')}
                      className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.14em] font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors"
                      aria-expanded={openAccordions.packaging}
                    >
                      <span className="flex items-center gap-2">
                        <Package size={14} className="text-[#B8943F]" />
                        Packaging & Protection
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openAccordions.packaging ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openAccordions.packaging && (
                      <div className="pb-4 text-xs text-[#5E5B55] font-light leading-relaxed space-y-2">
                        <p>
                          Every TAMRAH work ships in reinforced museum-grade packaging — either foam-lined rigid presentation boxes or reinforced wooden battens for heavy sculptures and mirror frames.
                        </p>
                        <p>
                          Includes an official TAMRAH Certificate of Craftsmanship detailing the moulding technique and artisan workshop.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Accordion 4: Care Instructions */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('care')}
                      className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.14em] font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors"
                      aria-expanded={openAccordions.care}
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#B8943F]" />
                        Care Instructions & Patina
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openAccordions.care ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openAccordions.care && (
                      <div className="pb-4 text-xs text-[#5E5B55] font-light leading-relaxed space-y-2">
                        <p>
                          • Regularly dust with a dry, lint-free microfibre or cotton cloth.
                        </p>
                        <p>
                          • Avoid brass polish, acidic detergents, or abrasive scouring pads, which will strip the natural matte charcoal patina.
                        </p>
                        <p>
                          • To maintain depth of color, gently buff with a pea-sized amount of clear mineral oil or organic beeswax once a year.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. RELATED PRODUCTS SECTION ──────────────────────── */}
      {relatedProducts.length > 0 && (
        <section
          className="section-padding bg-[#FAF8F5] border-t border-[#E8E6E1]"
          aria-labelledby="related-heading"
        >
          <div className="container-site">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium mb-2">
                  Considered Pairings
                </p>
                <h2
                  id="related-heading"
                  className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1916]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  More from {collection ? collection.name : 'Our Workshop'}
                </h2>
              </div>

              <Link
                to={collection ? `/shop?category=${collection.id}` : '/shop'}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors border-b border-[#1A1916] pb-0.5 self-start sm:self-auto"
              >
                <span>View Entire Category</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  aspectRatio="1/1"
                  showCollection={false}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. LIGHTBOX MODAL ─────────────────────────────────── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Zoom Lightbox"
          className="fixed inset-0 z-50 bg-[#0E0D0B]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Lightbox Topbar */}
          <div
            className="flex items-center justify-between text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="font-serif text-lg text-white font-normal">{product.name}</p>
              <p className="text-[0.6875rem] text-[#928F89] uppercase tracking-[0.16em]">
                Image {activeImageIndex + 1} of {images.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-[#C8C5BF] hover:text-white bg-white/10 rounded-full transition-colors"
              aria-label="Close lightbox"
            >
              <X size={22} />
            </button>
          </div>

          {/* Lightbox Main Stage */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex(
                    (prev) => (prev - 1 + images.length) % images.length
                  )
                }
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* High-res Image */}
            <img
              src={currentImage.src}
              alt={currentImage.alt || product.name}
              className="max-h-[82vh] max-w-[90vw] object-contain drop-shadow-2xl transition-all duration-300"
            />

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % images.length)
                }
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails */}
          {images.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 overflow-hidden border-2 transition-all ${
                    idx === activeImageIndex
                      ? 'border-[#D4AF6A] scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.src} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
