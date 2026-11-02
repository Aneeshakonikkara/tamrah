// ============================================================
// TAMRAH – Catalogue Import & Export Service
// High-performance batch processing, validation, image matching & CSV generation
// Supports 1,000+ product catalogues with zero UI blocking
// ============================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';
import type { Product, Collection } from '../types';
import type {
  ProductImportRow,
  ValidationError,
  ValidatedImportRow,
  ImportBatchProgress,
  ImportHistoryEntry,
  ImageMatchItem,
  ProductImageAssociation,
  ExportFilterOptions,
} from '../types/importExport';

const HISTORY_STORAGE_KEY = 'tamrah_catalogue_import_history';

// ── 1. CSV PARSING & SERIALIZATION ─────────────────────────

/**
 * Parses raw CSV text into an array of string records conforming to RFC 4180
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const cleanText = csvText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if (char === '\r' && nextChar === '\n' && !insideQuotes) {
      i++; // skip \n
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.some((f) => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else if (char === '\n' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.some((f) => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  // Parse Header row
  const headers = rows[0].map((h) => normalizeHeader(h));
  const records: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const values = rows[r];
    const rowObj: Record<string, string> = {};
    headers.forEach((header, colIdx) => {
      rowObj[header] = values[colIdx] !== undefined ? values[colIdx].trim() : '';
    });
    records.push(rowObj);
  }

  return records;
}

function normalizeHeader(raw: string): string {
  const clean = raw.toLowerCase().trim().replace(/[\s_-]+/g, '');
  const map: Record<string, string> = {
    productname: 'productName',
    name: 'productName',
    title: 'productName',
    sku: 'sku',
    productsku: 'sku',
    slug: 'slug',
    category: 'category',
    categoryid: 'category',
    collection: 'category',
    collectionid: 'category',
    shortdescription: 'shortDescription',
    shortdesc: 'shortDescription',
    fulldescription: 'fullDescription',
    description: 'fullDescription',
    sellingprice: 'sellingPrice',
    price: 'sellingPrice',
    originalprice: 'originalPrice',
    mrp: 'originalPrice',
    material: 'material',
    finish: 'finish',
    dimensions: 'dimensions',
    size: 'dimensions',
    weight: 'weight',
    colour: 'colour',
    color: 'colour',
    manufacturingtechnique: 'manufacturingTechnique',
    technique: 'manufacturingTechnique',
    careinstructions: 'careInstructions',
    care: 'careInstructions',
    featuredstatus: 'featuredStatus',
    featured: 'featuredStatus',
    isfeatured: 'featuredStatus',
    newarrivalstatus: 'newArrivalStatus',
    newarrival: 'newArrivalStatus',
    isnew: 'newArrivalStatus',
    publicationstatus: 'publicationStatus',
    status: 'publicationStatus',
    published: 'publicationStatus',
    seotitle: 'seoTitle',
    seodescription: 'seoDescription',
    metadescription: 'seoDescription',
    images: 'images',
    imageurls: 'images',
    imagefilenames: 'images',
  };

  return map[clean] || raw.trim();
}

/**
 * Serializes an array of records into standard RFC 4180 CSV string
 */
export function serializeToCSV(headers: { key: string; label: string }[], rows: Record<string, any>[]): string {
  const headerLine = headers.map((h) => escapeCSVField(h.label)).join(',');
  const rowLines = rows.map((row) =>
    headers.map((h) => escapeCSVField(row[h.key] ?? '')).join(',')
  );

  return [headerLine, ...rowLines].join('\r\n');
}

