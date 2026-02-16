import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, School, Users, BookOpen, GraduationCap } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatGradeLevel, formatTeacherName, formatStudentName, formatClassName, formatSubjectName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();
  const isAr = locale === 'ar';

  // All queries in parallel
  const [clsRes, studentsRes, subjectsRes] = await Promise.all([
    supabase
      .from('classes')
      .select('*, teachers!classes_class_supervisor_id_fkey(id, first_name, first_name_ar, last_name, last_name_ar)')
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
      .select('id, periods_per_week, subjects(id, name, name_ar, code), teachers(id, first_name, first_name_ar, last_name, last_name_ar)')
      .eq('class_id', id),
  ]);

  const cls = clsRes.data;
  if (!cls) notFound();

  const students = studentsRes.data || [];
  const subjectAssignments = subjectsRes.data || [];

  return (
    <div className="max-w-[1100px]">
      <PageHeader
        title={formatClassName(cls, locale)}
        subtitle={`${formatGradeLevel(cls.grade_level, locale)} · ${t('class.section')} ${cls.section} · ${t('class.academicYear')} ${cls.academic_year}`}
        actions={
          <Link href={`/${locale}/classes`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

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
            <InfoRow label={t('class.roomNumber')} value={cls.room_number || '—'} />
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
              <div className="pt-2">
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
      <Card className="mb-3">
        <Card.Header>
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-brand-teal" />
            <Card.Title>{t('class.subjectAssignments')}</Card.Title>
          </div>
        </Card.Header>
        {subjectAssignments.length > 0 ? (
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
                  <Table.Cell>
                    {sa.teachers ? (
                      <Link href={`/${locale}/teachers/${sa.teachers.id}`} className="text-[11px] text-text-primary hover:text-brand-teal transition-colors">
                        {formatTeacherName(sa.teachers, locale)}
                      </Link>
                    ) : <span className="text-text-tertiary text-[11px]">—</span>}
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary text-[11px]">{sa.periods_per_week}/week</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
        )}
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
