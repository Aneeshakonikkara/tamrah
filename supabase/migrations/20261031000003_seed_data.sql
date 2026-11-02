-- ============================================================
-- TAMRAH Catalogue Database Migration 03: Seed Data
-- Populates Categories, Products, Specifications, Images, and Tags
-- ============================================================

-- ── 1. SEED CATEGORIES ───────────────────────────────────────
INSERT INTO categories (id, name, slug, short_description, description, image_src, display_order, is_active)
VALUES ('sculptures-idols', 'Sculptures & Idols', 'sculptures-idols', 'Sacred idols and timeless figures cast in deep matte black metal.', 'Each piece in our Sculptures & Idols collection is individually cast and finished by master artisans in Andhra Pradesh. Drawing from classical Indian iconography and balanced geometry, these works transform living spaces into sanctuaries of craft.', '/images/categories/sculptures.jpg', 1, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  image_src = EXCLUDED.image_src,
  display_order = EXCLUDED.display_order;

INSERT INTO categories (id, name, slug, short_description, description, image_src, display_order, is_active)
VALUES ('wall-decor', 'Wall Décor', 'wall-decor', 'Intricate panels and commanding wall hangings that anchor spaces.', 'From intricate floral jaali panels to sweeping Tree of Life compositions, our Wall Décor collection transforms bare architectural surfaces into statements of artisanal depth and shadow play.', '/images/categories/wall-decor.jpg', 2, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  image_src = EXCLUDED.image_src,
  display_order = EXCLUDED.display_order;

INSERT INTO categories (id, name, slug, short_description, description, image_src, display_order, is_active)
VALUES ('mirrors-frames', 'Mirrors & Frames', 'mirrors-frames', 'Hand-forged architectural frames with botanical scrollwork.', 'A mirror framed in TAMRAH metalwork is a quiet centerpiece. Our frames unite structural precision with botanical scrollwork, reflecting light and surrounding spaces with timeless distinction.', '/images/categories/mirrors.jpg', 3, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  image_src = EXCLUDED.image_src,
  display_order = EXCLUDED.display_order;

INSERT INTO categories (id, name, slug, short_description, description, image_src, display_order, is_active)
VALUES ('lamps-lighting', 'Lamps & Lighting', 'lamps-lighting', 'Perforated lampshades that sculpt warm ambient shadows and atmosphere.', 'Light filtered through TAMRAH jaali cutwork takes on hypnotic depth. Our lampshades cast delicate tessellations across walls and ceilings, creating intimate and inviting environments after dusk.', '/images/categories/lamps.jpg', 4, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  image_src = EXCLUDED.image_src,
  display_order = EXCLUDED.display_order;

INSERT INTO categories (id, name, slug, short_description, description, image_src, display_order, is_active)
VALUES ('decorative-accessories', 'Decorative Accessories', 'decorative-accessories', 'Tiered stands, urlis, and accent vessels — finishing touches of considered living.', 'Great interiors live in thoughtful accents. Our decorative accessories range includes tiered corner stands, hand-hammered urlis, and incense vessels that complete a curated home.', '/images/categories/accessories.jpg', 5, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  image_src = EXCLUDED.image_src,
  display_order = EXCLUDED.display_order;

-- ── 2. SEED PRODUCTS & SPECIFICATIONS ───────────────────────
INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'sc-001', 'TMR-SC-001', 'Nataraja — Lord of Cosmic Dance', 'nataraja-lord-of-cosmic-dance', 'sculptures-idols', 'A classical Nataraja rendered in deep-black metal, capturing infinite motion in still form.', 'Cast using traditional Andhra moulding techniques, this Nataraja embodies the cosmic dance of creation and destruction. The figure stands within a flaming aureole, each detail — from the matted locks to the poised foot — shaped by artisan hands over days of careful work.',
  18500, 21000, 'in-stock', TRUE, TRUE,
  TRUE, FALSE, TRUE, 1
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'sc-001', 'Handcrafted solid black-metal alloy', 'Antique matte charcoal black with natural beeswax seal', '45 cm H × 30 cm W × 12 cm D', 'Approx. 6.4 kg [Solid Cast Metal]', 'Deep Matte Charcoal Black with subtle bronze rub', 'Traditional Andhra moulding and lost-wax casting', 'Wipe gently with a soft dry cotton cloth. Avoid chemical solvents or water soaking. Apply thin coat of organic beeswax or mineral oil once a year to preserve dark lustre.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-001', '/images/products/nataraja.jpg', 'TAMRAH Nataraja sculpture front view', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-001', '/images/products/detail-chisel.jpg', 'Close-up hand-chiseled texture detail', 2, FALSE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-001', '/images/home/hero.jpg', 'Nataraja styled in luxury minimalist interior', 3, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('sc-001', 'nataraja') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-001', 'shiva') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-001', 'classical') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-001', 'sculpture') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-001', 'hindu idol') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'sc-002', 'TMR-SC-002', 'Contemplative Ganesha Idol', 'contemplative-ganesha-idol', 'sculptures-idols', 'Ganesha in meditative repose — a study in stillness, proportion and sacred form.', 'This seated Ganesha departs from the ceremonially ornate to embrace quiet contemplation. The simplified geometry of the form, punctuated by the characteristic curved trunk and broad ears, creates a piece equally at home in a pooja room or a curated modern interior.',
  12800, 14500, 'in-stock', TRUE, TRUE,
  TRUE, FALSE, TRUE, 2
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'sc-002', 'Solid black metal alloy with antique patina', 'Antique matte black with bronze edge highlights', '30 cm H × 20 cm W × 16 cm D', 'Approx. 3.8 kg [Solid Cast Metal]', 'Aged Charcoal Black with bronze patina', 'Sand & loam mould hand casting', 'Dust with a dry microfibre brush. Avoid abrasive polishing powders or acidic liquids.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-002', '/images/products/ganesha.jpg', 'TAMRAH Contemplative Ganesha sculpture', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-002', '/images/products/detail-chisel.jpg', 'Chiseled metal detail of Ganesha', 2, FALSE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-002', '/images/categories/sculptures.jpg', 'Ganesha idol studio shelf styling', 3, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('sc-002', 'ganesha') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-002', 'ganpati') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-002', 'sculpture') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-002', 'meditation') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-002', 'pooja') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'sc-003', 'TMR-SC-003', 'Meditating Buddha — Dhyana Mudra', 'meditating-buddha-dhyana-mudra', 'sculptures-idols', 'Serene Buddha in deep meditative posture, sculpted with timeless balance.', 'Sculpted with a gentle countenance and serene meditative symmetry, this Buddha statue brings calm equilibrium into living halls, studies, and sacred alcoves. Cast with solid weight and polished with natural mineral wax.',
  14200, 16000, 'in-stock', TRUE, FALSE,
  TRUE, TRUE, TRUE, 3
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'sc-003', 'Cast metal alloy on limestone finish base', 'Smoked charcoal black with soft hand-buffed sheen', '36 cm H × 24 cm W × 18 cm D', 'Approx. 4.2 kg [Solid Cast Metal]', 'Charcoal Black with warm patinated highlights', 'Lost-mould casting with hand-burnished edges', 'Dust with soft dry cloth. Safe for indoor living and meditation rooms.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-003', '/images/products/buddha.jpg', 'TAMRAH Meditating Buddha sculpture', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-003', '/images/products/detail-chisel.jpg', 'Carved robe texture detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('sc-003', 'buddha') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-003', 'serenity') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-003', 'meditation') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-003', 'zen') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-003', 'sculpture') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'sc-004', 'TMR-SC-004', 'Standing Lakshmi — Goddess of Abundance', 'standing-lakshmi-goddess-of-abundance', 'sculptures-idols', 'Traditional standing Lakshmi holding lotuses, cast with exquisite devotional precision.', 'Crafted with the exacting care that classical devotional sculpture demands, this standing Lakshmi holds lotuses and showers prosperity in the iconic Varalakshmi posture. The matte-black finish gives the idol a timeless, temple-sanctum authority.',
  16500, NULL, 'made-to-order', TRUE, TRUE,
  FALSE, FALSE, TRUE, 4
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'sc-004', 'Handcrafted black metal alloy', 'Hand-buffed matte black patina', '42 cm H × 18 cm W × 14 cm D', 'Approx. 5.1 kg [Solid Metal]', 'Deep Temple Black', 'Traditional loam casting with chisel engraving', 'Dry dust only. Suitable for daily worship and living displays.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-004', '/images/categories/sculptures.jpg', 'TAMRAH Lakshmi devotional idol', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-004', '/images/products/detail-chisel.jpg', 'Hand-finished metal texture', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('sc-004', 'lakshmi') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-004', 'goddess') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-004', 'idol') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-004', 'devotional') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-004', 'wealth') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'sc-005', 'TMR-SC-005', 'Abstract Dynamic Figure No. 4', 'abstract-dynamic-figure-4', 'sculptures-idols', 'Contemporary metal silhouette exploring tension, balance and negative space.', 'Part of TAMRAH contemporary gallery line, this abstract piece interprets the human poise through slender curved planes of cast metal. A commanding modern statement piece for architectural consoles and credenzas.',
  13900, NULL, 'in-stock', TRUE, FALSE,
  FALSE, TRUE, TRUE, 5
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'sc-005', 'Forged black metal alloy', 'Brushed charcoal patina', '48 cm H × 16 cm W × 12 cm D', 'Approx. 3.4 kg', 'Graphite Charcoal Black', 'Hand-moulded lost-wax with fine hand-filing', 'Clean with dry lint-free cloth.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-005', '/images/products/ganesha.jpg', 'TAMRAH Abstract Dynamic Sculpture', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('sc-005', '/images/products/detail-chisel.jpg', 'Hand-chiseled texture detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('sc-005', 'contemporary') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-005', 'abstract') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-005', 'modern') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('sc-005', 'minimalist') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'wd-001', 'TMR-WD-001', 'Mandala Medallion — Floral Jaali Panel', 'mandala-medallion-floral-jaali-panel', 'wall-decor', 'A circular medallion wall panel featuring intricate radial jaali cutwork.', 'Inspired by sacred temple geometry and Mughal jaali traditions, this circular wall medallion creates an architectural presence. Intricately pierced and finished in antique charcoal patina, it casts radiant shadow patterns across your interior wall.',
  15400, 17800, 'in-stock', TRUE, TRUE,
  TRUE, FALSE, TRUE, 6
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'wd-001', 'Handcrafted black metal alloy', 'Antique matte black with protective clear lacquer', '75 cm Diameter × 3 cm Depth', 'Approx. 5.2 kg', 'Matte Charcoal Black', 'Precision pierced jaali metalwork with chiseled border', 'Wipe with dry feather duster or soft cloth. Ships with concealed heavy-duty wall anchors.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-001', '/images/products/wall-mandala.jpg', 'TAMRAH Mandala wall panel', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-001', '/images/products/detail-jaali.jpg', 'Intricate pierced floral cutwork detail', 2, FALSE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-001', '/images/categories/wall-decor.jpg', 'Wall panel installed in interior', 3, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('wd-001', 'wall panel') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-001', 'mandala') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-001', 'geometric') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-001', 'cutwork') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-001', 'jaali') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'wd-002', 'TMR-WD-002', 'Tree of Life — Kalpavriksha Hanging', 'tree-of-life-kalpavriksha-hanging', 'wall-decor', 'The ancient Tree of Life motif rendered in expansive black metal lattice.', 'A commanding focal centrepiece for living rooms and stairwells, this Tree of Life hanging features hundreds of hand-carved leaves and organic branching roots radiating from a sturdy twisted trunk.',
  21000, 24500, 'in-stock', TRUE, TRUE,
  TRUE, TRUE, TRUE, 7
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'wd-002', 'Hand-hammered black metal alloy', 'Deep charcoal with subtle burnished edges', '85 cm Diameter × 2.5 cm Depth', 'Approx. 7.2 kg', 'Deep Charcoal Black', 'Hand-hammered and pierced sheet alloy with cast trunk core', 'Mount on load-bearing masonry wall using provided heavy-duty anchors.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-002', '/images/products/tree-of-life.jpg', 'TAMRAH Tree of Life wall hanging', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-002', '/images/products/detail-jaali.jpg', 'Lattice foliage detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('wd-002', 'tree of life') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-002', 'wall hanging') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-002', 'large') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-002', 'nature') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-002', 'kalpavriksha') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'wd-003', 'TMR-WD-003', 'Kalasha Triptych Panel Set', 'kalasha-triptych-panel-set', 'wall-decor', 'Three-panel wall installation depicting auspicious sacred motifs in geometric relief.', 'Inspired by the sacred vessel of Indian ceremonies, this three-panel set brings modular architectural elegance. Designed to be mounted side-by-side or spaced across accent walls.',
  19500, NULL, 'made-to-order', TRUE, FALSE,
  FALSE, FALSE, TRUE, 8
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'wd-003', 'Solid black metal alloy panels', 'Antique matte black', '3 panels, each 65 cm H × 22 cm W', 'Approx. 8.4 kg [Total Set]', 'Smoked Matte Black', 'Cast relief panels with hand-chiseled borders', 'Wipe with dry cloth. Flush wall bracket set included.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-003', '/images/categories/wall-decor.jpg', 'TAMRAH Kalasha triptych wall panel', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-003', '/images/products/detail-jaali.jpg', 'Cutwork detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('wd-003', 'wall panel') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-003', 'triptych') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-003', 'geometric') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-003', 'modular') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'wd-004', 'TMR-WD-004', 'Lotus Blossom Radial Wall Plaque', 'lotus-blossom-radial-wall-plaque', 'wall-decor', 'Delicate stylized lotus petals arranged in symmetrical concentric relief.', 'A serene, mid-scale wall sculpture celebrating the sacred lotus. Lightweight yet sturdy, easily mounted with concealed flush-mount brackets.',
  9800, 11500, 'in-stock', TRUE, FALSE,
  FALSE, TRUE, TRUE, 9
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'wd-004', 'Handcrafted black metal', 'Matte charcoal with graphite rub', '50 cm Diameter × 2 cm Depth', 'Approx. 3.2 kg', 'Graphite Charcoal', 'Hand-formed repoussé and metal chasing', 'Dust with soft dry cotton.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-004', '/images/products/wall-mandala.jpg', 'TAMRAH Lotus Blossom wall plaque', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('wd-004', '/images/products/detail-jaali.jpg', 'Pierced petal detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('wd-004', 'lotus') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-004', 'wall plaque') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-004', 'minimalist') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('wd-004', 'floral') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'mf-001', 'TMR-MF-001', 'Arch Mirror — Heritage Botanical Frame', 'arch-mirror-heritage-botanical-frame', 'mirrors-frames', 'An arched mirror in a hand-forged frame of dense botanical metalwork.', 'The Heritage Frame pairs a regal arched silhouette with a border of painstakingly rendered botanical scrollwork — curling leaves, tendrils, and floral crests. Ships with high-grade float mirror glass and reinforced wall anchors.',
  24500, 28000, 'made-to-order', TRUE, TRUE,
  TRUE, FALSE, TRUE, 10
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'mf-001', 'Handcrafted black metal frame, 5 mm float mirror', 'Antique matte black', '120 cm H × 60 cm W × 4 cm D', 'Approx. 11.5 kg [Including 5mm float glass]', 'Deep Matte Black', 'Hand-forged architectural border with glass retainer clips', 'Clean mirror glass with standard glass cleaner applied to cloth. Keep liquid away from metal frame border.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('mf-001', '/images/categories/mirrors.jpg', 'TAMRAH Arch Mirror Heritage Frame', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('mf-001', '/images/products/detail-chisel.jpg', 'Botanical scrollwork border detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('mf-001', 'mirror') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-001', 'arch') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-001', 'botanical') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-001', 'heritage') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-001', 'statement') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'mf-002', 'TMR-MF-002', 'Sunburst Petal Round Mirror', 'sunburst-petal-round-mirror', 'mirrors-frames', 'Circular wall mirror enclosed in an intricate scrollwork jaali perimeter.', 'This round wall mirror brings architectural symmetry and reflecting luminescence to entryways, powder rooms, and living spaces. The outer ring features pierced floral scrolls reminiscent of Andhra temple gates.',
  16800, 19200, 'in-stock', TRUE, TRUE,
  TRUE, TRUE, TRUE, 11
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'mf-002', 'Handcrafted black metal frame with float mirror', 'Matte charcoal with warm antique wash', '70 cm Diameter × 3 cm Depth', 'Approx. 6.8 kg', 'Aged Charcoal Black', 'Pierced scrollwork ring with hand-welded outer rim', 'Wipe frame with dry lint-free cloth. Clean mirror with microfiber glass cloth.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('mf-002', '/images/products/mirror-round.jpg', 'TAMRAH Sunburst Round Mirror', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('mf-002', '/images/products/detail-jaali.jpg', 'Pierced perimeter petal detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('mf-002', 'mirror') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-002', 'round') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-002', 'sunburst') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-002', 'scrollwork') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-002', 'entryway') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'mf-003', 'TMR-MF-003', 'Jharokha Architectural Vanity Mirror', 'jharokha-architectural-vanity-mirror', 'mirrors-frames', 'Arched window-frame mirror inspired by royal Rajasthani and Deccan jharokhas.', 'Featuring a double arch pediment and delicate fretwork side pillars, this mirror evokes historical palace windows. Cast with substantial weight and timeless charisma.',
  18900, NULL, 'in-stock', TRUE, FALSE,
  FALSE, FALSE, TRUE, 12
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'mf-003', 'Black metal alloy frame, 5 mm mirror', 'Aged matte black', '90 cm H × 48 cm W × 3 cm D', 'Approx. 8.2 kg', 'Matte Charcoal Black', 'Lost-wax mould architectural casting', 'Keep dry. Dust metal with soft brush.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('mf-003', '/images/categories/mirrors.jpg', 'TAMRAH Jharokha Vanity Mirror', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('mf-003', '/images/products/detail-chisel.jpg', 'Fretwork pillar detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('mf-003', 'mirror') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-003', 'jharokha') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-003', 'arched') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-003', 'vanity') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('mf-003', 'heritage') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'ls-001', 'TMR-LS-001', 'Jaali Pendant Lampshade — Geometric Cutwork', 'jaali-pendant-lampshade-geometric-cutwork', 'lamps-lighting', 'Perforated pendant lampshade casting hypnotic geometric shadow patterns.', 'Inspired by the jaali screens of Mughal architecture, this pendant lampshade transforms ordinary light into ambient poetry. Hand-drilled floral tessellations cast luminous warmth across ceilings and walls.',
  8900, 10500, 'in-stock', TRUE, TRUE,
  TRUE, FALSE, TRUE, 13
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'ls-001', 'Black metal alloy with brass wire fitting', 'Antique matte black, golden interior glow', '30 cm H × 25 cm Diameter', 'Approx. 2.4 kg', 'Matte Charcoal Black exterior with golden-toned interior reflection', 'Hand-punched perforated jaali lattice', 'Turn off power before cleaning. Dust exterior with soft brush. E27 bulb socket compatible.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ls-001', '/images/products/lamp.jpg', 'TAMRAH Jaali Pendant Lampshade', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ls-001', '/images/products/detail-jaali.jpg', 'Lampshade perforated shadow projection detail', 2, FALSE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ls-001', '/images/categories/lamps.jpg', 'Lampshade suspended in interior', 3, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('ls-001', 'lampshade') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-001', 'pendant') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-001', 'jaali') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-001', 'lighting') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-001', 'geometric') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'ls-002', 'TMR-LS-002', 'Moroccan-Andhra Filigree Table Lamp', 'moroccan-andhra-filigree-table-lamp', 'lamps-lighting', 'Dome-shaped table lamp with thousands of micro-pierced light apertures.', 'A table lamp that doubles as a sculpture when unlit and creates an enchanting warm atmosphere when illuminated. Fitted with high-grade brass hardware and inline cord switch.',
  11200, 12800, 'in-stock', TRUE, TRUE,
  FALSE, TRUE, TRUE, 14
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'ls-002', 'Perforated black metal alloy with solid base', 'Matte black with burnished brass neck', '38 cm H × 22 cm Diameter', 'Approx. 3.1 kg', 'Charcoal Black with Burnished Brass', 'Hand-pierced micro-dome filigree', 'Unplug before wiping with dry soft cloth. Warm LED bulb recommended.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ls-002', '/images/categories/lamps.jpg', 'TAMRAH Filigree Table Lamp', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ls-002', '/images/products/detail-jaali.jpg', 'Micro-aperture light pattern', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('ls-002', 'table lamp') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-002', 'lighting') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-002', 'filigree') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-002', 'ambient') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-002', 'brass') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'ls-003', 'TMR-LS-003', 'Tall Geometric Floor Silhouette Lantern', 'tall-geometric-floor-silhouette-lantern', 'lamps-lighting', 'Columnar floor lamp with tall vertical jaali slats creating dramatic room shadows.', 'Ideal for living corners and foyers, this standing lantern projects tall vertical shadow rays that heighten ceiling perception. Features internal candle/bulb socket.',
  17500, NULL, 'made-to-order', TRUE, FALSE,
  FALSE, FALSE, TRUE, 15
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'ls-003', 'Heavy-gauge black metal alloy', 'Antique matte black', '75 cm H × 20 cm W × 20 cm D', 'Approx. 6.5 kg', 'Matte Charcoal Black', 'Architectural slotted metalwork with cast foot base', 'Dust with soft cloth. Avoid harsh chemicals.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ls-003', '/images/products/lamp.jpg', 'TAMRAH Floor Lantern', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ls-003', '/images/products/detail-jaali.jpg', 'Slotted light ray projection', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('ls-003', 'floor lamp') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-003', 'lantern') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-003', 'tall') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-003', 'lighting') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ls-003', 'architectural') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'ha-001', 'TMR-HA-001', 'Hammered Urli Bowl with Brass Trim', 'hammered-urli-bowl-with-brass-trim', 'decorative-accessories', 'Traditional shallow metal vessel for floating flowers, candles and fragrance.', 'Hand-hammered by master coppersmiths and finished in deep matte black with an engraved solid brass rim. Ideal for festive flower water arrangements at entryways and pooja consoles.',
  7800, 9200, 'in-stock', TRUE, TRUE,
  TRUE, TRUE, TRUE, 16
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'ha-001', 'Hand-hammered black metal with solid brass lip', 'Textured hammered charcoal with polished brass rim', '34 cm Diameter × 12 cm Depth', 'Approx. 3.2 kg', 'Textured Charcoal with polished brass trim', 'Hand-hammered sheet moulding with cast brass handles', 'Dry thoroughly after water use with fresh flowers to maintain matte finish.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-001', '/images/products/urli.jpg', 'TAMRAH Hammered Urli Bowl', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-001', '/images/products/detail-chisel.jpg', 'Hand-hammered texture and brass lip detail', 2, FALSE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-001', '/images/categories/accessories.jpg', 'Urli styled on credenza', 3, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('ha-001', 'urli') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-001', 'floating flowers') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-001', 'brass') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-001', 'festive') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-001', 'accessories') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'ha-002', 'TMR-HA-002', 'Tiered Scrollwork Corner Plant Stand', 'tiered-scrollwork-corner-plant-stand', 'decorative-accessories', 'Three-tiered corner stand in classical scrollwork, ideal for plants or artefacts.', 'This three-tiered corner stand brings structure and elegance to unused corners. The scrollwork detailing at each tier and along the legs is a signature of Andhra metalcraft.',
  11500, 13000, 'in-stock', TRUE, TRUE,
  FALSE, FALSE, TRUE, 17
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'ha-002', 'Handcrafted black metal alloy', 'Antique matte black', '95 cm H × 35 cm W × 35 cm D', 'Approx. 5.6 kg', 'Antique Matte Black', 'Hand-forged curved scrollwork frame with riveted tiers', 'Wipe with damp or dry cloth. Holds up to 15 kg per tier.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-002', '/images/categories/accessories.jpg', 'TAMRAH Scrollwork Corner Stand', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-002', '/images/products/detail-chisel.jpg', 'Forged scrollwork detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('ha-002', 'corner stand') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-002', 'furniture') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-002', 'scrollwork') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-002', 'plant stand') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'ha-003', 'TMR-HA-003', 'Dhokra-Inspired Sacred Incense Censer', 'dhokra-inspired-sacred-incense-censer', 'decorative-accessories', 'Perforated dhoop incense burner with removable brass finial lid.', 'Designed for ritual sambrani and incense cones, this burner releases fragrant smoke trails through intricate dome perforations. Insulated footed base protects tabletop surfaces.',
  4900, NULL, 'in-stock', TRUE, FALSE,
  FALSE, TRUE, TRUE, 18
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'ha-003', 'Cast black metal alloy with brass finial', 'Antique matte charcoal', '18 cm H × 14 cm Diameter', 'Approx. 1.6 kg', 'Aged Charcoal Black with brass accents', 'Lost-wax cast perforated dome with turned finial', 'Empty ash after each use. Wipe brass finial with dry cloth.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-003', '/images/categories/accessories.jpg', 'TAMRAH Incense Censer', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-003', '/images/products/detail-chisel.jpg', 'Dome perforations detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('ha-003', 'incense') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-003', 'censer') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-003', 'dhoop') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-003', 'ritual') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-003', 'gifting') ON CONFLICT (product_id, tag) DO NOTHING;

