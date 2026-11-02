import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The requested page does not exist." noIndex={true} />
      <div
        className="flex flex-col items-center justify-center text-center section-padding-lg"
        style={{ minHeight: '60vh' }}
      >
        <p
          className="font-serif mb-4"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '6rem',
            fontWeight: 300,
            lineHeight: 1,
            color: 'var(--color-charcoal-10)',
          }}
        >
          404
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 300,
            color: 'var(--color-charcoal)',
            marginBottom: '1rem',
          }}
        >
          This page does not exist.
        </h1>
        <p className="text-body mb-8" style={{ color: 'var(--color-charcoal-60)', maxWidth: '360px' }}>
          The page you are looking for may have been moved or may never have existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/collections" className="btn btn-secondary">Browse Collections</Link>
        </div>
      </div>
    </>
  );
}
