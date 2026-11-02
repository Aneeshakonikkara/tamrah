import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import type { Product } from '../../types';
import { buildProductEnquiryUrl, getBaseWebsiteUrl } from '../../config/whatsapp';

interface ProductCardProps {
  product: Product;
  aspectRatio?: '3/4' | '4/3' | '1/1' | '4/5';
  showCollection?: boolean;
}

function MetalworkPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#1A1916]">
      <svg
        viewBox="0 0 200 200"
        className="w-24 h-24 opacity-30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <polygon
          points="100,10 150,30 180,80 180,120 150,170 100,190 50,170 20,120 20,80 50,30"
          stroke="#C8A96B"
          strokeWidth="1"
        />
        <circle cx="100" cy="100" r="40" stroke="#C8A96B" strokeWidth="1" />
        <line x1="100" y1="60" x2="100" y2="140" stroke="#C8A96B" strokeWidth="0.5" />
        <line x1="60" y1="100" x2="140" y2="100" stroke="#C8A96B" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export default function ProductCard({
  product,
  aspectRatio = '1/1',
  showCollection = false,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const paddingMap: Record<string, string> = {
    '3/4': '133.33%',
    '4/5': '125%',
    '4/3': '75%',
    '1/1': '100%',
  };

  const imageSrc = product.images?.[0]?.src || '/images/products/ganesha.jpg';
  const fullProductUrl = `${getBaseWebsiteUrl()}/products/${product.slug}`;

  // Centralized WhatsApp Enquiry URL for this product card
  const whatsappCardUrl = buildProductEnquiryUrl({
    productName: product.name,
    productSku: product.sku,
    quantity: 1,
    formattedPrice: product.formattedPrice,
    productUrl: fullProductUrl,
  });

  return (
    <div className="product-card group flex flex-col h-full bg-white border border-[#E8E6E1] hover:border-[#C8C5BF] transition-all duration-300 shadow-xs hover:shadow-md">
      {/* Image Container with Link */}
      <Link
        to={`/products/${product.slug}`}
        className="product-card-image-wrapper relative w-full overflow-hidden bg-[#F8F6F1] block"
        style={{ paddingBottom: paddingMap[aspectRatio] }}
        aria-label={`View details for ${product.name}`}
      >
        {!imgError ? (
          <img
            src={imageSrc}
            alt={`${product.name} — Handcrafted solid black metal décor by TAMRAH`}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <MetalworkPlaceholder />
        )}

        {/* Hover subtle darkening */}
        <div className="absolute inset-0 bg-[#0E0D0B]/0 group-hover:bg-[#0E0D0B]/10 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-wrap gap-1.5 z-10 max-w-[85%]">
          {product.isNew && (
            <span className="text-[0.5625rem] sm:text-[0.625rem] font-medium tracking-[0.14em] uppercase bg-[#1A1916] text-white px-2 py-0.5">
              New Arrival
            </span>
          )}
          {product.isFeatured && !product.isNew && (
            <span className="text-[0.5625rem] sm:text-[0.625rem] font-medium tracking-[0.14em] uppercase bg-[#B8943F] text-white px-2 py-0.5">
              Featured
            </span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="text-[0.5625rem] sm:text-[0.625rem] font-medium tracking-[0.14em] uppercase bg-[#7C5A2A] text-white px-2 py-0.5">
              Bestseller
            </span>
          )}
          {product.availability === 'made-to-order' && (
            <span className="text-[0.5625rem] sm:text-[0.625rem] font-medium tracking-[0.14em] uppercase bg-white/90 text-[#5E5B55] border border-[#C8C5BF] px-2 py-0.5 backdrop-blur-xs">
              Made to Order
            </span>
          )}
        </div>

        {/* Floating Quick Action Overlay on Image Hover */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 text-[0.625rem] font-medium uppercase tracking-[0.12em] bg-white/95 text-[#1A1916] px-2.5 py-1.5 shadow-sm border border-[#E8E6E1]">
            Details <ArrowRight size={10} />
          </span>
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {showCollection && (
            <p className="text-[0.5625rem] sm:text-[0.625rem] tracking-[0.16em] uppercase text-[#928F89] mb-1 truncate">
              {product.collectionId.replace(/-/g, ' ')}
            </p>
          )}

          <Link
            to={`/products/${product.slug}`}
            className="block text-decoration-none group-hover:text-[#7C5A2A] transition-colors"
          >
            <h3
              className="font-serif text-sm sm:text-base lg:text-lg font-medium text-[#1A1916] leading-snug mb-1 line-clamp-1 hover:text-[#7C5A2A]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.name}
            </h3>
          </Link>

          <p className="text-[0.75rem] sm:text-xs text-[#5E5B55] font-light line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        </div>

        {/* Card Footer: Price & Direct Actions */}
        <div className="pt-2.5 sm:pt-3 border-t border-[#E8E6E1]/60 flex items-end justify-between gap-2">
          <div>
            <span className="text-[0.5625rem] sm:text-[0.625rem] uppercase tracking-[0.12em] text-[#928F89] block">
              Direct Price
            </span>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm lg:text-base font-semibold text-[#1A1916]">
                {product.formattedPrice || 'Price on Request'}
              </span>
              {product.formattedOriginalPrice && (
                <span className="text-[0.6875rem] sm:text-xs text-[#928F89] line-through font-light">
                  {product.formattedOriginalPrice}
                </span>
              )}
            </div>
          </div>

          {/* WhatsApp Direct Enquiry Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappCardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#F8F6F1] hover:bg-[#128C7E] text-[#1A1916] hover:text-white border border-[#E8E6E1] hover:border-[#128C7E] text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.08em] font-medium transition-all duration-200"
              title={`Direct WhatsApp enquiry for ${product.name}`}
              aria-label={`Enquire on WhatsApp about ${product.name}`}
            >
              <MessageCircle size={13} className="text-[#128C7E] group-hover:text-white" />
              <span>Enquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
