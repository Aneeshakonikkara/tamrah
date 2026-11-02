interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean; // for dark backgrounds
  className?: string;
  id?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  light = false,
  className = '',
  id,
}: SectionHeaderProps) {
  const textColor = light ? '#fff' : 'var(--color-charcoal)';
  const eyebrowColor = light ? 'rgba(255,255,255,0.45)' : 'var(--color-charcoal-40)';
  const subtitleColor = light ? 'rgba(255,255,255,0.55)' : 'var(--color-charcoal-60)';

  return (
    <div
      className={`${align === 'center' ? 'text-center mx-auto' : ''} ${className}`}
      style={{ maxWidth: align === 'center' ? '640px' : undefined }}
    >
      {eyebrow && (
        <p
          className="text-label mb-4"
          style={{ color: eyebrowColor, letterSpacing: '0.14em' }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="text-heading-xl"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.875rem, 3.5vw, 3rem)',
          fontWeight: 300,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          color: textColor,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-body mt-4"
          style={{ color: subtitleColor, maxWidth: '520px', lineHeight: 1.7 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
