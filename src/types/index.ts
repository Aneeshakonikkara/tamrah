// ============================================================
// TAMRAH – Type Definitions
// ============================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  shortDescription: string;
  description: string;
  material: string;
  dimensions?: string;
  finish?: string;
  price?: number;
  originalPrice?: number;
  formattedPrice?: string;
  formattedOriginalPrice?: string;
  images: ProductImage[];
  tags: string[];
  sku?: string;
  weight?: string;
  colour?: string;
  technique?: string;
  careInstructions?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isPublished?: boolean;
  availability?: 'in-stock' | 'made-to-order';
  inStock?: boolean;
  enquiryEnabled: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
  sortOrder: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
