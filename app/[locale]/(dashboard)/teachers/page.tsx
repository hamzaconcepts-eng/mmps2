import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { GraduationCap, Plus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTeacherName, formatDate, formatPhone } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import SortableHead from '@/components/SortableHead';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import ClickableRow from '@/components/ClickableRow';
import SelectFilter from '@/components/SelectFilter';
import ResetFilters from '@/components/ResetFilters';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const PER_PAGE = 20;

export default async function TeachersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; page?: string; sort?: string; dir?: string; gender?: string; print?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const search = sp?.search || '';
  const genderFilter = sp?.gender || '';
  const isPrint = sp?.print === '1';
  const page = isPrint ? 1 : Math.max(1, Number(sp?.page || 1));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  // Sort: locale-aware first_name sorting
  const nameColumn = locale === 'ar' ? 'first_name_ar' : 'first_name';

  // Sort params
  const sortKey = sp?.sort || '';
  const sortDir = sp?.dir === 'desc' ? 'desc' : 'asc';

  // Build query with pagination
  let query = supabase
    .from('teachers')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  // Only paginate when NOT printing
  if (!isPrint) {
    query = query.range(from, to);
  }

  // Apply sort
  if (sortKey === 'employee_id') {
    query = query.order('employee_id', { ascending: sortDir === 'asc' });
  } else if (sortKey === 'name') {
    query = query.order(nameColumn, { ascending: sortDir === 'asc' });
  } else if (sortKey === 'specialization') {
    query = query.order('specialization', { ascending: sortDir === 'asc' });
  } else if (sortKey === 'gender') {
    query = query.order('gender', { ascending: sortDir === 'asc' });
  } else if (sortKey === 'phone') {
    query = query.order('phone', { ascending: sortDir === 'asc' });
  } else if (sortKey === 'hire_date') {
    query = query.order('hire_date', { ascending: sortDir === 'asc' });
  } else {
    // Default sort: first_name by locale
    query = query.order(nameColumn, { ascending: true });
  }

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,employee_id.ilike.%${search}%,first_name_ar.ilike.%${search}%,last_name_ar.ilike.%${search}%`);
  }
  if (genderFilter) {
    query = query.eq('gender', genderFilter);
  }

  const { data, count } = await query;
  const teachers = data || [];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // Build base path for pagination (preserve all params)
  const searchParamsStr = new URLSearchParams();
  if (search) searchParamsStr.set('search', search);
  if (genderFilter) searchParamsStr.set('gender', genderFilter);
  if (sortKey) searchParamsStr.set('sort', sortKey);
  if (sortKey) searchParamsStr.set('dir', sortDir);
  const basePath = `/${locale}/teachers${searchParamsStr.toString() ? `?${searchParamsStr.toString()}` : ''}`;

  // Gender filter options
  const genderOptions = [
    { value: 'male', label: t('student.male') },
    { value: 'female', label: t('student.female') },
  ];

  return (
    <div className="max-w-[1200px]">
      {isPrint && <AutoPrint />}
      <PageHeader
        title={t('teacher.allTeachers')}
        subtitle={`${totalCount} ${t('navigation.teachers')}`}
        actions={
          <Link href={`/${locale}/teachers/new`}>
            <Button variant="accent" size="sm" icon={<Plus size={14} />}>
              {t('teacher.addTeacher')}
            </Button>
          </Link>
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
          <ResetFilters label={t('common.resetFilters')} />
        </div>
      </Card>

      <Card>
        {/* Print button bar above table */}
        <div className="flex items-center justify-between px-2 py-2 print:hidden">
          <p className="text-[11px] text-text-tertiary">
            {isPrint
              ? `${totalCount} ${t('navigation.teachers')}`
              : `${t('common.showing')} ${teachers.length > 0 ? from + 1 : 0}-${Math.min(to + 1, totalCount)} ${t('common.of')} ${totalCount}`}
          </p>
          <PrintButton label={t('common.print')} />
        </div>

        {teachers.length === 0 ? (
          <EmptyState icon={<GraduationCap size={40} className="text-text-tertiary" />} title={t('common.noResults')} />
        ) : (
          <>
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
                {teachers.map((teacher: any, index: number) => (
                  <ClickableRow key={teacher.id} href={`/${locale}/teachers/${teacher.id}`}>
                    <Table.Cell className="text-text-tertiary text-[11px] font-mono">
                      {isPrint ? index + 1 : from + index + 1}
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

            {/* Pagination — hidden when printing */}
            {!isPrint && (
              <div className="flex items-center justify-center px-2 pt-3 border-t border-gray-100 print:hidden">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={basePath}
                  locale={locale}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