function escapeCSVField(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ── 2. DOWNLOADABLE CSV TEMPLATE ───────────────────────────

export const CSV_TEMPLATE_COLUMNS: { key: keyof ProductImportRow | 'id'; label: string; sample: string; required: boolean }[] = [
  { key: 'productName', label: 'Product Name', sample: 'Ganesha Seated under Tree of Life', required: true },
  { key: 'sku', label: 'SKU', sample: 'TMR-SC-012', required: true },
  { key: 'slug', label: 'Slug', sample: 'ganesha-seated-under-tree-of-life', required: true },
  { key: 'category', label: 'Category', sample: 'sculptures-idols', required: true },
  { key: 'shortDescription', label: 'Short Description', sample: 'Cast black-metal Ganesha seated beneath an intricate branching kalpavriksha canopy.', required: true },
  { key: 'fullDescription', label: 'Full Description', sample: 'Hand-moulded by hereditary artisans in Andhra Pradesh. Features rich chiselling and a charcoal matte finish.', required: false },
  { key: 'sellingPrice', label: 'Selling Price', sample: '18500', required: true },
  { key: 'originalPrice', label: 'Original Price', sample: '22000', required: false },
  { key: 'material', label: 'Material', sample: 'Solid high-density metal alloy', required: true },
  { key: 'finish', label: 'Finish', sample: 'Charcoal matte black patina with bronze undertones', required: true },
  { key: 'dimensions', label: 'Dimensions', sample: '14" H x 10" W x 6" D', required: true },
  { key: 'weight', label: 'Weight', sample: '4.2 kg', required: true },
  { key: 'colour', label: 'Colour', sample: 'Deep Charcoal Black', required: true },
  { key: 'manufacturingTechnique', label: 'Manufacturing Technique', sample: 'Traditional lost-wax and sand casting', required: true },
  { key: 'careInstructions', label: 'Care Instructions', sample: 'Dust with soft dry cloth; avoid chemical cleaners.', required: true },
  { key: 'featuredStatus', label: 'Featured Status', sample: 'TRUE', required: false },
  { key: 'newArrivalStatus', label: 'New Arrival Status', sample: 'FALSE', required: false },
  { key: 'publicationStatus', label: 'Publication Status', sample: 'published', required: true },
  { key: 'seoTitle', label: 'SEO Title', sample: 'Handcrafted Black Metal Ganesha Idol | TAMRAH', required: false },
  { key: 'seoDescription', label: 'SEO Description', sample: 'Order authentic handcrafted Ganesha black-metal idol forged in Andhra Pradesh. Free insured shipping across India.', required: false },
  { key: 'images', label: 'Images', sample: 'TMR-SC-012_primary.jpg, TMR-SC-012_1.jpg', required: false },
];

/**
 * Returns a ready-to-download CSV template string with sample rows
 */
export function generateCSVTemplate(): string {
  const headers = CSV_TEMPLATE_COLUMNS.map((c) => escapeCSVField(c.label)).join(',');
  const sample1 = CSV_TEMPLATE_COLUMNS.map((c) => escapeCSVField(c.sample)).join(',');
  const sample2 = [
    'Surya Mandala Radiant Wall Panel',
    'TMR-WD-008',
    'surya-mandala-radiant-wall-panel',
    'wall-decor',
    'Multi-tiered architectural solar wall medallion with concentric ray motifs.',
    'Formed from heavyweight blackened metal. Ready to mount on architectural anchors.',
    '24500',
    '28000',
    'Architectural metal alloy',
    'Matte black beeswax patina',
    '24" Diameter x 2" Depth',
    '6.8 kg',
    'Matte Charcoal Black',
    'Lost-wax moulding and hand-chiseled radial relief',
    'Dry microfiber wipe only.',
    'TRUE',
    'TRUE',
    'published',
    'Surya Mandala Metal Wall Art | TAMRAH Décor',
    'Architectural solar metal wall medallion handcrafted in Andhra Pradesh.',
    'TMR-WD-008_primary.jpg, TMR-WD-008_1.jpg',
  ].map((f) => escapeCSVField(f)).join(',');

  return [headers, sample1, sample2].join('\r\n');
}

// ── 3. PRE-IMPORT VALIDATION ENGINE ─────────────────────────

export function validateImportBatch(
  rawRecords: Record<string, string>[],
  existingProducts: Product[],
  validCategories: Collection[]
): {
  validatedRows: ValidatedImportRow[];
  totalValid: number;
  totalErrors: number;
  newCount: number;
  updateCount: number;
  allErrors: ValidationError[];
} {
  const validatedRows: ValidatedImportRow[] = [];

  // Track seen SKUs and Slugs within this CSV upload to catch internal duplicates
  const seenSKUsInFile = new Map<string, number>(); // sku -> first rowNumber seen
  const seenSlugsInFile = new Map<string, number>(); // slug -> first rowNumber seen

  // Lookup map of existing products by SKU and by Slug
  const existingBySku = new Map<string, Product>();
  const existingBySlug = new Map<string, Product>();
  existingProducts.forEach((p) => {
    if (p.sku) existingBySku.set(p.sku.toUpperCase().trim(), p);
    if (p.slug) existingBySlug.set(p.slug.toLowerCase().trim(), p);
  });

  const catNameToId = new Map<string, string>();
  validCategories.forEach((c) => {
    catNameToId.set(c.name.toLowerCase().trim(), c.id);
    catNameToId.set(c.id.toLowerCase().trim(), c.id);
    catNameToId.set(c.slug.toLowerCase().trim(), c.id);
  });

  let totalValid = 0;
  let totalErrors = 0;
  let newCount = 0;
  let updateCount = 0;
  const errorsCollector: ValidationError[] = [];

  rawRecords.forEach((raw, idx) => {
    const rowNumber = idx + 2; // +1 for 0-index, +1 for header line
    const rowErrors: ValidationError[] = [];

    // 1. Product Name validation
    const productName = (raw.productName || '').trim();
    if (!productName) {
      rowErrors.push({
        rowNumber,
        sku: raw.sku || 'N/A',
        field: 'Product Name',
        message: 'Product Name is required and cannot be empty.',
        severity: 'error',
      });
    }

    // 2. SKU validation
    const rawSku = (raw.sku || '').trim();
    const sku = rawSku.toUpperCase();
    if (!sku) {
      rowErrors.push({
        rowNumber,
        sku: 'EMPTY',
        field: 'SKU',
        message: 'SKU is required and must be unique.',
        severity: 'error',
      });
    } else {
      if (seenSKUsInFile.has(sku)) {
        rowErrors.push({
          rowNumber,
          sku,
          field: 'SKU',
          message: `Duplicate SKU '${sku}' detected inside this CSV (already defined on Row ${seenSKUsInFile.get(sku)}).`,
          severity: 'error',
        });
      } else {
        seenSKUsInFile.set(sku, rowNumber);
      }
    }

    // 3. Slug validation
    let slug = (raw.slug || '').toLowerCase().trim();
    if (!slug && productName) {
      slug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (!slug) {
      rowErrors.push({
        rowNumber,
        sku: sku || 'N/A',
        field: 'Slug',
        message: 'Slug is required (could not be auto-generated).',
        severity: 'error',
      });
    } else {
      if (seenSlugsInFile.has(slug)) {
        rowErrors.push({
          rowNumber,
          sku: sku || 'N/A',
          field: 'Slug',
          message: `Duplicate URL slug '${slug}' detected inside this CSV (already used on Row ${seenSlugsInFile.get(slug)}).`,
          severity: 'error',
        });
      } else {
        seenSlugsInFile.set(slug, rowNumber);
      }

      // Check if slug belongs to another existing product with a different SKU
      const existingWithSlug = existingBySlug.get(slug);
      if (existingWithSlug && existingWithSlug.sku?.toUpperCase() !== sku) {
        rowErrors.push({
          rowNumber,
          sku: sku || 'N/A',
          field: 'Slug',
          message: `Slug '${slug}' conflicts with existing product '${existingWithSlug.name}' (SKU: ${existingWithSlug.sku}). Slugs must be globally unique.`,
          severity: 'error',
        });
      }
    }

    // 4. Category validation
    const rawCat = (raw.category || '').toLowerCase().trim();
    let matchedCategoryId = '';
    if (!rawCat) {
      rowErrors.push({
        rowNumber,
        sku: sku || 'N/A',
        field: 'Category',
        message: 'Category is required.',
        severity: 'error',
      });
    } else if (catNameToId.has(rawCat)) {
      matchedCategoryId = catNameToId.get(rawCat)!;
    } else {
      rowErrors.push({
        rowNumber,
        sku: sku || 'N/A',
        field: 'Category',
        message: `Invalid Category '${raw.category}'. Must match a valid category ID or name (e.g., sculptures-idols, wall-decor, mirrors-frames).`,
        severity: 'error',
      });
    }

    // 5. Price validation
    const cleanSellingPrice = (raw.sellingPrice || '').replace(/[₹,$\s]/g, '');
    const sellingPrice = parseFloat(cleanSellingPrice);
    if (isNaN(sellingPrice) || sellingPrice < 0) {
      rowErrors.push({
        rowNumber,
        sku: sku || 'N/A',
        field: 'Selling Price',
        message: `Selling Price '${raw.sellingPrice}' is invalid. Must be a non-negative number.`,
        severity: 'error',
      });
    }

    let originalPrice: number | undefined;
    if (raw.originalPrice && raw.originalPrice.trim()) {
      const cleanOrig = raw.originalPrice.replace(/[₹,$\s]/g, '');
      originalPrice = parseFloat(cleanOrig);
      if (isNaN(originalPrice) || originalPrice < 0) {
        rowErrors.push({
          rowNumber,
          sku: sku || 'N/A',
          field: 'Original Price',
          message: `Original Price '${raw.originalPrice}' is invalid.`,
          severity: 'error',
        });
      } else if (!isNaN(sellingPrice) && originalPrice < sellingPrice) {
        rowErrors.push({
          rowNumber,
          sku: sku || 'N/A',
          field: 'Original Price',
          message: `Original Price (₹${originalPrice}) cannot be lower than Selling Price (₹${sellingPrice}).`,
          severity: 'error',
        });
      }
    }

    // 6. Publication Status validation
    const rawPub = (raw.publicationStatus || '').toLowerCase().trim();
    let publicationStatus: 'published' | 'draft' | 'archived' = 'published';
    if (!rawPub || ['published', 'publish', 'active', 'true', '1', 'yes'].includes(rawPub)) {
      publicationStatus = 'published';
    } else if (['draft', 'inactive', 'false', '0', 'no'].includes(rawPub)) {
      publicationStatus = 'draft';
    } else if (['archived', 'archive'].includes(rawPub)) {
      publicationStatus = 'archived';
    } else {
      rowErrors.push({
        rowNumber,
        sku: sku || 'N/A',
        field: 'Publication Status',
        message: `Invalid status '${raw.publicationStatus}'. Must be 'published', 'draft', or 'archived'.`,
        severity: 'error',
      });
    }

    // Parse Boolean flags
    const parseBool = (v?: string): boolean => {
      if (!v) return false;
      const clean = v.toLowerCase().trim();
      return ['true', 'yes', '1', 't', 'y'].includes(clean);
    };

    const featuredStatus = parseBool(raw.featuredStatus);
    const newArrivalStatus = parseBool(raw.newArrivalStatus);

    // Images
    const rawImages = (raw.images || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // 7. Action determination (Safe update vs Create)
    const existingProduct = sku ? existingBySku.get(sku) : undefined;
    const action: 'create' | 'update' = existingProduct ? 'update' : 'create';
    if (action === 'create') newCount++;
    else updateCount++;

    const isValid = rowErrors.length === 0;
    if (isValid) totalValid++;
    else {
      totalErrors++;
      errorsCollector.push(...rowErrors);
    }

    const rowData: ProductImportRow = {
      productName,
      sku,
      slug,
      category: matchedCategoryId || raw.category || '',
      shortDescription: (raw.shortDescription || '').trim(),
      fullDescription: (raw.fullDescription || '').trim(),
      sellingPrice: isNaN(sellingPrice) ? 0 : sellingPrice,
      originalPrice,
      material: (raw.material || '').trim(),
      finish: (raw.finish || '').trim(),
      dimensions: (raw.dimensions || '').trim(),
      weight: (raw.weight || '').trim(),
      colour: (raw.colour || '').trim(),
      manufacturingTechnique: (raw.manufacturingTechnique || '').trim(),
      careInstructions: (raw.careInstructions || '').trim(),
      featuredStatus,
      newArrivalStatus,
      publicationStatus,
      seoTitle: (raw.seoTitle || '').trim() || undefined,
      seoDescription: (raw.seoDescription || '').trim() || undefined,
      images: rawImages,
    };

    validatedRows.push({
      rowNumber,
      raw,
      data: rowData,
      action,
      existingProductId: existingProduct?.id,
      errors: rowErrors,
      isValid,
    });
  });

  return {
    validatedRows,
    totalValid,
    totalErrors,
    newCount,
    updateCount,
    allErrors: errorsCollector,
  };
}

// ── 4. LARGE-BATCH PROCESSING ENGINE ─────────────────────────

export interface BatchProcessingOptions {
  batchSize?: number;
  safeUpdatesAllowed: boolean; // Must be explicitly true to overwrite existing products
  onProgress?: (progress: ImportBatchProgress) => void;
  shouldPause?: () => boolean;
}

/**
 * Imports validated rows in controlled batches of 25–50 records.
 * Supports up to 1,000+ items without freezing or hitting query limits.
 */
export async function processBatchImport(
  validatedRows: ValidatedImportRow[],
  options: BatchProcessingOptions
): Promise<{
  successCount: number;
  failedCount: number;
  skippedCount: number;
  processedCount: number;
  errors: { rowNumber: number; sku: string; error: string }[];
}> {
  const { batchSize = 25, safeUpdatesAllowed, onProgress } = options;

  // Filter to valid rows only
  const rowsToProcess = validatedRows.filter((r) => r.isValid);
  const total = rowsToProcess.length;
  const totalBatches = Math.ceil(total / batchSize);

  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  let processedCount = 0;
  const executionErrors: { rowNumber: number; sku: string; error: string }[] = [];

  const updateProgress = (status: ImportBatchProgress['status'], errorMsg?: string) => {
    if (onProgress) {
      onProgress({
        total,
        processed: processedCount,
        currentBatch: Math.min(Math.floor(processedCount / batchSize) + 1, totalBatches),
        totalBatches,
        successCount,
        failedCount,
        skippedCount,
        percent: total > 0 ? Math.round((processedCount / total) * 100) : 100,
        status,
        errorMessage: errorMsg,
      });
    }
  };

  updateProgress('processing');

  for (let b = 0; b < totalBatches; b++) {
    const batch = rowsToProcess.slice(b * batchSize, (b + 1) * batchSize);

    // Yield execution to the browser microtask loop to keep UI rendering silky smooth
    await new Promise((resolve) => setTimeout(resolve, 40));

    for (const item of batch) {
      // Safe update check: if it's an update and safe updates are disabled, skip cleanly
      if (item.action === 'update' && !safeUpdatesAllowed) {
        skippedCount++;
        processedCount++;
        continue;
      }

      try {
        if (isSupabaseConfigured() && supabase) {
          await persistProductToSupabase(item);
        } else {
          // Local development / fallback simulation
          await new Promise((res) => setTimeout(res, 5));
        }
        successCount++;
      } catch (err: any) {
        failedCount++;
        executionErrors.push({
          rowNumber: item.rowNumber,
          sku: item.data.sku,
          error: err?.message || 'Database error during record persistence.',
        });
      }
      processedCount++;
    }

    updateProgress('processing');
  }

  updateProgress('completed');

  return {
    successCount,
    failedCount,
    skippedCount,
    processedCount,
    errors: executionErrors,
  };
}

async function persistProductToSupabase(item: ValidatedImportRow): Promise<void> {
  if (!supabase) return;

  const { data } = item;
  const isPublished = data.publicationStatus === 'published';

  // 1. Upsert product table row
  const productPayload: Record<string, any> = {
    sku: data.sku,
    name: data.productName,
    slug: data.slug,
    category_id: data.category,
    short_description: data.shortDescription,
    description: data.fullDescription || data.shortDescription,
    price: data.sellingPrice,
    original_price: data.originalPrice || null,
    is_published: isPublished,
    is_featured: data.featuredStatus,
    is_new: data.newArrivalStatus,
    seo_title: data.seoTitle || null,
    seo_description: data.seoDescription || null,
    updated_at: new Date().toISOString(),
  };

  if (item.action === 'update' && item.existingProductId) {
    productPayload.id = item.existingProductId;
  }

  const { data: upsertedProduct, error: prodErr } = await supabase
    .from('products')
    .upsert(productPayload, { onConflict: 'sku' })
    .select('id')
    .single();

  if (prodErr) throw prodErr;
  const productId = upsertedProduct.id;

  // 2. Upsert specifications
  const specPayload = {
    product_id: productId,
    material: data.material || 'Solid black-metal alloy',
    finish: data.finish || 'Charcoal matte black patina',
    dimensions: data.dimensions || 'Handcrafted dimensions',
    weight: data.weight || 'Studio verified',
    colour: data.colour || 'Matte Charcoal Black',
    technique: data.manufacturingTechnique || 'Centuries-old casting',
    care_instructions: data.careInstructions || 'Dust with soft dry cloth.',
    origin: 'Andhra Pradesh, India',
    updated_at: new Date().toISOString(),
  };

  const { error: specErr } = await supabase
    .from('product_specifications')
    .upsert(specPayload, { onConflict: 'product_id' });

  if (specErr) console.warn('[TAMRAH DB] Spec upsert warning:', specErr);

  // 3. Associate images if provided in CSV
  if (data.images && data.images.length > 0) {
    const imagePayloads = data.images.map((imgSrc, idx) => ({
      product_id: productId,
      src: imgSrc.startsWith('http') || imgSrc.startsWith('/') ? imgSrc : `/images/products/${imgSrc}`,
      alt: `${data.productName} handcrafted view ${idx + 1}`,
      display_order: idx,
      is_primary: idx === 0,
    }));

    // Delete prior images if updating, then insert ordered gallery
    if (item.action === 'update') {
      await supabase.from('product_images').delete().eq('product_id', productId);
    }
    await supabase.from('product_images').insert(imagePayloads);
  }
}

// ── 5. PRODUCT IMAGE MATCHING CONVENTION ─────────────────────

/**
 * Image matching rules:
 * - <SKU>.jpg / <SKU>.png / <SKU>.webp -> Primary Image (display_order: 0)
 * - <SKU>_primary.<ext> -> Primary Image (display_order: 0)
 * - <SKU>_1.<ext> or <SKU>-1.<ext> -> Gallery Image (display_order: 1)
 * - <SKU>_2.<ext> or <SKU>-2.<ext> -> Gallery Image (display_order: 2)
 * Matches case-insensitively.
 */
export function matchImagesToProducts(
  fileNames: string[],
  products: Product[]
): {
  matchedItems: ImageMatchItem[];
  unmatchedFiles: string[];
  productAssociations: Map<string, ProductImageAssociation>;
  missingImageSkus: string[];
} {
  const matchedItems: ImageMatchItem[] = [];
  const unmatchedFiles: string[] = [];
  const productAssociations = new Map<string, ProductImageAssociation>();

  // Initialize associations map for all products
  products.forEach((p) => {
    if (p.sku) {
      productAssociations.set(p.sku.toUpperCase(), {
        sku: p.sku.toUpperCase(),
        productName: p.name,
        imagesCount: p.images?.length || 0,
        hasPrimary: Boolean(p.images?.some((img) => img.isPrimary)),
        images: (p.images || []).map((img, i) => ({
          src: img.src,
          alt: img.alt,
          isPrimary: Boolean(img.isPrimary || i === 0),
          displayOrder: i,
        })),
        isMissingImages: !p.images || p.images.length === 0,
      });
    }
  });

  const skuSet = new Set(Array.from(productAssociations.keys()));

  fileNames.forEach((fileName) => {
    const clean = fileName.trim();
    // Parse filename pattern: e.g. TMR-SC-001_primary.jpg, TMR-SC-001_1.png, TMR-SC-001.webp
    const base = clean.replace(/\.[a-zA-Z0-9]+$/, '');
    
    let matchedSku = '';
    let isPrimary = false;
    let displayOrder = 0;

    // Check if filename is exactly a known SKU
    const upperBase = base.toUpperCase();
    if (skuSet.has(upperBase)) {
      matchedSku = upperBase;
      isPrimary = true;
      displayOrder = 0;
    } else {
      // Check for suffixes: _primary, _1, _2, -1, -2
      const match = upperBase.match(/^(.+?)(?:_PRIMARY|_([0-9]+)|-([0-9]+))$/i);
      if (match) {
        const candidateSku = match[1];
        if (skuSet.has(candidateSku)) {
          matchedSku = candidateSku;
          if (upperBase.endsWith('_PRIMARY')) {
            isPrimary = true;
            displayOrder = 0;
          } else {
            const num = parseInt(match[2] || match[3] || '1', 10);
            displayOrder = num;
            isPrimary = false;
          }
        }
      }
    }

    if (matchedSku) {
      matchedItems.push({
        fileName: clean,
        matchedSku,
        isPrimary,
        displayOrder,
        status: 'matched',
      });

      // Update product association
      const assoc = productAssociations.get(matchedSku);
      if (assoc) {
        assoc.images.push({
          src: `/images/products/${clean}`,
          alt: `${assoc.productName} view ${displayOrder}`,
          isPrimary,
          displayOrder,
        });
        // Sort with primary first, then displayOrder
        assoc.images.sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return a.displayOrder - b.displayOrder;
        });
        assoc.imagesCount = assoc.images.length;
        assoc.hasPrimary = assoc.images.some((i) => i.isPrimary);
        assoc.isMissingImages = false;
      }
    } else {
      unmatchedFiles.push(clean);
      matchedItems.push({
        fileName: clean,
        isPrimary: false,
        displayOrder: 99,
        status: 'unmatched',
      });
    }
  });

  const missingImageSkus: string[] = [];
  productAssociations.forEach((assoc, sku) => {
    if (assoc.isMissingImages || assoc.imagesCount === 0) {
      missingImageSkus.push(sku);
    }
  });

  return {
    matchedItems,
    unmatchedFiles,
    productAssociations,
    missingImageSkus,
  };
}

// ── 6. CATALOGUE EXPORT FUNCTIONALITY ────────────────────────

export async function exportCatalogueToCSV(
  allProducts: Product[],
  options: ExportFilterOptions = {}
): Promise<{ csvContent: string; exportedCount: number; fileName: string }> {
  let filtered = [...allProducts];

  // Category filter
  if (options.categoryId && options.categoryId !== 'all') {
    filtered = filtered.filter((p) => p.collectionId === options.categoryId);
  }

  // Publication status filter
  if (options.status && options.status !== 'all') {
    if (options.status === 'published') {
      filtered = filtered.filter((p) => p.isPublished !== false);
    } else if (options.status === 'draft') {
      filtered = filtered.filter((p) => p.isPublished === false);
    }
  }

  // Selected IDs filter
  if (options.selectedIds && options.selectedIds.length > 0) {
    const idSet = new Set(options.selectedIds);
    filtered = filtered.filter((p) => idSet.has(p.id));
  }

  const exportHeaders = [
    { key: 'id', label: 'Product ID' },
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'category', label: 'Category' },
    { key: 'shortDescription', label: 'Short Description' },
    { key: 'fullDescription', label: 'Full Description' },
    { key: 'price', label: 'Selling Price' },
    { key: 'originalPrice', label: 'Original Price' },
    { key: 'material', label: 'Material' },
    { key: 'finish', label: 'Finish' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'weight', label: 'Weight' },
    { key: 'colour', label: 'Colour' },
    { key: 'technique', label: 'Manufacturing Technique' },
    { key: 'careInstructions', label: 'Care Instructions' },
    { key: 'isFeatured', label: 'Featured Status' },
    { key: 'isNew', label: 'New Arrival Status' },
    { key: 'status', label: 'Publication Status' },
    { key: 'seoTitle', label: 'SEO Title' },
    { key: 'seoDescription', label: 'SEO Description' },
    { key: 'images', label: 'Images' },
  ];

  const exportRows = filtered.map((p) => ({
    id: p.id,
    sku: p.sku || '',
    name: p.name,
    slug: p.slug,
    category: p.collectionId,
    shortDescription: p.shortDescription || '',
    fullDescription: p.description || p.shortDescription || '',
    price: p.price ?? '',
    originalPrice: p.originalPrice ?? '',
    material: p.material || '',
    finish: p.finish || '',
    dimensions: p.dimensions || '',
    weight: p.weight || '',
    colour: p.colour || '',
    technique: p.technique || '',
    careInstructions: p.careInstructions || '',
    isFeatured: p.isFeatured ? 'TRUE' : 'FALSE',
    isNew: p.isNew ? 'TRUE' : 'FALSE',
    status: p.isPublished === false ? 'draft' : 'published',
    seoTitle: p.seoTitle || `${p.name} — TAMRAH`,
    seoDescription: p.seoDescription || p.shortDescription || '',
    images: (p.images || []).map((img) => img.src.split('/').pop() || img.src).join(', '),
  }));

  const csvContent = serializeToCSV(exportHeaders, exportRows);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `tamrah_catalogue_export_${dateStr}_${filtered.length}_items.csv`;

  return {
    csvContent,
    exportedCount: filtered.length,
    fileName,
  };
}

// ── 7. IMPORT HISTORY & ERROR REPORT DOWNLOADS ──────────────

export function getImportHistory(): ImportHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ImportHistoryEntry[];
  } catch (err) {
    console.warn('Failed to parse import history:', err);
    return [];
  }
}

export function logImportHistory(entry: Omit<ImportHistoryEntry, 'id' | 'timestamp'>): ImportHistoryEntry {
  const newEntry: ImportHistoryEntry = {
    ...entry,
    id: 'imp_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
  };

  try {
    const history = getImportHistory();
    history.unshift(newEntry);
    // Keep last 30 runs
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
  } catch (err) {
    console.warn('Failed to save import history:', err);
  }

  return newEntry;
}

export function generateErrorReportCSV(errors: ValidationError[]): string {
  const headers = [
    { key: 'rowNumber', label: 'Row Number' },
    { key: 'sku', label: 'Product SKU' },
    { key: 'field', label: 'Field Name' },
    { key: 'severity', label: 'Severity' },
    { key: 'message', label: 'Validation Error Message' },
  ];
  return serializeToCSV(headers, errors);
}

/**
 * Triggers a native browser file download for generated text/CSV
 */
export function triggerBrowserDownload(content: string, fileName: string, mimeType = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
