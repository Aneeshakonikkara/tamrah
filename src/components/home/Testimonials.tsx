import { Quote, Info } from 'lucide-react';

const sampleTestimonials = [
  {
    quote:
      "The weight and solemnity of the Nataraja sculpture exceeded all expectations. In our contemporary Bangalore apartment, it brings a commanding sense of heritage without feeling ornamental.",
    client: "[Interior Architect, Bengaluru]",
    piece: "Patron of Nataraja Sculpture",
    tag: "Architectural Living Space",
  },
  {
    quote:
      "Finding metal wall panels that preserve authentic Andhra jaali cutwork without looking mass-produced is exceedingly rare. The cast texture catches warm ambient lampshade light with stunning subtlety.",
    client: "[Private Homeowner, Hyderabad]",
    piece: "Patron of Mandala Wall Panel",
    tag: "Heritage Wall Installation",
  },
  {
    quote:
      "We selected several pieces for our boutique hospitality retreat. The tactile finish, heavy solid alloy feel, and thoughtful packaging made every unboxing a memorable experience.",
    client: "[Design Director, Kochi]",
    piece: "Patron of Jali Lighting & Sculptures",
    tag: "Hospitality Commission",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-padding bg-[#F8F6F1] border-b border-[#E8E6E1]"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-site">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-[0.6875rem] uppercase tracking-[0.22em] text-[#7C5A2A] font-medium mb-3">
            Client Perspectives
          </p>
          <h2
            id="testimonials-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1916] tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Spaces Transformed by Metal
          </h2>

          {/* Explicit Note marked for replacement as requested */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E8E6E1]/70 border border-[#C8C5BF]/60 text-[0.6875rem] text-[#5E5B55] mt-2">
            <Info size={13} className="text-[#7C5A2A]" />
            <span>Sample Testimonials — Placeholder for Authenticated Patron Quotes</span>
          </div>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {sampleTestimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-7 sm:p-9 border border-[#E8E6E1] flex flex-col justify-between relative shadow-xs"
            >
              <div className="text-[#B8943F]/60 mb-6">
                <Quote size={28} />
              </div>

              <blockquote className="font-serif text-base sm:text-lg text-[#1A1916] font-normal leading-relaxed mb-6 italic">
                "{item.quote}"
              </blockquote>

              <div className="pt-5 border-t border-[#E8E6E1]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#1A1916] tracking-wide">
                    {item.client}
                  </span>
                  <span className="text-[0.625rem] tracking-[0.14em] uppercase text-[#7C5A2A] bg-[#F8F6F1] px-2 py-0.5">
                    {item.tag}
                  </span>
                </div>
                <p className="text-[0.6875rem] text-[#928F89]">{item.piece}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
