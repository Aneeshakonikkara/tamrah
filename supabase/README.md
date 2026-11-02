# TAMRAH – Supabase & PostgreSQL Database Setup Guide

This guide walks you through setting up the PostgreSQL database on Supabase for the TAMRAH handcrafted metal décor catalogue website.

---

## Architecture Overview

- **Engine:** PostgreSQL 15+ (hosted on Supabase)
- **Security:** Strict Row Level Security (RLS) on all tables
- **Access Model:**
  - **Public Visitors (Anon):** Can read published products, active categories, specifications, images, variants, and tags. Zero write permissions.
  - **Administrators:** Authenticated via Supabase Auth and authorized via `admin_profiles` table. Can create, edit, publish, and delete catalogue entries.
  - **No Public Registration:** Admin accounts can only be provisioned by super-admins or through the Supabase Dashboard.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account).
2. Click **New Project**.
3. Choose an organization, select a strong database password, and select a region close to your target audience (e.g., `South Asia (Mumbai)` or `Singapore`).
4. Click **Create new project** and wait 1–2 minutes for the database to provision.

---

## Step 2: Run the SQL Migrations

Open the **SQL Editor** in your Supabase Dashboard (the terminal `>_` icon on the left sidebar).

Execute the migration scripts in sequential order:

### 1. Initial Schema Migration
- Open file: `supabase/migrations/20261031000001_initial_schema.sql`
- Copy the entire SQL content into the Supabase SQL Editor.
- Click **Run** (or `Ctrl+Enter`).
- **Creates:** `categories`, `products`, `product_specifications`, `product_images`, `product_variants`, `product_tags`, and `admin_profiles` with foreign keys, checks, indexes, and triggers.

### 2. Row Level Security (RLS) Policies Migration
- Open file: `supabase/migrations/20261031000002_rls_policies.sql`
- Copy the entire SQL content into the Supabase SQL Editor.
- Click **Run**.
- **Enables:** RLS on all 7 tables and applies public read vs authenticated admin write policies.

### 3. Catalogue Seed Data Migration
- Open file: `supabase/migrations/20261031000003_seed_data.sql`
- Copy the entire SQL content into the Supabase SQL Editor.
- Click **Run**.
- **Populates:** 5 collections, 19 handcrafted metal pieces, detailed specifications, images, and search tags.

---

## Step 3: Configure Environment Variables

1. In your Supabase Dashboard, navigate to **Project Settings** (gear icon) -> **API**.
2. Locate the following two values:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key (long JWT string)
3. In your local project root (`c:\Users\LENOVO\.gemini\antigravity-ide\scratch\tamrah\`), create a file named `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart the Vite development server so the new environment variables take effect:
   ```bash
   npm run dev
   ```

> ⚠️ **SECURITY WARNING:** NEVER put your `service_role` secret key into `.env` or any client-facing file. The `anon` key is safe because Row Level Security strictly governs what it can access.

---

## Step 4: Provision Your First Administrator Account

Because public registration is disabled for security:

1. In the Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your email (e.g. `admin@tamrah.in`) and a secure password. Check **Auto Confirm User**.
4. Copy the generated User ID (UUID).
5. Go to the **SQL Editor** and run this snippet (replace the UUID and email with your own):
   ```sql
   INSERT INTO admin_profiles (id, email, full_name, role, is_active)
   VALUES (
     'PASTE-YOUR-COPIED-USER-UUID-HERE',
     'admin@tamrah.in',
     'TAMRAH Head Curator',
     'super_admin',
     TRUE
   );
   ```

---

## Step 5: Verification

- Open `http://localhost:5173/shop` in your browser.
- Open DevTools Console.
- When live credentials are provided in `.env`, the console will no longer show the fallback notice and will pull live data directly from PostgreSQL.
