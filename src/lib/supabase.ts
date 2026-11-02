// ============================================================
// TAMRAH – Supabase Client Configuration
// Safe browser client using Vite environment variables
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const envProcess = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env;

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || envProcess?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || envProcess?.VITE_SUPABASE_ANON_KEY;

/**
 * Validates whether valid, non-placeholder Supabase credentials are configured.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false;
  }
  // Exclude default placeholder template strings
  if (
    supabaseUrl.includes('your-project-ref') ||
    supabaseAnonKey.includes('your-supabase-anon-key') ||
    supabaseUrl.trim() === '' ||
    supabaseAnonKey.trim() === ''
  ) {
    return false;
  }
  return true;
}

/**
 * Central Supabase Client instance.
 * Initialized with strict Database types if credentials are provided,
 * or null fallback to avoid crashing during early development.
 */
let clientInstance: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured()) {
  clientInstance = createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.info(
      '[TAMRAH DB] Supabase credentials not set or using placeholders. Frontend is operating in mock / static fallback mode. See .env.example to connect a live database.'
    );
  }
}

export const supabase = clientInstance;
