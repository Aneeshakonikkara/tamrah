import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';
import SEO from '../components/common/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Us — Handcrafted Heritage & Craft Philosophy"
        description="Learn about TAMRAH, an Indian handcrafted black-metal décor and sacred idols brand rooted in Andhra Pradesh moulding craftsmanship and considered living."
        canonicalUrl="https://tamrah.in/about"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' },
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
              <li className="text-[#1A1916] font-medium">About Us</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── 2. HERO SECTION ──────────────────────────────────── */}
      <section className="bg-[#FAF8F5] section-padding border-b border-[#E8E6E1]" aria-labelledby="about-hero">
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#B8943F]" />
              <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium">
                The Philosophy of TAMRAH
              </span>
            </div>

            <h1
              id="about-hero"
              className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-light text-[#1A1916] leading-[1.12] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Objects of Quiet Majesty,{' '}
              <span className="italic font-normal text-[#7C5A2A] block sm:inline">
                Forged with Intention.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#5E5B55] font-light leading-relaxed max-w-2xl">
              TAMRAH is an Indian handcrafted metal décor brand rooted in the timeless casting and moulding heritage of Andhra Pradesh. We create sculptures, sacred idols, and architectural accents designed to bring visual weight, cultural reverence, and enduring beauty into modern living spaces.
            </p>

            <div className="mt-4 p-3 bg-white border border-[#E8E6E1] inline-block text-[0.6875rem] text-[#928F89] font-light">
              <span className="font-medium text-[#7C5A2A]">[Studio Origin Note]:</span> Established to celebrate authentic metalcraft traditions and connect discerning homeowners directly with master artisan casting.
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. BRAND INTRODUCTION & PHILOSOPHY ───────────────── */}
      <section className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]" aria-labelledby="philosophy-title">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Narrative (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block">
                Our Foundation
              </span>
              <h2
                id="philosophy-title"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1916] leading-snug"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                In a World of Transient Goods, We Choose the Unhurried.
              </h2>

              <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                TAMRAH takes its inspiration from the ancient Sanskrit reverence for metalworking — an art form that has shaped Indian sacred spaces and architectural monuments for millennia.
              </p>
              <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                Rather than producing mass-manufactured, stamped items that lose their luster in a season, we choose the deliberate, unhurried pace of the foundry. Every piece begins with loam and sand moulding, followed by the fiery pour of molten alloy, and culminates in hours of careful hand-chiseling by experienced craftsmen.
              </p>
              <p className="text-xs sm:text-sm text-[#3A3834] font-normal leading-relaxed">
                The result is an object with weight you can feel, texture you can trace with your fingertips, and a presence that commands quiet respect.
              </p>
            </div>

            {/* Right Editorial Image (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden shadow-lg border border-[#E8E6E1]">
                <img
                  src="/images/home/artisan.jpg"
                  alt="Artisan handcrafting metal sculpture in Andhra Pradesh"
                  className="w-full h-[420px] sm:h-[480px] object-cover object-center"
                />
                <div className="p-4 bg-white border-t border-[#E8E6E1]">
                  <p className="text-[0.6875rem] text-[#928F89] italic">
                    Hands that preserve generations of moulding knowledge in Andhra Pradesh, India.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. APPROACH TO HOME DÉCOR & GIFTING ───────────────── */}
      <section className="section-padding bg-[#FAF8F5] border-b border-[#E8E6E1]" aria-labelledby="approach-title">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-2">
              Curated Living & Celebrations
            </span>
            <h2
              id="approach-title"
              className="font-serif text-3xl sm:text-4xl text-[#1A1916] font-light tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Our Approach to Décor & Gifting
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5B55] font-light mt-3 leading-relaxed">
              We believe home décor should anchor a space rather than clutter it, and gifts should carry lifelong personal significance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#E8E6E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#7C5A2A] mb-5">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-serif text-xl text-[#1A1916] font-medium mb-3">
                  Visual Gravitas
                </h3>
                <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                  Our black-metal pieces are engineered with substantial physical weight. They serve as definitive focal points on consoles, prayer alcoves, entryways, and accent walls.
                </p>
              </div>
              <span className="text-[0.625rem] tracking-[0.16em] uppercase text-[#928F89] pt-6 mt-6 border-t border-[#E8E6E1]">
                Thoughtful Interiors
              </span>
            </div>

            <div className="bg-white p-8 border border-[#E8E6E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#7C5A2A] mb-5">
                  <Heart size={20} />
                </div>
                <h3 className="font-serif text-xl text-[#1A1916] font-medium mb-3">
                  Heirloom Gifting
                </h3>
                <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                  Whether honoring a housewarming, a spiritual milestone, a wedding, or an executive achievement, a TAMRAH creation is designed to be cherished for generations, not discarded.
                </p>
              </div>
              <span className="text-[0.625rem] tracking-[0.16em] uppercase text-[#928F89] pt-6 mt-6 border-t border-[#E8E6E1]">
                Enduring Moments
              </span>
            </div>

            <div className="bg-white p-8 border border-[#E8E6E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#7C5A2A] mb-5">
                  <Award size={20} />
                </div>
                <h3 className="font-serif text-xl text-[#1A1916] font-medium mb-3">
                  Subtle Restraint
                </h3>
                <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                  By moving away from overly shiny synthetic lacquers toward a velvety matte-charcoal patina with brushed bronze undertones, our pieces blend seamlessly into both contemporary and classical decor.
                </p>
              </div>
              <span className="text-[0.625rem] tracking-[0.16em] uppercase text-[#928F89] pt-6 mt-6 border-t border-[#E8E6E1]">
                Refined Aesthetic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CONNECTION WITH INDIAN CRAFTSMANSHIP ───────────── */}
      <section className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]" aria-labelledby="heritage-title">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Imagery Stack (6 cols) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="overflow-hidden border border-[#E8E6E1]">
                <img
                  src="/images/products/nataraja.jpg"
                  alt="Nataraja metal sculpture"
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </div>
              <div className="overflow-hidden border border-[#E8E6E1] mt-8">
                <img
                  src="/images/products/detail-chisel.jpg"
                  alt="Hand-chiseled texture detail"
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </div>
            </div>

            {/* Right Craft Description (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block">
                Indian Craftsmanship
              </span>
              <h2
                id="heritage-title"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1916] leading-snug"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Honoring the Casting Traditions of Andhra Pradesh
              </h2>

              <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                The southern Indian state of Andhra Pradesh has long been recognized for its distinctive metalworking guilds. Here, artisanal knowledge has been passed from parent to child through oral instruction, touch, and daily practice in the foundry.
              </p>
              <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                TAMRAH operates in direct partnership with these craft communities. We provide sustainable patronage for traditional techniques—such as hand-rammed loam moulds, wax sculpting, and chisel chasing—while ensuring that our designs speak directly to modern living aesthetics.
              </p>
              <div className="pt-2">
                <Link
                  to="/our-craft"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[#7C5A2A] hover:text-[#1A1916] transition-colors border-b border-[#7C5A2A] pb-1"
                >
                  <span>Explore the Creation Process in Detail</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. WHAT MAKES TAMRAH DISTINCTIVE ─────────────────── */}
      <section className="section-padding bg-[#FAF8F5] border-b border-[#E8E6E1]" aria-labelledby="distinctive-title">
        <div className="container-site">
          <div className="max-w-3xl mb-12">
            <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-2">
              The Studio Standard
            </span>
            <h2
              id="distinctive-title"
              className="font-serif text-3xl sm:text-4xl text-[#1A1916] font-light tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              What Sets Our Work Apart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-[#E8E6E1]">
              <span className="font-serif text-2xl text-[#B8943F] font-light block mb-2">01</span>
              <h4 className="font-serif text-lg text-[#1A1916] font-medium mb-2">Solid Metal Composition</h4>
              <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                Cast from dense metal alloys that provide commanding physical weight, ensuring stability and long-term durability.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E6E1]">
              <span className="font-serif text-2xl text-[#B8943F] font-light block mb-2">02</span>
              <h4 className="font-serif text-lg text-[#1A1916] font-medium mb-2">Matte Charcoal Patina</h4>
              <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                Hand-buffed with natural beeswax to produce a deep, light-absorbing charcoal surface that ages gracefully over time.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E6E1]">
              <span className="font-serif text-2xl text-[#B8943F] font-light block mb-2">03</span>
              <h4 className="font-serif text-lg text-[#1A1916] font-medium mb-2">Unrepeated Nuance</h4>
              <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                No two casts are 100% identical. Subtle chisel marks and cooling textures attest to genuine human touch.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E6E1]">
              <span className="font-serif text-2xl text-[#B8943F] font-light block mb-2">04</span>
              <h4 className="font-serif text-lg text-[#1A1916] font-medium mb-2">Direct Artisan Dialogue</h4>
              <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                Our catalogue allows direct consultation with our studio team, with personalized assistance for custom requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CONCLUDING STATEMENT & CTA ────────────────────── */}
      <section className="section-padding bg-[#1A1916] text-[#FDFCF9]" aria-label="Explore Catalogue">
        <div className="container-site text-center max-w-2xl mx-auto">
          <span className="text-[0.6875rem] uppercase tracking-[0.24em] text-[#D4AF6A] font-medium block mb-3">
            Handcrafted for Generations
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Bring Authentic Indian Metalcraft Into Your Home.
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BF] font-light leading-relaxed mb-10">
            Browse our complete collection of sculptures, sacred idols, architectural panels, mirror frames, and lampshades.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="btn btn-light px-8 py-3.5 text-xs uppercase tracking-[0.14em] font-medium bg-[#FDFCF9] text-[#1A1916] hover:bg-[#D4AF6A] hover:text-black transition-all"
            >
              Shop Collection
            </Link>
            <Link
              to="/contact"
              className="btn btn-secondary px-8 py-3.5 text-xs uppercase tracking-[0.14em] font-medium text-white border-white/30 hover:border-white hover:bg-white/10"
            >
              Contact Studio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
