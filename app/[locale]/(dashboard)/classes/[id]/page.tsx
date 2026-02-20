import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, School, Users, BookOpen, GraduationCap, DoorOpen } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatGradeLevel, formatTeacherName, formatStudentName, formatClassName, formatSubjectName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import EntityActions from '@/components/EntityActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { deleteClass } from './actions';
import SubjectAssignmentForm from './SubjectAssignmentForm';
import EmbeddedTimetable from '@/app/[locale]/(dashboard)/timetable/EmbeddedTimetable';
import { Calendar } from 'lucide-react';

export default async function ClassDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { locale, id } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();
  const isAr = locale === 'ar';
  const isPrint = sp?.print === '1';

  // All queries in parallel
  const [clsRes, studentsRes, subjectsRes, allSubjectsRes, allTeachersRes] = await Promise.all([
    supabase
      .from('classes')
      .select('*, teachers!classes_class_supervisor_id_fkey(id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, last_name, last_name_ar, gender), facilities(id, name, name_ar, code)')
      .eq('id', id)
      .single(),
    supabase
      .from('students')
      .select('id, student_id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, gender')
      .eq('class_id', id)
      .eq('is_active', true)
      .order('student_id'),
    supabase
      .from('class_subjects')
      .select('id, periods_per_week, subjects(id, name, name_ar, code), teachers(id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, last_name, last_name_ar, gender)')
      .eq('class_id', id),
    supabase
      .from('subjects')
      .select('id, name, name_ar, code')
      .eq('is_active', true)
      .order('code'),
    supabase
      .from('teachers')
      .select('id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, last_name, last_name_ar, gender')
      .eq('is_active', true)
      .order('first_name'),
  ]);

  const cls = clsRes.data;
  if (!cls) notFound();

  const students = studentsRes.data || [];
  const subjectAssignments = subjectsRes.data || [];
  const allSubjects = allSubjectsRes.data || [];
  const allTeachers = (allTeachersRes.data || []).map((t: any) => ({
    id: t.id,
    displayName: formatTeacherName(t, locale),
  }));

  // Shape assignments for the client form
  const assignmentsForForm = subjectAssignments.map((sa: any) => ({
    id: sa.id,
    periods_per_week: sa.periods_per_week,
    subjects: sa.subjects,
    teachers: sa.teachers ? {
      id: sa.teachers.id,
      displayName: formatTeacherName(sa.teachers, locale),
    } : null,
  }));

  const printDate = new Date().toLocaleDateString(isAr ? 'ar-OM' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-[1100px]">
      {isPrint && <AutoPrint />}

      {/* Print-only header */}
      <div className="print-header hidden print:flex items-center gap-3 pb-2 mb-3 border-b border-gray-300">
        <Image src="/logo.svg" alt="" width={40} height={40} className="print-logo" />
        <div className="flex-1">
          <p className="print-school-name font-bold text-[14px] text-black leading-tight">
            {t('common.schoolName')}
          </p>
          <p className="print-date text-[9px] text-gray-500">{printDate}</p>
        </div>
      </div>

      {/* Print-only class banner */}
      <div className="print-student-banner hidden print:flex items-center gap-4 py-4 mb-4 border-b border-gray-200">
        <div>
          <h2 className="print-student-name text-[16px] font-extrabold text-black leading-tight">
            {formatClassName(cls, locale)}
          </h2>
          <p className="text-[9px] text-gray-500 mt-1">
            {formatGradeLevel(cls.grade_level, locale)} · {t('class.section')} {cls.section} · {students.length} {t('class.students')}
          </p>
        </div>
      </div>

      <div className="print:hidden">
        <PageHeader
          title={formatClassName(cls, locale)}
          subtitle={`${formatGradeLevel(cls.grade_level, locale)} · ${t('class.section')} ${cls.section} · ${t('class.academicYear')} ${cls.academic_year}`}
          actions={
            <div className="flex items-center gap-2">
              <EntityActions
                entityId={id}
                editHref={`/${locale}/classes/${id}/edit`}
                deleteAction={deleteClass}
                redirectHref={`/${locale}/classes`}
                labels={{
                  edit: t('class.editClass'),
                  delete: t('class.deleteClass'),
                  confirmTitle: t('common.confirmDelete'),
                  confirmMessage: t('common.confirmDeleteMessage'),
                  cancel: t('common.cancel'),
                  deleting: t('class.deleting'),
                }}
              />
              <PrintButton label={t('common.print')} />
              <Link href={`/${locale}/classes`}>
                <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
                  {t('common.back')}
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        {/* Class Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <School size={15} className="text-brand-teal" />
              <Card.Title>{t('class.classDetails')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('class.className')} value={formatClassName(cls, locale)} />
            <InfoRow label={t('class.gradeLevel')} value={formatGradeLevel(cls.grade_level, locale)} />
            <InfoRow label={t('class.section')} value={cls.section} />
            <InfoRow label={t('class.roomNumber')}>
              {cls.facilities ? (
                <Link href={`/${locale}/rooms/${cls.facilities.id}`} className="flex items-center gap-1 text-[12px] font-semibold text-brand-teal hover:opacity-80 transition-opacity print:text-black print:no-underline">
                  <DoorOpen size={12} />
                  {isAr ? cls.facilities.name_ar : cls.facilities.name}
                  <span className="text-text-tertiary font-normal">({cls.facilities.code})</span>
                </Link>
              ) : (
                <span className="text-[12px] text-text-primary font-semibold">—</span>
              )}
            </InfoRow>
            <InfoRow label={t('class.capacity')} value={cls.capacity?.toString() || '—'} />
            <InfoRow label={t('class.studentCount')}>
              <Badge variant={students.length >= cls.capacity ? 'danger' : students.length > cls.capacity * 0.8 ? 'warning' : 'success'}>
                {students.length} / {cls.capacity}
              </Badge>
            </InfoRow>
          </div>
        </Card>

        {/* Supervisor */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-accent-orange" />
              <Card.Title>{t('class.supervisor')}</Card.Title>
            </div>
          </Card.Header>
          {cls.teachers ? (
            <div className="space-y-2.5">
              <InfoRow label={t('student.fullName')} value={formatTeacherName(cls.teachers, locale)} />
              <div className="pt-2 print:hidden">
                <Link href={`/${locale}/teachers/${cls.teachers.id}`}>
                  <Button variant="glass" size="sm">{t('common.viewAll')} {t('teacher.teacherDetails')}</Button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
          )}
        </Card>

        {/* Quick Stats */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-success" />
              <Card.Title>{t('dashboard.quickStats')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('class.students')} value={students.length.toString()} />
            <InfoRow label={t('class.subjects')} value={subjectAssignments.length.toString()} />
            <InfoRow label={t('student.male')}>
              <Badge variant="teal">{students.filter((s: any) => s.gender === 'male').length}</Badge>
            </InfoRow>
            <InfoRow label={t('student.female')}>
              <Badge variant="ice">{students.filter((s: any) => s.gender === 'female').length}</Badge>
            </InfoRow>
          </div>
        </Card>
      </div>

      {/* Subject Assignments */}
      <Card className="mb-3 print:hidden">
        <Card.Header>
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-brand-teal" />
            <Card.Title>{t('class.subjectAssignments')} ({subjectAssignments.length})</Card.Title>
          </div>
        </Card.Header>
        <SubjectAssignmentForm
          classId={id}
          locale={locale}
          subjects={allSubjects}
          teachers={allTeachers}
          assignments={assignmentsForForm}
          labels={{
            assignSubject: t('class.assignSubject'),
            removeSubject: t('class.removeSubject'),
            selectSubject: t('class.selectSubject'),
            selectTeacher: t('class.selectTeacher'),
            noTeacher: t('class.noTeacher'),
            periodsPerWeek: t('class.periodsPerWeek'),
            noSubjectsForGrade: t('class.noSubjectsForGrade'),
            subjectAssigned: t('class.subjectAssigned'),
            updateSuccess: t('class.updateSuccess'),
            assignFailed: t('class.assignFailed'),
            editAssignment: t('class.editAssignment'),
            save: t('common.save'),
            saving: t('class.saving'),
          }}
        />
      </Card>

      {/* Subject Assignments — print only (simple table) */}
      {subjectAssignments.length > 0 && (
        <Card className="mb-3 hidden print:block">
          <Card.Header>
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-brand-teal" />
              <Card.Title>{t('class.subjectAssignments')}</Card.Title>
            </div>
          </Card.Header>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('subject.subjectCode')}</Table.Head>
                <Table.Head>{t('subject.subjectName')}</Table.Head>
                <Table.Head>{t('navigation.teachers')}</Table.Head>
                <Table.Head>{t('timetable.period')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {subjectAssignments.map((sa: any) => (
                <Table.Row key={sa.id}>
                  <Table.Cell className="font-mono text-[11px] text-brand-teal">{sa.subjects?.code || '—'}</Table.Cell>
                  <Table.Cell className="text-text-primary font-semibold text-[11px]">
                    {sa.subjects ? formatSubjectName(sa.subjects, locale) : '—'}
                  </Table.Cell>
                  <Table.Cell className="text-[11px] text-text-secondary">
                    {sa.teachers ? formatTeacherName(sa.teachers, locale) : '—'}
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary text-[11px]">{sa.periods_per_week}/week</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}

      {/* Timetable */}
      <Card className="mb-3">
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-brand-teal" />
              <Card.Title>{t('timetable.classTimetable')}</Card.Title>
            </div>
            <Link href={`/${locale}/timetable?classId=${id}`} className="print:hidden">
              <Button variant="glass" size="sm">{t('timetable.viewFullTimetable')}</Button>
            </Link>
          </div>
        </Card.Header>
        <EmbeddedTimetable
          mode="class"
          entityId={id}
          locale={locale}
          printTitle={`${formatClassName(cls, locale)} — ${t('timetable.title')}`}
        />
      </Card>

      {/* Student Roster */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Users size={15} className="text-accent-orange" />
            <Card.Title>{t('class.studentRoster')} ({students.length})</Card.Title>
          </div>
        </Card.Header>
        {students.length > 0 ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('student.studentId')}</Table.Head>
                <Table.Head>{t('student.fullName')}</Table.Head>
                <Table.Head>{t('student.gender')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {students.map((student: any) => (
                <Table.Row key={student.id}>
                  <Table.Cell>
                    <Link href={`/${locale}/students/${student.id}`} className="font-mono text-[11px] text-brand-teal hover:text-brand-teal-soft transition-colors">
                      {student.student_id}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={`/${locale}/students/${student.id}`} className="font-semibold text-text-primary hover:text-brand-teal transition-colors text-[12px]">
                      {formatStudentName(student, locale)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={student.gender === 'male' ? 'teal' : 'ice'}>
                      {student.gender === 'male' ? t('student.male') : t('student.female')}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
        )}
      </Card>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-text-tertiary font-medium">{label}:</span>
      {children || <span className="text-[12px] text-text-primary font-semibold">{value || '—'}</span>}
    </div>
  );
}
