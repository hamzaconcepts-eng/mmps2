import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Users, Plus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClassesList } from '@/lib/supabase/cached-queries';
import { formatStudentName } from '@/lib/utils/format';
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
import ClassFilter from '@/components/ClassFilter';

const PER_PAGE = 20;

export default async function StudentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; class?: string; page?: string; sort?: string; dir?: string; gender?: string; status?: string; print?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const search = sp?.search || '';
  const classFilter = sp?.class || '';
  const genderFilter = sp?.gender || '';
  const statusFilter = sp?.status || '';
  const isPrint = sp?.print === '1';
  const page = isPrint ? 1 : Math.max(1, Number(sp?.page || 1));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  // Sort: locale-aware first_name sorting
  const nameColumn = locale === 'ar' ? 'first_name_ar' : 'first_name';

  // Build query
  let query = supabase
    .from('students')
    .select('id, student_id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, gender, is_active, class_id, classes(name, name_ar, grade_level, section)', { count: 'exact' });

  // Only paginate when NOT printing
  if (!isPrint) {
    query = query.range(from, to);
  }

  // Status filter (default: show active only)
  if (statusFilter === 'inactive') {
    query = query.eq('is_active', false);
  } else if (statusFilter === 'all') {
    // show all — no filter
  } else {
    query = query.eq('is_active', true);
  }

  // Sort params
  const sortKey = sp?.sort || '';
  const sortDir = sp?.dir === 'desc' ? 'desc' : 'asc';

  // Apply sort
  if (sortKey === 'student_id') {
    query = query.order('student_id', { ascending: sortDir === 'asc' });
  } else if (sortKey === 'name') {
    query = query.order(nameColumn, { ascending: sortDir === 'asc' });
  } else if (sortKey === 'gender') {
    query = query.order('gender', { ascending: sortDir === 'asc' });
  } else if (sortKey === 'class') {
    query = query.order('name', { ascending: sortDir === 'asc', referencedTable: 'classes' });
  } else {
    // Default sort: first_name by locale
    query = query.order(nameColumn, { ascending: true });
  }

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,family_name.ilike.%${search}%,student_id.ilike.%${search}%,first_name_ar.ilike.%${search}%,family_name_ar.ilike.%${search}%`);
  }
  if (classFilter) {
    query = query.eq('class_id', classFilter);
  }
  if (genderFilter) {
    query = query.eq('gender', genderFilter);
  }

  // Students query is always fresh (paginated + filtered); classes list is cached
  const [studentsRes, classes] = await Promise.all([
    query,
    getClassesList(),
  ]);

  const students = studentsRes.data || [];
  const totalCount = studentsRes.count || 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // Build base path for pagination (preserve all params)
  const searchParamsStr = new URLSearchParams();
  if (search) searchParamsStr.set('search', search);
  if (classFilter) searchParamsStr.set('class', classFilter);
  if (genderFilter) searchParamsStr.set('gender', genderFilter);
  if (statusFilter) searchParamsStr.set('status', statusFilter);
  if (sortKey) searchParamsStr.set('sort', sortKey);
  if (sortKey) searchParamsStr.set('dir', sortDir);
  const basePath = `/${locale}/students${searchParamsStr.toString() ? `?${searchParamsStr.toString()}` : ''}`;

  // Gender filter options
  const genderOptions = [
    { value: 'male', label: t('student.male') },
    { value: 'female', label: t('student.female') },
  ];

  // Status filter options
  const statusOptions = [
    { value: 'active', label: t('student.active') },
    { value: 'inactive', label: t('student.inactive') },
    { value: 'all', label: t('common.all') },
  ];

  return (
    <div className="max-w-[1200px]">
      {isPrint && <AutoPrint />}
      <PageHeader
        title={t('student.allStudents')}
        subtitle={`${totalCount} ${t('navigation.students')}`}
        actions={
          <Button variant="accent" size="sm" icon={<Plus size={14} />}>
            {t('common.add')} {t('student.name')}
          </Button>
        }
      />

      {/* Filters */}
      <Card padding="sm" className="print:hidden">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <SearchBar placeholder={t('student.searchPlaceholder')} locale={locale} />
          </div>
          <div className="w-[180px]">
            <ClassFilter
              classes={classes}
              locale={locale}
              placeholder={t('student.filterByClass')}
              currentValue={classFilter}
            />
          </div>
          <div className="w-[130px]">
            <SelectFilter
              paramKey="gender"
              placeholder={t('student.gender')}
              options={genderOptions}
              currentValue={genderFilter}
            />
          </div>
          <div className="w-[130px]">
            <SelectFilter
              paramKey="status"
              placeholder={t('common.status')}
              options={statusOptions}
              currentValue={statusFilter}
            />
          </div>
          <ResetFilters label={t('common.resetFilters')} />
        </div>
      </Card>

      {/* Table */}
      <div className="mt-3">
        <Card>
          {/* Print button bar above table */}
          <div className="flex items-center justify-between px-2 py-2 print:hidden">
            <p className="text-[11px] text-text-tertiary">
              {isPrint
                ? `${totalCount} ${t('navigation.students')}`
                : `${t('common.showing')} ${students.length > 0 ? from + 1 : 0}-${Math.min(to + 1, totalCount)} ${t('common.of')} ${totalCount}`}
            </p>
            <PrintButton label={t('common.print')} />
          </div>

          {students.length === 0 ? (
            <EmptyState
              icon={<Users size={40} className="text-text-tertiary" />}
              title={t('common.noResults')}
              description={search ? t('student.searchPlaceholder') : undefined}
            />
          ) : (
            <>
              <Table>
                <colgroup>
                  <col className="w-[40px]" />
                  <col className="w-[72px]" />
                  <col />
                  <col className="w-[140px]" />
                  <col className="w-[80px]" />
                  <col className="w-[80px]" />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>#</Table.Head>
                    <SortableHead sortKey="student_id">{t('student.studentId')}</SortableHead>
                    <SortableHead sortKey="name">{t('student.fullName')}</SortableHead>
                    <SortableHead sortKey="class">{t('student.class')}</SortableHead>
                    <SortableHead sortKey="gender">{t('student.gender')}</SortableHead>
                    <Table.Head>{t('common.status')}</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {students.map((student: any, index: number) => (
                    <ClickableRow key={student.id} href={`/${locale}/students/${student.id}`}>
                      <Table.Cell className="text-text-tertiary text-[11px] font-mono">
                        {isPrint ? index + 1 : from + index + 1}
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-mono text-[11px] text-brand-teal">
                          {student.student_id}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-semibold text-text-primary">
                          {formatStudentName(student, locale)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-text-secondary">
                        {student.classes
                          ? locale === 'ar' ? student.classes.name_ar : student.classes.name
                          : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant={student.gender === 'male' ? 'teal' : 'ice'}>
                          {student.gender === 'male' ? t('student.male') : t('student.female')}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant={student.is_active ? 'success' : 'dark'}>
                          {student.is_active ? t('student.active') : t('student.inactive')}
                        </Badge>
                      </Table.Cell>
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
    </div>
  );
}
