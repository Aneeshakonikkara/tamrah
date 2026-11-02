import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Gift,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';
import {
  type BulkEnquiryPayload,
  buildBulkEnquiryUrl,
  openWhatsAppChat,
  BUSINESS_EMAIL,
} from '../config/whatsapp';
import SEO from '../components/common/SEO';

interface BulkFormState {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  productCategory: string;
  approximateQuantity: string;
  intendedPurpose: string;
  additionalMessage: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  productCategory?: string;
  approximateQuantity?: string;
  intendedPurpose?: string;
  additionalMessage?: string;
}

const QUANTITY_OPTIONS = [
  { value: '1–10 pieces', label: '1–10 pieces (Curated Studio Batch)' },
  { value: '11–50 pieces', label: '11–50 pieces (Corporate & Festive Volume)' },
  { value: '51–100 pieces', label: '51–100 pieces (Large Scale Project / Weddings)' },
  { value: '101–500 pieces', label: '101–500 pieces (Hospitality & Institutional)' },
  { value: '500+ pieces', label: '500+ pieces (Major Commercial Commission)' },
];

const CATEGORY_OPTIONS = [
  'Sculptures & Sacred Idols',
  'Wall Décor & Metal Panels',
  'Mirrors & Decorative Frames',
  'Lamps & Lighting Accents',
  'Corner Stands & Décor Accessories',
  'Custom Bespoke Castings / Multi-Category',
];

const PURPOSE_OPTIONS = [
  'Corporate Executive & Leadership Gifting',
  'Diwali & Festive Celebration Hampers',
  'Interior Architecture & Residential Staging',
  'Hospitality, Boutique Hotel & Resort Décor',
  'Luxury Wedding Favours & Heirloom Keepsakes',
  'Sacred Mandir & Temple Sanctum Installation',
  'Gallery Showcase & Specialty Retail',
  'Other Bespoke Commercial Project',
];

