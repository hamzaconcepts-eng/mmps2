'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Create a new subject and assign grade levels.
 */
export async function createSubject(data: Record<string, any>) {
  try {
    const supabase = createAdminClient();

    const { data: newSubject, error } = await supabase
      .from('subjects')
      .insert({
        code: data.code,
        name: data.name,
        name_ar: data.name_ar,
        description: data.description || null,
        is_activity: data.is_activity ?? false,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    // Insert grade_subjects rows for each selected grade
    const grades: number[] = data.grades ?? [];
    if (grades.length > 0) {
      const gradeRows = grades.map((g) => ({
        subject_id: newSubject.id,
        grade_level: g,
        periods_per_week: 1,
        is_active: true,
      }));
      const { error: gradeError } = await supabase.from('grade_subjects').insert(gradeRows);
      if (gradeError) throw gradeError;
    }

    revalidatePath('/[locale]/subjects', 'page');
    revalidateTag('subjects');
    revalidateTag('subjects-with-details');

    return { success: true, subjectId: newSubject.id };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create subject',
    };
  }
}

/**
 * Update an existing subject and sync grade levels.
 */
export async function updateSubject(subjectId: string, data: Record<string, any>) {
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

    revalidatePath('/[locale]/subjects', 'page');
    revalidatePath(`/[locale]/subjects/${subjectId}`, 'page');
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
