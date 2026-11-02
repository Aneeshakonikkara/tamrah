import { Link } from 'react-router-dom';

export default function GiftingBand() {
  return (
    <section
      className="relative overflow-hidden section-padding"
      style={{ backgroundColor: 'var(--color-charcoal)' }}
      aria-label="Gifting and corporate orders"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C8A96B' stroke-width='0.5'%3E%3Cpolygon points='30,5 55,20 55,40 30,55 5,40 5,20'/%3E%3Ccircle cx='30' cy='30' r='12'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-narrow text-center">
        <p
          className="text-label mb-5"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.16em' }}
        >
          Premium Gifting
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            fontWeight: 300,
            lineHeight: 1.2,
            color: '#fff',
            marginBottom: '1.25rem',
            letterSpacing: '-0.01em',
          }}
        >
          A TAMRAH piece makes a gift<br />
          <em style={{ fontStyle: 'italic', color: 'var(--color-gold-light)' }}>
            that is never forgotten.
          </em>
        </h2>
        <p
          className="text-body mx-auto mb-10"
          style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '480px' }}
        >
          From corporate gifting programmes to wedding favours and personal commissions, we craft bespoke packages that carry the weight of genuine artisanal intent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/gifting" className="btn btn-light">
            Gifting Collections
          </Link>
          <Link to="/corporate" className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Corporate Orders →
          </Link>
        </div>
      </div>
    </section>
  );
}
