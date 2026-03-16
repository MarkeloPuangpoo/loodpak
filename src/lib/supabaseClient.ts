"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables:\n` +
    `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '✗ Missing'}\n` +
    `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓ Set' : '✗ Missing'}\n\n` +
    `Please check your .env.local file and ensure these variables are set correctly.`
  );
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
