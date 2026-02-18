'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function createRoom(data: Record<string, any>) {
  try {
    const supabase = createAdminClient();

    const { data: newRoom, error } = await supabase
      .from('facilities')
      .insert({
        name: data.name,
        name_ar: data.name_ar,
        code: data.code.toUpperCase(),
        type: data.type,
        capacity: data.capacity ? parseInt(data.capacity, 10) : null,
        is_shared: data.is_shared === true || data.is_shared === 'true',
        is_active: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    // Assign the selected class to this new room (if any)
    if (data.facility_class_id) {
      await supabase
        .from('classes')
        .update({ facility_id: newRoom.id })
        .eq('id', data.facility_class_id);
    }

    revalidatePath('/[locale]/rooms', 'page');
    revalidateTag('facilities');
    revalidateTag('rooms-with-assignments');
    revalidateTag('classes');

    return { success: true, roomId: newRoom.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create room' };
  }
}

export async function updateRoom(id: string, data: Record<string, any>) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('facilities')
      .update({
        name: data.name,
        name_ar: data.name_ar,
        code: data.code.toUpperCase(),
        type: data.type,
        capacity: data.capacity ? parseInt(data.capacity, 10) : null,
        is_shared: data.is_shared === true || data.is_shared === 'true',
        is_active: data.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    // Handle class assignment: unassign any class currently pointing to this room,
    // then assign the newly selected class (if any)
    const newClassId = data.facility_class_id || null;

    // Clear facility_id for classes currently assigned to this room
    await supabase
      .from('classes')
      .update({ facility_id: null })
      .eq('facility_id', id);

    // Assign the selected class to this room
    if (newClassId) {
      await supabase
        .from('classes')
        .update({ facility_id: id })
        .eq('id', newClassId);
    }

    revalidatePath('/[locale]/rooms', 'page');
    revalidateTag('facilities');
    revalidateTag('rooms-with-assignments');
    revalidateTag('classes');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update room' };
  }
}

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
