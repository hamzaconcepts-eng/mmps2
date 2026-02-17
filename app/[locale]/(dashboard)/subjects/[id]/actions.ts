'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Delete a subject.
 */
export async function deleteSubject(subjectId: string) {
  try {
    const supabase = createAdminClient();

    const { data: subject } = await supabase
      .from('subjects')
      .select('id')
      .eq('id', subjectId)
      .single();

    if (!subject) {
      return { success: false, error: 'Subject not found' };
    }

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', subjectId);

    if (error) throw error;

    revalidatePath('/[locale]/subjects', 'page');
    revalidateTag('subjects');
    revalidateTag('subjects-with-details');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete subject',
    };
  }
}

/**
 * Update a subject record.
 */
export async function updateSubject(
  subjectId: string,
  data: Record<string, any>
) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('subjects')
      .update({
        code: data.code,
        name: data.name,
        name_ar: data.name_ar,
        description: data.description || null,
        is_activity: data.is_activity ?? false,
        is_active: data.is_active ?? true,
      })
      .eq('id', subjectId);

    if (error) throw error;

    revalidatePath(`/[locale]/subjects/${subjectId}`, 'page');
    revalidatePath('/[locale]/subjects', 'page');
    revalidateTag('subjects');
    revalidateTag('subjects-with-details');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update subject',
    };
  }
}
