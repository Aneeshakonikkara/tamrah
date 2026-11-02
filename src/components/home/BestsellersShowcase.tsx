import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Product } from '../../types';
import { getBestsellers } from '../../services/productService';
import { buildProductEnquiryUrl, getBaseWebsiteUrl } from '../../config/whatsapp';

export default function BestsellersShowcase() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadBestsellers() {
      try {
        // Strictly fetch products with verified is_bestseller = true
        const data = await getBestsellers(4);
        if (!isCancelled) {
          setBestsellers(data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('[TAMRAH] Failed to load bestsellers:', err);
        if (!isCancelled) setLoading(false);
      }
    }

    loadBestsellers();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Do not display bestsellers showcase without verified evidence
  if (!loading && bestsellers.length === 0) {
    return null;
  }

  const currentProduct = bestsellers[selectedIndex] || bestsellers[0];
  const whatsappUrl = currentProduct
    ? buildProductEnquiryUrl({
        productName: currentProduct.name,
        productSku: currentProduct.sku,
        quantity: 1,
        formattedPrice: currentProduct.formattedPrice,
        productUrl: `${getBaseWebsiteUrl()}/products/${currentProduct.slug}`,
      })
    : '';

  return (
    <section
      id="bestsellers"
      className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]"
      aria-labelledby="bestsellers-heading"
    >
      <div className="container-site">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium mb-3">
            Signature Metalware
          </p>
          <h2
            id="bestsellers-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1916] tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Bestsellers Gallery
          </h2>
          <p className="text-sm sm:text-base text-[#5E5B55] font-light">
            Our most revered sculptures and statement décor, chosen by collectors and interior designers for their enduring presence.
          </p>
        </div>

        {/* Editorial Spotlight Layout */}
        {loading || !currentProduct ? (
          <div className="bg-white border border-[#E8E6E1] p-8 h-[550px] animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-white border border-[#E8E6E1] p-6 sm:p-10 shadow-xs">

            {/* Left: Featured Active Bestseller (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="relative overflow-hidden bg-[#F8F6F1] border border-[#E8E6E1] mb-6 group">
                <img
                  src={currentProduct.images[0]?.src || '/images/products/nataraja.jpg'}
                  alt={currentProduct.name}
                  loading="lazy"
                  className="w-full h-[360px] sm:h-[460px] object-cover object-center transition-all duration-700 group-hover:scale-102"
                />
                <div className="absolute top-4 left-4 bg-[#1A1916] text-[#FDFCF9] px-3 py-1 text-[0.6875rem] uppercase tracking-[0.16em] font-medium">
                  Verified Bestseller
                </div>
              </div>

              {/* Product Meta & Details */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
                <div>
                  <span className="text-[0.625rem] tracking-[0.18em] uppercase text-[#7C5A2A] font-medium">
                    {currentProduct.collectionId.replace(/-/g, ' ')}
                  </span>
                  <h3
                    className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1916] mt-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {currentProduct.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5B55] font-light mt-1 max-w-md">
                    {currentProduct.shortDescription}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[0.625rem] uppercase tracking-[0.14em] text-[#928F89] block">
                    Artisan Price
                  </span>
                  <span className="text-xl sm:text-2xl font-serif text-[#1A1916] font-medium">
                    {currentProduct.formattedPrice}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-5 border-t border-[#E8E6E1]">
                <Link
                  to={`/products/${currentProduct.slug}`}
                  className="btn btn-primary px-6 py-3 text-xs tracking-[0.12em] uppercase"
                >
                  View Full Specifications
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary px-6 py-3 text-xs tracking-[0.12em] uppercase inline-flex items-center gap-2"
                >
                  <MessageCircle size={15} className="text-[#25D366]" />
                  Enquire via WhatsApp
                </a>
              </div>
            </div>

            {/* Right: Bestseller Switcher List (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E8E6E1] pt-6 lg:pt-0 lg:pl-8">
              <div>
                <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-[#928F89] font-medium mb-4">
                  Select A Masterpiece
                </p>

                <div className="space-y-3">
                  {bestsellers.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedIndex(idx)}
                        className={`w-full text-left p-3.5 sm:p-4 flex items-center gap-4 border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#1A1916] bg-[#F8F6F1] shadow-xs'
                            : 'border-[#E8E6E1] bg-white hover:border-[#C8C5BF] hover:bg-[#FDFCF9]'
                        }`}
                      >
                        <img
                          src={item.images[0]?.src || '/images/products/nataraja.jpg'}
                          alt={item.name}
                          loading="lazy"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-[#E8E6E1] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[0.5625rem] tracking-[0.16em] uppercase text-[#7C5A2A] block">
                            0{idx + 1} • {item.collectionId.replace(/-/g, ' ')}
                          </span>
                          <h4 className="font-serif text-base sm:text-lg font-medium text-[#1A1916] truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[#5E5B55] font-light">
                              {item.dimensions || 'Handcrafted'}
                            </span>
                            <span className="text-xs font-semibold text-[#1A1916]">
                              {item.formattedPrice}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Craft Guarantee bullet points */}
              <div className="mt-8 pt-6 border-t border-[#E8E6E1] bg-[#FDFCF9] p-4">
                <h5 className="text-xs uppercase tracking-[0.14em] font-medium text-[#1A1916] mb-3">
                  The TAMRAH Standard
                </h5>
                <ul className="space-y-2 text-xs text-[#5E5B55]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#B8943F]" />
                    <span>Solid cast metal alloy with protective beeswax patina</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#B8943F]" />
                    <span>Shipped in wooden crate protection across India</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#B8943F]" />
                    <span>Artisan certificate of origin included with every piece</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link
                    to="/shop"
                    className="text-xs text-[#7C5A2A] font-medium uppercase tracking-[0.1em] hover:underline inline-flex items-center gap-1"
                  >
                    Explore All Collections <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
