import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GraduationCap, Plus } from 'lucide-react';
import { getAllTeachers } from '@/lib/supabase/cached-queries';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTeacherName, formatDate, formatPhone } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import SortableHead from '@/components/SortableHead';
import PrintButton from '@/components/PrintButton';
import ClickableRow from '@/components/ClickableRow';
import SelectFilter from '@/components/SelectFilter';
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
  searchParams: Promise<{ search?: string; sort?: string; dir?: string; gender?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const search = sp?.search || '';
  const genderFilter = sp?.gender || '';

  // Sort params
  const sortKey = sp?.sort || '';
  const sortDir = sp?.dir === 'desc' ? 'desc' : 'asc';
  const sortColumn = SORT_COLUMNS[sortKey];

  // Always use direct query when filters/sort are active
  let teacherList: any[];
  if (search || sortColumn || genderFilter) {
    const supabase = createAdminClient();
    let query = supabase
      .from('teachers')
      .select('*')
      .eq('is_active', true);

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,employee_id.ilike.%${search}%,first_name_ar.ilike.%${search}%,last_name_ar.ilike.%${search}%`);
    }
    if (genderFilter) {
      query = query.eq('gender', genderFilter);
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

  // Gender filter options
  const genderOptions = [
    { value: 'male', label: t('student.male') },
    { value: 'female', label: t('student.female') },
  ];

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

      {/* Filters */}
      <Card padding="sm" className="mb-3 print:hidden">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <SearchBar placeholder={t('teacher.searchPlaceholder')} locale={locale} />
          </div>
          <div className="w-[130px]">
            <SelectFilter
              paramKey="gender"
              placeholder={t('student.gender')}
              options={genderOptions}
              currentValue={genderFilter}
            />
          </div>
        </div>
      </Card>

      <Card>
        {/* Print button bar above table */}
        <div className="flex items-center justify-between px-2 py-2 print:hidden">
          <p className="text-[11px] text-text-tertiary">
            {teacherList.length} {t('navigation.teachers')}
          </p>
          <PrintButton label={t('common.print')} />
        </div>

        {teacherList.length === 0 ? (
          <EmptyState icon={<GraduationCap size={40} className="text-text-tertiary" />} title={t('common.noResults')} />
        ) : (
          <Table>
            <colgroup>
              <col className="w-[40px]" />
              <col className="w-[80px]" />
              <col />
              <col className="w-[150px]" />
              <col className="w-[80px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.Head>#</Table.Head>
                <SortableHead sortKey="employee_id">{t('teacher.employeeId')}</SortableHead>
                <SortableHead sortKey="name">{t('student.fullName')}</SortableHead>
                <SortableHead sortKey="specialization">{t('teacher.specialization')}</SortableHead>
                <SortableHead sortKey="gender">{t('student.gender')}</SortableHead>
                <SortableHead sortKey="phone">{t('teacher.phone')}</SortableHead>
                <SortableHead sortKey="hire_date">{t('teacher.hireDate')}</SortableHead>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teacherList.map((teacher: any, index: number) => (
                <ClickableRow key={teacher.id} href={`/${locale}/teachers/${teacher.id}`}>
                  <Table.Cell className="text-text-tertiary text-[11px] font-mono">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-[11px] text-brand-teal">
                      {teacher.employee_id}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-semibold text-text-primary">
                      {formatTeacherName(teacher, locale)}
                    </span>
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
                </ClickableRow>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
}
