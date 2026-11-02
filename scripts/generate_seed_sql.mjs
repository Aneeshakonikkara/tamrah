// Script to generate version-controlled seed SQL from current catalogue data
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSeed() {
  const { products } = await import('../src/data/products.ts');
  const { collections } = await import('../src/data/collections.ts');

  let sql = `-- ============================================================
-- TAMRAH Catalogue Database Migration 03: Seed Data
-- Populates Categories, Products, Specifications, Images, and Tags
-- ============================================================

-- ── 1. SEED CATEGORIES ───────────────────────────────────────
`;

  for (const c of collections) {
    const desc = c.description.replace(/'/g, "''");
    const shortDesc = c.shortDescription.replace(/'/g, "''");
    const name = c.name.replace(/'/g, "''");
    sql += `INSERT INTO categories (id, name, slug, short_description, description, image_src, display_order, is_active)
VALUES ('${c.id}', '${name}', '${c.slug}', '${shortDesc}', '${desc}', '${c.coverImage}', ${c.sortOrder}, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  image_src = EXCLUDED.image_src,
  display_order = EXCLUDED.display_order;\n\n`;
  }

  sql += `-- ── 2. SEED PRODUCTS & SPECIFICATIONS ───────────────────────\n`;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const name = p.name.replace(/'/g, "''");
    const shortDesc = p.shortDescription.replace(/'/g, "''");
    const desc = p.description.replace(/'/g, "''");
    const origPrice = p.originalPrice ? p.originalPrice : 'NULL';

    // Products table
    sql += `INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  '${p.id}', '${p.sku}', '${name}', '${p.slug}', '${p.collectionId}', '${shortDesc}', '${desc}',
  ${p.price}, ${origPrice}, '${p.availability || 'in-stock'}', TRUE, ${p.isFeatured ? 'TRUE' : 'FALSE'},
  ${p.isBestseller ? 'TRUE' : 'FALSE'}, ${p.isNew ? 'TRUE' : 'FALSE'}, TRUE, ${i + 1}
) ON CONFLICT (id) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category_id = EXCLUDED.category_id,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  availability = EXCLUDED.availability,
  is_featured = EXCLUDED.is_featured,
  is_bestseller = EXCLUDED.is_bestseller,
  is_new = EXCLUDED.is_new;\n\n`;

    // Product Specifications
    const mat = (p.material || 'Solid black-metal alloy').replace(/'/g, "''");
    const fin = (p.finish || 'Antique matte charcoal black with natural beeswax seal').replace(/'/g, "''");
    const dim = (p.dimensions || 'Standard dimensions').replace(/'/g, "''");
    const wt = (p.weight || 'Approx. 4.5 kg').replace(/'/g, "''");
    const col = (p.colour || 'Matte Charcoal Black').replace(/'/g, "''");
    const tech = (p.technique || 'Traditional Andhra moulding and lost-wax casting').replace(/'/g, "''");
    const care = (p.careInstructions || 'Wipe with soft dry cloth').replace(/'/g, "''");

    sql += `INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  '${p.id}', '${mat}', '${fin}', '${dim}', '${wt}', '${col}', '${tech}', '${care}', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;\n\n`;

    // Product Images
    if (p.images && p.images.length > 0) {
      for (let imgIdx = 0; imgIdx < p.images.length; imgIdx++) {
        const img = p.images[imgIdx];
        const alt = (img.alt || p.name).replace(/'/g, "''");
        const isPrim = imgIdx === 0 || img.isPrimary ? 'TRUE' : 'FALSE';
        sql += `INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('${p.id}', '${img.src}', '${alt}', ${imgIdx + 1}, ${isPrim});\n`;
      }
      sql += '\n';
    }

    // Product Tags
    if (p.tags && p.tags.length > 0) {
      for (const t of p.tags) {
        const safeTag = t.replace(/'/g, "''");
        sql += `INSERT INTO product_tags (product_id, tag) VALUES ('${p.id}', '${safeTag}') ON CONFLICT (product_id, tag) DO NOTHING;\n`;
      }
      sql += '\n';
    }
  }

  const targetPath = path.resolve(__dirname, '../supabase/migrations/20261031000003_seed_data.sql');
  fs.writeFileSync(targetPath, sql, 'utf-8');
  console.log(`✅ Seed migration written to: ${targetPath}`);
}

generateSeed().catch(console.error);
