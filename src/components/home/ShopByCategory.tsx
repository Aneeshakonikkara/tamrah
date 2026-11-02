import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Collection } from '../../types';
import { getCategories } from '../../services/productService';

export default function ShopByCategory() {
  const [categories, setCategories] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!isCancelled) {
          setCategories(data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('[TAMRAH] Failed to load home categories:', err);
        if (!isCancelled) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section
      id="shop-by-category"
      className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]"
      aria-labelledby="category-heading"
    >
      <div className="container-site">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium mb-3">
              Artisanal Repertoire
            </p>
            <h2
              id="category-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1916] tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Shop by Category
            </h2>
          </div>
          <p className="text-sm text-[#5E5B55] max-w-md font-light">
            Explore our curated collections of architectural black-metal décor, handcrafted using centuries-old moulding disciplines.
          </p>
        </div>

        {/* Categories Grid (Editorial 2-top, 3-bottom on desktop) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
            <div className="lg:col-span-3 h-[440px] bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
            <div className="lg:col-span-3 h-[440px] bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
            <div className="lg:col-span-2 h-[380px] bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
            <div className="lg:col-span-2 h-[380px] bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
            <div className="lg:col-span-2 h-[380px] bg-[#F2EFE9] animate-pulse border border-[#E8E6E1]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
            {categories.map((cat, idx) => {
              // First 2 categories take 3 columns each (half width on desktop), remaining take 2 columns each
              const colSpan = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
              const cardHeight = idx < 2 ? 'h-[440px] sm:h-[480px]' : 'h-[380px] sm:h-[420px]';

              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className={`group relative overflow-hidden block ${colSpan} ${cardHeight} border border-[#E8E6E1]/80 shadow-xs text-decoration-none`}
                >
                  {/* Background Image */}
                  <div className="w-full h-full overflow-hidden bg-[#1A1916]">
                    <img
                      src={cat.coverImage}
                      alt={cat.coverImageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.88] group-hover:brightness-[0.95]"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B]/85 via-[#0E0D0B]/25 to-transparent transition-opacity duration-300"
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                    {/* Category Number / Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-[0.625rem] tracking-[0.2em] uppercase text-[#D4AF6A] font-medium bg-[#1A1916]/50 px-2.5 py-1 backdrop-blur-xs">
                        Collection 0{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#B8943F] group-hover:text-black transition-all">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>

                    {/* Title and Short Description */}
                    <div>
                      <h3
                        className="font-serif text-2xl sm:text-3xl text-[#FDFCF9] font-normal leading-snug group-hover:text-[#D4AF6A] transition-colors"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {cat.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#E8E6E1]/80 mt-2 font-light line-clamp-2">
                        {cat.shortDescription}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-[0.6875rem] tracking-[0.14em] uppercase text-white font-medium border-b border-white/40 pb-0.5 group-hover:border-[#D4AF6A] group-hover:text-[#D4AF6A] transition-colors">
                        Explore Pieces
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
