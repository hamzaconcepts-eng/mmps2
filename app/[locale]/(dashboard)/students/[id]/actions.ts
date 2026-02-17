'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUserRole, isAdminOrOwner } from '@/lib/auth/get-current-user-role';
import { revalidatePath } from 'next/cache';

/**
 * Delete a student (cascades to guardians, transport, grades, attendance, invoices).
 * Only owner and admin roles are authorized.
 */
export async function deleteStudent(studentId: string) {
  try {
    const currentUser = await getCurrentUserRole();
    if (!currentUser || !isAdminOrOwner(currentUser.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const supabase = createAdminClient();

    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('id', studentId)
      .single();

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) throw error;

    revalidatePath('/[locale]/students', 'page');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete student',
    };
  }
}

/**
 * Update a student record.
 * Only owner and admin roles are authorized.
 */
export async function updateStudent(
  studentId: string,
  data: Record<string, any>
) {
  try {
    const currentUser = await getCurrentUserRole();
    if (!currentUser || !isAdminOrOwner(currentUser.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('students')
      .update(data)
      .eq('id', studentId);

    if (error) throw error;

    revalidatePath(`/[locale]/students/${studentId}`, 'page');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update student',
    };
  }
}
