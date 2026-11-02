// ============================================================
// TAMRAH – Central Enquiry & Contact Configuration
// Re-exports WhatsApp configuration & provides Email enquiry builders
// ============================================================

export * from './whatsapp';
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  buildProductEnquiryUrl as buildWhatsAppUrlFromPayload,
} from './whatsapp';

/**
 * Backward compatibility alias for building product WhatsApp enquiry URLs.
 */
export function buildWhatsAppEnquiryUrl(payload: {
  productName: string;
  productSku?: string;
  quantity: number;
  productUrl?: string;
  formattedPrice?: string;
}): string {
  return buildWhatsAppUrlFromPayload(payload);
}

/**
 * Generates a mailto: inquiry link for clients preferring email dialogue.
 */
export function buildEmailEnquiryUrl(payload: {
  productName: string;
  productSku?: string;
  quantity: number;
  productUrl?: string;
}): string {
  const subject = encodeURIComponent(
    `Product Enquiry: ${payload.productName} [${payload.productSku || BUSINESS_NAME}]`
  );
  const body = encodeURIComponent(
    `Hello ${BUSINESS_NAME} Craft Studio,\n\nI would like to enquire about the following handcrafted piece:\n\nProduct: ${payload.productName}\nSKU: ${payload.productSku || 'N/A'}\nQuantity: ${payload.quantity}\nPage Link: ${payload.productUrl || ''}\n\nPlease share details on availability, dimensions, and shipping schedule.\n\nThank you.`
  );
  return `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
}