INSERT INTO products (
  id, sku, name, slug, category_id, short_description, description, price, original_price,
  availability, is_published, is_featured, is_bestseller, is_new, enquiry_enabled, display_order
) VALUES (
  'ha-004', 'TMR-HA-004', 'Engraved Metal Accent Charger Tray', 'engraved-metal-accent-charger-tray', 'decorative-accessories', 'Substantial rectangular serving and display tray with chased floral borders.', 'A tactile decorative tray for styling coffee tables, holding decanters, or displaying sacred keepsakes. Finished with felt base backing.',
  6200, 7400, 'in-stock', TRUE, FALSE,
  FALSE, FALSE, TRUE, 19
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
  is_new = EXCLUDED.is_new;

INSERT INTO product_specifications (
  product_id, material, finish, dimensions, weight, colour, technique, care_instructions, origin
) VALUES (
  'ha-004', 'Chased black metal alloy', 'Matte charcoal with subtle gold rubbing', '40 cm L × 25 cm W × 3 cm H', 'Approx. 2.8 kg', 'Charcoal Black with subtle brass edge wash', 'Chased and embossed plate metalwork', 'Wipe with dry cloth. Do not place in dishwasher.', 'Andhra Pradesh, India'
) ON CONFLICT (product_id) DO UPDATE SET
  material = EXCLUDED.material,
  finish = EXCLUDED.finish,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  colour = EXCLUDED.colour,
  technique = EXCLUDED.technique,
  care_instructions = EXCLUDED.care_instructions;

INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-004', '/images/categories/accessories.jpg', 'TAMRAH Charger Tray', 1, TRUE);
INSERT INTO product_images (product_id, src, alt, display_order, is_primary)
VALUES ('ha-004', '/images/products/detail-chisel.jpg', 'Chased border detail', 2, FALSE);

INSERT INTO product_tags (product_id, tag) VALUES ('ha-004', 'tray') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-004', 'charger') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-004', 'tabletop') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-004', 'chased metal') ON CONFLICT (product_id, tag) DO NOTHING;
INSERT INTO product_tags (product_id, tag) VALUES ('ha-004', 'entertaining') ON CONFLICT (product_id, tag) DO NOTHING;

