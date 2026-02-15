import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Users, Plus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClassesList } from '@/lib/supabase/cached-queries';
import { formatStudentName, formatGradeLevel } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
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
  searchParams: Promise<{ search?: string; class?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const search = sp?.search || '';
  const classFilter = sp?.class || '';
  const page = Math.max(1, Number(sp?.page || 1));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  // Build query
  let query = supabase
    .from('students')
    .select('id, student_id, first_name, first_name_ar, father_name, father_name_ar, family_name, family_name_ar, gender, is_active, class_id, classes(name, name_ar, grade_level, section)', { count: 'exact' })
    .eq('is_active', true)
    .order('family_name', { ascending: true })
    .range(from, to);

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,family_name.ilike.%${search}%,student_id.ilike.%${search}%,first_name_ar.ilike.%${search}%,family_name_ar.ilike.%${search}%`);
  }
  if (classFilter) {
    query = query.eq('class_id', classFilter);
  }

  // Students query is always fresh (paginated + filtered); classes list is cached
  const [studentsRes, classes] = await Promise.all([
    query,
    getClassesList(),
  ]);

  const students = studentsRes.data || [];
  const totalCount = studentsRes.count || 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // Build base path for pagination (preserve search params)
  const searchParamsStr = new URLSearchParams();
  if (search) searchParamsStr.set('search', search);
  if (classFilter) searchParamsStr.set('class', classFilter);
  const basePath = `/${locale}/students${searchParamsStr.toString() ? `?${searchParamsStr.toString()}` : ''}`;

  return (
    <div className="max-w-[1200px]">
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
      <Card padding="sm">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <SearchBar placeholder={t('student.searchPlaceholder')} locale={locale} />
          </div>
          <div className="w-[200px]">
            <ClassFilter
              classes={classes}
              locale={locale}
              placeholder={t('student.filterByClass')}
              currentValue={classFilter}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <div className="mt-3">
        <Card>
          {students.length === 0 ? (
            <EmptyState
              icon={<Users size={40} className="text-text-tertiary" />}
              title={t('common.noResults')}
              description={search ? t('student.searchPlaceholder') : undefined}
            />
          ) : (
            <>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>{t('student.studentId')}</Table.Head>
                    <Table.Head>{t('student.fullName')}</Table.Head>
                    <Table.Head>{t('student.class')}</Table.Head>
                    <Table.Head>{t('student.gender')}</Table.Head>
                    <Table.Head>{t('common.status')}</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {students.map((student: any) => (
                    <Table.Row key={student.id}>
                      <Table.Cell>
                        <Link
                          href={`/${locale}/students/${student.id}`}
                          className="font-mono text-[11px] text-brand-teal hover:text-brand-teal-soft transition-colors"
                        >
                          {student.student_id}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          href={`/${locale}/students/${student.id}`}
                          className="font-semibold text-white hover:text-brand-teal transition-colors"
                        >
                          {formatStudentName(student, locale)}
                        </Link>
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
                        <Badge variant="success">{t('student.active')}</Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              {/* Pagination info + controls */}
              <div className="flex items-center justify-between px-2 pt-3 border-t border-white/[0.06]">
                <p className="text-[11px] text-text-tertiary">
                  {t('common.showing')} {from + 1}-{Math.min(to + 1, totalCount)} {t('common.of')} {totalCount}
                </p>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={basePath}
                  locale={locale}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
