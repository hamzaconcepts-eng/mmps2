import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { GraduationCap, Plus } from 'lucide-react';
import { getAllTeachers } from '@/lib/supabase/cached-queries';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTeacherName, formatDate, formatPhone } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import SortableHead from '@/components/SortableHead';
import PrintButton from '@/components/PrintButton';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Map sort keys to Supabase column names
const SORT_COLUMNS: Record<string, string> = {
  employee_id: 'employee_id',
  name: 'last_name',
  specialization: 'specialization',
  gender: 'gender',
  phone: 'phone',
  hire_date: 'hire_date',
};

export default async function TeachersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; sort?: string; dir?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const search = sp?.search || '';

  // Sort params
  const sortKey = sp?.sort || '';
  const sortDir = sp?.dir === 'desc' ? 'desc' : 'asc';
  const sortColumn = SORT_COLUMNS[sortKey];

  // Use cached list when no search and no sort; direct query for search or sort
  let teacherList: any[];
  if (search || sortColumn) {
    const supabase = createAdminClient();
    let query = supabase
      .from('teachers')
      .select('*')
      .eq('is_active', true);

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,employee_id.ilike.%${search}%,first_name_ar.ilike.%${search}%,last_name_ar.ilike.%${search}%`);
    }

    if (sortColumn) {
      query = query.order(sortColumn, { ascending: sortDir === 'asc' });
    } else {
      query = query.order('employee_id');
    }

    const { data } = await query;
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
          <div className="flex items-center gap-2">
            <PrintButton label={t('common.print')} />
            <Button variant="accent" size="sm" icon={<Plus size={14} />}>
              {t('common.add')} {t('navigation.teachers')}
            </Button>
          </div>
        }
      />

      <Card padding="sm" className="mb-3 print:hidden">
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
                <SortableHead sortKey="employee_id">{t('teacher.employeeId')}</SortableHead>
                <SortableHead sortKey="name">{t('student.fullName')}</SortableHead>
                <SortableHead sortKey="specialization">{t('teacher.specialization')}</SortableHead>
                <SortableHead sortKey="gender">{t('student.gender')}</SortableHead>
                <SortableHead sortKey="phone">{t('teacher.phone')}</SortableHead>
                <SortableHead sortKey="hire_date">{t('teacher.hireDate')}</SortableHead>
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
