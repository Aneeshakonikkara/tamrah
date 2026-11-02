import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  Minus,
  Search,
  MessageCircle,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import {
  WHATSAPP_PHONE_NUMBER,
} from '../config/enquiry';
import SEO from '../components/common/SEO';

interface FaqItem {
  id: string;
  category: 'materials' | 'production' | 'dimensions' | 'orders' | 'care';
  categoryLabel: string;
  question: string;
  answer: string;
  isPlaceholder?: boolean;
}

const FAQ_DATA: FaqItem[] = [
  // 1. PRODUCT MATERIALS
  {
    id: 'material-composition',
    category: 'materials',
    categoryLabel: 'Product Materials',
    question: 'What metal alloys are TAMRAH pieces crafted from?',
    answer:
      'All TAMRAH sculptures and décor pieces are cast from solid black-metal alloys traditional to Indian casting heritage. Unlike mass-market pressed sheet metal or hollow resin replicas, our pieces feature substantial heft, cool metallic resonance, and dense structural integrity.',
  },
  {
    id: 'material-patina',
    category: 'materials',
    categoryLabel: 'Product Materials',
    question: 'How is the signature matte charcoal patina achieved?',
    answer:
      'We do not use synthetic spray paints or synthetic powder coats. The dark tone is achieved through an artisan charcoal patination wash applied while the casting is warm, followed by hand-rubbing with natural organic beeswax. This seals the pore structure and produces a soft, low-lustre matte finish that matures gracefully over years.',
  },

  // 2. HANDCRAFTED PRODUCTION
  {
    id: 'craft-andhra-origin',
    category: 'production',
    categoryLabel: 'Handcrafted Production',
    question: 'Where and how are TAMRAH pieces manufactured?',
    answer:
      'Every piece is handcrafted in Andhra Pradesh, India, adhering to centuries-old moulding and lost-wax metalcraft traditions. Loam and river sand moulds are sculpted by hand, molten alloy is poured in charcoal-fired crucibles, and each piece undergoes hours of individual chisel chasing and hand-filing.',
  },
  {
    id: 'craft-variations',
    category: 'production',
    categoryLabel: 'Handcrafted Production',
    question: 'Why do minor textural marks or slight surface variations appear?',
    answer:
      'Subtle nuances in chisel texture, tiny cooling ripples, and micro-variations in charcoal tone are authentic hallmarks of genuine sand-moulding. Because each clay mould is broken open to liberate the metal within, no two TAMRAH castings can ever be completely identical. Each item carries the unique signature of the artisan who finished it.',
  },

  // 3. PRODUCT DIMENSIONS
  {
    id: 'dim-accuracy',
    category: 'dimensions',
    categoryLabel: 'Product Dimensions',
    question: 'How accurate are the dimensions and weights specified in the catalogue?',
    answer:
      'Every product page specifies precise height, width, depth (in inches and centimetres), and gross weight in kilograms. Due to the manual nature of mould preparation, hand-filing, and chisel carving, slight tolerances within ±0.5 cm and minimal weight nuances may naturally occur.',
  },
  {
    id: 'dim-visual-reference',
    category: 'dimensions',
    categoryLabel: 'Product Dimensions',
    question: 'Can I request additional photos or video reference for scale?',
    answer:
      'Yes, absolutely. If you wish to understand how an idol or wall sculpture feels in a domestic setting, tap the WhatsApp Enquiry button on any piece. Our team will happily share handheld video walkthroughs and scale comparisons against typical home consoles or wall spaces.',
  },

  // 4. PRODUCT AVAILABILITY
  {
    id: 'avail-stock-model',
    category: 'dimensions',
    categoryLabel: 'Product Availability',
    question: 'Are all products available for immediate dispatch?',
    answer:
      'We maintain small, curated batch inventory in our studio for popular figurines and sacred idols. Larger architectural wall accents, intricate mirror frames, and multi-tier standing lamps are produced in limited casting runs. Current piece availability is instantly confirmed when you reach out on WhatsApp.',
  },
  {
    id: 'avail-backorder',
    category: 'dimensions',
    categoryLabel: 'Product Availability',
    question: 'What if a piece I desire is currently out of stock?',
    answer:
      'If a piece is between casting runs, you can reserve a slot in the next foundry batch. Our team will share the expected pouring date and keep you updated with photographs as your piece emerges from the sand mould.',
  },

  // 5. BULK ORDERS
  {
    id: 'bulk-corporate-gifting',
    category: 'orders',
    categoryLabel: 'Bulk Orders & Trade',
    question: 'Do you cater to bulk corporate gifting, festive orders, and weddings?',
    answer:
      'Yes. TAMRAH pieces are frequently commissioned for corporate leadership milestones, Diwali corporate gifting, wedding keepsakes, and architectural hospitality installations. We provide tiered pricing for batch orders alongside personalized artisan provenance cards.',
  },
  {
    id: 'bulk-moq-leadtime',
    category: 'orders',
    categoryLabel: 'Bulk Orders & Trade',
    question: 'What is the minimum order quantity (MOQ) and production lead time for bulk orders?',
    answer:
      '[Placeholder Details]: Minimum order quantities and lead times are tailored to the specific piece, required quantity, and current foundry schedule. Because all pieces are cast and chiselled by hand, lead times generally range depending on volume. Please contact our team with your target date for an exact project plan.',
    isPlaceholder: true,
  },

  // 6. CUSTOMISATION
  {
    id: 'custom-commissions',
    category: 'orders',
    categoryLabel: 'Customisation',
    question: 'Can I commission custom sizes or bespoke metal sculptures?',
    answer:
      '[Placeholder Details]: We accept select bespoke commissions and dimensional modifications for interior design and sacred mandir projects, subject to artisan feasibility and moulding parameters. Every bespoke request is reviewed on an individual basis without blanket guarantees. Please share your sketches or space requirements via WhatsApp or email.',
    isPlaceholder: true,
  },
  {
    id: 'custom-branding',
    category: 'orders',
    categoryLabel: 'Customisation',
    question: 'Can company logos or personalized inscriptions be added for gifting?',
    answer:
      '[Placeholder Details]: For qualifying batch gifting orders, we can coordinate custom engraved brass plaques, embossed presentation sleeves, or custom wooden keepsake caskets. Specific options and proofing will be reviewed during your enquiry consultation.',
    isPlaceholder: true,
  },

  // 7. SHIPPING AND DELIVERY
  {
    id: 'shipping-coverage',
    category: 'orders',
    categoryLabel: 'Shipping & Delivery',
    question: 'Where do you ship, and what are the delivery timelines?',
    answer:
      '[Placeholder Details]: We coordinate insured domestic door delivery across major cities and regions in India. Exact shipping carrier partners, delivery timelines, and transit rates are calculated based on destination and gross metal weight, and will be shared transparently during order confirmation. We do not make unverified delivery day promises before assessing your location.',
    isPlaceholder: true,
  },
  {
    id: 'shipping-international',
    category: 'orders',
    categoryLabel: 'Shipping & Delivery',
    question: 'Do you provide international shipping outside India?',
    answer:
      '[Placeholder Details]: International delivery can be facilitated on a special-request basis with export crating and documentation. Customs duties and international air freight vary by destination country and are confirmed individually upon inquiry.',
    isPlaceholder: true,
  },

  // 8. PACKAGING
  {
    id: 'packaging-safety',
    category: 'orders',
    categoryLabel: 'Packaging',
    question: 'How are heavy metal sculptures protected during transit?',
    answer:
      'Because solid metal artwork requires robust protection against shock and movement, every piece is cocooned in high-density foam cushioning, wrapped in protective barrier wrap, and enclosed in heavy-duty 7-ply corrugated boxes. Oversized wall panels and free-standing figures are shipped with reinforced corner framing.',
  },
  {
    id: 'packaging-gifting-presentation',
    category: 'orders',
    categoryLabel: 'Packaging',
    question: 'Is premium gift presentation packaging available?',
    answer:
      'Yes. Sacred idols and gifting editions can be packaged with TAMRAH linen/velvet dust pouches, an embossed care booklet, and an artisan provenance note detailing the Andhra Pradesh casting lineage.',
  },

  // 9. PRODUCT CARE
  {
    id: 'care-cleaning-instructions',
    category: 'care',
    categoryLabel: 'Product Care',
    question: 'How should I clean and maintain my black-metal pieces?',
    answer:
      'Clean only with a dry, soft microfiber or cotton cloth. Do NOT use liquid brass cleaners, acidic solutions, vinegar, or abrasive scrubbers, as these will strip the natural charcoal patina and beeswax protective seal. If the surface looks dull after several months, a light touch of pure organic beeswax buffed gently with a soft cloth restores the warm matte lustre.',
  },
  {
    id: 'care-outdoor-moisture',
    category: 'care',
    categoryLabel: 'Product Care',
    question: 'Can TAMRAH metal pieces be kept in outdoor gardens or wet zones?',
    answer:
      'Our pieces are intended for interior living rooms, covered verandas, pooja mandirs, and sheltered entryways. Prolonged exposure to open rainwater, constant monsoon dampness, or extreme humidity may accelerate natural oxidation and alter the patina over time.',
  },

  // 10. WHATSAPP ORDERING
  {
    id: 'ordering-why-whatsapp',
    category: 'orders',
    categoryLabel: 'WhatsApp Ordering',
    question: 'Why does TAMRAH use direct WhatsApp enquiries rather than an automated cart?',
    answer:
      'Handcrafted solid metal sculptures are heirloom investments, not disposable fast-fashion items. By connecting you directly with our studio via WhatsApp, we can confirm exact piece weight, share live handheld video clips, discuss custom architectural requirements, and personally oversee safe crating and courier dispatch.',
  },
  {
    id: 'ordering-step-by-step',
    category: 'orders',
    categoryLabel: 'WhatsApp Ordering',
    question: 'How does the direct ordering process work step-by-step?',
    answer:
      '1. Browse our catalogue and click "Enquire on WhatsApp" on any piece you admire.\n2. The link pre-fills the piece name, SKU, and catalogue link directly in your WhatsApp chat.\n3. Our client team confirms studio inventory, dispatch timeline, and shipping details.\n4. You complete payment via direct bank transfer or authorized business UPI.\n5. Your piece is inspected, crated, and dispatched with live tracking provided directly in the chat.',
  },
];

