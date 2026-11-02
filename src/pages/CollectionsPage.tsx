import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Collection } from '../types';
import { getCategories } from '../services/productService';
import SectionHeader from '../components/ui/SectionHeader';
import SEO from '../components/common/SEO';

function CollectionPlaceholder({ id }: { id: string }) {
  const tones = [
    'hsl(25, 8%, 14%)', 'hsl(30, 10%, 13%)', 'hsl(20, 7%, 15%)',
    'hsl(35, 9%, 12%)', 'hsl(28, 8%, 13%)', 'hsl(22, 6%, 14%)',
  ];
  const idx = id.charCodeAt(0) % tones.length;
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: tones[idx] }}>
      <svg viewBox="0 0 160 160" className="w-16 h-16 opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="80" cy="80" r="60" stroke="#C8A96B" strokeWidth="0.75" />
        <circle cx="80" cy="80" r="30" stroke="#C8A96B" strokeWidth="0.75" />
        <circle cx="80" cy="80" r="6" fill="#C8A96B" opacity="0.5" />
        <line x1="80" y1="20" x2="80" y2="140" stroke="#C8A96B" strokeWidth="0.5" />
        <line x1="20" y1="80" x2="140" y2="80" stroke="#C8A96B" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export default function CollectionsPage() {
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    getCategories()
      .then((data) => {
        if (!isCancelled) {
          setCollectionsList(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load collections:', err);
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const sorted = [...collectionsList].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <SEO
        title="Artisanal Collections — Handcrafted Black-Metal Décor"
        description="Explore curated collections of solid black-metal sculptures, sacred Hindu idols, jaali wall décor, and filigree lighting handcrafted in Andhra Pradesh."
        canonicalUrl="https://tamrah.in/collections-overview"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/collections-overview' },
        ]}
      />

      {/* Page Header */}
      <div
        className="section-padding border-b border-subtle"
        style={{ backgroundColor: 'var(--color-ivory)' }}
      >
        <div className="container-site">
          <p
            className="text-label mb-4"
            style={{ color: 'var(--color-charcoal-40)' }}
          >
            <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
            {' / '}Collections
          </p>
          <SectionHeader
            eyebrow="All Collections"
            title="Browse by category"
            subtitle="Curated families of handcrafted black-metal objects, each serving a different dimension of the considered home."
          />
        </div>
      </div>

      {/* Collections List */}
      <section className="section-padding-lg" aria-label="All collections">
        <div className="container-site">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-[#F2EFE9] border border-[#E8E6E1] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((col) => (
                <Link
                  key={col.id}
                  to={`/shop?category=${col.id}`}
                  className="collection-card group"
                  style={{ aspectRatio: '4/5' }}
                  aria-label={`Browse ${col.name}`}
                >
                  <div className="absolute inset-0">
                    {col.coverImage ? (
                      <img
                        src={col.coverImage}
                        alt={col.coverImageAlt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <CollectionPlaceholder id={col.id} />
                    )}
                  </div>
                  <div className="collection-card-overlay">
                    <div>
                      <h2
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.5rem',
                          fontWeight: 400,
                          color: '#fff',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {col.name}
                      </h2>
                      <p className="text-body-sm" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '260px' }}>
                        {col.shortDescription}
                      </p>
                      <p
                        className="text-label mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: 'var(--color-gold-light)', fontSize: '0.6875rem' }}
                      >
                        Explore Collection →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
