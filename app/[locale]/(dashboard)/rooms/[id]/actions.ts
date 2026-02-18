'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function deleteRoom(id: string) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('facilities')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/[locale]/rooms', 'page');
    revalidateTag('facilities');
    revalidateTag('rooms-with-assignments');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete room' };
  }
}
