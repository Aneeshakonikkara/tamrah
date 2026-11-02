import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  Gift,
  Compass,
} from 'lucide-react';
import {
  BUSINESS_NAME,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  STUDIO_LOCATION,
  buildGeneralEnquiryUrl,
  buildWhatsAppUrl,
} from '../config/whatsapp';
import SEO from '../components/common/SEO';

function InstagramIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface FormFields {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  enquiryType?: string;
  message?: string;
}

export default function ContactPage() {
  const [formState, setFormState] = useState<FormFields>({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'general',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedData, setSubmittedData] = useState<FormFields | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (fields: FormFields): FormErrors => {
    const errs: FormErrors = {};

    if (!fields.name.trim()) {
      errs.name = 'Please provide your full name.';
    } else if (fields.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!emailRegex.test(fields.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    const phoneRegex = /^[0-9+\s\-()]{10,18}$/;
    if (!fields.phone.trim()) {
      errs.phone = 'Please provide your contact phone number.';
    } else if (!phoneRegex.test(fields.phone.trim())) {
      errs.phone = 'Please provide a valid phone number (minimum 10 digits).';
    }

    if (!fields.enquiryType) {
      errs.enquiryType = 'Please select the type of enquiry.';
    }

    if (!fields.message.trim()) {
      errs.message = 'Please enter your message or enquiry requirements.';
    } else if (fields.message.trim().length < 15) {
      errs.message = 'Please provide a few more details (minimum 15 characters).';
    }

    return errs;
  };

  const handleBlur = (field: keyof FormFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validate(formState);
    setErrors(currentErrors);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...formState, [name]: value };
    setFormState(updated);

    if (touched[name]) {
      const currentErrors = validate(updated);
      setErrors(currentErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      enquiryType: true,
      message: true,
    });

    const validationErrors = validate(formState);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedData({ ...formState });
      }, 400);
    }
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    setFormState({
      name: '',
      email: '',
      phone: '',
      enquiryType: 'general',
      message: '',
    });
    setErrors({});
    setTouched({});
  };

  const selectEnquiryTypeAndScroll = (type: string) => {
    setFormState((prev) => ({ ...prev, enquiryType: type }));
    const formElement = document.getElementById('contact-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const generalWhatsAppUrl = buildGeneralEnquiryUrl();

  const tradeWhatsAppUrl = buildWhatsAppUrl(
    'Hello TAMRAH, I am an architect / interior designer and would like to discuss trade partnership and bespoke pieces.'
  );

  const submittedWhatsAppUrl = submittedData
    ? buildWhatsAppUrl(
        `Hello ${BUSINESS_NAME},\n\nI submitted an enquiry on your website:\n• *Name:* ${submittedData.name}\n• *Category:* ${submittedData.enquiryType}\n• *Phone:* ${submittedData.phone}\n• *Email:* ${submittedData.email}\n• *Message:* ${submittedData.message}\n\nPlease let me know your availability.`
      )
    : generalWhatsAppUrl;

  return (
    <>
      <SEO
        title="Contact Us & Studio Inquiries — Handcrafted Décor"
        description="Connect with TAMRAH for catalogue enquiries, interior designer collaborations, corporate gifting, and bespoke handcrafted metal commissions in Andhra Pradesh."
        canonicalUrl="https://tamrah.in/contact"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact' },
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
              <li className="text-[#1A1916] font-medium">Contact Us</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── 2. PAGE HEADER ───────────────────────────────────── */}
      <section className="bg-[#FAF8F5] section-padding border-b border-[#E8E6E1]" aria-labelledby="contact-heading">
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#B8943F]" />
              <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium">
                Artisan Dialogue & Inquiries
              </span>
            </div>

            <h1
              id="contact-heading"
              className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-light text-[#1A1916] leading-[1.12] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Begin a Conversation with{' '}
              <span className="italic font-normal text-[#7C5A2A]">
                the Foundry.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#5E5B55] font-light leading-relaxed max-w-2xl">
              Whether you are inquiring about a specific handcrafted sculpture, commissioning a bespoke piece for your architectural project, or planning thoughtful corporate gifting, our artisan studio is at your service.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. MAIN CONTACT & FORM SECTION ────────────────────── */}
      <section id="contact-form-section" className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left Column: Contact Channels & Placeholders (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-2">
                  Direct Channels
                </span>
                <h2
                  className="font-serif text-2xl sm:text-3xl font-light text-[#1A1916] mb-4"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Reach Out Directly
                </h2>
                <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                  We welcome personal conversations regarding piece details, custom sizing, and dispatch schedules.
                </p>
              </div>

              {/* WhatsApp Priority Card */}
              <div className="p-6 bg-[#FAF8F5] border border-[#25D366]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-16 h-16 bg-[#25D366]/10 rounded-full blur-md pointer-events-none" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0 text-[#128C7E]">
                    <MessageCircle size={20} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[0.625rem] uppercase tracking-[0.18em] text-[#128C7E] font-semibold block">
                      Fastest Response Time
                    </span>
                    <h3 className="text-base font-serif font-medium text-[#1A1916]">
                      Direct WhatsApp Catalogue Inquiries
                    </h3>
                    <p className="text-xs text-[#5E5B55] leading-relaxed">
                      Connect directly with our client concierge to inspect detailed piece photographs, discuss custom dimensions, or place order requests.
                    </p>
                    <div className="pt-2">
                      <a
                        href={generalWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn inline-flex items-center gap-2 bg-[#128C7E] text-white hover:bg-[#075E54] text-xs px-5 py-2.5 transition-colors"
                      >
                        <MessageCircle size={15} />
                        <span>Chat on WhatsApp [Placeholder]</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Cards List */}
              <div className="space-y-4">

                {/* Email Address */}
                <div className="p-5 bg-white border border-[#E8E6E1] flex items-start gap-4 hover:border-[#B8943F]/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E6E1] flex items-center justify-center shrink-0 text-[#7C5A2A]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89] block mb-0.5">
                      Email Inquiries Placeholder
                    </span>
                    <a
                      href={`mailto:${BUSINESS_EMAIL}`}
                      className="text-sm font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors"
                    >
                      {BUSINESS_EMAIL}
                    </a>
                    <p className="text-xs text-[#928F89] mt-0.5">
                      For detailed briefs, architectural schedules, and gifting lookbooks.
                    </p>
                  </div>
                </div>

                {/* Business Phone */}
                <div className="p-5 bg-white border border-[#E8E6E1] flex items-start gap-4 hover:border-[#B8943F]/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E6E1] flex items-center justify-center shrink-0 text-[#7C5A2A]">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89] block mb-0.5">
                      Studio Phone Placeholder
                    </span>
                    <a
                      href={`tel:${BUSINESS_PHONE.replace(/\s+/g, '')}`}
                      className="text-sm font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors"
                    >
                      {BUSINESS_PHONE}
                    </a>
                    <p className="text-xs text-[#928F89] mt-0.5">
                      Available Monday to Saturday, 10:00 AM – 6:30 PM IST.
                    </p>
                  </div>
                </div>

                {/* Instagram Link */}
                <div className="p-5 bg-white border border-[#E8E6E1] flex items-start gap-4 hover:border-[#B8943F]/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E6E1] flex items-center justify-center shrink-0 text-[#7C5A2A]">
                    <InstagramIcon size={16} />
                  </div>
                  <div>
                    <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89] block mb-0.5">
                      Instagram Studio Journal Placeholder
                    </span>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#1A1916] hover:text-[#7C5A2A] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{INSTAGRAM_HANDLE}</span>
                      <ArrowRight size={12} className="text-[#928F89]" />
                    </a>
                    <p className="text-xs text-[#928F89] mt-0.5">
                      Daily casting clips, patina tests, and styling inspiration.
                    </p>
                  </div>
                </div>

                {/* Studio Location */}
                <div className="p-5 bg-white border border-[#E8E6E1] flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E6E1] flex items-center justify-center shrink-0 text-[#7C5A2A]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89] block mb-0.5">
                      Craft Origin & Studio Foundry
                    </span>
                    <p className="text-sm font-medium text-[#1A1916]">
                      {STUDIO_LOCATION}
                    </p>
                    <p className="text-xs text-[#928F89] mt-0.5">
                      Visits to our casting workshop and gallery by prior appointment only.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Interactive Form with Validation (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#E8E6E1] p-8 sm:p-10 shadow-sm relative">
                <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-2">
                  Enquiry Form
                </span>
                <h2
                  className="font-serif text-2xl sm:text-3xl font-light text-[#1A1916] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Send an Inquiry
                </h2>
                <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed mb-8">
                  Please fill out the form below. For custom sizing or architectural projects, include approximate dimensions in your message.
                </p>

                {/* Frontend Prototype Disclaimer Banner */}
                <div className="mb-8 p-3.5 bg-[#FAF8F5] border-l-2 border-[#B8943F] text-xs text-[#5E5B55]">
                  <p className="font-medium text-[#7C5A2A] mb-0.5">
                    Notice: Frontend Prototype Demonstration
                  </p>
                  <p className="text-[0.8125rem] leading-relaxed text-[#5E5B55]">
                    This form demonstrates user interaction and validation on the frontend. Submissions are not currently connected to a live email relay. For immediate customer orders, please use the WhatsApp enquiry option or write to{' '}
                    <a href={`mailto:${BUSINESS_EMAIL}`} className="underline text-[#1A1916]">
                      {BUSINESS_EMAIL}
                    </a>
                    .
                  </p>
                </div>

                {submittedData ? (
                  /* Submission Success State */
                  <div
                    className="p-6 sm:p-8 bg-[#FAF8F5] border border-[#B8943F]/40 text-left space-y-5"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center shrink-0">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl text-[#1A1916] font-medium">
                          Inquiry Prepared Successfully
                        </h3>
                        <p className="text-xs text-[#928F89]">
                          Logged in session state • Reference: #{Date.now().toString().slice(-6)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-b border-[#E8E6E1] py-4 text-xs space-y-2 text-[#5E5B55]">
                      <p>
                        <strong className="text-[#1A1916]">Client:</strong> {submittedData.name} ({submittedData.email})
                      </p>
                      <p>
                        <strong className="text-[#1A1916]">Contact:</strong> {submittedData.phone}
                      </p>
                      <p>
                        <strong className="text-[#1A1916]">Enquiry Category:</strong>{' '}
                        <span className="capitalize">{submittedData.enquiryType.replace('-', ' ')}</span>
                      </p>
                      <p className="pt-1">
                        <strong className="text-[#1A1916]">Your Message:</strong>
                      </p>
                      <p className="italic bg-white p-3 border border-[#E8E6E1] text-[#1A1916]">
                        "{submittedData.message}"
                      </p>
                    </div>

                    <p className="text-xs text-[#5E5B55] leading-relaxed">
                      To send these details directly to the TAMRAH team right now via WhatsApp, tap the button below:
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a
                        href={submittedWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn inline-flex items-center justify-center gap-2 bg-[#128C7E] text-white hover:bg-[#075E54] text-xs px-6 py-3 transition-colors"
                      >
                        <MessageCircle size={16} />
                        <span>Send via WhatsApp Now</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="btn btn-secondary text-xs px-5 py-3"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Interactive Form */
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Full Name <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          value={formState.name}
                          onChange={handleChange}
                          onBlur={() => handleBlur('name')}
                          aria-invalid={touched.name && !!errors.name}
                          aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                          placeholder="e.g. Priyadarshini Rao"
                          className={`w-full px-4 py-3 bg-[#FAF8F5] border text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none transition-colors ${
                            touched.name && errors.name
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-[#E8E6E1] focus:border-[#B8943F]'
                          }`}
                        />
                        {touched.name && errors.name && (
                          <p id="name-error" className="mt-1.5 text-[0.75rem] text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Email Address <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          onBlur={() => handleBlur('email')}
                          aria-invalid={touched.email && !!errors.email}
                          aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                          placeholder="e.g. client@example.com"
                          className={`w-full px-4 py-3 bg-[#FAF8F5] border text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none transition-colors ${
                            touched.email && errors.email
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-[#E8E6E1] focus:border-[#B8943F]'
                          }`}
                        />
                        {touched.email && errors.email && (
                          <p id="email-error" className="mt-1.5 text-[0.75rem] text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone & Enquiry Type Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Phone / WhatsApp Number <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          value={formState.phone}
                          onChange={handleChange}
                          onBlur={() => handleBlur('phone')}
                          aria-invalid={touched.phone && !!errors.phone}
                          aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
                          placeholder="e.g. +91 98765 43210"
                          className={`w-full px-4 py-3 bg-[#FAF8F5] border text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none transition-colors ${
                            touched.phone && errors.phone
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-[#E8E6E1] focus:border-[#B8943F]'
                          }`}
                        />
                        {touched.phone && errors.phone && (
                          <p id="phone-error" className="mt-1.5 text-[0.75rem] text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-enquiryType"
                          className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                        >
                          Enquiry Category <span className="text-[#7C5A2A]">*</span>
                        </label>
                        <select
                          id="contact-enquiryType"
                          name="enquiryType"
                          required
                          value={formState.enquiryType}
                          onChange={handleChange}
                          onBlur={() => handleBlur('enquiryType')}
                          className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E6E1] text-xs text-[#1A1916] focus:outline-none focus:border-[#B8943F] transition-colors"
                        >
                          <option value="general">General Inquiries & Catalogue</option>
                          <option value="product">Product Availability & Pricing</option>
                          <option value="interior">Interior Designers & Trade</option>
                          <option value="bulk">Corporate & Festival Gifting</option>
                          <option value="bespoke">Bespoke Metal Commission</option>
                        </select>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-medium uppercase tracking-[0.1em] text-[#1A1916] mb-2"
                      >
                        Your Message / Project Requirements <span className="text-[#7C5A2A]">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        value={formState.message}
                        onChange={handleChange}
                        onBlur={() => handleBlur('message')}
                        aria-invalid={touched.message && !!errors.message}
                        aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                        placeholder="Please share details such as desired piece name, preferred dimensions, target delivery timeline, or bulk quantity..."
                        className={`w-full px-4 py-3 bg-[#FAF8F5] border text-xs text-[#1A1916] placeholder-[#928F89] focus:outline-none transition-colors ${
                          touched.message && errors.message
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-[#E8E6E1] focus:border-[#B8943F]'
                        }`}
                      />
                      {touched.message && errors.message && (
                        <p id="message-error" className="mt-1.5 text-[0.75rem] text-red-600 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 text-xs tracking-[0.14em]"
                      >
                        {isSubmitting ? (
                          <span>Processing Inquiry...</span>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Submit Studio Inquiry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. DEDICATED SECTION: BULK ORDERS, GIFTING & DESIGNERS ── */}
      <section className="section-padding bg-[#FAF8F5] border-b border-[#E8E6E1]" aria-labelledby="trade-section-title">
        <div className="container-site">
          <div className="max-w-3xl mb-12">
            <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-2">
              Collaborations & Special Projects
            </span>
            <h2
              id="trade-section-title"
              className="font-serif text-2xl sm:text-4xl font-light text-[#1A1916] mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Interior Designers, Architects & Corporate Patrons
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
              We collaborate with residential architects, luxury hospitality projects, interior styling studios, and corporate institutions seeking distinctive Indian handcrafted metal decor with substantial physical presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Pillar 1: Interior Designers & Architecture */}
            <div className="bg-white border border-[#E8E6E1] p-8 flex flex-col justify-between hover:border-[#B8943F] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#FAF8F5] border border-[#E8E6E1] flex items-center justify-center text-[#7C5A2A]">
                  <Building2 size={22} />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  Trade & Interior Architecture
                </h3>
                <p className="text-xs text-[#5E5B55] leading-relaxed font-light">
                  Direct artisan pricing for certified interior designers and architectural firms. We assist with custom wall bracket anchorings, scaled dimensional adaptations for living spaces, and bespoke finishes.
                </p>
                <ul className="text-xs text-[#5E5B55] space-y-2 pt-2 border-t border-[#E8E6E1]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>Specification sheets & weight profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>High-resolution installation photos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>Custom batch runs for hospitality suites</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E6E1]">
                <button
                  type="button"
                  onClick={() => selectEnquiryTypeAndScroll('interior')}
                  className="text-xs uppercase tracking-[0.12em] font-medium text-[#7C5A2A] hover:text-[#1A1916] inline-flex items-center gap-1.5"
                >
                  <span>Request Trade Catalogue</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Pillar 2: Corporate & Festival Bulk Gifting */}
            <div className="bg-white border border-[#E8E6E1] p-8 flex flex-col justify-between hover:border-[#B8943F] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#FAF8F5] border border-[#E8E6E1] flex items-center justify-center text-[#7C5A2A]">
                  <Gift size={22} />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  Corporate & Festive Gifting
                </h3>
                <p className="text-xs text-[#5E5B55] leading-relaxed font-light">
                  Elevate executive celebrations, Diwali gestures, and wedding keepsakes beyond generic gifting. Our pieces carry lasting weight and cultural reverence that recipients preserve for generations.
                </p>
                <ul className="text-xs text-[#5E5B55] space-y-2 pt-2 border-t border-[#E8E6E1]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>Tiered volume pricing for batch orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>Bespoke presentation boxing options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>Personalized artisan provenance cards</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E6E1]">
                <button
                  type="button"
                  onClick={() => selectEnquiryTypeAndScroll('bulk')}
                  className="text-xs uppercase tracking-[0.12em] font-medium text-[#7C5A2A] hover:text-[#1A1916] inline-flex items-center gap-1.5"
                >
                  <span>Enquire for Bulk Gifting</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Pillar 3: Bespoke Castings & Sacred Mandir Art */}
            <div className="bg-white border border-[#E8E6E1] p-8 flex flex-col justify-between hover:border-[#B8943F] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#FAF8F5] border border-[#E8E6E1] flex items-center justify-center text-[#7C5A2A]">
                  <Compass size={22} />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  Bespoke Mandir & Sacred Art
                </h3>
                <p className="text-xs text-[#5E5B55] leading-relaxed font-light">
                  We cast traditional Hindu idols and sanctum features according to Shilpa Shastra proportions. For temple niches and bespoke pooja rooms, we facilitate artisan consultations.
                </p>
                <ul className="text-xs text-[#5E5B55] space-y-2 pt-2 border-t border-[#E8E6E1]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>Classical iconography & proportional fidelity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>Heavy solid metal casting for altar sanctity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8943F]" />
                    <span>Special beeswax protective seal for daily puja</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E6E1]">
                <button
                  type="button"
                  onClick={() => selectEnquiryTypeAndScroll('bespoke')}
                  className="text-xs uppercase tracking-[0.12em] font-medium text-[#7C5A2A] hover:text-[#1A1916] inline-flex items-center gap-1.5"
                >
                  <span>Discuss Sacred Commissions</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Trade WhatsApp Consultation Banner */}
          <div className="mt-12 p-6 sm:p-8 bg-[#141311] text-[#E5E0D8] border border-[#2C2924] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[0.625rem] uppercase tracking-[0.2em] text-[#B8943F] font-semibold block">
                Trade Concierge
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FDFCF9]">
                Have an urgent site schedule or architectural tender?
              </h3>
              <p className="text-xs text-[#928F89] font-light max-w-xl">
                Message our head curator directly with floor plans, CAD elevations, or reference moodboards.
              </p>
            </div>
            <a
              href={tradeWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn inline-flex items-center gap-2 bg-[#FDFCF9] text-[#1A1916] hover:bg-[#B8943F] hover:text-white text-xs px-6 py-3 transition-colors shrink-0"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Trade Desk</span>
            </a>
          </div>

        </div>
      </section>
    </>
  );
}
