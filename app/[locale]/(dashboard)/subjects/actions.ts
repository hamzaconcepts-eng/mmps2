'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Create a new subject.
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
