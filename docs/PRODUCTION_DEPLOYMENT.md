# TAMRAH — Production Deployment & Readiness Guide

This document outlines the step-by-step procedures, infrastructure architecture, environment configurations, and security practices required to take **TAMRAH — Handcrafted Black-Metal Home Décor & Sacred Idols** into a production public launch.

> **IMPORTANT**: In accordance with user policy, this document provides complete instructions without deploying the site, changing DNS records, or exposing the admin dashboard publicly without administrator approval.

---

## 1. Hosting Architecture & Provider Selection

TAMRAH is built with React 19, TypeScript, Tailwind CSS, and Vite, featuring route-level code-splitting and client-side routing. It is optimized for zero-cold-start Edge static delivery with an API connection to Supabase PostgreSQL.

### Recommended Providers:
1. **Cloudflare Pages / Vercel / Netlify**:
   - Native support for single-page applications (SPA) with automatic static asset caching at edge points of presence across India (Mumbai, Chennai, Bangalore, Hyderabad, Delhi).
   - Global CDN with automatic HTTP/3, Brotli/Gzip compression, and free managed SSL/TLS certificates.

### Build & Deploy Configuration:
- **Build Command**: `npm run build` (runs `tsc -b && vite build`)
- **Output Directory**: `dist`
- **Node.js Version**: `20.x` or higher
- **SPA Rewrites**:
  - Cloudflare Pages: Handled automatically or via `_routes.json` / `_headers`.
  - Vercel: Include `vercel.json`:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
  - Netlify: Include `public/_redirects`:
    ```
    /*    /index.html   200
    ```

---

## 2. Environment Variables Configuration

Configure the following environment variables in your hosting provider's dashboard:

| Variable Name | Required? | Example Value | Purpose |
| :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | **Yes** | `https://xyzcompany.supabase.co` | Supabase project API gateway endpoint |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | `eyJhbGciOi...` | Public API key. Safe for browser use with RLS active |
| `VITE_SITE_URL` | Optional | `https://tamrah.in` | Canonical site origin for SEO and sitemap resolution |
| `VITE_WHATSAPP_PHONE` | Optional | `919876543210` | Business WhatsApp number for direct enquiry routing |
| `VITE_CONTACT_EMAIL` | Optional | `enquiries@tamrah.in` | Formal communications email for bulk orders |

> ⚠️ **CRITICAL SECURITY RULE**: Never set `SUPABASE_SERVICE_ROLE_KEY` or database passwords in client environment variables. The frontend bundle only requires the public `anon` key.

---

## 3. Custom Domain & HTTPS Setup (`tamrah.in`)

1. **DNS Provider Configuration**:
   - **Apex Domain (`tamrah.in`)**:
     - `A` records pointing to your provider's IP addresses, or `ALIAS`/`ANAME` record pointing to the provider's edge host.
   - **Subdomain (`www.tamrah.in`)**:
     - `CNAME` record pointing to `tamrah.in` or provider's project URL.
2. **HTTPS & TLS Encryption**:
   - Modern TLS 1.3 / 1.2 strict configuration.
   - Enforce automatic HTTP-to-HTTPS redirect.
   - HSTS (HTTP Strict Transport Security) enabled with `max-age=31536000; includeSubDomains; preload`.

---

## 4. Supabase Production Hardening Checklist

Before connecting the production database:

1. **Run All Migrations in Sequence**:
   - `supabase/migrations/20261031000001_initial_schema.sql` (Tables, Foreign Keys, Indexes, Constraints)
   - `supabase/migrations/20261031000002_rls_policies.sql` (Row Level Security policies, Admin checks)
   - `supabase/migrations/20261031000003_seed_data.sql` (Initial catalogue & category taxonomy)
   - `supabase/migrations/20261031000004_seo_columns.sql` (`seo_title`, `seo_description`)
2. **Verify Row Level Security (RLS)**:
   - Ensure RLS is enabled on all tables: `products`, `categories`, `product_specifications`, `product_images`, `product_variants`, `product_tags`, `admin_profiles`.
   - Confirm public users can ONLY `SELECT` records where `is_published = TRUE`.
   - Confirm `INSERT`, `UPDATE`, and `DELETE` queries are strictly rejected for unauthenticated or non-admin requests.
3. **Database Connection Pooling**:
   - Utilize Supavisor connection pooler on port 6543 for high concurrent traffic (1,000+ simultaneous connections).
4. **Automated Daily Backups & Point-in-Time Recovery (PITR)**:
   - Enable Supabase Automated Daily Backups in Project Settings -> Database -> Backups.
   - For mission-critical catalogues, enable Point-in-Time Recovery (PITR) with a 7-day or 14-day continuous physical backup window.
5. **Storage Bucket Policies**:
   - Create bucket `product-images` with public read access for served images, but authenticated upload access restricted to active administrators.

---

## 5. Security & Administrative Access Controls

1. **Route Protection**:
   - Administrative catalogue routes (`/admin`, `/admin/catalogue`, `/admin/import`, `/admin/export`) are guarded by session authentication.
   - Administrators must authenticate with their administrative credentials.
   - Public robots are instructed via `/robots.txt` and `noindex, nofollow` meta tags not to index any administrative pages.
2. **Safe Updates Policy**:
   - Bulk CSV product imports require explicit confirmation to update existing SKUs, preventing accidental catalogue overwrites.
3. **Audit Logging**:
   - Every catalogue import operation is timestamped and recorded in local storage and database audit history.

---

## 6. Performance & CDN Optimizations

1. **Bundle Code-Splitting**:
   - Each route is dynamically loaded via `React.lazy()` and `Suspense`, keeping initial download sizes under 30 kB gzip per page.
   - Vendor libraries are separated into `vendor-react`, `vendor-icons`, and `vendor-supabase` chunks.
2. **Font Loading**:
   - Google Fonts are preconnected in `<head>` with `display=swap`.
3. **Image Optimization**:
   - LCP Hero image uses `fetchpriority="high"` and `<link rel="preload">`.
   - Product grid images and thumbnails use native `loading="lazy"` and `decoding="async"`.
4. **Client-Side Caching**:
   - Static assets in `dist/assets/` have content hashes and can be safely cached with `Cache-Control: public, max-age=31536000, immutable`.

---

## 7. Error Monitoring & Telemetry Recommendations

1. **Frontend Error Logging**:
   - Integrate Sentry (`@sentry/react`) for real-time JavaScript exception capture, sourcemap tracking, and unhandled promise rejection monitoring.
2. **Privacy-Respecting Analytics**:
   - PostHog or Plausible for privacy-compliant traffic insights without third-party tracking cookies.
3. **Uptime Monitoring**:
   - BetterStack or UptimeRobot monitoring `https://tamrah.in/` with 1-minute HTTP health checks and WhatsApp / SMS alert integrations.
