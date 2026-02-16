import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, GraduationCap, School, BookOpen, Phone, Mail, Calendar } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTeacherName, formatDate, formatGradeLevel, formatClassName, formatSubjectName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';

export default async function TeacherDetailPage({
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
  const [teacherRes, supervisedRes, assignmentsRes] = await Promise.all([
    supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('classes')
      .select('id, name, name_ar, grade_level, section, capacity')
      .eq('class_supervisor_id', id)
      .eq('is_active', true)
      .eq('academic_year', '2025-2026')
      .order('grade_level'),
    supabase
      .from('class_subjects')
      .select('id, periods_per_week, classes(id, name, name_ar, grade_level, section), subjects(id, name, name_ar, code)')
      .eq('teacher_id', id),
  ]);

  const teacher = teacherRes.data;
  if (!teacher) notFound();

  const supervisedClasses = supervisedRes.data || [];
  const assignments = assignmentsRes.data || [];

  return (
    <div className="max-w-[1000px]">
      <PageHeader
        title={formatTeacherName(teacher, locale)}
        subtitle={`${t('teacher.employeeId')}: ${teacher.employee_id}`}
        actions={
          <Link href={`/${locale}/teachers`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Personal Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-brand-teal" />
              <Card.Title>{t('student.personalInfo')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('teacher.firstName')} value={isAr ? teacher.first_name_ar : teacher.first_name} />
            <InfoRow label={t('teacher.lastName')} value={isAr ? teacher.last_name_ar : teacher.last_name} />
            <InfoRow label={t('student.gender')}>
              <Badge variant={teacher.gender === 'male' ? 'teal' : 'ice'}>
                {teacher.gender === 'male' ? t('student.male') : t('student.female')}
              </Badge>
            </InfoRow>
            <InfoRow label={t('teacher.specialization')} value={isAr ? teacher.specialization_ar || teacher.specialization : teacher.specialization || '—'} />
            {teacher.qualifications && (
              <InfoRow label={t('teacher.qualifications')} value={teacher.qualifications} />
            )}
            <div className="flex items-center gap-2 text-[12px] text-text-secondary pt-1">
              <Phone size={12} /> {teacher.phone || '—'}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-text-secondary">
              <Mail size={12} /> {teacher.email}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-text-secondary">
              <Calendar size={12} /> {t('teacher.hireDate')}: {formatDate(teacher.hire_date, locale)}
            </div>
          </div>
        </Card>

        {/* Supervised Classes */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <School size={15} className="text-accent-orange" />
              <Card.Title>{t('teacher.supervisedClasses')}</Card.Title>
            </div>
          </Card.Header>
          {supervisedClasses.length > 0 ? (
            <div className="space-y-2">
              {supervisedClasses.map((cls: any) => (
                <Link
                  key={cls.id}
                  href={`/${locale}/classes/${cls.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg glass hover:bg-black/[0.04] transition-all"
                >
                  <div>
                    <p className="text-[12px] font-bold text-text-primary">{formatClassName(cls, locale)}</p>
                    <p className="text-[10px] text-text-tertiary">{formatGradeLevel(cls.grade_level, locale)} · {t('class.section')} {cls.section}</p>
                  </div>
                  <Badge variant="teal">{cls.capacity} {t('class.capacity')}</Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
          )}
        </Card>

        {/* Subject & Class Assignments */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-success" />
                <Card.Title>{t('teacher.subjectsAssigned')}</Card.Title>
              </div>
            </Card.Header>
            {assignments.length > 0 ? (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>{t('subject.subjectCode')}</Table.Head>
                    <Table.Head>{t('subject.subjectName')}</Table.Head>
                    <Table.Head>{t('class.className')}</Table.Head>
                    <Table.Head>{t('class.gradeLevel')}</Table.Head>
                    <Table.Head>{t('timetable.period')}</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {assignments.map((a: any) => (
                    <Table.Row key={a.id}>
                      <Table.Cell className="font-mono text-[11px] text-brand-teal">{a.subjects?.code || '—'}</Table.Cell>
                      <Table.Cell className="text-text-primary font-semibold text-[11px]">
                        {a.subjects ? formatSubjectName(a.subjects, locale) : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        {a.classes ? (
                          <Link href={`/${locale}/classes/${a.classes.id}`} className="text-[11px] text-text-primary hover:text-brand-teal transition-colors">
                            {formatClassName(a.classes, locale)}
                          </Link>
                        ) : '—'}
                      </Table.Cell>
                      <Table.Cell className="text-text-secondary text-[11px]">
                        {a.classes ? formatGradeLevel(a.classes.grade_level, locale) : '—'}
                      </Table.Cell>
                      <Table.Cell className="text-text-secondary text-[11px]">{a.periods_per_week}/week</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-text-tertiary font-medium">{label}</span>
      {children || <span className="text-[12px] text-text-primary font-semibold">{value || '—'}</span>}
    </div>
  );
}
