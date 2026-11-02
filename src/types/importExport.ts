// ============================================================
// TAMRAH – Bulk Catalogue Import & Export Types
// Defines structures for CSV parsing, validation, batching, and images
// ============================================================

export interface ProductImportRow {
  productName: string;
  sku: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  sellingPrice: number;
  originalPrice?: number;
  material: string;
  finish: string;
  dimensions: string;
  weight: string;
  colour: string;
  manufacturingTechnique: string;
  careInstructions: string;
  featuredStatus: boolean;
  newArrivalStatus: boolean;
  publicationStatus: 'published' | 'draft' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  images?: string[];
}

export interface ValidationError {
  rowNumber: number;
  sku: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidatedImportRow {
  rowNumber: number;
  raw: Record<string, string>;
  data: ProductImportRow;
  action: 'create' | 'update';
  existingProductId?: string;
  errors: ValidationError[];
  isValid: boolean;
}

export interface ImageMatchItem {
  fileName: string;
  fileSize?: number;
  matchedSku?: string;
  isPrimary: boolean;
  displayOrder: number;
  status: 'matched' | 'unmatched';
  previewUrl?: string;
}

export interface ProductImageAssociation {
  sku: string;
  productName: string;
  imagesCount: number;
  hasPrimary: boolean;
  images: {
    src: string;
    alt: string;
    isPrimary: boolean;
    displayOrder: number;
  }[];
  isMissingImages: boolean;
}

export interface ImportBatchProgress {
  total: number;
  processed: number;
  currentBatch: number;
  totalBatches: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  percent: number;
  status: 'idle' | 'validating' | 'processing' | 'paused' | 'completed' | 'error';
  errorMessage?: string;
}

export interface ImportHistoryEntry {
  id: string;
  timestamp: string;
  fileName: string;
  totalRecords: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  status: 'completed' | 'partial' | 'failed';
  errorReport?: string;
}

export interface ExportFilterOptions {
  categoryId?: string;
  status?: 'all' | 'published' | 'draft' | 'archived';
  selectedIds?: string[];
}
