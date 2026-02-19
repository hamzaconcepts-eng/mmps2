'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';

// ─────────────────────────────────────────────────────────────────────────────
// Period settings CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function getPeriodSettings() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('period_settings')
    .select('*')
    .order('slot_number');
  if (error) throw error;
  return data || [];
}

export async function upsertPeriodSettings(
  slots: Array<{
    id?: string;
    slot_number: number;
    slot_type: 'period' | 'break' | 'prayer';
    label: string;
    label_ar: string;
    start_time: string;
    end_time: string;
  }>
) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('period_settings')
      .upsert(slots, { onConflict: 'slot_number' });
    if (error) throw error;
    revalidateTag('period-settings');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-generate timetable for all classes
// Algorithm:
//   For each class → for each class_subject → distribute its periods_per_week
//   across days (Sun–Thu), picking empty slots, avoiding teacher conflicts.
// ─────────────────────────────────────────────────────────────────────────────

export async function generateTimetable(academicYear: string = '2025-2026') {
  try {
    const supabase = createAdminClient();

    // 1. Fetch all period slots (only teaching periods, ordered)
    const { data: periodSettings } = await supabase
      .from('period_settings')
      .select('*')
      .eq('slot_type', 'period')
      .eq('is_active', true)
      .order('slot_number');

    if (!periodSettings || periodSettings.length === 0) {
      return { success: false, error: 'No period settings found. Please configure periods first.' };
    }

    // Map slot_number → period index (1-based)
    // We only care about "period" type slots for grid placement
    // period_number = index in periodSettings array (1-indexed)
    const periods = periodSettings.map((ps, idx) => ({
      period_number: idx + 1,
      setting_id: ps.id,
      start_time: ps.start_time,
      end_time: ps.end_time,
    }));
    const DAYS = [0, 1, 2, 3, 4]; // Sun=0 … Thu=4
    const NUM_PERIODS = periods.length;

    // 2. Fetch all classes
    const { data: classes } = await supabase
      .from('classes')
      .select('id, name, grade_level')
      .eq('academic_year', academicYear)
      .eq('is_active', true);

    if (!classes || classes.length === 0) {
      return { success: false, error: 'No active classes found for the academic year.' };
    }

    // 3. Fetch all class_subjects (with teacher_id and periods_per_week)
    const { data: classSubjects } = await supabase
      .from('class_subjects')
      .select('id, class_id, teacher_id, periods_per_week, subjects(name, code)')
      .in('class_id', classes.map((c) => c.id));

    if (!classSubjects || classSubjects.length === 0) {
      return { success: false, error: 'No subject assignments found. Please assign subjects to classes first.' };
    }

    // 4. Clear existing timetable slots for this academic year
    await supabase
      .from('timetable_slots')
      .delete()
      .eq('academic_year', academicYear);

    // 5. Build schedule
    // slots[classId][day][period] = class_subject_id | null
    const classSlots: Record<string, Record<number, Record<number, string | null>>> = {};
    // teacherSlots[teacherId][day][period] = true (busy)
    const teacherSlots: Record<string, Record<number, Record<number, boolean>>> = {};

    for (const cls of classes) {
      classSlots[cls.id] = {};
      for (const day of DAYS) {
        classSlots[cls.id][day] = {};
        for (let p = 1; p <= NUM_PERIODS; p++) {
          classSlots[cls.id][day][p] = null;
        }
      }
    }

    // Shuffle for variety between re-generates
    const shuffled = [...classSubjects].sort(() => Math.random() - 0.5);

    const toInsert: Array<{
      class_subject_id: string;
      day_of_week: number;
      period: number;
      start_time: string;
      end_time: string;
      period_setting_id: string;
      academic_year: string;
    }> = [];

    for (const cs of shuffled) {
      let remaining = cs.periods_per_week;
      const teacherId = cs.teacher_id;

      // Try to spread periods across different days
      // Attempt up to remaining*5 iterations to find free slots
      let attempts = 0;
      const maxAttempts = remaining * NUM_PERIODS * DAYS.length;

      while (remaining > 0 && attempts < maxAttempts) {
        attempts++;
        const day = DAYS[Math.floor(Math.random() * DAYS.length)];
        const periodIdx = Math.floor(Math.random() * NUM_PERIODS);
        const p = periodIdx + 1;

        // Check class slot free
        if (classSlots[cs.class_id]?.[day]?.[p] !== null) continue;

        // Check teacher not busy
        if (teacherId) {
          if (!teacherSlots[teacherId]) {
            teacherSlots[teacherId] = {};
            for (const d of DAYS) teacherSlots[teacherId][d] = {};
          }
          if (teacherSlots[teacherId][day]?.[p]) continue;
        }

        // Assign
        classSlots[cs.class_id][day][p] = cs.id;
        if (teacherId) {
          teacherSlots[teacherId][day][p] = true;
        }

        const periodInfo = periods[periodIdx];
        toInsert.push({
          class_subject_id: cs.id,
          day_of_week: day,
          period: p,
          start_time: periodInfo.start_time,
          end_time: periodInfo.end_time,
          period_setting_id: periodInfo.setting_id,
          academic_year: academicYear,
        });

        remaining--;
      }
    }

    // 6. Bulk insert
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('timetable_slots')
        .insert(toInsert);
      if (insertError) throw insertError;
    }

    revalidateTag('timetable');
    revalidatePath('/[locale]/timetable', 'page');

    return {
      success: true,
      slotsCreated: toInsert.length,
      classesScheduled: classes.length,
    };
  } catch (e: any) {
    return { success: false, error: e.message || 'Generation failed' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch timetable for a class (used in all detail pages)
// ─────────────────────────────────────────────────────────────────────────────

export async function getClassTimetable(classId: string, academicYear: string = '2025-2026') {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('timetable_slots')
    .select(`
      id, day_of_week, period, start_time, end_time, academic_year,
      class_subjects (
        id, periods_per_week,
        subjects ( id, name, name_ar, code ),
        teachers ( id, first_name, first_name_ar, father_name, father_name_ar,
                   grandfather_name, grandfather_name_ar,
                   family_name, family_name_ar, last_name, last_name_ar, gender )
      )
    `)
    .eq('class_subjects.class_id', classId)
    .eq('academic_year', academicYear)
    .order('day_of_week')
    .order('period');

  if (error) throw error;
  return data || [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch timetable for a teacher
// ─────────────────────────────────────────────────────────────────────────────

export async function getTeacherTimetable(teacherId: string, academicYear: string = '2025-2026') {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('timetable_slots')
    .select(`
      id, day_of_week, period, start_time, end_time, academic_year,
      class_subjects (
        id, periods_per_week, teacher_id,
        subjects ( id, name, name_ar, code ),
        classes ( id, name, name_ar, grade_level, section )
      )
    `)
    .eq('class_subjects.teacher_id', teacherId)
    .eq('academic_year', academicYear)
    .order('day_of_week')
    .order('period');

  if (error) throw error;
  return data || [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch timetable for a room (facility)
// ─────────────────────────────────────────────────────────────────────────────

export async function getRoomTimetable(facilityId: string, academicYear: string = '2025-2026') {
  const supabase = createAdminClient();
  // Room timetable: join through class_subjects → classes with this facility
  const { data, error } = await supabase
    .from('timetable_slots')
    .select(`
      id, day_of_week, period, start_time, end_time, academic_year,
      class_subjects (
        id, periods_per_week,
        subjects ( id, name, name_ar, code ),
        classes ( id, name, name_ar, grade_level, section, facility_id )
      )
    `)
    .eq('class_subjects.classes.facility_id', facilityId)
    .eq('academic_year', academicYear)
    .order('day_of_week')
    .order('period');

  if (error) throw error;
  return data || [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Clear all timetable slots for a given academic year
// ─────────────────────────────────────────────────────────────────────────────

export async function clearTimetable(academicYear: string = '2025-2026') {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('timetable_slots')
      .delete()
      .eq('academic_year', academicYear);
    if (error) throw error;
    revalidateTag('timetable');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
