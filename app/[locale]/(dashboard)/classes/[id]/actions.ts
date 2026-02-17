'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Delete a class.
 */
export async function deleteClass(classId: string) {
  try {
    const supabase = createAdminClient();

    const { data: cls } = await supabase
      .from('classes')
      .select('id')
      .eq('id', classId)
      .single();

    if (!cls) {
      return { success: false, error: 'Class not found' };
    }

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);

    if (error) throw error;

    revalidatePath('/[locale]/classes', 'page');
    revalidateTag('classes');
    revalidateTag('classes-with-counts');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete class',
    };
  }
}

/**
 * Update a class record.
 */
export async function updateClass(
  classId: string,
  data: Record<string, any>
) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('classes')
      .update({
        name: data.name,
        name_ar: data.name_ar,
        grade_level: data.grade_level,
        section: data.section,
        capacity: data.capacity,
        room_number: data.room_number || null,
        class_supervisor_id: data.class_supervisor_id || null,
        is_active: data.is_active ?? true,
      })
      .eq('id', classId);

    if (error) throw error;

    revalidatePath(`/[locale]/classes/${classId}`, 'page');
    revalidatePath('/[locale]/classes', 'page');
    revalidateTag('classes');
    revalidateTag('classes-with-counts');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update class',
    };
  }
}
