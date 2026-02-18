import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { BookOpen, Plus } from 'lucide-react';
import { getSubjectsWithDetails } from '@/lib/supabase/cached-queries';
import { formatGradeLevel } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import ClickableRow from '@/components/ClickableRow';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const PER_PAGE = 25;

export default async function SubjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ print?: string; search?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isPrint = sp?.print === '1';
  const search = sp?.search?.toLowerCase() || '';
  const page = isPrint ? 1 : Math.max(1, Number(sp?.page || 1));

  const { subjects: allSubjects, gradeLevelMap, scoringMap } = await getSubjectsWithDetails();
  const filtered = search
    ? allSubjects.filter((s: any) =>
        s.name?.toLowerCase().includes(search) ||
        s.name_ar?.includes(search) ||
        s.code?.toLowerCase().includes(search)
      )
    : allSubjects;

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const from = (page - 1) * PER_PAGE;
  const subjects = isPrint ? filtered : filtered.slice(from, from + PER_PAGE);

  const searchParamsStr = new URLSearchParams();
  if (search) searchParamsStr.set('search', sp?.search || '');
  const basePath = `/${locale}/subjects${searchParamsStr.toString() ? `?${searchParamsStr.toString()}` : ''}`;

  return (
    <div className="max-w-[1200px]">
      {isPrint && <AutoPrint />}
      <PageHeader
        title={t('subject.allSubjects')}
        subtitle={`${totalCount} ${t('navigation.subjects')}`}
        actions={
          <Link href={`/${locale}/subjects/new`}>
            <Button variant="accent" size="sm" icon={<Plus size={14} />}>
              {t('subject.addSubject')}
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex items-center justify-between px-2 py-2 print:hidden">
          <div className="w-64">
            <SearchBar placeholder={t('subject.searchPlaceholder')} locale={locale} />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-text-tertiary">
              {isPrint
                ? `${totalCount} ${t('navigation.subjects')}`
                : `${t('common.showing')} ${subjects.length > 0 ? from + 1 : 0}–${Math.min(from + PER_PAGE, totalCount)} ${t('common.of')} ${totalCount}`}
            </p>
            <PrintButton label={t('common.print')} />
          </div>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>#</Table.Head>
              <Table.Head>{t('subject.subjectCode')}</Table.Head>
              <Table.Head>{t('subject.subjectName')}</Table.Head>
              <Table.Head>{t('subject.subjectType')}</Table.Head>
              <Table.Head>{t('subject.gradeLevels')}</Table.Head>
              <Table.Head>{t('subject.scoringCategories')}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {subjects.map((subject: any, index: number) => {
              const levels = gradeLevelMap[subject.id] || [];
              const categories = scoringMap[subject.id] || [];
              levels.sort((a: number, b: number) => a - b);
              return (
                <ClickableRow key={subject.id} href={`/${locale}/subjects/${subject.id}`}>
                  <Table.Cell className="text-text-tertiary text-[11px] font-mono">
                    {isPrint ? index + 1 : from + index + 1}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-[11px] text-brand-teal font-bold">{subject.code}</span>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-text-primary">
                    {locale === 'ar' ? subject.name_ar : subject.name}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={subject.is_activity ? 'orange' : 'teal'}>
                      {subject.is_activity ? t('subject.activity') : t('subject.academic')}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1">
                      {levels.map((lvl: number) => (
                        <span key={lvl} className="text-[10px] px-1.5 py-0.5 rounded glass text-text-secondary">
                          {formatGradeLevel(lvl, locale)}
                        </span>
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1">
                      {categories.map((cat: any, i: number) => (
                        <span key={i} className="text-[10px] text-text-tertiary">
                          {locale === 'ar' ? cat.name_ar : cat.name} ({cat.percentage}%)
                          {i < categories.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      {categories.length === 0 && <span className="text-[10px] text-text-tertiary">—</span>}
                    </div>
                  </Table.Cell>
                </ClickableRow>
              );
            })}
          </Table.Body>
        </Table>

        {!isPrint && totalPages > 1 && (
          <div className="flex items-center justify-center px-2 pt-3 border-t border-gray-100 print:hidden">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={basePath}
              locale={locale}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
