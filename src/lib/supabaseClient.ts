"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key-for-build';

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  // In production (Vercel runtime), we want to know if the URL is missing.
  // We don't throw an error here anymore to avoid build failures,
  // but we should probably log a warning if it's the actual production environment.
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL is not defined.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(
    `Invalid NEXT_PUBLIC_SUPABASE_URL: "${supabaseUrl}"\n` +
    `Must be a valid HTTP or HTTPS URL (e.g., https://your-project.supabase.co)\n` +
    `Current value is not a valid URL format.`
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
