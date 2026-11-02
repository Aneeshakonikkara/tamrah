-- ============================================================
-- TAMRAH Catalogue Database Migration 04: SEO Columns
-- Adds SEO title and description to products table
-- ============================================================

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;

COMMENT ON COLUMN products.seo_title IS 'Custom SEO title tag for search engine optimization';
COMMENT ON COLUMN products.seo_description IS 'Custom meta description tag for search engine optimization';
