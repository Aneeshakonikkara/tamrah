import { ShieldCheck, Clock, Gift, Hammer } from 'lucide-react';

const values = [
  {
    icon: Hammer,
    title: 'Handcrafted Heritage',
    description:
      'Rooted in centuries-old Andhra Pradesh moulding traditions, preserving authentic sand and lost-wax casting methods passed through artisan families.',
  },
  {
    icon: Clock,
    title: 'Timeless Design',
    description:
      'Balanced forms sculpted in deep charcoal black metal, created to transcend fleeting trends and anchor both contemporary and classical interiors.',
  },
  {
    icon: Gift,
    title: 'Thoughtful Gifting',
    description:
      'Heirloom-grade creations packaged with care, designed to commemorate housewarmings, sacred celebrations, and enduring milestones.',
  },
  {
    icon: ShieldCheck,
    title: 'Made with Craftsmanship',
    description:
      'Uncompromised material weight, meticulous hand-chiseled detailing, and natural beeswax finishes that deepen in character year after year.',
  },
];

export default function BrandValues() {
  return (
    <section
      id="brand-values"
      className="section-padding bg-[#FDFCF9] border-b border-[#E8E6E1]"
      aria-labelledby="brand-values-heading"
    >
      <div className="container-site">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium mb-3">
            The Pillars of TAMRAH
          </p>
          <h2
            id="brand-values-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1916] tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Crafted with Conviction
          </h2>
        </div>

        {/* 4 Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="flex flex-col p-6 sm:p-8 bg-white border border-[#E8E6E1] hover:border-[#C8C5BF] transition-all duration-300 shadow-xs"
              >
                <div className="w-12 h-12 rounded-full bg-[#F8F6F1] flex items-center justify-center text-[#7C5A2A] mb-6">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <span className="text-[0.625rem] tracking-[0.2em] uppercase text-[#928F89] font-medium mb-2">
                  Pillar 0{idx + 1}
                </span>
                <h3
                  className="font-serif text-xl sm:text-2xl font-normal text-[#1A1916] mb-3 leading-snug"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5E5B55] font-light leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
