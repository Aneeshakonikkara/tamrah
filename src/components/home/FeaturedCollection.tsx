import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../types';
import { getFeaturedProducts } from '../../services/productService';
import ProductCard from '../ui/ProductCard';

export default function FeaturedCollection() {
  const [featuredList, setFeaturedList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadFeatured() {
      try {
        const data = await getFeaturedProducts(6);
        if (!isCancelled) {
          setFeaturedList(data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('[TAMRAH] Failed to load featured products:', err);
        if (!isCancelled) setLoading(false);
      }
    }

    loadFeatured();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section
      id="featured-collection"
      className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]"
      aria-labelledby="featured-collection-heading"
    >
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium mb-3">
              Curated Selection
            </p>
            <h2
              id="featured-collection-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1916] tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Curated for Your Space
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#5E5B55] max-w-sm font-light">
              Distinctive signature pieces cast in solid black metal, designed to create visual weight and timeless presence.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors border-b border-[#1A1916] pb-1 self-start sm:self-auto shrink-0"
            >
              <span>View All Products</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Product Grid (3 cols on desktop, 2 cols on tablet/mobile) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E8E6E1] h-[380px] animate-pulse flex flex-col justify-between p-4"
              >
                <div className="w-full h-[240px] bg-[#F2EFE9]" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-[#E8E6E1] w-3/4" />
                  <div className="h-3 bg-[#F2EFE9] w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                aspectRatio="1/1"
                showCollection={true}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA bar */}
        <div className="mt-14 pt-8 border-t border-[#E8E6E1] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-[#928F89]">
            Looking for customized dimensions or temple-scale commissions?
          </p>
          <Link
            to="/contact"
            className="text-xs uppercase tracking-[0.14em] text-[#7C5A2A] font-medium hover:underline inline-flex items-center gap-1.5"
          >
            Inquire About Bespoke Pieces <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
