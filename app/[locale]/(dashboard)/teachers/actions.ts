'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Create a new teacher with auto-generated employee_id.
 */
export async function createTeacher(data: {
  teacher: Record<string, any>;
}) {
  try {
    const supabase = createAdminClient();
    const t = data.teacher;

    // Auto-generate employee_id (4-digit, zero-padded)
    const { data: lastTeacher } = await supabase
      .from('teachers')
      .select('employee_id')
      .order('employee_id', { ascending: false })
      .limit(1)
      .single();

    const lastNum = lastTeacher ? parseInt(lastTeacher.employee_id, 10) : 0;
    const nextId = String(lastNum + 1).padStart(4, '0');

    const { data: newTeacher, error } = await supabase
      .from('teachers')
      .insert({
        employee_id: nextId,
        first_name: t.first_name,
        first_name_ar: t.first_name_ar,
        last_name: t.last_name,
        last_name_ar: t.last_name_ar,
        gender: t.gender,
        phone: t.phone || null,
        email: t.email || null,
        specialization: t.specialization || null,
        specialization_ar: t.specialization_ar || null,
        qualifications: t.qualifications || null,
        hire_date: t.hire_date,
        national_id: t.national_id || null,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath('/[locale]/teachers', 'page');

    return { success: true, teacherId: newTeacher.id };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create teacher',
    };
  }
}