export default function BulkOrdersPage() {
  const [formData, setFormData] = useState<BulkFormState>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    productCategory: 'Sculptures & Sacred Idols',
    approximateQuantity: '11–50 pieces',
    intendedPurpose: 'Corporate Executive & Leadership Gifting',
    additionalMessage: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedPayload, setSubmittedPayload] = useState<BulkEnquiryPayload | null>(null);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string>('');

  const validate = (state: BulkFormState): FormErrors => {
    const errs: FormErrors = {};

    if (!state.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    } else if (state.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!state.email.trim()) {
      errs.email = 'Please enter your professional email address.';
    } else if (!emailRegex.test(state.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    const phoneRegex = /^[0-9+\s\-()]{10,18}$/;
    if (!state.phone.trim()) {
      errs.phone = 'Please enter your contact phone or WhatsApp number.';
    } else if (!phoneRegex.test(state.phone.trim())) {
      errs.phone = 'Please provide a valid contact number (at least 10 digits).';
    }

    if (!state.productCategory) {
      errs.productCategory = 'Please select a primary product category.';
    }

    if (!state.approximateQuantity) {
      errs.approximateQuantity = 'Please select an approximate quantity tier.';
    }

    if (!state.intendedPurpose) {
      errs.intendedPurpose = 'Please select the intended purpose of this order.';
    }

    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      const vErrors = validate(updated);
      setErrors(vErrors);
    }
  };

  const handleBlur = (field: keyof BulkFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const vErrors = validate(formData);
    setErrors(vErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      productCategory: true,
      approximateQuantity: true,
      intendedPurpose: true,
    });

    const vErrors = validate(formData);
    setErrors(vErrors);

    if (Object.keys(vErrors).length === 0) {
      const payload: BulkEnquiryPayload = {
        fullName: formData.fullName,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        productCategory: formData.productCategory,
        approximateQuantity: formData.approximateQuantity,
        intendedPurpose: formData.intendedPurpose,
        additionalMessage: formData.additionalMessage,
      };

      const waUrl = buildBulkEnquiryUrl(payload);
      setLastGeneratedUrl(waUrl);
      setSubmittedPayload(payload);

      // Open WhatsApp click-to-chat in new tab immediately
      openWhatsAppChat(waUrl);
    }
  };

  const handleReset = () => {
    setSubmittedPayload(null);
    setLastGeneratedUrl('');
    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      productCategory: 'Sculptures & Sacred Idols',
      approximateQuantity: '11–50 pieces',
      intendedPurpose: 'Corporate Executive & Leadership Gifting',
      additionalMessage: '',
    });
    setTouched({});
    setErrors({});
  };

  return (
    <>
      <SEO
        title="Bulk Orders & Corporate Gifting — Handcrafted Metalware"
        description="Commission bulk orders, corporate gifting hampers, and architectural installations directly from TAMRAH's Andhra Pradesh metalcraft foundry."
        canonicalUrl="https://tamrah.in/bulk-orders"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Bulk Orders', url: '/bulk-orders' },
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
              <li className="text-[#1A1916] font-medium">Bulk Orders & Business Enquiries</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── 2. HERO SECTION ──────────────────────────────────── */}
      <section className="bg-[#FAF8F5] section-padding border-b border-[#E8E6E1]" aria-labelledby="bulk-hero-heading">
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={14} className="text-[#B8943F]" />
              <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium">
                Trade & Institutional Dialogue
              </span>
            </div>

            <h1
              id="bulk-hero-heading"
              className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-light text-[#1A1916] leading-[1.12] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Bulk Orders &{' '}
              <span className="italic font-normal text-[#7C5A2A]">
                Commercial Commissions.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#5E5B55] font-light leading-relaxed max-w-2xl">
              From executive leadership mementos and festive gifting lookbooks to luxury resort installations and architectural staging, our Andhra Pradesh foundry accommodates bespoke batch castings with tailored specifications.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. FOUR FOUNDRY VALUE PILLARS ────────────────────── */}
      <section className="py-12 bg-white border-b border-[#E8E6E1]">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 border border-[#E8E6E1] bg-[#FAF8F5] flex items-start gap-3.5">
              <ShieldCheck size={20} className="text-[#7C5A2A] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1A1916] mb-1">
                  Tiered Trade Pricing
                </h2>
                <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                  Transparent wholesale pricing scales for architects, interior curators, and corporate patrons.
                </p>
              </div>
            </div>

            <div className="p-5 border border-[#E8E6E1] bg-[#FAF8F5] flex items-start gap-3.5">
              <Gift size={20} className="text-[#7C5A2A] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1A1916] mb-1">
                  Custom Packaging
                </h2>
                <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                  Bespoke wooden caskets, embossed sleeves, and custom engraved brass plaques for gifting.
                </p>
              </div>
            </div>

            <div className="p-5 border border-[#E8E6E1] bg-[#FAF8F5] flex items-start gap-3.5">
              <Clock size={20} className="text-[#7C5A2A] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1A1916] mb-1">
                  Scheduled Batch Casting
                </h2>
                <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                  Dedicated foundry production cycles synchronized with your project handover dates.
                </p>
              </div>
            </div>

            <div className="p-5 border border-[#E8E6E1] bg-[#FAF8F5] flex items-start gap-3.5">
              <PackageCheck size={20} className="text-[#7C5A2A] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1A1916] mb-1">
                  Insured Pan-India Transit
                </h2>
                <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                  Export-grade crating with high-density protective buffers delivered directly to site.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BULK ENQUIRY FORM & WHATSAPP GENERATION ───────── */}
      <section className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Context & Guidance (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-2">
                  Direct WhatsApp Project Desk
                </span>
                <h2
                  className="font-serif text-2xl sm:text-3xl font-light text-[#1A1916] mb-4"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  How Bulk Ordering Works
                </h2>
                <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                  Because every TAMRAH creation is solid metal and cast by hand in Andhra Pradesh, bulk commissions are handled with dedicated personal attention:
                </p>
              </div>

              <div className="space-y-4 text-xs text-[#5E5B55]">
                <div className="p-4 bg-white border border-[#E8E6E1] space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-[#1A1916]">
                    <span className="w-5 h-5 rounded-full bg-[#1A1916] text-white flex items-center justify-center text-[0.625rem]">1</span>
                    <span>Submit Your Project Scope</span>
                  </div>
                  <p className="pl-7 font-light">
                    Select your preferred category, approximate quantity tier, and delivery timeframe in the form.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E8E6E1] space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-[#1A1916]">
                    <span className="w-5 h-5 rounded-full bg-[#1A1916] text-white flex items-center justify-center text-[0.625rem]">2</span>
                    <span>Review in WhatsApp</span>
                  </div>
                  <p className="pl-7 font-light">
                    Tapping the submit button formats your details into a structured message and opens WhatsApp for you to review and send directly to our team.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E8E6E1] space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-[#1A1916]">
                    <span className="w-5 h-5 rounded-full bg-[#1A1916] text-white flex items-center justify-center text-[0.625rem]">3</span>
                    <span>Foundry Schedule & Quotation</span>
                  </div>
                  <p className="pl-7 font-light">
                    Our head curator shares tiered volume discounts, casting calendar availability, and sample references.
                  </p>
                </div>
              </div>

              {/* Alternative Email Contact Card */}
              <div className="p-5 bg-[#FAF8F5] border border-[#E8E6E1] text-xs space-y-2">
                <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89] font-medium block">
                  Prefer Sending an RFP or Drawing Set?
                </span>
                <p className="text-[#5E5B55] font-light">
                  For formal architectural drawings, tenders, and PDF lookbooks:
                </p>
                <a
                  href={`mailto:${BUSINESS_EMAIL}?subject=Bulk%20Order%20RFP%20Enquiry`}
                  className="font-medium text-[#1A1916] hover:text-[#7C5A2A] underline block"
                >
                  {BUSINESS_EMAIL}
                </a>
              </div>
            </div>

            {/* Right Form Card (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#E8E6E1] p-8 sm:p-10 shadow-sm relative">

                {submittedPayload ? (
                  /* Success / Message Preview State */
                  <div className="space-y-6" role="alert" aria-live="polite">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center shrink-0">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#128C7E] font-semibold block">
                          WhatsApp Redirect Initiated
                        </span>
                        <h3 className="font-serif text-2xl text-[#1A1916] font-medium">
                          Enquiry Message Prepared
                        </h3>
                        <p className="text-xs text-[#5E5B55] mt-1 font-light">
                          WhatsApp has been launched in a new tab with your project details structured and ready to send.
                        </p>
                      </div>
                    </div>

                    {/* Formatted Message Preview */}
                    <div className="p-4 bg-[#FAF8F5] border border-[#E8E6E1] text-xs font-mono whitespace-pre-wrap leading-relaxed text-[#3A3834] max-h-64 overflow-y-auto">
                      {buildBulkEnquiryUrl(submittedPayload).split('text=')[1]
                        ? decodeURIComponent(buildBulkEnquiryUrl(submittedPayload).split('text=')[1])
                        : 'Message prepared.'}
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <p className="font-semibold">Important Note:</p>
                      <p className="font-light">
                        In accordance with our direct ordering model, no checkout or online payment has been processed. Please send the pre-filled message in WhatsApp to begin your consultation with TAMRAH.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a
                        href={lastGeneratedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn inline-flex items-center justify-center gap-2 bg-[#128C7E] text-white hover:bg-[#075E54] text-xs px-6 py-3 font-medium transition-colors"
                      >
                        <MessageCircle size={16} />
                        <span>Re-open WhatsApp Chat</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-secondary text-xs px-5 py-3"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-1">
                        Commercial Inquiry Form
                      </span>
                      <h2
                        className="font-serif text-2xl font-light text-[#1A1916]"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        Tell Us About Your Project
                      </h2>
                    </div>

                    {/* Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="bulk-fullName"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Full Name <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <input
                          id="bulk-fullName"
                          name="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          onBlur={() => handleBlur('fullName')}
                          placeholder="e.g. Vikramaditya Sharma"
                          aria-invalid={touched.fullName && !!errors.fullName}
                          className={`w-full px-4 py-3 bg-[#FAF8F5] border text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none transition-colors ${
                            touched.fullName && errors.fullName
                              ? 'border-red-500'
                              : 'border-[#E8E6E1] focus:border-[#B8943F]'
                          }`}
                        />
                        {touched.fullName && errors.fullName && (
                          <p className="mt-1 text-[0.75rem] text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} />
                            <span>{errors.fullName}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="bulk-companyName"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Company / Studio Name
                        </label>
                        <input
                          id="bulk-companyName"
                          name="companyName"
                          type="text"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="e.g. Studio V Architecture"
                          className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E6E1] text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none focus:border-[#B8943F] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="bulk-email"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Email Address <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <input
                          id="bulk-email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={() => handleBlur('email')}
                          placeholder="e.g. vikram@studiov.in"
                          aria-invalid={touched.email && !!errors.email}
                          className={`w-full px-4 py-3 bg-[#FAF8F5] border text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none transition-colors ${
                            touched.email && errors.email
                              ? 'border-red-500'
                              : 'border-[#E8E6E1] focus:border-[#B8943F]'
                          }`}
                        />
                        {touched.email && errors.email && (
                          <p className="mt-1 text-[0.75rem] text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="bulk-phone"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Phone / WhatsApp Number <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <input
                          id="bulk-phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={() => handleBlur('phone')}
                          placeholder="e.g. +91 98450 12345"
                          aria-invalid={touched.phone && !!errors.phone}
                          className={`w-full px-4 py-3 bg-[#FAF8F5] border text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none transition-colors ${
                            touched.phone && errors.phone
                              ? 'border-red-500'
                              : 'border-[#E8E6E1] focus:border-[#B8943F]'
                          }`}
                        />
                        {touched.phone && errors.phone && (
                          <p className="mt-1 text-[0.75rem] text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Category & Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="bulk-productCategory"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Product Category <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <select
                          id="bulk-productCategory"
                          name="productCategory"
                          value={formData.productCategory}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E6E1] text-xs text-[#1A1916] focus:outline-none focus:border-[#B8943F] transition-colors"
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="bulk-approximateQuantity"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Approximate Quantity <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <select
                          id="bulk-approximateQuantity"
                          name="approximateQuantity"
                          value={formData.approximateQuantity}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E6E1] text-xs text-[#1A1916] focus:outline-none focus:border-[#B8943F] transition-colors"
                        >
                          {QUANTITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Intended Purpose */}
                    <div>
                      <label
                        htmlFor="bulk-intendedPurpose"
                        className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                      >
                        Intended Purpose / Project Type <span className="text-[#7C5A2A]">*</span>
                      </label>
                      <select
                        id="bulk-intendedPurpose"
                        name="intendedPurpose"
                        value={formData.intendedPurpose}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E6E1] text-xs text-[#1A1916] focus:outline-none focus:border-[#B8943F] transition-colors"
                      >
                        {PURPOSE_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Additional Message */}
                    <div>
                      <label
                        htmlFor="bulk-additionalMessage"
                        className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                      >
                        Additional Message / Project Brief (Optional)
                      </label>
                      <textarea
                        id="bulk-additionalMessage"
                        name="additionalMessage"
                        rows={4}
                        value={formData.additionalMessage}
                        onChange={handleChange}
                        placeholder="Please share target delivery dates, custom dimensions, destination city, or special packaging preferences..."
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E6E1] text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none focus:border-[#B8943F] transition-colors"
                      />
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-4 px-8 text-xs tracking-[0.14em] uppercase font-medium bg-[#128C7E] hover:bg-[#075E54] text-white shadow-md transition-all cursor-pointer"
                      >
                        <MessageCircle size={17} />
                        <span>Submit Enquiry on WhatsApp</span>
                      </button>
                      <p className="text-[0.6875rem] text-[#928F89] mt-2">
                        Clicking opens WhatsApp with this project brief structured for review before sending.
                      </p>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
