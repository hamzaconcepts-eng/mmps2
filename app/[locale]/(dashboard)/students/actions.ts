'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUserRole, isAdminOrOwner } from '@/lib/auth/get-current-user-role';
import { revalidatePath } from 'next/cache';

/**
 * Create a new student with auto-generated student_id (4-digit zero-padded).
 * Only owner and admin roles are authorized.
 */
export async function createStudent(data: Record<string, any>) {
  try {
    const currentUser = await getCurrentUserRole();
    if (!currentUser || !isAdminOrOwner(currentUser.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const supabase = createAdminClient();

    // Generate next student_id: find the highest existing, increment by 1
    const { data: lastStudent } = await supabase
      .from('students')
      .select('student_id')
      .order('student_id', { ascending: false })
      .limit(1);

    const lastId = lastStudent?.[0]?.student_id
      ? parseInt(lastStudent[0].student_id, 10)
      : 0;
    const nextId = String(lastId + 1).padStart(4, '0');

    const { data: newStudent, error } = await supabase
      .from('students')
      .insert({
        student_id: nextId,
        first_name: data.first_name,
        first_name_ar: data.first_name_ar,
        father_name: data.father_name,
        father_name_ar: data.father_name_ar,
        grandfather_name: data.grandfather_name,
        grandfather_name_ar: data.grandfather_name_ar,
        family_name: data.family_name,
        family_name_ar: data.family_name_ar,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        nationality: data.nationality || null,
        national_id: data.national_id || null,
        class_id: data.class_id || null,
        enrollment_date: data.enrollment_date,
        is_active: data.is_active ?? true,
        gps_location: data.gps_location || null,
        medical_notes: data.medical_notes || null,
      })
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath('/[locale]/students', 'page');

    return { success: true, studentId: newStudent.id };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create student',
    };
  }
}
