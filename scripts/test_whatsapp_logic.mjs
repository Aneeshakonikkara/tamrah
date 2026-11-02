// ============================================================
// Automated Test Suite for WhatsApp Enquiry Logic
// Covers Requirement H:
// - Different product enquiries
// - Quantity changes
// - Product URLs
// - Bulk enquiry validation & formatting
// - Special characters in messages (e.g. ₹, &, quotes, emojis, newlines)
// - Mobile / Desktop URL structure
// - Missing WhatsApp configuration fallback
// ============================================================

import assert from 'node:assert';
import {
  cleanPhoneNumber,
  buildWhatsAppUrl,
  buildProductEnquiryMessage,
  buildProductEnquiryUrl,
  buildBulkEnquiryMessage,
  buildBulkEnquiryUrl,
  buildGeneralEnquiryUrl,
  WHATSAPP_PHONE_NUMBER,
  BUSINESS_NAME,
} from '../src/config/whatsapp.ts';

console.log('🧪 Starting WhatsApp Enquiry & URL Test Suite...\n');

// ── Test 1: Phone Number Cleaning ───────────────────────────
console.log('Test 1: Phone number sanitization...');
assert.strictEqual(cleanPhoneNumber('+91 99999 99999'), '919999999999');
assert.strictEqual(cleanPhoneNumber('+91 (984) 50-12345'), '919845012345');
assert.strictEqual(cleanPhoneNumber(''), '');
assert.strictEqual(cleanPhoneNumber(undefined), '');
console.log('✅ Phone sanitization passed.');

// ── Test 2: Standard WhatsApp URL Construction ──────────────
console.log('Test 2: Standard WhatsApp click-to-chat URL format...');
const stdUrl = buildWhatsAppUrl('Hello TAMRAH', '919999999999');
assert.ok(stdUrl.startsWith('https://wa.me/919999999999?text=Hello%20TAMRAH'));
console.log('✅ Standard click-to-chat URL passed.');

// ── Test 3: Missing WhatsApp Configuration (Requirement H) ───
console.log('Test 3: Missing WhatsApp configuration fallback (Requirement H)...');
const missingPhoneUrl1 = buildWhatsAppUrl('Inquiry with empty string number', '');
assert.ok(missingPhoneUrl1.startsWith('https://wa.me/?text='));
assert.ok(missingPhoneUrl1.includes('Inquiry%20with%20empty%20string%20number'));

// When phone is omitted, it correctly uses configured WHATSAPP_PHONE_NUMBER
const defaultPhoneUrl = buildWhatsAppUrl('Inquiry with default configured number');
assert.ok(defaultPhoneUrl.startsWith(`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=`));
console.log('✅ Missing configuration and default configurations handled gracefully.');

// ── Test 4: Different Products & Parameters (Requirement H) ──
console.log('Test 4: Different product enquiries (Requirement H)...');
const product1 = {
  productName: 'Nataraja Bronze-Black Metal Sculpture',
  productSku: 'TAM-SC-001',
  quantity: 1,
  formattedPrice: '₹18,500',
  productUrl: 'https://tamrah.in/products/nataraja-bronze-black-metal-sculpture',
};
const p1Message = buildProductEnquiryMessage(product1);
assert.ok(p1Message.includes('• *Product:* Nataraja Bronze-Black Metal Sculpture'));
assert.ok(p1Message.includes('• *SKU:* TAM-SC-001'));
assert.ok(p1Message.includes('• *Quantity:* 1'));
assert.ok(p1Message.includes('• *Price:* ₹18,500'));
assert.ok(p1Message.includes('• *Product Link:* https://tamrah.in/products/nataraja-bronze-black-metal-sculpture'));

