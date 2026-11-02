import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import type { Collection } from '../../types';
import { getCategories } from '../../services/productService';
import { buildGeneralEnquiryUrl } from '../../config/whatsapp';

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function LinkedinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);

  useEffect(() => {
    getCategories().then(setCollectionsList).catch(console.warn);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer
      id="site-footer"
      className="bg-[#12110E] text-[#C8C5BF] border-t border-[#2A2824]"
      aria-label="Site footer"
    >
      {/* ── Pre-footer Newsletter & Dialogue Band ──────────────── */}
      <div className="py-14 sm:py-16 border-b border-[#24221E] bg-[#161512]">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[0.6875rem] uppercase tracking-[0.24em] text-[#B8943F] font-medium block mb-3">
              The Artisan Letter
            </span>
            <h2
              className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FDFCF9] font-light mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Stories from the Foundry
            </h2>
            <p className="text-xs sm:text-sm text-[#928F89] font-light max-w-lg mx-auto mb-8">
              Receive private previews of limited edition castings, invitations to studio exhibitions, and notes on Indian heritage metalcraft.
            </p>

            {/* Newsletter Subscription Form */}
            {!subscribed ? (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full sm:w-auto flex-1 bg-[#1A1916] border border-[#3A3834] px-4 py-3 text-xs text-[#FDFCF9] placeholder-[#928F89] focus:outline-none focus:border-[#B8943F]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#FDFCF9] text-[#1A1916] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#B8943F] hover:text-white transition-all whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#25231F] border border-[#B8943F]/50 text-xs text-[#D4AF6A]">
                <CheckCircle size={15} />
                <span>Thank you. You are added to the studio dispatch list.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Footer Columns ─────────────────────────────────── */}
      <div className="section-padding">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

            {/* Brand Profile (4 cols) */}
            <div className="lg:col-span-4">
              <Link to="/" aria-label="TAMRAH Home" className="text-decoration-none">
                <span
                  className="font-serif text-2xl tracking-[0.24em] text-[#FDFCF9] font-medium block mb-2"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  TAMRAH
                </span>
              </Link>
              <span className="text-[0.625rem] uppercase tracking-[0.24em] text-[#B8943F] block mb-4">
                Andhra Pradesh • Handcrafted Metal Décor
              </span>

              <p className="text-xs sm:text-sm text-[#928F89] font-light leading-relaxed mb-6 max-w-sm">
                Each TAMRAH creation is hand-cast and hand-finished in our Andhra Pradesh workshops using traditional moulding techniques, delivering solid metal art of quiet majesty.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1A1916] border border-[#3A3834] flex items-center justify-center text-[#928F89] hover:text-white hover:border-[#B8943F] transition-colors"
                  aria-label="Follow TAMRAH on Instagram"
                >
                  <InstagramIcon size={14} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1A1916] border border-[#3A3834] flex items-center justify-center text-[#928F89] hover:text-white hover:border-[#B8943F] transition-colors"
                  aria-label="Follow TAMRAH on Facebook"
                >
                  <FacebookIcon size={14} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1A1916] border border-[#3A3834] flex items-center justify-center text-[#928F89] hover:text-white hover:border-[#B8943F] transition-colors"
                  aria-label="Connect with TAMRAH on LinkedIn"
                >
                  <LinkedinIcon size={14} />
                </a>
                <a
                  href={buildGeneralEnquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1A1916] border border-[#3A3834] flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle size={14} />
                </a>
              </div>
            </div>

            {/* Collections Navigation (3 cols) */}
            <div className="lg:col-span-3">
              <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-[#FDFCF9] font-medium mb-5">
                Artisanal Collections
              </p>
              <ul className="space-y-2.5 text-xs text-[#928F89]">
                {collectionsList.map((col) => (
                  <li key={col.id}>
                    <Link
                      to={`/shop?category=${col.id}`}
                      className="hover:text-[#FDFCF9] transition-colors block py-0.5"
                    >
                      {col.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    to="/shop"
                    className="text-[#D4AF6A] hover:underline inline-flex items-center gap-1"
                  >
                    All Collections <ArrowRight size={11} />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Brand & Studio Links (2 cols) */}
            <div className="lg:col-span-2">
              <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-[#FDFCF9] font-medium mb-5">
                The Brand
              </p>
              <ul className="space-y-2.5 text-xs text-[#928F89]">
                <li>
                  <Link to="/" className="hover:text-[#FDFCF9] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-[#FDFCF9] transition-colors">
                    Shop Catalogue
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#FDFCF9] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/our-craft" className="hover:text-[#FDFCF9] transition-colors">
                    Our Craft
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#FDFCF9] transition-colors">
                    Frequently Asked (FAQ)
                  </Link>
                </li>
                <li>
                  <Link to="/bulk-orders" className="hover:text-[#FDFCF9] transition-colors">
                    Bulk Orders & Trade
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#FDFCF9] transition-colors">
                    Contact Studio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Placeholders & Workshop (3 cols) */}
            <div className="lg:col-span-3">
              <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-[#FDFCF9] font-medium mb-5">
                Artisan Studio & Inquiries
              </p>
              <div className="space-y-3.5 text-xs text-[#928F89]">
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 text-[#B8943F] shrink-0" />
                  <span>
                    TAMRAH Foundry & Workshop<br />
                    Moulding Artisans Enclave, Andhra Pradesh, India
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-[#B8943F] shrink-0" />
                  <a href="tel:+919999999999" className="hover:text-[#FDFCF9]">
                    +91 99999 99999 [Inquiries]
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-[#B8943F] shrink-0" />
                  <a href="mailto:hello@tamrah.in" className="hover:text-[#FDFCF9]">
                    hello@tamrah.in
                  </a>
                </div>
                <div className="pt-2">
                  <span className="text-[0.625rem] text-[#5E5B55] block">
                    Visiting Hours: By prior appointment only
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Legal & Copyright Bar ───────────────────────────────── */}
      <div className="border-t border-[#24221E] py-6">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.6875rem] text-[#716E68]">
          <p>
            © {currentYear} TAMRAH Craft Studio. All rights reserved. Handcrafted in Andhra Pradesh, India.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link to="/faq" className="hover:text-[#C8C5BF] transition-colors">
              FAQ & Policies
            </Link>
            <Link to="/faq" className="hover:text-[#C8C5BF] transition-colors">
              Care & Maintenance
            </Link>
            <Link to="/faq" className="hover:text-[#C8C5BF] transition-colors">
              Crating & Shipping
            </Link>
            <Link to="/contact" className="hover:text-[#C8C5BF] transition-colors">
              Contact Studio
            </Link>
            <Link to="/admin" className="text-[#8C8983] hover:text-[#D4AF6A] transition-colors">
              Catalogue Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
