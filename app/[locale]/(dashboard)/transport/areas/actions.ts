'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createArea(data: Record<string, any>) {
  try {
    const supabase = createAdminClient();

    const { data: newArea, error } = await supabase
      .from('transport_areas')
      .insert({
        name: data.name,
        name_ar: data.name_ar,
        annual_fee: parseFloat(data.annual_fee) || 0,
        academic_year: '2025-2026',
        is_active: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath('/[locale]/transport', 'page');
    revalidateTag('transport');

    return { success: true, areaId: newArea.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create area' };
  }
}

export async function updateArea(areaId: string, data: Record<string, any>) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('transport_areas')
      .update({
        name: data.name,
        name_ar: data.name_ar,
        annual_fee: parseFloat(data.annual_fee) || 0,
        is_active: data.is_active ?? true,
      })
      .eq('id', areaId);

    if (error) throw error;

    revalidatePath(`/[locale]/transport/areas/${areaId}`, 'page');
    revalidatePath('/[locale]/transport', 'page');
    revalidateTag('transport');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update area' };
  }
}

export async function deleteArea(areaId: string) {
  try {
    const supabase = createAdminClient();

    const { data: area } = await supabase
      .from('transport_areas')
      .select('id')
      .eq('id', areaId)
      .single();

    if (!area) return { success: false, error: 'Area not found' };

    const { error } = await supabase
      .from('transport_areas')
      .delete()
      .eq('id', areaId);

    if (error) throw error;

    revalidatePath('/[locale]/transport', 'page');
    revalidateTag('transport');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete area' };
  }
}
