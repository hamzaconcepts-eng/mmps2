import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Fallback values when Supabase is not configured
const FALLBACK_URL = 'http://localhost:54321';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Client component Supabase client (safe even without env vars)
let _supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    try {
      _supabase = createClientComponentClient();
    } catch {
      // Fallback when env vars are missing
      _supabase = createClient(supabaseUrl, supabaseKey);
    }
  }
  return _supabase;
}

// Legacy export — lazy so it won't crash on import
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Browser client with explicit configuration
export const supabaseBrowser = createClient(supabaseUrl, supabaseKey);