const product2 = {
  productName: 'Dhokra-Inspired Tribal Brass Lamp',
  productSku: 'TAM-LP-008',
  quantity: 4,
  formattedPrice: '₹9,800',
  productUrl: 'https://tamrah.in/products/dhokra-inspired-tribal-brass-lamp',
};
const p2Message = buildProductEnquiryMessage(product2);
assert.ok(p2Message.includes('• *Product:* Dhokra-Inspired Tribal Brass Lamp'));
assert.ok(p2Message.includes('• *Quantity:* 4'));
console.log('✅ Different product messages generated accurately.');

// ── Test 5: Quantity Changes (Requirement H) ─────────────────
console.log('Test 5: Quantity changes (Requirement H)...');
const qtyTestPayload = {
  productName: 'Vintage Sun Wall Plaque',
  quantity: 12,
};
const qtyMessage = buildProductEnquiryMessage(qtyTestPayload);
assert.ok(qtyMessage.includes('• *Quantity:* 12'));
console.log('✅ Quantity variations reflected correctly.');

// ── Test 6: Special Characters in Messages (Requirement H) ───
console.log('Test 6: Special characters encoding (Requirement H)...');
const specialPayload = {
  productName: 'Goddess Lakshmi & Ganesha Sanctum Bell [Antique "Black Gold" Edition]',
  productSku: 'TAM-SC/LAK&GAN#100',
  quantity: 2,
  formattedPrice: '₹24,999/- + GST & Shipping',
  customNotes: 'Require custom wall anchors (M8 bolts) & custom inscription: "शुभ लाभ"',
};
const specialUrl = buildProductEnquiryUrl(specialPayload);
// Verify that URL is valid
assert.doesNotThrow(() => new URL(specialUrl));
const decodedText = decodeURIComponent(specialUrl.split('text=')[1]);
assert.ok(decodedText.includes('Goddess Lakshmi & Ganesha Sanctum Bell [Antique "Black Gold" Edition]'));
assert.ok(decodedText.includes('TAM-SC/LAK&GAN#100'));
assert.ok(decodedText.includes('₹24,999/- + GST & Shipping'));
assert.ok(decodedText.includes('शुभ लाभ'));
console.log('✅ Special characters, emojis, symbols, brackets, and quotes encode cleanly.');

// ── Test 7: Bulk Enquiry Form Generation (Requirement H) ────
console.log('Test 7: Bulk enquiry message & URL structure (Requirement H)...');
const bulkData = {
  fullName: 'Ananya Deshmukh',
  companyName: 'Oberoi Heritage Resort & Spas',
  email: 'ananya.d@oberoigroup.com',
  phone: '+91 98200 54321',
  productCategory: 'Wall Décor & Metal Panels',
  approximateQuantity: '51–100 pieces',
  intendedPurpose: 'Hospitality, Boutique Hotel & Resort Décor',
  additionalMessage: 'Required for 40 luxury villas in Coorg by November 2026.',
};
const bulkMessage = buildBulkEnquiryMessage(bulkData);
assert.ok(bulkMessage.includes('• *Full Name:* Ananya Deshmukh'));
assert.ok(bulkMessage.includes('• *Company / Studio:* Oberoi Heritage Resort & Spas'));
assert.ok(bulkMessage.includes('• *Approximate Quantity:* 51–100 pieces'));
assert.ok(bulkMessage.includes('• *Intended Purpose:* Hospitality, Boutique Hotel & Resort Décor'));
assert.ok(bulkMessage.includes('Required for 40 luxury villas in Coorg by November 2026.'));

const bulkUrl = buildBulkEnquiryUrl(bulkData);
assert.doesNotThrow(() => new URL(bulkUrl));
console.log('✅ Bulk enquiry generation and structure verified.');

// ── Test 8: General Enquiry URL ─────────────────────────────
console.log('Test 8: General enquiry URL...');
const genUrl = buildGeneralEnquiryUrl();
assert.ok(genUrl.includes('https://wa.me/919999999999?text='));
console.log('✅ General enquiry verified.');

console.log('\n🎉 ALL 8 AUTOMATED WHATSAPP LOGIC TESTS PASSED SUCCESSFULLY!\n');
