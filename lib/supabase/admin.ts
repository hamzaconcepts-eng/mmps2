import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with the service role key.
 * This bypasses Row Level Security — use only in server-side code
 * for admin/owner operations where RLS would block queries.
 *
 * Note: Untyped client — our Database types lack the `Relationships`
 * arrays required by supabase-js v2.95+. We'll regenerate types with
 * `supabase gen types` once the schema stabilises. All queries already
 * use `any` casts for complex joins so runtime safety is unchanged.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
