'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createBus(data: Record<string, any>) {
  try {
    const supabase = createAdminClient();

    const { data: newBus, error } = await supabase
      .from('buses')
      .insert({
        bus_number: data.bus_number,
        plate_number: data.plate_number || null,
        capacity: parseInt(data.capacity, 10) || 40,
        transport_area_id: data.transport_area_id,
        driver_name: data.driver_name || null,
        driver_name_ar: data.driver_name_ar || null,
        driver_father_name: data.driver_father_name || null,
        driver_father_name_ar: data.driver_father_name_ar || null,
        driver_grandfather_name: data.driver_grandfather_name || null,
        driver_grandfather_name_ar: data.driver_grandfather_name_ar || null,
        driver_family_name: data.driver_family_name || null,
        driver_family_name_ar: data.driver_family_name_ar || null,
        driver_phone: data.driver_phone || null,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath('/[locale]/transport', 'page');
    revalidateTag('transport');

    return { success: true, busId: newBus.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create bus' };
  }
}

export async function updateBus(busId: string, data: Record<string, any>) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('buses')
      .update({
        bus_number: data.bus_number,
        plate_number: data.plate_number || null,
        capacity: parseInt(data.capacity, 10) || 40,
        transport_area_id: data.transport_area_id,
        driver_name: data.driver_name || null,
        driver_name_ar: data.driver_name_ar || null,
        driver_father_name: data.driver_father_name || null,
        driver_father_name_ar: data.driver_father_name_ar || null,
        driver_grandfather_name: data.driver_grandfather_name || null,
        driver_grandfather_name_ar: data.driver_grandfather_name_ar || null,
        driver_family_name: data.driver_family_name || null,
        driver_family_name_ar: data.driver_family_name_ar || null,
        driver_phone: data.driver_phone || null,
        is_active: data.is_active ?? true,
      })
      .eq('id', busId);

    if (error) throw error;

    revalidatePath(`/[locale]/transport/buses/${busId}`, 'page');
    revalidatePath('/[locale]/transport', 'page');
    revalidateTag('transport');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update bus' };
  }
}

export async function deleteBus(busId: string) {
  try {
    const supabase = createAdminClient();

    const { data: bus } = await supabase
      .from('buses')
      .select('id')
      .eq('id', busId)
      .single();

    if (!bus) return { success: false, error: 'Bus not found' };

    const { error } = await supabase
      .from('buses')
      .delete()
      .eq('id', busId);

    if (error) throw error;

    revalidatePath('/[locale]/transport', 'page');
    revalidateTag('transport');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete bus' };
  }
}