type CategoryFilter = 'all' | 'materials' | 'production' | 'dimensions' | 'orders' | 'care';

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'material-composition': true,
    'craft-andhra-origin': true,
  });

  const searchInputId = useId();

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQ_DATA.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenIds(allOpen);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' ? true : item.category === activeCategory;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: 'All Questions (18)' },
    { key: 'materials', label: 'Materials & Finish' },
    { key: 'production', label: 'Craft & Andhra Heritage' },
    { key: 'dimensions', label: 'Dimensions & Scale' },
    { key: 'orders', label: 'Ordering, Shipping & Bulk' },
    { key: 'care', label: 'Care & Maintenance' },
  ];

  const waFaqUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    'Hello TAMRAH, I have a question regarding your handcrafted metal pieces that was not covered in the FAQ.'
  )}`;

  return (
    <>
      <SEO
        title="Frequently Asked Questions — Materials, Craft & Inquiries"
        description="Read answers to common questions about TAMRAH handcrafted black-metal sculptures, Andhra Pradesh moulding craft, dimensions, bulk gifting, and WhatsApp ordering."
        canonicalUrl="https://tamrah.in/faq"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'FAQ', url: '/faq' },
        ]}
      />

      {/* ── 1. BREADCRUMB ────────────────────────────────────── */}
      <div className="bg-[#FAF8F5] border-b border-[#E8E6E1] py-4">
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.14em] text-[#928F89]">
              <li>
                <Link to="/" className="hover:text-[#1A1916] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-[#1A1916] font-medium">FAQ</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── 2. HERO HEADER ───────────────────────────────────── */}
      <section className="bg-[#FAF8F5] section-padding border-b border-[#E8E6E1]" aria-labelledby="faq-page-heading">
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle size={14} className="text-[#B8943F]" />
              <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium">
                Clarity & Transparency
              </span>
            </div>

            <h1
              id="faq-page-heading"
              className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-light text-[#1A1916] leading-[1.12] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Frequently Asked{' '}
              <span className="italic font-normal text-[#7C5A2A]">
                Questions.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#5E5B55] font-light leading-relaxed max-w-2xl">
              Everything you need to know about our traditional moulding techniques in Andhra Pradesh, materials, dimensions, bespoke orders, and direct WhatsApp concierge consultations.
            </p>

            {/* Policy Placeholder Disclaimer Notice */}
            <div className="mt-6 p-4 bg-white border border-[#E8E6E1] flex items-start gap-3 text-xs text-[#5E5B55]">
              <ShieldAlert size={16} className="text-[#B8943F] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#1A1916]">
                  Studio Policy Note:
                </span>{' '}
                Specific shipping carrier partners, return conditions, and bespoke timelines are finalized during direct client dialogue and are subject to foundry scheduling. Unconfirmed policies are transparently indicated with placeholder tags.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SEARCH & CATEGORY FILTER BAR ──────────────────── */}
      <section className="bg-[#FDFCF9] border-b border-[#E8E6E1] py-6 sticky top-18 lg:top-22 z-30 shadow-xs backdrop-blur-md bg-[#FDFCF9]/95">
        <div className="container-site">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Quick Search Bar */}
            <div className="w-full md:w-80 relative">
              <label htmlFor={searchInputId} className="sr-only">
                Search frequently asked questions
              </label>
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#928F89]" />
              <input
                id={searchInputId}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials, care, delivery..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E8E6E1] text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none focus:border-[#B8943F] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.6875rem] text-[#928F89] hover:text-[#1A1916]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Expand / Collapse Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-[0.6875rem] uppercase tracking-[0.12em] font-medium text-[#7C5A2A]">
              <button
                type="button"
                onClick={expandAll}
                className="hover:underline py-1"
              >
                Expand All
              </button>
              <span className="text-[#E8E6E1]">|</span>
              <button
                type="button"
                onClick={collapseAll}
                className="hover:underline py-1 text-[#928F89]"
              >
                Collapse All
              </button>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 text-xs whitespace-nowrap transition-colors uppercase tracking-[0.08em] font-medium border ${
                  activeCategory === cat.key
                    ? 'bg-[#1A1916] text-[#FDFCF9] border-[#1A1916]'
                    : 'bg-white text-[#5E5B55] border-[#E8E6E1] hover:border-[#1A1916] hover:text-[#1A1916]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ACCORDION FAQ CONTENT ─────────────────────────── */}
      <section className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]" aria-label="Frequently Asked Questions list">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-[#FAF8F5] border border-[#E8E6E1] p-8">
                <HelpCircle size={32} className="mx-auto text-[#928F89] mb-3" />
                <h3 className="font-serif text-xl text-[#1A1916] mb-2">
                  No matching questions found
                </h3>
                <p className="text-xs text-[#5E5B55] max-w-md mx-auto mb-6">
                  We could not find answers matching "{searchQuery}". Try different search terms or send your question directly to our studio concierge.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="btn btn-secondary text-xs px-5 py-2.5"
                >
                  View All Questions
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => {
                  const isOpen = !!openIds[faq.id];
                  const buttonId = `faq-btn-${faq.id}`;
                  const regionId = `faq-region-${faq.id}`;

                  return (
                    <div
                      key={faq.id}
                      className={`border transition-colors duration-200 bg-white ${
                        isOpen ? 'border-[#B8943F]/60 shadow-xs' : 'border-[#E8E6E1] hover:border-[#C8C5BF]'
                      }`}
                    >
                      <h3>
                        <button
                          type="button"
                          id={buttonId}
                          aria-expanded={isOpen}
                          aria-controls={regionId}
                          onClick={() => toggleItem(faq.id)}
                          className="w-full flex items-start justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B8943F]"
                        >
                          <div className="space-y-1">
                            <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#7C5A2A] font-medium block">
                              {faq.categoryLabel}
                            </span>
                            <span className="font-serif text-base sm:text-lg text-[#1A1916] font-medium block leading-snug">
                              {faq.question}
                            </span>
                          </div>

                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isOpen
                                ? 'bg-[#1A1916] text-[#FDFCF9] border-[#1A1916]'
                                : 'bg-[#FAF8F5] text-[#5E5B55] border-[#E8E6E1]'
                            }`}
                          >
                            {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                          </div>
                        </button>
                      </h3>

                      {isOpen && (
                        <div
                          id={regionId}
                          role="region"
                          aria-labelledby={buttonId}
                          className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#FAF8F5]"
                        >
                          {faq.isPlaceholder && (
                            <div className="mb-3 inline-block px-2.5 py-0.5 bg-[#FAF8F5] border border-[#B8943F]/40 text-[0.625rem] uppercase tracking-[0.14em] text-[#7C5A2A] font-medium">
                              Policy Placeholder
                            </div>
                          )}

                          <div className="text-xs sm:text-sm text-[#5E5B55] leading-relaxed font-light whitespace-pre-line space-y-2">
                            {faq.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ── 5. NEED MORE CLARITY CTA BANNER ──────────────────── */}
      <section className="section-padding-lg bg-[#FAF8F5]" aria-labelledby="faq-cta-heading">
        <div className="container-site">
          <div className="bg-[#141311] text-[#E5E0D8] p-8 sm:p-12 lg:p-16 border border-[#2C2924] relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <span className="text-[0.6875rem] uppercase tracking-[0.24em] text-[#B8943F] font-medium block">
                Foundry Inquiries
              </span>

              <h2
                id="faq-cta-heading"
                className="font-serif text-2xl sm:text-4xl text-[#FDFCF9] font-light leading-snug"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Have a Question Not Answered Here?
              </h2>

              <p className="text-xs sm:text-sm text-[#928F89] font-light leading-relaxed">
                Our client concierge assists with custom dimensions, specific architectural mounting instructions, export crating, or high-volume festive gifting lookbooks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href={waFaqUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center justify-center gap-2 bg-[#25D366] text-[#0E0D0B] hover:bg-[#1EBE5D] text-xs px-6 py-3 font-medium transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>Ask on WhatsApp</span>
                </a>

                <Link
                  to="/contact"
                  className="btn inline-flex items-center justify-center gap-2 bg-transparent text-[#FDFCF9] border border-[#3A3834] hover:border-[#B8943F] text-xs px-6 py-3 transition-colors"
                >
                  <Mail size={15} />
                  <span>Send Studio Inquiry Form</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
