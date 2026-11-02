import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product, Collection } from '../../types';
import { getFeaturedProducts, getCategories } from '../../services/productService';
import ProductCard from '../ui/ProductCard';
import SectionHeader from '../ui/SectionHeader';

export default function FeaturedProducts() {
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [featuredList, setFeaturedList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Collection[]>([]);

  useEffect(() => {
    let isCancelled = false;
    Promise.all([getFeaturedProducts(12), getCategories()])
      .then(([products, collections]) => {
        if (!isCancelled) {
          setFeaturedList(products);
          setCategoriesList(collections);
        }
      })
      .catch(console.warn);

    return () => {
      isCancelled = true;
    };
  }, []);

  const filtered =
    activeCollection === 'all'
      ? featuredList
      : featuredList.filter((p) => p.collectionId === activeCollection);

  // Only collections that have featured products
  const activeCollectionIds = [...new Set(featuredList.map((p) => p.collectionId))];
  const filterCollections = categoriesList.filter((c) =>
    activeCollectionIds.includes(c.id)
  );

  return (
    <section
      className="section-padding-lg bg-warm-white"
      aria-labelledby="featured-heading"
    >
      <div className="container-site">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-14">
          <SectionHeader
            eyebrow="Featured Pieces"
            title="Select works"
            subtitle="A curated selection from the workshop. Each piece is made to order."
            id="featured-heading"
          />
          <Link
            to="/shop"
            className="btn btn-ghost text-charcoal self-start lg:self-end flex-shrink-0"
          >
            Browse all products →
          </Link>
        </div>

        {/* Collection Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            id="filter-all"
            className={`btn text-label ${
              activeCollection === 'all'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
            style={{ padding: '0.5rem 1.125rem', fontSize: '0.6875rem' }}
            onClick={() => setActiveCollection('all')}
          >
            All
          </button>
          {filterCollections.map((col) => (
            <button
              key={col.id}
              id={`filter-${col.id}`}
              className={`btn text-label ${
                activeCollection === col.id
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
              style={{ padding: '0.5rem 1.125rem', fontSize: '0.6875rem' }}
              onClick={() => setActiveCollection(col.id)}
            >
              {col.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} aspectRatio="3/4" />
          ))}
        </div>
      </div>
    </section>
  );
}
