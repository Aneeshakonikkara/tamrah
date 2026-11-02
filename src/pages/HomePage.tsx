import Hero from '../components/home/Hero';
import ShopByCategory from '../components/home/ShopByCategory';
import FeaturedCollection from '../components/home/FeaturedCollection';
import BrandStory from '../components/home/BrandStory';
import BestsellersShowcase from '../components/home/BestsellersShowcase';
import BrandValues from '../components/home/BrandValues';
import Testimonials from '../components/home/Testimonials';
import SEO from '../components/common/SEO';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Handcrafted Black-Metal Home Décor & Sacred Idols from Andhra Pradesh"
        description="Discover heirloom handcrafted black-metal sculptures, sacred Hindu idols, jaali wall décor, and filigree lamps forged using ancient Andhra Pradesh moulding traditions."
        canonicalUrl="https://tamrah.in/"
        ogType="website"
      />

      {/* ── 3. HERO SECTION ───────────────────────────────── */}
      <Hero />

      {/* ── 4. SHOP BY CATEGORY ───────────────────────────── */}
      <ShopByCategory />

      {/* ── 5. FEATURED COLLECTION ────────────────────────── */}
      <FeaturedCollection />

      {/* ── 6. BRAND STORY ────────────────────────────────── */}
      <BrandStory />

      {/* ── 7. FEATURED PRODUCTS / BESTSELLERS ────────────── */}
      <BestsellersShowcase />

      {/* ── 8. BRAND VALUES ───────────────────────────────── */}
      <BrandValues />

      {/* ── 9. TESTIMONIALS ───────────────────────────────── */}
      <Testimonials />
    </>
  );
}
