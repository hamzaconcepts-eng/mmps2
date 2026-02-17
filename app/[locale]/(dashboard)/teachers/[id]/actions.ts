'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Delete a teacher.
 */
export async function deleteTeacher(teacherId: string) {
  try {
    const supabase = createAdminClient();

    const { data: teacher } = await supabase
      .from('teachers')
      .select('id')
      .eq('id', teacherId)
      .single();

    if (!teacher) {
      return { success: false, error: 'Teacher not found' };
    }

    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', teacherId);

    if (error) throw error;

    revalidatePath('/[locale]/teachers', 'page');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete teacher',
    };
  }
}

/**
 * Update a teacher record.
 */
export async function updateTeacher(
  teacherId: string,
  data: Record<string, any>
) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('teachers')
      .update({
        first_name: data.first_name,
        first_name_ar: data.first_name_ar,
        last_name: data.last_name,
        last_name_ar: data.last_name_ar,
        gender: data.gender,
        phone: data.phone || null,
        email: data.email || null,
        specialization: data.specialization || null,
        specialization_ar: data.specialization_ar || null,
        qualifications: data.qualifications || null,
        hire_date: data.hire_date,
        national_id: data.national_id || null,
        is_active: data.is_active ?? true,
      })
      .eq('id', teacherId);

    if (error) throw error;

    revalidatePath(`/[locale]/teachers/${teacherId}`, 'page');
    revalidatePath('/[locale]/teachers', 'page');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update teacher',
    };
  }
}
