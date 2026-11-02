// ============================================================
// TAMRAH – Supabase Database TypeScript Definitions
// Generated for PostgreSQL Schema (Categories, Products, Images, Specs, Variants, Tags, Admins)
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'super_admin' | 'admin' | 'catalogue_editor';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'super_admin' | 'admin' | 'catalogue_editor';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'super_admin' | 'admin' | 'catalogue_editor';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string;
          description: string | null;
          image_src: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          short_description: string;
          description?: string | null;
          image_src?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          short_description?: string;
          description?: string | null;
          image_src?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          slug: string;
          category_id: string;
          short_description: string;
          description: string;
          price: number;
          original_price: number | null;
          availability: 'in-stock' | 'made-to-order' | 'out-of-stock';
          is_published: boolean;
          is_featured: boolean;
          is_bestseller: boolean;
          is_new: boolean;
          enquiry_enabled: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          slug: string;
          category_id: string;
          short_description: string;
          description: string;
          price: number;
          original_price?: number | null;
          availability?: 'in-stock' | 'made-to-order' | 'out-of-stock';
          is_published?: boolean;
          is_featured?: boolean;
          is_bestseller?: boolean;
          is_new?: boolean;
          enquiry_enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          name?: string;
          slug?: string;
          category_id?: string;
          short_description?: string;
          description?: string;
          price?: number;
          original_price?: number | null;
          availability?: 'in-stock' | 'made-to-order' | 'out-of-stock';
          is_published?: boolean;
          is_featured?: boolean;
          is_bestseller?: boolean;
          is_new?: boolean;
          enquiry_enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      product_specifications: {
        Row: {
          id: string;
          product_id: string;
          material: string;
          finish: string;
          dimensions: string;
          weight: string;
          colour: string;
          technique: string;
          care_instructions: string;
          origin: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          material: string;
          finish: string;
          dimensions: string;
          weight: string;
          colour: string;
          technique: string;
          care_instructions: string;
          origin?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          material?: string;
          finish?: string;
          dimensions?: string;
          weight?: string;
          colour?: string;
          technique?: string;
          care_instructions?: string;
          origin?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_specifications_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: true;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          src: string;
          alt: string;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          src: string;
          alt: string;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          src?: string;
          alt?: string;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price: number | null;
          dimensions: string | null;
          weight: string | null;
          is_available: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          sku?: string | null;
          price?: number | null;
          dimensions?: string | null;
          weight?: string | null;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          sku?: string | null;
          price?: number | null;
          dimensions?: string | null;
          weight?: string | null;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      product_tags: {
        Row: {
          id: string;
          product_id: string;
          tag: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          tag: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          tag?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_tags_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ── Convenience Aliases ─────────────────────────────────────
export type ProductRow = Database['public']['Tables']['products']['Row'];
export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type ProductImageRow = Database['public']['Tables']['product_images']['Row'];
export type ProductSpecificationRow = Database['public']['Tables']['product_specifications']['Row'];
export type ProductVariantRow = Database['public']['Tables']['product_variants']['Row'];
export type ProductTagRow = Database['public']['Tables']['product_tags']['Row'];
export type AdminProfileRow = Database['public']['Tables']['admin_profiles']['Row'];

/**
 * Joined Product structure returned by catalogue queries
 */
export interface ProductWithDetails extends ProductRow {
  category?: CategoryRow;
  specifications?: ProductSpecificationRow | null;
  images: ProductImageRow[];
  variants?: ProductVariantRow[];
  tags: string[];
}
