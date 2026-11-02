import { useEffect } from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProductSchemaData {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  currency: string;
  availability: boolean;
  category?: string;
  material?: string;
  finish?: string;
  url: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  noIndex?: boolean;
  productData?: ProductSchemaData;
  breadcrumbs?: BreadcrumbItem[];
}

const DEFAULT_TITLE = 'TAMRAH — Handcrafted Black-Metal Home Décor & Sacred Idols';
const DEFAULT_DESCRIPTION =
  'Handcrafted solid black-metal sculptures, sacred Hindu idols, jaali wall décor, brass mirrors and filigree lighting from Andhra Pradesh mould craftsmanship.';
const DEFAULT_IMAGE = '/images/home/hero.jpg';
const SITE_NAME = 'TAMRAH';
const BASE_URL = 'https://tamrah.in';

/**
 * High-performance, lightweight SEO Head Component.
 * Dynamically updates document.title, meta tags, OpenGraph, Twitter cards,
 * canonical links, robots indexing directives, and Schema.org JSON-LD scripts.
 */
export default function SEO({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  noIndex = false,
  productData,
  breadcrumbs,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to set or create a meta tag
    const setMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Description
    const metaDescription = description || DEFAULT_DESCRIPTION;
    setMeta('description', metaDescription);

    // 3. Robots Indexing Directives
    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // 4. Canonical Link
    const activeCanonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', activeCanonical);

    // 5. Open Graph Meta Tags
    const activeImage = ogImage
      ? (ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`)
      : `${BASE_URL}${DEFAULT_IMAGE}`;

    setMeta('og:title', formattedTitle, true);
    setMeta('og:description', metaDescription, true);
    setMeta('og:url', activeCanonical, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:image', activeImage, true);
    setMeta('og:locale', 'en_IN', true);

    if (productData) {
      setMeta('product:price:amount', productData.price.toString(), true);
      setMeta('product:price:currency', productData.currency || 'INR', true);
      setMeta('product:retailer_item_id', productData.sku, true);
      setMeta('product:availability', productData.availability ? 'in stock' : 'out of stock', true);
    }

    // 6. Twitter Card Meta Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', formattedTitle);
    setMeta('twitter:description', metaDescription);
    setMeta('twitter:image', activeImage);

    // 7. Schema.org JSON-LD Management
    const scriptId = 'tamrah-schema-jsonld';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    const schemas: Record<string, unknown>[] = [];

    // Base Organization Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.svg`,
      description: DEFAULT_DESCRIPTION,
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Andhra Pradesh',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Artisan Catalogue & Bulk Inquiries',
        availableLanguage: ['English', 'Telugu', 'Hindi'],
      },
    });

    // WebSite Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/shop?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });

    // Product Schema (Strictly factual data from DB, no fake ratings/reviews)
    if (productData) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productData.name,
        description: productData.description,
        image: [activeImage],
        sku: productData.sku,
        category: productData.category || 'Handcrafted Metal Décor',
        material: productData.material || 'Solid Black-Metal Alloy',
        color: 'Charcoal Black Patina',
        brand: {
          '@type': 'Brand',
          name: SITE_NAME,
        },
        offers: {
          '@type': 'Offer',
          url: activeCanonical,
          priceCurrency: productData.currency || 'INR',
          price: productData.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: productData.availability
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: SITE_NAME,
          },
        },
      });
    }

    // Breadcrumbs Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url.startsWith('/') ? '' : '/'}${crumb.url}`,
        })),
      });
    }

    scriptElement.textContent = JSON.stringify(schemas);

    return () => {
      // Optional cleanup on unmount
    };
  }, [title, description, canonicalUrl, ogType, ogImage, noIndex, productData, breadcrumbs]);

  return null;
}
