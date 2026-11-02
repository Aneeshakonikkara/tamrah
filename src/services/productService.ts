// ============================================================
// TAMRAH – Product Data Access Service
// Reusable service with Database-level pagination, filtering & fallback
// ============================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';
import type { Product, Collection } from '../types/index.ts';
import { products as localProducts } from '../data/products.ts';
import { collections as localCollections } from '../data/collections.ts';

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  searchQuery?: string;
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  availability?: 'all' | 'in-stock' | 'made-to-order';
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Format numeric price into standard Indian Rupee string (e.g. 18500 -> "₹18,500")
 */
export function formatINR(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

/**
 * Maps a raw Supabase joined row into the frontend Product interface
 */
function mapDatabaseToProduct(row: any): Product {
  const images = Array.isArray(row.product_images) && row.product_images.length > 0
    ? [...row.product_images]
        .sort((a: { display_order: number; is_primary?: boolean }, b: { display_order: number; is_primary?: boolean }) => {
          // Primary image always first if designated
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.display_order ?? 0) - (b.display_order ?? 0);
        })
        .map((img: { src: string; alt: string; is_primary: boolean }) => ({
          src: img.src,
          alt: img.alt || row.name,
          isPrimary: Boolean(img.is_primary),
        }))
    : [{ src: '/images/products/ganesha.jpg', alt: row.name, isPrimary: true }];

  const specs = row.product_specifications?.[0] || row.product_specifications || {};
  const tags = Array.isArray(row.product_tags)
    ? row.product_tags.map((t: { tag: string }) => t.tag)
    : [];

  const price = Number(row.price);
  const origPrice = row.original_price ? Number(row.original_price) : undefined;

  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    slug: row.slug,
    collectionId: row.category_id,
    shortDescription: row.short_description || '',
    description: row.description || '',
    // Strict adherence: do not invent specifications if absent from database
    material: specs.material || '',
    dimensions: specs.dimensions || '',
    finish: specs.finish || '',
    weight: specs.weight || '',
    colour: specs.colour || '',
    technique: specs.technique || '',
    careInstructions: specs.care_instructions || '',
    price,
    originalPrice: origPrice,
    formattedPrice: formatINR(price),
    formattedOriginalPrice: origPrice ? formatINR(origPrice) : undefined,
    images: images.length > 0 ? images : [{ src: '/images/products/ganesha.jpg', alt: row.name }],
    tags,
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    isBestseller: Boolean(row.is_bestseller),
    availability: row.availability === 'made-to-order' ? 'made-to-order' : 'in-stock',
    inStock: row.availability === 'in-stock',
    enquiryEnabled: row.enquiry_enabled ?? true,
  };
}

/**
 * Maps a raw category row into the Collection interface
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategoryToCollection(cat: any): Collection {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    shortDescription: cat.short_description || '',
    description: cat.description || '',
    coverImage: cat.image_src || '/images/categories/sculptures.jpg',
    coverImageAlt: `${cat.name} handcrafted collection by TAMRAH`,
    sortOrder: cat.display_order || 0,
  };
}

// ── DATA ACCESS FUNCTIONS ───────────────────────────────────

/**
 * Fetches products with database-level filtering, search, sorting and pagination.
 * Automatically falls back to local data if Supabase credentials are not configured.
 */
