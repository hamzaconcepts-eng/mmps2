import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Singleton Supabase admin client with service role key.
 * Reused across all server requests to avoid recreating TCP/SSL
 * connections on every page load.
 *
 * Note: Untyped client — our Database types lack the `Relationships`
 * arrays required by supabase-js v2.95+. We'll regenerate types with
 * `supabase gen types` once the schema stabilises.
 */
let _adminClient: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  _adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _adminClient;
}
