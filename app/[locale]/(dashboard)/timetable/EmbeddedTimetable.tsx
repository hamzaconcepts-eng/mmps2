/**
 * EmbeddedTimetable — server component used in class/teacher/student/room detail pages.
 * Fetches its own data and renders a TimetableGrid.
 */
import { getTranslations } from 'next-intl/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTeacherName, formatClassName } from '@/lib/utils/format';
import TimetableGrid, { type TimetableSlot, type PeriodInfo, type BreakInfo } from './TimetableGrid';

function normaliseTime(t: string) {
  if (!t) return '00:00';
  return t.slice(0, 5);
}

type Mode = 'class' | 'teacher' | 'room';

interface Props {
  mode: Mode;
  /** class_id for mode=class, teacher_id for mode=teacher, facility_id for mode=room */
  entityId: string;
  locale: string;
  academicYear?: string;
  /** Shown in print header e.g. "Grade 3-A Weekly Timetable" */
  printTitle?: string;
}

export default async function EmbeddedTimetable({ mode, entityId, locale, academicYear = '2025-2026', printTitle }: Props) {
  const t = await getTranslations();
  const supabase = createAdminClient();

  // ── Fetch period settings (graceful if table doesn't exist yet) ──────────
  const { data: periodSettings, error: psError } = await supabase
    .from('period_settings')
    .select('*')
    .eq('is_active', true)
    .order('slot_number');

  // If migration hasn't been run yet, show nothing rather than crash
  if (psError) return null;

  const ps = periodSettings || [];

  // ── Shape period / break info ─────────────────────────────────────────────
  const periods: PeriodInfo[] = [];
  const breaks: BreakInfo[] = [];
  let periodIdx = 0;
  let lastPeriodNum = 0;

  for (const s of ps) {
    if (s.slot_type === 'period') {
      periodIdx++;
      periods.push({
        period_number: periodIdx,
        start_time: normaliseTime(s.start_time),
        end_time: normaliseTime(s.end_time),
        label: s.label,
        label_ar: s.label_ar,
      });
      lastPeriodNum = periodIdx;
    } else {
      breaks.push({
        after_period: lastPeriodNum,
        slot_type: s.slot_type,
        label: s.label,
        label_ar: s.label_ar,
        start_time: normaliseTime(s.start_time),
        end_time: normaliseTime(s.end_time),
      });
    }
  }

  // ── Fetch timetable slots depending on mode ──────────────────────────────
  let rawSlots: any[] = [];

  if (mode === 'class') {
    const { data } = await supabase
      .from('timetable_slots')
      .select(`
        id, day_of_week, period, start_time, end_time,
        class_subjects!inner (
          id, class_id,
          subjects ( id, name, name_ar, code ),
          teachers ( id, first_name, first_name_ar, father_name, father_name_ar,
                     grandfather_name, grandfather_name_ar,
                     family_name, family_name_ar, last_name, last_name_ar, gender )
        )
      `)
      .eq('class_subjects.class_id', entityId)
      .eq('academic_year', academicYear)
      .order('day_of_week')
      .order('period');
    rawSlots = data || [];
  } else if (mode === 'teacher') {
    const { data } = await supabase
      .from('timetable_slots')
      .select(`
        id, day_of_week, period, start_time, end_time,
        class_subjects!inner (
          id, teacher_id,
          subjects ( id, name, name_ar, code ),
          classes ( id, name, name_ar, grade_level, section )
        )
      `)
      .eq('class_subjects.teacher_id', entityId)
      .eq('academic_year', academicYear)
      .order('day_of_week')
      .order('period');
    rawSlots = data || [];
  } else if (mode === 'room') {
    // Room: get classes assigned to this facility, then get their timetable slots
    const { data: roomClasses } = await supabase
      .from('classes')
      .select('id')
      .eq('facility_id', entityId)
      .eq('academic_year', academicYear);

    const classIds = (roomClasses || []).map((c: any) => c.id);

    if (classIds.length > 0) {
      const { data } = await supabase
        .from('timetable_slots')
        .select(`
          id, day_of_week, period, start_time, end_time,
          class_subjects!inner (
            id, class_id,
            subjects ( id, name, name_ar, code ),
            classes ( id, name, name_ar, grade_level, section ),
            teachers ( id, first_name, first_name_ar, father_name, father_name_ar,
                       grandfather_name, grandfather_name_ar,
                       family_name, family_name_ar, last_name, last_name_ar, gender )
          )
        `)
        .in('class_subjects.class_id', classIds)
        .eq('academic_year', academicYear)
        .order('day_of_week')
        .order('period');
      rawSlots = data || [];
    }
  }

  // ── Shape slots ───────────────────────────────────────────────────────────
  const slots: TimetableSlot[] = rawSlots
    .filter((rs: any) => rs.class_subjects && rs.class_subjects.subjects)
    .map((rs: any) => {
      const cs = rs.class_subjects;
      const subj = cs.subjects;
      const teacher = cs.teachers;
      const cls = cs.classes;
      return {
        id: rs.id,
        day_of_week: rs.day_of_week,
        period: rs.period,
        start_time: normaliseTime(rs.start_time),
        end_time: normaliseTime(rs.end_time),
        subjectId: subj.id,
        subjectName: subj.name,
        subjectNameAr: subj.name_ar,
        subjectCode: subj.code,
        teacherName: teacher ? formatTeacherName(teacher, locale) : undefined,
        className: cls ? formatClassName(cls, locale) : undefined,
      };
    });

  const dayLabels = [
    t('timetable.sunday'),
    t('timetable.monday'),
    t('timetable.tuesday'),
    t('timetable.wednesday'),
    t('timetable.thursday'),
  ];

  const gridLabels = {
    days: dayLabels,
    period: t('timetable.period'),
    noTimetable: t('timetable.noSlots'),
    free: t('timetable.free'),
    break: t('timetable.break'),
    prayer: t('timetable.prayerBreak'),
  };

  return (
    <TimetableGrid
      slots={slots}
      periods={periods}
      breaks={breaks}
      locale={locale}
      mode={mode}
      labels={gridLabels}
      printTitle={printTitle}
      schoolName="Mashaail Muscat Private School"
      academicYear={academicYear}
    />
  );
}
