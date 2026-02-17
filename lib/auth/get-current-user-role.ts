import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type UserRole =
  | 'owner'
  | 'admin'
  | 'teacher'
  | 'class_supervisor'
  | 'student'
  | 'parent'
  | 'accountant';

/**
 * Get the current logged-in user's role from their profile.
 * Uses cookie-based auth to identify the user, then admin client
 * to fetch the profile (bypasses RLS).
 */
export async function getCurrentUserRole(): Promise<{
  userId: string;
  role: UserRole;
} | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.log('[getCurrentUserRole] auth error:', authError.message);
    }
    if (!user) {
      console.log('[getCurrentUserRole] no user found (not authenticated)');
      return null;
    }
    console.log('[getCurrentUserRole] user:', user.id);

    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('[getCurrentUserRole] profile query error:', profileError.message);
    }
    if (!profile) {
      console.log('[getCurrentUserRole] no profile found for user:', user.id);
      return null;
    }
    console.log('[getCurrentUserRole] role:', profile.role);
    return { userId: user.id, role: profile.role as UserRole };
  } catch (err: any) {
    console.log('[getCurrentUserRole] caught error:', err?.message || err);
    return null;
  }
}

/** Check if a role is owner or admin (school principal). */
export function isAdminOrOwner(role: UserRole): boolean {
  return role === 'owner' || role === 'admin';
}
