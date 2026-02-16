import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { GraduationCap, Plus } from 'lucide-react';
import { getAllTeachers } from '@/lib/supabase/cached-queries';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTeacherName, formatDate, formatPhone } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function TeachersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const search = sp?.search || '';

  // Use cached list when no search; direct query only for search
  let teacherList: any[];
  if (search) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('teachers')
      .select('*')
      .eq('is_active', true)
      .or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,employee_id.ilike.%${search}%,first_name_ar.ilike.%${search}%,last_name_ar.ilike.%${search}%`)
      .order('employee_id');
    teacherList = data || [];
  } else {
    teacherList = await getAllTeachers();
  }

  return (
    <div className="max-w-[1200px]">
      <PageHeader
        title={t('teacher.allTeachers')}
        subtitle={`${teacherList.length} ${t('navigation.teachers')}`}
        actions={
          <Button variant="accent" size="sm" icon={<Plus size={14} />}>
            {t('common.add')} {t('navigation.teachers')}
          </Button>
        }
      />

      <Card padding="sm" className="mb-3">
        <SearchBar placeholder={t('teacher.searchPlaceholder')} locale={locale} />
      </Card>

      <Card>
        {teacherList.length === 0 ? (
          <EmptyState icon={<GraduationCap size={40} className="text-text-tertiary" />} title={t('common.noResults')} />
        ) : (
          <Table>
            <colgroup>
              <col className="w-[80px]" />
              <col />
              <col className="w-[160px]" />
              <col className="w-[80px]" />
              <col className="w-[100px]" />
              <col className="w-[110px]" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('teacher.employeeId')}</Table.Head>
                <Table.Head>{t('student.fullName')}</Table.Head>
                <Table.Head>{t('teacher.specialization')}</Table.Head>
                <Table.Head>{t('student.gender')}</Table.Head>
                <Table.Head>{t('teacher.phone')}</Table.Head>
                <Table.Head>{t('teacher.hireDate')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teacherList.map((teacher: any) => (
                <Table.Row key={teacher.id}>
                  <Table.Cell>
                    <Link href={`/${locale}/teachers/${teacher.id}`} className="font-mono text-[11px] text-brand-teal hover:text-brand-teal-soft transition-colors">
                      {teacher.employee_id}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={`/${locale}/teachers/${teacher.id}`} className="font-semibold text-text-primary hover:text-brand-teal transition-colors">
                      {formatTeacherName(teacher, locale)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary">
                    {locale === 'ar' ? teacher.specialization_ar || teacher.specialization : teacher.specialization || '—'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={teacher.gender === 'male' ? 'teal' : 'ice'}>
                      {teacher.gender === 'male' ? t('student.male') : t('student.female')}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary text-[11px]">{formatPhone(teacher.phone)}</Table.Cell>
                  <Table.Cell className="text-text-secondary text-[11px]">{formatDate(teacher.hire_date, locale)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
}
