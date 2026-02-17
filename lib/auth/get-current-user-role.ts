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
    } = await supabase.auth.getUser();
    if (!user) return null;

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) return null;
    return { userId: user.id, role: profile.role as UserRole };
  } catch {
    return null;
  }
}

/** Check if a role is owner or admin (school principal). */
export function isAdminOrOwner(role: UserRole): boolean {
  return role === 'owner' || role === 'admin';
}
