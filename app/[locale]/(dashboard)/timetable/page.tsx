import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, LayoutGrid, Users, School, GraduationCap } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatClassName, formatGradeLevel, formatTeacherName, formatSubjectName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import TimetableGrid, { type TimetableSlot, type PeriodInfo, type BreakInfo } from './TimetableGrid';
import GenerateClient from './GenerateClient';

// ── Helper: normalise a time string to HH:MM ─────────────────────────────────
function normaliseTime(t: string) {
  if (!t) return '00:00';
  return t.slice(0, 5); // "07:30:00" → "07:30"
}

export default async function TimetablePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ classId?: string; view?: string; print?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();
  const isAr = locale === 'ar';
  const isPrint = sp?.print === '1';
  const selectedClassId = sp?.classId || '';
  const view = (sp?.view as 'class' | 'teacher') || 'class';
  const ACADEMIC_YEAR = '2025-2026';

  const printDate = new Date().toLocaleDateString(isAr ? 'ar-OM' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  // ── Parallel data fetch ─────────────────────────────────────────────────────
  const [classesRes, periodRes, slotsRes] = await Promise.all([
    supabase
      .from('classes')
      .select('id, name, name_ar, grade_level, section')
      .eq('academic_year', ACADEMIC_YEAR)
      .eq('is_active', true)
      .order('grade_level')
      .order('section'),
    supabase
      .from('period_settings')
      .select('*')
      .eq('is_active', true)
      .order('slot_number'),
    selectedClassId
      ? supabase
          .from('timetable_slots')
          .select(`
            id, day_of_week, period, start_time, end_time, academic_year,
            class_subjects!inner (
              id, periods_per_week, class_id,
              subjects ( id, name, name_ar, code ),
              teachers ( id, first_name, first_name_ar, father_name, father_name_ar,
                         grandfather_name, grandfather_name_ar,
                         family_name, family_name_ar, last_name, last_name_ar, gender )
            )
          `)
          .eq('class_subjects.class_id', selectedClassId)
          .eq('academic_year', ACADEMIC_YEAR)
          .order('day_of_week')
          .order('period')
      : Promise.resolve({ data: [], error: null }),
  ]);

  const classes = classesRes.data || [];
  // If period_settings table doesn't exist yet, treat as empty (migration not run)
  const migrationNeeded = !!periodRes.error;
  const periodSettings = periodRes.data || [];
  const rawSlots = slotsRes.data || [];

  // ── Shape period settings into PeriodInfo + BreakInfo ───────────────────────
  const periods: PeriodInfo[] = [];
  const breaks: BreakInfo[] = [];
  let periodIdx = 0;
  let lastPeriodNum = 0;

  for (const ps of periodSettings) {
    if (ps.slot_type === 'period') {
      periodIdx++;
      periods.push({
        period_number: periodIdx,
        start_time: normaliseTime(ps.start_time),
        end_time: normaliseTime(ps.end_time),
        label: ps.label,
        label_ar: ps.label_ar,
      });
      lastPeriodNum = periodIdx;
    } else {
      breaks.push({
        after_period: lastPeriodNum,
        slot_type: ps.slot_type,
        label: ps.label,
        label_ar: ps.label_ar,
        start_time: normaliseTime(ps.start_time),
        end_time: normaliseTime(ps.end_time),
      });
    }
  }

  // ── Shape timetable slots ──────────────────────────────────────────────────
  const slots: TimetableSlot[] = rawSlots
    .filter((rs: any) => rs.class_subjects && rs.class_subjects.subjects)
    .map((rs: any) => {
      const cs = rs.class_subjects;
      const subj = cs.subjects;
      const teacher = cs.teachers;
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
      };
    });

  // ── Selected class info ────────────────────────────────────────────────────
  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // ── Labels for day names ───────────────────────────────────────────────────
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

  // ── Generate page labels ───────────────────────────────────────────────────
  const generateLabels = {
    periodConfig: t('timetable.periodConfig'),
    periods: t('timetable.periods'),
    breaks: t('timetable.breaks'),
    saveSettings: t('timetable.saveSettings'),
    savedSuccess: t('timetable.savedSuccess'),
    saveFailed: t('timetable.saveFailed'),
    saving: t('common.saving'),
    addSlot: t('timetable.addSlot'),
    generateTitle: t('timetable.generateTitle'),
    generateDesc: t('timetable.generateDesc'),
    generate: t('timetable.generate'),
    generating: t('timetable.generating'),
    regenerate: t('timetable.regenerate'),
    generateSuccess: t('timetable.generateSuccess'),
    classesScheduled: t('timetable.classesScheduled'),
    slotsCreated: t('timetable.slotsCreated'),
    noPeriods: t('timetable.noPeriods'),
    freePeriods: t('timetable.freePeriods'),
  };

  // ── Period settings for the client component ───────────────────────────────
  const initialSlots = periodSettings.map((ps) => ({
    id: ps.id,
    slot_number: ps.slot_number,
    slot_type: ps.slot_type as 'period' | 'break' | 'prayer',
    label: ps.label,
    label_ar: ps.label_ar,
    start_time: normaliseTime(ps.start_time),
    end_time: normaliseTime(ps.end_time),
  }));

  return (
    <div className="max-w-[1300px]">
      {isPrint && <AutoPrint />}

      {/* ── Print header ─────────────────────────────────────────────────── */}
      <div className="print-header hidden print:flex items-center gap-3 pb-2 mb-3 border-b border-gray-300">
        <Image src="/logo.svg" alt="" width={40} height={40} className="print-logo" />
        <div className="flex-1">
          <p className="print-school-name font-bold text-[14px] text-black leading-tight">
            {t('common.schoolName')}
          </p>
          <p className="print-date text-[9px] text-gray-500">{printDate}</p>
        </div>
      </div>

      {/* ── Print banner ─────────────────────────────────────────────────── */}
      {selectedClass && (
        <div className="hidden print:block mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-[16px] font-extrabold text-black">
            {t('timetable.title')} — {formatClassName(selectedClass, locale)}
          </h2>
          <p className="text-[9px] text-gray-500 mt-0.5">
            {formatGradeLevel(selectedClass.grade_level, locale)} · {t('class.section')} {selectedClass.section} · {ACADEMIC_YEAR}
          </p>
        </div>
      )}

      {/* ── Migration needed banner ──────────────────────────────────────── */}
      {migrationNeeded && (
        <div className="print:hidden mb-4 flex items-start gap-3 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-[13px] font-bold">Database migration required</p>
            <p className="text-[12px] mt-1 leading-relaxed">
              The <code className="bg-amber-100 px-1 rounded font-mono text-[11px]">period_settings</code> table
              does not exist yet. Please open your{' '}
              <strong>Supabase dashboard → SQL Editor</strong> and run the file:
            </p>
            <code className="mt-1.5 block text-[11px] font-mono bg-amber-100 px-2 py-1 rounded">
              supabase/migrate_timetable.sql
            </code>
            <p className="text-[11px] mt-1.5 opacity-70">Then refresh this page.</p>
          </div>
        </div>
      )}

      {/* ── Screen header ─────────────────────────────────────────────────── */}
      <div className="print:hidden">
        <PageHeader
          title={t('timetable.title')}
          subtitle={`${ACADEMIC_YEAR} · ${classes.length} ${t('class.allClasses')}`}
          actions={<div />}
        />
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 print:block">

        {/* ── Left panel: Configure + Generate ────────────────────────── */}
        <div className="space-y-4 print:hidden">
          <GenerateClient
            initialSlots={initialSlots}
            academicYear={ACADEMIC_YEAR}
            locale={locale}
            labels={generateLabels}
          />
        </div>

        {/* ── Right panel: Class selector + Timetable grid ─────────────── */}
        <div className="space-y-4">
          {/* Class selector */}
          <div className="print:hidden">
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <LayoutGrid size={15} className="text-brand-teal" />
                  <Card.Title>{t('timetable.selectClass')}</Card.Title>
                </div>
              </Card.Header>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {classes.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/${locale}/timetable?classId=${cls.id}`}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      selectedClassId === cls.id
                        ? 'bg-brand-teal text-white border-brand-teal shadow-sm'
                        : 'bg-gray-50 text-text-secondary border-gray-200 hover:border-brand-teal/40 hover:text-brand-teal hover:bg-brand-teal/5'
                    }`}
                  >
                    {formatClassName(cls, locale)}
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Timetable grid */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-brand-teal" />
                  <Card.Title>
                    {selectedClass
                      ? `${formatClassName(selectedClass, locale)} — ${t('timetable.title')}`
                      : t('timetable.title')}
                  </Card.Title>
                  {selectedClass && (
                    <span className="text-[10px] text-text-tertiary hidden sm:inline">
                      {formatGradeLevel(selectedClass.grade_level, locale)} · {t('class.section')} {selectedClass.section}
                    </span>
                  )}
                </div>
                {selectedClassId && (
                  <span className="text-[10px] text-text-tertiary print:hidden">{slots.length} {t('timetable.slotsCreated')}</span>
                )}
              </div>
            </Card.Header>

            {!selectedClassId ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-tertiary">
                <Calendar size={36} className="opacity-30" />
                <p className="text-sm font-medium">{t('timetable.selectClassPrompt')}</p>
              </div>
            ) : (
              <TimetableGrid
                slots={slots}
                periods={periods}
                breaks={breaks}
                locale={locale}
                mode="class"
                labels={gridLabels}
                printTitle={selectedClass ? `${formatClassName(selectedClass, locale)} — ${t('timetable.title')}` : undefined}
                schoolName={t('common.schoolName')}
                academicYear={ACADEMIC_YEAR}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
