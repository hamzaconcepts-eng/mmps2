import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { School } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatGradeLevel, formatTeacherName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default async function ClassesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const [classesRes, studentsRes] = await Promise.all([
    supabase
      .from('classes')
      .select('*, teachers!classes_class_supervisor_id_fkey(first_name, first_name_ar, last_name, last_name_ar)')
      .eq('is_active', true)
      .eq('academic_year', '2025-2026')
      .order('grade_level')
      .order('section'),
    supabase
      .from('students')
      .select('class_id')
      .eq('is_active', true),
  ]);

  const classes = classesRes.data || [];
  const students = studentsRes.data || [];

  // Count students per class
  const countMap: Record<string, number> = {};
  students.forEach((s: any) => {
    if (s.class_id) countMap[s.class_id] = (countMap[s.class_id] || 0) + 1;
  });

  return (
    <div className="max-w-[1200px]">
      <PageHeader
        title={t('class.allClasses')}
        subtitle={`${classes.length} ${t('navigation.classes')} · ${t('class.academicYear')} 2025-2026`}
      />

      <Card>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>{t('class.className')}</Table.Head>
              <Table.Head>{t('class.gradeLevel')}</Table.Head>
              <Table.Head>{t('class.section')}</Table.Head>
              <Table.Head>{t('class.supervisor')}</Table.Head>
              <Table.Head>{t('class.studentCount')}</Table.Head>
              <Table.Head>{t('class.capacity')}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {classes.map((cls: any) => {
              const studentCount = countMap[cls.id] || 0;
              const isFull = studentCount >= cls.capacity;
              return (
                <Table.Row key={cls.id}>
                  <Table.Cell>
                    <Link href={`/${locale}/classes/${cls.id}`} className="font-semibold text-white hover:text-brand-teal transition-colors">
                      {locale === 'ar' ? cls.name_ar : cls.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary">{formatGradeLevel(cls.grade_level, locale)}</Table.Cell>
                  <Table.Cell className="text-text-secondary">{cls.section}</Table.Cell>
                  <Table.Cell className="text-text-secondary">
                    {cls.teachers ? formatTeacherName(cls.teachers, locale) : '—'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={isFull ? 'danger' : studentCount > cls.capacity * 0.8 ? 'warning' : 'success'}>
                      {studentCount}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary">{cls.capacity}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
