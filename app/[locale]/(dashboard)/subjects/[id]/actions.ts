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
 * Update a subject record and sync grade levels.
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

    // Sync grade_subjects: delete all existing, re-insert selected
    await supabase.from('grade_subjects').delete().eq('subject_id', subjectId);

    const grades: number[] = data.grades ?? [];
    if (grades.length > 0) {
      const gradeRows = grades.map((g) => ({
        subject_id: subjectId,
        grade_level: g,
        periods_per_week: 1,
        is_active: true,
      }));
      const { error: gradeError } = await supabase.from('grade_subjects').insert(gradeRows);
      if (gradeError) throw gradeError;
    }

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
