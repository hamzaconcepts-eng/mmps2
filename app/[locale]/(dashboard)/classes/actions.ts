'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

/**
 * Create a new class.
 */
export async function createClass(data: Record<string, any>) {
  try {
    const supabase = createAdminClient();

    const { data: newClass, error } = await supabase
      .from('classes')
      .insert({
        name: data.name,
        name_ar: data.name_ar,
        grade_level: data.grade_level,
        section: data.section,
        capacity: data.capacity,
        room_number: data.room_number || null,
        class_supervisor_id: data.class_supervisor_id || null,
        academic_year: '2025-2026',
        is_active: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath('/[locale]/classes', 'page');
    revalidateTag('classes');
    revalidateTag('classes-with-counts');

    return { success: true, classId: newClass.id };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create class',
    };
  }
}
