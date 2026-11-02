import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative w-full flex flex-col justify-between overflow-hidden bg-[#141310]"
      style={{ minHeight: 'calc(100vh - 5rem)' }}
      aria-label="TAMRAH Hero Section"
    >
      {/* ── Background Lifestyle Photograph ─────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/home/hero.jpg"
          alt="Handcrafted TAMRAH black-metal Nataraja sculpture in a luxury minimalist interior"
          className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05]"
          fetchPriority="high"
          decoding="async"
        />
        {/* Editorial Gradients: Dark vignette on left & bottom for crisp typographic contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0E0D0B]/90 via-[#0E0D0B]/60 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B]/95 via-transparent to-[#0E0D0B]/30"
          aria-hidden="true"
        />
      </div>

      {/* ── Top Spacing Spacer ──────────────────────────────── */}
      <div className="h-12 sm:h-20" aria-hidden="true" />

      {/* ── Main Content Area ───────────────────────────────── */}
      <div className="relative z-10 container-site py-12 sm:py-16 lg:py-20 flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Eyebrow / Provenance */}
          <div className="flex items-center gap-3.5 mb-6">
            <span className="w-8 h-[1px] bg-[#B8943F]" aria-hidden="true" />
            <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-[#D4AF6A] font-medium">
              Andhra Pradesh • Heritage Metalcraft
            </p>
          </div>

          {/* Elegant Headline */}
          <h1
            className="font-serif text-[#FDFCF9] font-light leading-[1.08] tracking-[-0.015em] text-4xl sm:text-6xl lg:text-[4.25rem] mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Handcrafted Metalware
            <span className="block italic font-normal text-[#E8E6E1]/90 mt-1">
              For Timeless Spaces
            </span>
          </h1>

          {/* Short Supporting Description */}
          <p className="text-sm sm:text-base lg:text-lg text-[#E8E6E1]/80 font-light leading-relaxed max-w-xl mb-10">
            Rooted in centuries-old Andhra moulding traditions, TAMRAH crafts bespoke
            sculptures, sacred idols, and architectural accents in deep matte black metal.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              to="/shop"
              className="btn btn-light px-8 py-3.5 text-xs tracking-[0.14em] uppercase font-medium bg-[#FDFCF9] text-[#1A1916] hover:bg-[#B8943F] hover:text-white transition-all shadow-md"
            >
              Explore Collection
            </Link>

            <Link
              to="/our-craft"
              className="group inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.14em] font-medium text-[#FDFCF9] hover:text-[#D4AF6A] py-3 transition-colors"
            >
              <span>Discover Our Craft</span>
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom Provenance Ribbon ────────────────────────── */}
      <div className="relative z-10 border-t border-white/10 bg-[#0E0D0B]/60 backdrop-blur-sm">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 text-center py-4 sm:py-5">
            <div className="px-3 py-1">
              <span className="block text-xs sm:text-sm font-serif text-[#D4AF6A]">Lost-Mould Casting</span>
              <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89]">Ancient Technique</span>
            </div>
            <div className="px-3 py-1">
              <span className="block text-xs sm:text-sm font-serif text-[#D4AF6A]">Master Artisans</span>
              <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89]">Andhra Pradesh</span>
            </div>
            <div className="px-3 py-1">
              <span className="block text-xs sm:text-sm font-serif text-[#D4AF6A]">Solid Black Metal</span>
              <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89]">Natural Patina</span>
            </div>
            <div className="px-3 py-1">
              <span className="block text-xs sm:text-sm font-serif text-[#D4AF6A]">Direct Catalogue</span>
              <span className="text-[0.625rem] uppercase tracking-[0.16em] text-[#928F89]">Artisan Enquiry</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
