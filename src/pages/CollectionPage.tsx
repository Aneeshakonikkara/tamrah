import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import type { Collection, Product } from '../types';
import { getCategories, getProducts } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import SEO from '../components/common/SEO';

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setNotFound(false);

    async function loadCategoryAndItems() {
      if (!slug) return;
      try {
        const categories = await getCategories();
        const found = categories.find((c) => c.slug === slug || c.id === slug);
        if (!found) {
          if (!isCancelled) {
            setNotFound(true);
            setLoading(false);
          }
          return;
        }

        if (!isCancelled) setCollection(found);

        const res = await getProducts({
          categoryId: found.id,
          pageSize: 48,
        });

        if (!isCancelled) {
          setCollectionProducts(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Error loading collection page:', err);
        if (!isCancelled) setLoading(false);
      }
    }

    loadCategoryAndItems();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (notFound) return <Navigate to="/shop" replace />;

  return (
    <>
      <SEO
        title={collection ? `${collection.name} Collection — Handcrafted Metal Décor` : 'Artisanal Collection'}
        description={
          collection
            ? `${collection.description || collection.shortDescription} Handcrafted in solid black-metal by Andhra Pradesh artisans.`
            : 'Handcrafted solid black-metal décor from Andhra Pradesh.'
        }
        canonicalUrl={collection ? `https://tamrah.in/collections/${collection.slug || collection.id}` : undefined}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
          ...(collection ? [{ name: collection.name, url: `/collections/${collection.slug || collection.id}` }] : []),
        ]}
      />

      {/* ── Page Header ── */}
      <div
        className="section-padding border-b border-subtle"
        style={{ backgroundColor: 'var(--color-ivory)' }}
      >
        <div className="container-site">
          <p className="text-label mb-5" style={{ color: 'var(--color-charcoal-40)' }}>
            <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
            {' / '}
            <Link to="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
            {' / '}
            {collection?.name || 'Category'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  color: 'var(--color-charcoal)',
                  letterSpacing: '-0.01em',
                }}
              >
                {collection?.name || 'Loading…'}
              </h1>
            </div>
            <p
              className="text-body"
              style={{
                color: 'var(--color-charcoal-60)',
                maxWidth: '440px',
              }}
            >
              {collection?.description || collection?.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <section className="section-padding-lg" aria-label={collection ? `${collection.name} products` : 'Products'}>
        <div className="container-site">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-[#F2EFE9] border border-[#E8E6E1] animate-pulse" />
              ))}
            </div>
          ) : collectionProducts.length > 0 ? (
            <>
              <p
                className="text-label mb-10"
                style={{ color: 'var(--color-charcoal-40)' }}
              >
                {collectionProducts.length} {collectionProducts.length === 1 ? 'piece' : 'pieces'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {collectionProducts.map((product) => (
                  <ProductCard key={product.id} product={product} aspectRatio="1/1" />
                ))}
              </div>
            </>
          ) : (
            <div className="py-24 text-center">
              <p className="text-body text-charcoal-40">
                New pieces coming soon. Please enquire for bespoke commissions.
              </p>
              <Link to="/contact" className="btn btn-primary mt-8 inline-flex">
                Enquire
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
