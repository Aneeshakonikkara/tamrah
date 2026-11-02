import { Link } from 'react-router-dom';
import { Flame, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';

const craftSteps = [
  {
    number: '01',
    title: 'Loam & Sand Mould Sculpting',
    subtitle: 'The Blueprint in Clay',
    description:
      'Every creation begins with a carefully composed mould shaped from natural clay, fine river sand, and loam. For intricate religious idols and ornate figures, the lost-wax technique is employed, allowing artisans to sculpt delicate drapery, facial expressions, and classical attributes entirely by hand.',
    highlight: 'No pre-fabricated silicone or plastic moulds are used.',
  },
  {
    number: '02',
    title: 'The Molten Alloy Pour',
    subtitle: 'Precision at the Crucible',
    description:
      'Solid black metal alloy is brought to molten temperature in charcoal-fired crucibles. Pouring requires practiced intuition: too cool and the liquid metal will not fill delicate jaali perforations; too hot and the surface risks air pitting. Artisans synchronize the pour with fluid, steady gestures.',
    highlight: 'Hand-poured at optimal thermal equilibrium.',
  },
  {
    number: '03',
    title: 'De-Moulding & Chisel Chasing',
    subtitle: 'Extracting the Form',
    description:
      'Once cooled, the hardened clay mould is carefully broken open to release the raw casting. The piece then enters the hands of master engravers who spend hours with fine chisels, files, and scrapers, sharpening features, smoothing seams, and carving geometric relief lines.',
    highlight: 'Individual hand-chiseling creates unrepeated texture.',
  },
  {
    number: '04',
    title: 'Charcoal Patina & Beeswax Seal',
    subtitle: 'The Signature Matte Finish',
    description:
      'Instead of artificial spray paints, TAMRAH works are treated with an artisanal charcoal patination wash. The metal is then rubbed with warm organic beeswax, sealing the surface with a rich, matte charcoal hue that resists fading and develops deeper character over the years.',
    highlight: 'Sealed with organic beeswax for enduring lustre.',
  },
];

export default function OurCraftPage() {
  return (
    <>
      <SEO
        title="Our Craft — Traditional Andhra Metal Moulding & Lost-Wax Casting"
        description="Discover the traditional moulding, casting, and hand-chiseling techniques used by Andhra Pradesh artisans to create TAMRAH handcrafted black-metal décor."
        canonicalUrl="https://tamrah.in/our-craft"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Our Craft', url: '/our-craft' },
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
              <li className="text-[#1A1916] font-medium">Our Craft</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── 2. HERO SECTION ──────────────────────────────────── */}
      <section className="bg-[#FAF8F5] section-padding border-b border-[#E8E6E1]" aria-labelledby="craft-hero">
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={14} className="text-[#B8943F]" />
              <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium">
                The Foundry Discipline
              </span>
            </div>

            <h1
              id="craft-hero"
              className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-light text-[#1A1916] leading-[1.12] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Ancient Art of{' '}
              <span className="italic font-normal text-[#7C5A2A]">
                Andhra Metal Moulding.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#5E5B55] font-light leading-relaxed max-w-2xl">
              In an era dominated by computerized stampings, TAMRAH remains faithful to traditional Indian metalcraft. Handcrafted in the metalworking regions of Andhra Pradesh, our creations represent an unbroken lineage of moulding techniques that turn raw alloy into timeless objects of art.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. MOULDING TECHNIQUES OVERVIEW ─────────────────── */}
      <section className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]" aria-labelledby="technique-overview">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Large Image (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative overflow-hidden border border-[#E8E6E1] shadow-lg">
                <img
                  src="/images/home/artisan.jpg"
                  alt="Master craftsman finishing a metal sculpture in Andhra Pradesh"
                  className="w-full h-[450px] sm:h-[520px] object-cover object-center"
                />
              </div>
              <div className="p-4 bg-white border border-[#E8E6E1] mt-3">
                <p className="text-[0.6875rem] text-[#928F89] italic">
                  An artisan hand-chiseling intricate details on a classical sculpture in our Andhra Pradesh workshop.
                </p>
              </div>
            </div>

            {/* Narrative (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block">
                Heritage Moulding
              </span>
              <h2
                id="technique-overview"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1916] leading-snug"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Why Handcrafted Moulding Cannot Be Mechanised
              </h2>

              <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                The essence of Andhra metalcraft lies in the relationship between the artisan and the mould. Each mould is created individually—fashioned by hand out of regional clay, river silt, and binders that withstand the extreme heat of molten alloy.
              </p>
              <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                Because each mould is broken upon release to retrieve the cast, no two castings can ever be exact industrial duplicates. Slight cooling marks, subtle variations in thickness, and tool traces are not imperfections—they are the indelible signature of human artistry.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8E6E1]">
                <div>
                  <h4 className="font-serif text-lg text-[#1A1916] font-medium">Lost-Mould Casting</h4>
                  <p className="text-xs text-[#928F89] mt-1 font-light">Each casting requires a uniquely sculpted single-use mould.</p>
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#1A1916] font-medium">Natural Shrinkage</h4>
                  <p className="text-xs text-[#928F89] mt-1 font-light">Cooling alloy develops authentic microscopic surface character.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. STEP-BY-STEP PROCESS ─────────────────────────── */}
      <section className="section-padding bg-[#FAF8F5] border-b border-[#E8E6E1]" aria-labelledby="process-heading">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-2">
              From Raw Alloy to Refined Object
            </span>
            <h2
              id="process-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1916] tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Creation Process
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5B55] font-light mt-3 leading-relaxed">
              Every TAMRAH piece undergoes a disciplined four-stage journey before earning the studio mark.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {craftSteps.map((step) => (
              <div
                key={step.number}
                className="bg-white p-8 sm:p-10 border border-[#E8E6E1] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1] mb-5">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#7C5A2A] font-medium">
                      Stage {step.number}
                    </span>
                    <span className="font-serif text-2xl text-[#C8C5BF] font-light">
                      {step.number}
                    </span>
                  </div>

                  <h3
                    className="font-serif text-2xl text-[#1A1916] font-normal mb-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs font-medium text-[#B8943F] uppercase tracking-[0.1em] mb-4">
                    {step.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E6E1]/70 flex items-center gap-2 text-xs text-[#1A1916]">
                  <Sparkles size={13} className="text-[#B8943F]" />
                  <span className="font-medium">{step.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. MATERIALS & FINISH INFORMATION ────────────────── */}
      <section className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]" aria-labelledby="materials-heading">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Content (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block">
                Composition & Longevity
              </span>
              <h2
                id="materials-heading"
                className="font-serif text-3xl sm:text-4xl font-light text-[#1A1916] leading-snug"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Solid Black Metal Alloy & Natural Beeswax Patina
              </h2>

              <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                We formulate our metal using traditional copper-derived alloy blends. This heavy, solid composite grants each piece significant physical weight and structural resilience. Unlike resin imitations or hollow castings, a TAMRAH sculpture will not easily tip, deform, or warp with temperature shifts.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 bg-[#FAF8F5] border border-[#E8E6E1]">
                  <h4 className="font-serif text-base text-[#1A1916] font-medium mb-1">
                    Light-Absorbing Charcoal Tone
                  </h4>
                  <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                    Our signature matte charcoal surface absorbs harsh room glare, casting velvety soft shadows that highlight sculptural geometry.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#E8E6E1]">
                  <h4 className="font-serif text-base text-[#1A1916] font-medium mb-1">
                    Organic Mineral & Beeswax Treatment
                  </h4>
                  <p className="text-xs text-[#5E5B55] font-light leading-relaxed">
                    Finished without synthetic polyurethane or solvent sprays. The beeswax barrier preserves the metal naturally while emitting no volatile fumes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Macro Detail Imagery (6 cols) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="overflow-hidden border border-[#E8E6E1] shadow-sm">
                <img
                  src="/images/products/detail-chisel.jpg"
                  alt="Macro chiseled texture of black metal"
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="p-3 bg-white text-[0.6875rem] text-[#928F89] text-center border-t border-[#E8E6E1]">
                  Hand-Chiseled Texture
                </div>
              </div>

              <div className="overflow-hidden border border-[#E8E6E1] shadow-sm mt-8">
                <img
                  src="/images/products/detail-jaali.jpg"
                  alt="Macro perforated jaali cutwork"
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="p-3 bg-white text-[0.6875rem] text-[#928F89] text-center border-t border-[#E8E6E1]">
                  Perforated Jaali Lattice
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. CRAFTSMANSHIP GALLERY ─────────────────────────── */}
      <section className="section-padding bg-[#FAF8F5] border-b border-[#E8E6E1]" aria-label="Craft Gallery">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#7C5A2A] font-medium block mb-2">
              Visual Chronicles
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1A1916] font-light tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Substance of the Handmade
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative overflow-hidden border border-[#E8E6E1] bg-white">
              <img
                src="/images/products/nataraja.jpg"
                alt="Nataraja Cosmic Dance metal sculpture"
                className="w-full h-72 sm:h-80 object-cover object-center"
              />
              <div className="p-4 text-center">
                <h4 className="font-serif text-base text-[#1A1916] font-medium">Devotional Castings</h4>
                <p className="text-xs text-[#928F89] font-light mt-1">Reverent iconography in solid metal</p>
              </div>
            </div>

            <div className="relative overflow-hidden border border-[#E8E6E1] bg-white">
              <img
                src="/images/products/wall-mandala.jpg"
                alt="Mandala metal wall hanging"
                className="w-full h-72 sm:h-80 object-cover object-center"
              />
              <div className="p-4 text-center">
                <h4 className="font-serif text-base text-[#1A1916] font-medium">Architectural Jaali</h4>
                <p className="text-xs text-[#928F89] font-light mt-1">Pierced panels that sculpt room shadows</p>
              </div>
            </div>

            <div className="relative overflow-hidden border border-[#E8E6E1] bg-white">
              <img
                src="/images/products/urli.jpg"
                alt="Hammered urli with brass trim"
                className="w-full h-72 sm:h-80 object-cover object-center"
              />
              <div className="p-4 text-center">
                <h4 className="font-serif text-base text-[#1A1916] font-medium">Chased & Hammered Vessels</h4>
                <p className="text-xs text-[#928F89] font-light mt-1">Tactile accents for living spaces</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CONCLUDING CTA ────────────────────────────────── */}
      <section className="section-padding bg-[#1A1916] text-[#FDFCF9]" aria-label="Explore Collection CTA">
        <div className="container-site text-center max-w-2xl mx-auto">
          <span className="text-[0.6875rem] uppercase tracking-[0.24em] text-[#D4AF6A] font-medium block mb-3">
            Experience the Repertoire
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Explore the Finished Creations.
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BF] font-light leading-relaxed mb-10">
            From iconic dancing Shiva sculptures to delicate jaali pendant lampshades, discover pieces designed to bring heritage into your everyday spaces.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="btn btn-light px-8 py-3.5 text-xs uppercase tracking-[0.14em] font-medium bg-[#FDFCF9] text-[#1A1916] hover:bg-[#D4AF6A] hover:text-black transition-all"
            >
              Explore Collection
            </Link>
            <Link
              to="/contact"
              className="btn btn-secondary px-8 py-3.5 text-xs uppercase tracking-[0.14em] font-medium text-white border-white/30 hover:border-white hover:bg-white/10"
            >
              Custom Commissions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
