import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { School, Plus } from 'lucide-react';
import { getClassesWithCounts } from '@/lib/supabase/cached-queries';
import { formatGradeLevel, formatTeacherName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import ClickableRow from '@/components/ClickableRow';
import SortableHead from '@/components/SortableHead';
import SearchBar from '@/components/SearchBar';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function ClassesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string; dir?: string; print?: string; search?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isPrint = sp?.print === '1';
  const search = sp?.search?.toLowerCase() || '';

  const { classes: allClasses, countMap } = await getClassesWithCounts();
  const classes = search
    ? allClasses.filter((cls: any) =>
        cls.name?.toLowerCase().includes(search) ||
        cls.name_ar?.includes(search) ||
        cls.section?.toLowerCase().includes(search) ||
        formatGradeLevel(cls.grade_level, 'en').toLowerCase().includes(search)
      )
    : allClasses;

  return (
    <div className="max-w-[1200px]">
      {isPrint && <AutoPrint />}
      <PageHeader
        title={t('class.allClasses')}
        subtitle={`${classes.length} ${t('navigation.classes')} · ${t('class.academicYear')} 2025-2026`}
        actions={
          <Link href={`/${locale}/classes/new`}>
            <Button variant="accent" size="sm" icon={<Plus size={14} />}>
              {t('class.addClass')}
            </Button>
          </Link>
        }
      />

      <Card>
        {/* Print button bar above table */}
        <div className="flex items-center justify-between px-2 py-2 print:hidden">
          <div className="w-64">
            <SearchBar placeholder={t('class.searchPlaceholder')} locale={locale} />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-text-tertiary">
              {classes.length} {t('navigation.classes')}
            </p>
            <PrintButton label={t('common.print')} />
          </div>
        </div>

        <Table>
          <colgroup>
            <col className="w-[40px]" />
            <col />
            <col className="w-[120px]" />
            <col className="w-[70px]" />
            <col />
            <col className="w-[90px]" />
            <col className="w-[80px]" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.Head>#</Table.Head>
              <SortableHead sortKey="name">{t('class.className')}</SortableHead>
              <SortableHead sortKey="grade">{t('class.gradeLevel')}</SortableHead>
              <SortableHead sortKey="section">{t('class.section')}</SortableHead>
              <Table.Head>{t('class.supervisor')}</Table.Head>
              <Table.Head>{t('class.studentCount')}</Table.Head>
              <Table.Head>{t('class.capacity')}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {classes.map((cls: any, index: number) => {
              const studentCount = countMap[cls.id] || 0;
              const isFull = studentCount >= cls.capacity;
              return (
                <ClickableRow key={cls.id} href={`/${locale}/classes/${cls.id}`}>
                  <Table.Cell className="text-text-tertiary text-[11px] font-mono">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-semibold text-text-primary">
                      {locale === 'ar' ? cls.name_ar : cls.name}
                    </span>
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
                </ClickableRow>
              );
            })}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
