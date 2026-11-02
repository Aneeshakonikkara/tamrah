import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Collection } from '../../types';
import { getCategories } from '../../services/productService';
import SectionHeader from '../ui/SectionHeader';

function CollectionPlaceholder({ id }: { id: string }) {
  const tones = [
    'hsl(25, 8%, 14%)',
    'hsl(30, 10%, 13%)',
    'hsl(20, 7%, 15%)',
    'hsl(35, 9%, 12%)',
    'hsl(28, 8%, 13%)',
    'hsl(22, 6%, 14%)',
  ];
  const idx = id.charCodeAt(0) % tones.length;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: tones[idx] }}
    >
      <svg
        viewBox="0 0 160 160"
        className="w-20 h-20 opacity-25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="80" cy="80" r="60" stroke="#C8A96B" strokeWidth="0.75" />
        <circle cx="80" cy="80" r="35" stroke="#C8A96B" strokeWidth="0.75" />
        <circle cx="80" cy="80" r="8" fill="#C8A96B" opacity="0.5" />
        <line x1="80" y1="20" x2="80" y2="140" stroke="#C8A96B" strokeWidth="0.5" />
        <line x1="20" y1="80" x2="140" y2="80" stroke="#C8A96B" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export default function Collections() {
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);

  useEffect(() => {
    let isCancelled = false;
    getCategories()
      .then((data) => {
        if (!isCancelled) setCollectionsList(data);
      })
      .catch(console.warn);

    return () => {
      isCancelled = true;
    };
  }, []);

  const sorted = [...collectionsList].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      className="section-padding-lg bg-ivory"
      style={{ backgroundColor: 'var(--color-ivory)' }}
      aria-labelledby="collections-heading"
    >
      <div className="container-site">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
          <SectionHeader
            eyebrow="The Collections"
            title="Craft by category"
            subtitle="Explore our work organised by form and purpose in the home."
            id="collections-heading"
          />
          <Link
            to="/shop"
            className="btn btn-ghost text-charcoal self-start lg:self-end flex-shrink-0"
          >
            All categories ({sorted.length}) →
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((col) => (
            <Link
              key={col.id}
              to={`/shop?category=${col.id}`}
              className="collection-card group"
              style={{ aspectRatio: '4/5' }}
              aria-label={`Browse ${col.name} collection`}
            >
              <div className="absolute inset-0">
                <CollectionPlaceholder id={col.id} />
              </div>

              <div className="collection-card-overlay">
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      fontWeight: 400,
                      color: 'var(--color-white)',
                      lineHeight: 1.25,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {col.name}
                  </h3>
                  <p
                    className="text-body-sm line-clamp-2"
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      maxWidth: '280px',
                    }}
                  >
                    {col.shortDescription}
                  </p>
                  <p
                    className="text-label mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      color: 'var(--color-gold-light)',
                      fontSize: '0.6875rem',
                    }}
                  >
                    Explore pieces →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
