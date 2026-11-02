// ============================================================
// TAMRAH – Central WhatsApp Configuration & Message Builders
// Single source of truth for all WhatsApp-based ordering & enquiries
// ============================================================

/**
 * Official TAMRAH business WhatsApp phone number.
 * Format: Country code without leading '+' or symbols (e.g. '919999999999').
 * Placeholder for verified business line.
 */
export const WHATSAPP_PHONE_NUMBER = '919999999999';

/**
 * Official Brand Name.
 */
export const BUSINESS_NAME = 'TAMRAH';

/**
 * Official Website URL fallback.
 */
export const WEBSITE_URL = 'https://tamrah.in';

/**
 * Central studio email and other contacts.
 */
export const BUSINESS_EMAIL = 'hello@tamrah.in';
export const BUSINESS_PHONE = '+91 99999 99999';
export const INSTAGRAM_HANDLE = '@tamrah.crafts';
export const INSTAGRAM_URL = 'https://instagram.com/tamrah.crafts';
export const STUDIO_LOCATION = 'Andhra Pradesh, India';

/**
 * Default general enquiry greeting.
 */
export const DEFAULT_GENERAL_ENQUIRY_MESSAGE =
  'Hello TAMRAH, I would like to enquire about your handcrafted black-metal décor collection.';

export const DEFAULT_CATALOGUE_MESSAGE =
  'Hello TAMRAH, I am browsing your online collection and would like to enquire about current studio availability.';

// ── Interfaces ──────────────────────────────────────────────

export interface ProductEnquiryPayload {
  productName: string;
  productSku?: string;
  quantity?: number;
  formattedPrice?: string;
  productUrl?: string;
  customNotes?: string;
}

export interface BulkEnquiryPayload {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  productCategory: string;
  approximateQuantity: string;
  intendedPurpose: string;
  additionalMessage?: string;
}

export interface GeneralEnquiryPayload {
  clientName?: string;
  subject?: string;
  message?: string;
}

// ── Sanitization & Base URL Construction ───────────────────

/**
 * Sanitizes phone numbers by stripping '+' symbols, spaces, dashes, and parens.
 */
export function cleanPhoneNumber(rawPhone?: string): string {
  if (!rawPhone) return '';
  return rawPhone.replace(/[^\d]/g, '');
}

/**
 * Gets the base website URL, using window.location.origin in browser if available.
 */
export function getBaseWebsiteUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return WEBSITE_URL;
}

/**
 * Constructs the official WhatsApp click-to-chat URL format.
 * Gracefully handles missing WhatsApp phone configuration.
 *
 * @param phone WhatsApp phone number (defaults to WHATSAPP_PHONE_NUMBER)
 * @param message Plain-text message string to be encoded
 */
export function buildWhatsAppUrl(
  message: string = DEFAULT_GENERAL_ENQUIRY_MESSAGE,
  phone?: string
): string {
  const targetPhone = phone !== undefined ? phone : WHATSAPP_PHONE_NUMBER;
  const cleaned = cleanPhoneNumber(targetPhone);
  const encodedMessage = encodeURIComponent(message.trim());

  // If phone number is configured, target that direct number
  if (cleaned) {
    return `https://wa.me/${cleaned}?text=${encodedMessage}`;
  }

  // Graceful fallback if phone configuration is missing or empty (Requirement H):
  // WhatsApp click-to-chat without a specified number prompts the user to select a recipient.
  return `https://wa.me/?text=${encodedMessage}`;
}

// ── Message Generators ──────────────────────────────────────

/**
 * Generates a clean, structured product enquiry message for WhatsApp.
 */
export function buildProductEnquiryMessage(payload: ProductEnquiryPayload): string {
  const qty = payload.quantity && payload.quantity > 0 ? payload.quantity : 1;
  const url = payload.productUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const lines = [
    `Hello ${BUSINESS_NAME},`,
    '',
    'I would like to enquire about the following handcrafted piece from your catalogue:',
    `• *Product:* ${payload.productName}`,
    payload.productSku ? `• *SKU:* ${payload.productSku}` : '',
    `• *Quantity:* ${qty}`,
    payload.formattedPrice ? `• *Price:* ${payload.formattedPrice}` : '',
    url ? `• *Product Link:* ${url}` : '',
    payload.customNotes ? `• *Note:* ${payload.customNotes}` : '',
    '',
    'Please advise on current studio availability, crafting schedule, and dispatch.',
  ].filter((line) => line !== '');

  return lines.join('\n');
}

/**
 * Generates the complete click-to-chat URL for an individual product enquiry.
 */
export function buildProductEnquiryUrl(
  payload: ProductEnquiryPayload,
  phone: string = WHATSAPP_PHONE_NUMBER
): string {
  const message = buildProductEnquiryMessage(payload);
  return buildWhatsAppUrl(message, phone);
}

/**
 * Generates a structured message for bulk orders, corporate gifting, and interior designer projects.
 */
export function buildBulkEnquiryMessage(payload: BulkEnquiryPayload): string {
  const lines = [
    `Hello ${BUSINESS_NAME} Craft Studio,`,
    '',
    'I would like to submit a Bulk / Business Order Enquiry:',
    '',
    '*Client & Organization:*',
    `• *Full Name:* ${payload.fullName.trim()}`,
    payload.companyName?.trim() ? `• *Company / Studio:* ${payload.companyName.trim()}` : '',
    `• *Email:* ${payload.email.trim()}`,
    `• *Phone:* ${payload.phone.trim()}`,
    '',
    '*Order Scope:*',
    `• *Product Category:* ${payload.productCategory}`,
    `• *Approximate Quantity:* ${payload.approximateQuantity}`,
    `• *Intended Purpose:* ${payload.intendedPurpose}`,
    '',
    payload.additionalMessage?.trim()
      ? `*Project Requirements & Notes:*\n${payload.additionalMessage.trim()}\n`
      : '',
    'Please share your trade pricing schedule, casting lead times, and specifications.',
  ].filter((line) => line !== '');

  return lines.join('\n');
}

/**
 * Generates the complete click-to-chat URL for bulk orders.
 */
export function buildBulkEnquiryUrl(
  payload: BulkEnquiryPayload,
  phone: string = WHATSAPP_PHONE_NUMBER
): string {
  const message = buildBulkEnquiryMessage(payload);
  return buildWhatsAppUrl(message, phone);
}

/**
 * Generates a general enquiry WhatsApp URL.
 */
export function buildGeneralEnquiryUrl(
  customMessage?: string,
  phone: string = WHATSAPP_PHONE_NUMBER
): string {
  const message = customMessage || DEFAULT_GENERAL_ENQUIRY_MESSAGE;
  return buildWhatsAppUrl(message, phone);
}

/**
 * Helper to trigger opening WhatsApp in a new tab/window safely.
 */
export function openWhatsAppChat(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
