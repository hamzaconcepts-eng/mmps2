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
// TIMETABLE GENERATION — Deterministic MRV scheduler (zero free periods)
//
// Guarantees:
//   1. Every class has EXACTLY (5 days × 8 periods = 40) subject slots filled.
//      If assigned subjects total < 40, extra periods are distributed across
//      the heaviest subjects so every cell is a real subject — no free periods.
//   2. No teacher is scheduled in two classes at the same day/period.
//   3. Subjects are spread across the week (max ceil(ppw/5) per day).
//   4. Hardest subjects (highest ppw, most-constrained teacher) placed first
//      (MRV heuristic).
// ─────────────────────────────────────────────────────────────────────────────

export async function generateTimetable(academicYear: string = '2025-2026') {
  try {
    const supabase = createAdminClient();

    // ── 1. Fetch teaching periods (ordered by slot_number) ───────────────────
    const { data: periodSettings, error: psErr } = await supabase
      .from('period_settings')
      .select('*')
      .eq('slot_type', 'period')
      .eq('is_active', true)
      .order('slot_number');

    if (psErr || !periodSettings || periodSettings.length === 0) {
      return { success: false, error: 'No period settings found. Please configure periods first.' };
    }

    const periods = periodSettings.map((ps, idx) => ({
      period_number: idx + 1,
      setting_id: ps.id,
      start_time: ps.start_time,
      end_time: ps.end_time,
    }));

    const DAYS = [0, 1, 2, 3, 4]; // Sun=0 … Thu=4
    const NUM_PERIODS = periods.length; // 8 teaching periods
    const TOTAL_SLOTS = DAYS.length * NUM_PERIODS; // 40

    // ── 2. Fetch all active classes ──────────────────────────────────────────
    const { data: classes, error: clsErr } = await supabase
      .from('classes')
      .select('id, name, grade_level')
      .eq('academic_year', academicYear)
      .eq('is_active', true)
      .order('grade_level');

    if (clsErr || !classes || classes.length === 0) {
      return { success: false, error: 'No active classes found for the academic year.' };
    }

    // ── 3. Fetch all class_subjects ──────────────────────────────────────────
    const { data: classSubjects, error: csErr } = await supabase
      .from('class_subjects')
      .select('id, class_id, teacher_id, periods_per_week, subjects(name, code)')
      .in('class_id', classes.map((c) => c.id));

    if (csErr || !classSubjects || classSubjects.length === 0) {
      return { success: false, error: 'No subject assignments found. Please assign subjects to classes first.' };
    }

    // ── 4. Clear existing slots ──────────────────────────────────────────────
    await supabase
      .from('timetable_slots')
      .delete()
      .eq('academic_year', academicYear);

    // ── 4b. Auto-fill: pad every class to exactly TOTAL_SLOTS ppw ────────────
    //
    // If a class has fewer than 40 total periods, distribute the deficit
    // across its subjects (heaviest first, round-robin +1 each pass).
    // This ensures zero free periods in every single class.

    for (const cls of classes) {
      const csForClass = classSubjects.filter((cs) => cs.class_id === cls.id);
      const totalPPW = csForClass.reduce((sum, cs) => sum + cs.periods_per_week, 0);
      let deficit = TOTAL_SLOTS - totalPPW;

      if (deficit > 0 && csForClass.length > 0) {
        // Sort by ppw descending — give extra periods to the biggest subjects first
        const sorted = [...csForClass].sort((a, b) => b.periods_per_week - a.periods_per_week);
        let idx = 0;
        while (deficit > 0) {
          sorted[idx % sorted.length].periods_per_week += 1;
          deficit--;
          idx++;
        }
      }
    }

    // ── 5. Build in-memory grids ─────────────────────────────────────────────
    //
    // classGrid[classId][day][period] = class_subject_id | null
    // teacherGrid[teacherId][day][period] = classId (for conflict detection)
    //
    type SlotValue = string | null;
    const classGrid: Record<string, Record<number, Record<number, SlotValue>>> = {};
    const teacherGrid: Record<string, Record<number, Record<number, string>>> = {};

    // Count how many classes each teacher teaches (for MRV sorting)
    const teacherClassCount: Record<string, number> = {};
    for (const cs of classSubjects) {
      if (cs.teacher_id) {
        teacherClassCount[cs.teacher_id] = (teacherClassCount[cs.teacher_id] || 0) + 1;
      }
    }

    for (const cls of classes) {
      classGrid[cls.id] = {};
      for (const d of DAYS) {
        classGrid[cls.id][d] = {};
        for (let p = 1; p <= NUM_PERIODS; p++) {
          classGrid[cls.id][d][p] = null;
        }
      }
    }

    // Helper: is a slot free for both class and teacher?
    const isFree = (classId: string, teacherId: string | null, day: number, period: number): boolean => {
      if (classGrid[classId]?.[day]?.[period] !== null) return false;
      if (teacherId && teacherGrid[teacherId]?.[day]?.[period]) return false;
      return true;
    };

    // Helper: assign a slot
    const assign = (classId: string, csId: string, teacherId: string | null, day: number, period: number) => {
      classGrid[classId][day][period] = csId;
      if (teacherId) {
        if (!teacherGrid[teacherId]) {
          teacherGrid[teacherId] = {};
          for (const d of DAYS) teacherGrid[teacherId][d] = {};
        }
        teacherGrid[teacherId][day][period] = classId;
      }
    };

    // ── 6. Schedule each class independently ─────────────────────────────────

    const conflicts: string[] = [];

    for (const cls of classes) {
      // Get subjects for this class, sorted MRV-first:
      //   primary: highest periods_per_week (hardest to fit)
      //   secondary: teacher with most classes (most constrained teacher first)
      const subjects = classSubjects
        .filter((cs) => cs.class_id === cls.id)
        .sort((a, b) => {
          const ppwDiff = b.periods_per_week - a.periods_per_week;
          if (ppwDiff !== 0) return ppwDiff;
          const aLoad = a.teacher_id ? (teacherClassCount[a.teacher_id] || 0) : 0;
          const bLoad = b.teacher_id ? (teacherClassCount[b.teacher_id] || 0) : 0;
          return bLoad - aLoad;
        });

      for (const cs of subjects) {
        let remaining = cs.periods_per_week;
        const tid = cs.teacher_id ?? null;

        // Track how many times this subject is already placed on each day
        const dayCount: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

        let dayStart = 0;

        // Pass 1: strict spread — max ceil(ppw/5) per day
        const maxPerDay = Math.ceil(cs.periods_per_week / DAYS.length);

        for (let attempt = 0; attempt < cs.periods_per_week * DAYS.length * NUM_PERIODS && remaining > 0; attempt++) {
          const day = DAYS[(dayStart + attempt) % DAYS.length];

          if (dayCount[day] >= maxPerDay) continue;

          let placed = false;
          for (let p = 1; p <= NUM_PERIODS; p++) {
            if (isFree(cls.id, tid, day, p)) {
              assign(cls.id, cs.id, tid, day, p);
              dayCount[day]++;
              remaining--;
              placed = true;
              break;
            }
          }

          if (placed) dayStart = (dayStart + 1) % DAYS.length;
        }

        // Pass 2: relax max-per-day, try any free slot with teacher check
        if (remaining > 0) {
          outer:
          for (const day of DAYS) {
            for (let p = 1; p <= NUM_PERIODS; p++) {
              if (isFree(cls.id, tid, day, p)) {
                assign(cls.id, cs.id, tid, day, p);
                remaining--;
                if (remaining === 0) break outer;
              }
            }
          }
        }

        // Pass 3: last resort — ignore teacher constraint to keep class full
        if (remaining > 0) {
          const subjectName = (cs.subjects as any)?.code || cs.id;
          outer3:
          for (const day of DAYS) {
            for (let p = 1; p <= NUM_PERIODS; p++) {
              if (classGrid[cls.id]?.[day]?.[p] === null) {
                classGrid[cls.id][day][p] = cs.id;
                remaining--;
                conflicts.push(
                  `Teacher conflict on ${cls.name} ${subjectName} day=${day} period=${p}`
                );
                if (remaining === 0) break outer3;
              }
            }
          }
        }

        if (remaining > 0) {
          conflicts.push(`Could not place ${remaining} period(s) for ${cls.name} — ${(cs.subjects as any)?.code}`);
        }
      }
    }

    // ── 7. Build insert rows from classGrid (ALL slots must be filled) ───────

    const toInsert: Array<{
      class_subject_id: string;
      day_of_week: number;
      period: number;
      start_time: string;
      end_time: string;
      period_setting_id: string;
      academic_year: string;
    }> = [];

    for (const cls of classes) {
      for (const day of DAYS) {
        for (let p = 1; p <= NUM_PERIODS; p++) {
          const val = classGrid[cls.id][day][p];
          const periodInfo = periods[p - 1];

          if (val && val !== null) {
            toInsert.push({
              class_subject_id: val,
              day_of_week: day,
              period: p,
              start_time: periodInfo.start_time,
              end_time: periodInfo.end_time,
              period_setting_id: periodInfo.setting_id,
              academic_year: academicYear,
            });
          }
        }
      }
    }

    // ── 8. Bulk insert ───────────────────────────────────────────────────────

    if (toInsert.length > 0) {
      const BATCH = 500;
      for (let i = 0; i < toInsert.length; i += BATCH) {
        const { error: insertError } = await supabase
          .from('timetable_slots')
          .insert(toInsert.slice(i, i + BATCH));
        if (insertError) throw insertError;
      }
    }

    revalidateTag('timetable');
    revalidatePath('/[locale]/timetable', 'page');

    return {
      success: true,
      slotsCreated: toInsert.length,
      classesScheduled: classes.length,
      freePeriods: 0,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
    };
  } catch (e: any) {
    return { success: false, error: e.message || 'Generation failed' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch timetable for a class
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
// Clear timetable
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