export async function getProducts(
  params: ProductQueryParams = {}
): Promise<PaginatedResult<Product>> {
  const {
    page = 1,
    pageSize = 12,
    categoryId,
    searchQuery,
    sortBy = 'featured',
    availability = 'all',
    minPrice,
    maxPrice,
  } = params;

  // 1. LIVE SUPABASE QUERY
  if (isSupabaseConfigured() && supabase) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('products')
        .select(
          `
          *,
          product_specifications(*),
          product_images(*),
          product_tags(tag),
          categories(id, name, slug)
        `,
          { count: 'exact' }
        )
        .eq('is_published', true);

      // Category filter at DB level
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      // Availability filter at DB level
      if (availability && availability !== 'all') {
        query = query.eq('availability', availability);
      }

      // Price range filters at DB level
      if (minPrice !== undefined && minPrice > 0) {
        query = query.gte('price', minPrice);
      }
      if (maxPrice !== undefined && maxPrice > 0) {
        query = query.lte('price', maxPrice);
      }

      // Search at DB level (case-insensitive on name, SKU & short description)
      if (searchQuery && searchQuery.trim() !== '') {
        const term = `%${searchQuery.trim()}%`;
        query = query.or(`name.ilike.${term},short_description.ilike.${term},sku.ilike.${term}`);
      }

      // Sorting at DB level
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'featured':
        default:
          query = query
            .order('is_featured', { ascending: false })
            .order('display_order', { ascending: true });
          break;
      }

      // Pagination at DB level
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('[TAMRAH DB] getProducts query error:', error);
        throw error;
      }

      const totalCount = count || 0;
      const mapped = (data || []).map(mapDatabaseToProduct);

      return {
        data: mapped,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    } catch (err) {
      console.warn('[TAMRAH DB] Supabase query failed. Falling back to static data.', err);
    }
  }

  // 2. STATIC LOCAL FALLBACK (Zero disruption during development)
  let filtered = [...localProducts];

  if (categoryId && categoryId !== 'all') {
    filtered = filtered.filter((p) => p.collectionId === categoryId);
  }

  if (availability && availability !== 'all') {
    filtered = filtered.filter((p) => p.availability === availability);
  }

  if (minPrice !== undefined && minPrice > 0) {
    filtered = filtered.filter((p) => (p.price || 0) >= minPrice);
  }

  if (maxPrice !== undefined && maxPrice > 0) {
    filtered = filtered.filter((p) => (p.price || 0) <= maxPrice);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku ? p.sku.toLowerCase().includes(q) : false) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  switch (sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price_desc':
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'featured':
    default:
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  const totalCount = filtered.length;
  const from = (page - 1) * pageSize;
  const paginated = filtered.slice(from, from + pageSize);

  return {
    data: paginated,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/**
 * Fetches an individual product by its URL slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          product_specifications(*),
          product_images(*),
          product_tags(tag),
          product_variants(*),
          categories(*)
        `
        )
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) {
        console.error('[TAMRAH DB] getProductBySlug query error:', error);
        throw error;
      }

      if (data) {
        return mapDatabaseToProduct(data);
      }
    } catch (err) {
      console.warn('[TAMRAH DB] Supabase getProductBySlug failed. Falling back to local data.', err);
    }
  }

  // Fallback to local catalogue
  const found = localProducts.find((p) => p.slug === slug);
  return found || null;
}

/**
 * Fetches spotlighted / featured products for home & showcase sections.
 */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          product_specifications(*),
          product_images(*),
          product_tags(tag),
          categories(id, name, slug)
        `
        )
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('[TAMRAH DB] getFeaturedProducts error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDatabaseToProduct);
      }
    } catch (err) {
      console.warn('[TAMRAH DB] Supabase getFeaturedProducts failed. Using local fallback.', err);
    }
  }

  return localProducts.filter((p) => p.isFeatured).slice(0, limit);
}

/**
 * Fetches related products from the same collection or category.
 */
export async function getRelatedProducts(
  currentProductId: string,
  categoryId: string,
  limit = 4
): Promise<Product[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          product_specifications(*),
          product_images(*),
          product_tags(tag),
          categories(id, name, slug)
        `
        )
        .eq('is_published', true)
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .order('is_featured', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[TAMRAH DB] getRelatedProducts error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDatabaseToProduct);
      }
    } catch (err) {
      console.warn('[TAMRAH DB] Supabase getRelatedProducts failed. Using local fallback.', err);
    }
  }

  const sameCategory = localProducts.filter(
    (p) => p.collectionId === categoryId && p.id !== currentProductId
  );
  const otherCategory = localProducts.filter(
    (p) => p.collectionId !== categoryId && p.id !== currentProductId
  );
  return [...sameCategory, ...otherCategory].slice(0, limit);
}

/**
 * Fetches active collections / categories for navigation and filter bars.
 */
export async function getCategories(): Promise<Collection[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[TAMRAH DB] getCategories error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapCategoryToCollection);
      }
    } catch (err) {
      console.warn('[TAMRAH DB] Supabase getCategories failed. Using local fallback.', err);
    }
  }

  return localCollections;
}

/**
 * Fetches verified bestseller products (ONLY where is_bestseller = true)
 * Strictly fulfills Requirement 4: "Bestselling products only if a genuine bestseller field exists. Do not label products as bestsellers without evidence."
 */
export async function getBestsellers(limit = 4): Promise<Product[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          product_specifications(*),
          product_images(*),
          product_tags(tag),
          categories(id, name, slug)
        `
        )
        .eq('is_published', true)
        .eq('is_bestseller', true)
        .order('display_order', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('[TAMRAH DB] getBestsellers error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDatabaseToProduct);
      }
    } catch (err) {
      console.warn('[TAMRAH DB] Supabase getBestsellers failed. Using local fallback.', err);
    }
  }

  return localProducts.filter((p) => p.isBestseller).slice(0, limit);
}

/**
 * Fetches new arrivals from the database (is_new = true or newest created_at)
 */
export async function getNewArrivals(limit = 6): Promise<Product[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          product_specifications(*),
          product_images(*),
          product_tags(tag),
          categories(id, name, slug)
        `
        )
        .eq('is_published', true)
        .eq('is_new', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[TAMRAH DB] getNewArrivals error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDatabaseToProduct);
      }
    } catch (err) {
      console.warn('[TAMRAH DB] Supabase getNewArrivals failed. Using local fallback.', err);
    }
  }

  return localProducts.filter((p) => p.isNew).slice(0, limit);
}

/**
 * Fetches accurate product counts per category for the shop filter and navigation
 */
export async function getCategoryProductCounts(): Promise<Record<string, number>> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category_id')
        .eq('is_published', true);

      if (!error && data) {
        const counts: Record<string, number> = { all: data.length };
        data.forEach((r) => {
          if (r.category_id) {
            counts[r.category_id] = (counts[r.category_id] || 0) + 1;
          }
        });
        return counts;
      }
    } catch (err) {
      console.warn('[TAMRAH DB] getCategoryProductCounts failed. Using local fallback.', err);
    }
  }

  const counts: Record<string, number> = { all: localProducts.length };
  localProducts.forEach((p) => {
    counts[p.collectionId] = (counts[p.collectionId] || 0) + 1;
  });
  return counts;
}

