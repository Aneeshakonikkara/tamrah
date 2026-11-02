import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function BrandStory() {
  return (
    <section
      id="brand-story"
      className="section-padding bg-[#F8F6F1] border-b border-[#E8E6E1]"
      aria-labelledby="brand-story-title"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Large Editorial Photograph (Left, 6 cols) ─────── */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden shadow-xl border border-[#E8E6E1]">
              <img
                src="/images/home/artisan.jpg"
                alt="Master Indian artisan handcrafting black metal sculpture in Andhra Pradesh workshop"
                className="w-full h-[480px] sm:h-[580px] object-cover object-center filter brightness-[0.97]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B]/70 via-transparent to-transparent"
                aria-hidden="true"
              />
              {/* Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-[0.625rem] tracking-[0.2em] uppercase text-[#D4AF6A] font-medium mb-1">
                  Workshop Chronicles
                </p>
                <p className="text-xs sm:text-sm font-light text-[#E8E6E1]">
                  Master craftsman detailing a traditional dancing Shiva bronze-alloy mould in Andhra Pradesh.
                </p>
              </div>
            </div>

            {/* Subtle decorative badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 bg-[#1A1916] text-[#FDFCF9] p-4 border border-[#3A3834] shadow-lg flex-col items-center justify-center text-center max-w-[150px]">
              <span className="font-serif text-2xl text-[#D4AF6A] font-light">100%</span>
              <span className="text-[0.5625rem] uppercase tracking-[0.16em] text-[#C8C5BF] mt-0.5">
                Hand Cast & Moulded
              </span>
            </div>
          </div>

          {/* ── Editorial Prose & Highlights (Right, 6 cols) ─── */}
          <div className="lg:col-span-6 lg:pl-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#B8943F]" />
              <p className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium">
                Our Provenance & Philosophy
              </p>
            </div>

            <h2
              id="brand-story-title"
              className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-[#1A1916] leading-[1.18] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Born from Ancient Moulds,{' '}
              <span className="italic block font-normal text-[#7C5A2A]">
                Sculpted by Master Hands.
              </span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5E5B55] font-light leading-relaxed mb-8">
              <p>
                TAMRAH takes inspiration from centuries-old metalcraft heritage of Andhra Pradesh, where generations of casting families have preserved the art of moulding raw elements into timeless devotional and architectural forms.
              </p>
              <p>
                Each piece begins not on a factory conveyor, but in the deliberate hands of master artisans. From the initial clay mould and molten alloy pour to meticulous chisel engraving and deep matte charcoal patination, no two pieces are identical.
              </p>
              <p className="text-[#3A3834] font-normal">
                The result is décor with undeniable visual gravity — metal that absorbs light, holds memory, and turns any modern space into an enduring sanctuary.
              </p>
            </div>

            {/* 3 Craft Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8E6E1] mb-8">
              <div>
                <h4 className="font-serif text-base text-[#1A1916] mb-1 font-medium">
                  Clay Moulding
                </h4>
                <p className="text-xs text-[#928F89] leading-relaxed">
                  Lost-wax & loam moulds shaped by touch.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-base text-[#1A1916] mb-1 font-medium">
                  Alloy Pouring
                </h4>
                <p className="text-xs text-[#928F89] leading-relaxed">
                  Carefully balanced black-metal composition.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-base text-[#1A1916] mb-1 font-medium">
                  Charcoal Patina
                </h4>
                <p className="text-xs text-[#928F89] leading-relaxed">
                  Hand-buffed matte finish that never fades.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/our-craft"
                className="btn btn-primary px-7 py-3 text-xs tracking-[0.14em] uppercase"
              >
                Discover Our Craft
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[#1A1916] hover:text-[#7C5A2A] transition-colors"
              >
                <span>Commission Custom Work</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
