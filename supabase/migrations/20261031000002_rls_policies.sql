-- ============================================================
-- TAMRAH Catalogue Database Migration 02: Row Level Security (RLS)
-- Access Control Policies for Public Catalogue & Admin Operations
-- ============================================================

-- ── 1. HELPER FUNCTIONS ──────────────────────────────────────

-- Check if current authenticated user is an active administrator
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_profiles
        WHERE id = auth.uid()
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current authenticated user is a super administrator
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_profiles
        WHERE id = auth.uid()
        AND role = 'super_admin'
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── 2. ENABLE ROW LEVEL SECURITY ─────────────────────────────
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

-- ── 3. ADMIN PROFILES POLICIES ───────────────────────────────
-- Security Rule: Disallow public registration. Users can never register themselves as admins.

-- Users can only read their own profile if authenticated
CREATE POLICY "Admins can view their own profile"
ON admin_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Super admins can view all admin profiles
CREATE POLICY "Super admins can view all profiles"
ON admin_profiles
FOR SELECT
TO authenticated
USING (is_super_admin());

-- Only super admins can insert, update or delete admin profiles
CREATE POLICY "Super admins can manage admin profiles"
ON admin_profiles
FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- ── 4. CATEGORIES POLICIES ───────────────────────────────────
-- Public visitors can read active categories
CREATE POLICY "Public can view active categories"
ON categories
FOR SELECT
TO anon, authenticated
USING (is_active = TRUE);

-- Administrators can view all categories (including inactive drafts)
CREATE POLICY "Admins can view all categories"
ON categories
FOR SELECT
TO authenticated
USING (is_admin());

-- Administrators can insert, update, or delete categories
CREATE POLICY "Admins can manage categories"
ON categories
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ── 5. PRODUCTS POLICIES ─────────────────────────────────────
-- Public visitors can only view published products
CREATE POLICY "Public can view published products"
ON products
FOR SELECT
TO anon, authenticated
USING (is_published = TRUE);

-- Administrators can view all products (including unpublished drafts)
CREATE POLICY "Admins can view all products"
ON products
FOR SELECT
TO authenticated
USING (is_admin());

-- Only administrators can insert, update, or delete products
CREATE POLICY "Admins can manage products"
ON products
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ── 6. PRODUCT SPECIFICATIONS POLICIES ───────────────────────
-- Public can view specifications for published products
CREATE POLICY "Public can view specifications of published products"
ON product_specifications
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM products p
        WHERE p.id = product_specifications.product_id
        AND p.is_published = TRUE
    )
);

-- Administrators can view all specifications
CREATE POLICY "Admins can view all specifications"
ON product_specifications
FOR SELECT
TO authenticated
USING (is_admin());

-- Administrators can manage specifications
CREATE POLICY "Admins can manage specifications"
ON product_specifications
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ── 7. PRODUCT IMAGES POLICIES ───────────────────────────────
-- Public can view images for published products
CREATE POLICY "Public can view images of published products"
ON product_images
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM products p
        WHERE p.id = product_images.product_id
        AND p.is_published = TRUE
    )
);

-- Administrators can view all product images
CREATE POLICY "Admins can view all product images"
ON product_images
FOR SELECT
TO authenticated
USING (is_admin());

-- Administrators can manage product images
CREATE POLICY "Admins can manage product images"
ON product_images
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ── 8. PRODUCT VARIANTS POLICIES ─────────────────────────────
-- Public can view available variants of published products
CREATE POLICY "Public can view variants of published products"
ON product_variants
FOR SELECT
TO anon, authenticated
USING (
    is_available = TRUE AND EXISTS (
        SELECT 1 FROM products p
        WHERE p.id = product_variants.product_id
        AND p.is_published = TRUE
    )
);

-- Administrators can view all variants
CREATE POLICY "Admins can view all variants"
ON product_variants
FOR SELECT
TO authenticated
USING (is_admin());

-- Administrators can manage variants
CREATE POLICY "Admins can manage variants"
ON product_variants
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ── 9. PRODUCT TAGS POLICIES ─────────────────────────────────
-- Public can view tags of published products
CREATE POLICY "Public can view tags of published products"
ON product_tags
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM products p
        WHERE p.id = product_tags.product_id
        AND p.is_published = TRUE
    )
);

-- Administrators can view all tags
CREATE POLICY "Admins can view all tags"
ON product_tags
FOR SELECT
TO authenticated
USING (is_admin());

-- Administrators can manage tags
CREATE POLICY "Admins can manage tags"
ON product_tags
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
