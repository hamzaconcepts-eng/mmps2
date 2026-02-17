import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { BookOpen, Plus } from 'lucide-react';
import { getSubjectsWithDetails } from '@/lib/supabase/cached-queries';
import { formatGradeLevel } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import ClickableRow from '@/components/ClickableRow';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function SubjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isPrint = sp?.print === '1';

  const { subjects, gradeLevelMap, scoringMap } = await getSubjectsWithDetails();

  return (
    <div className="max-w-[1200px]">
      {isPrint && <AutoPrint />}
      <PageHeader
        title={t('subject.allSubjects')}
        subtitle={`${subjects.length} ${t('navigation.subjects')}`}
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
          <p className="text-[11px] text-text-tertiary">
            {subjects.length} {t('navigation.subjects')}
          </p>
          <PrintButton label={t('common.print')} />
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>{t('subject.subjectCode')}</Table.Head>
              <Table.Head>{t('subject.subjectName')}</Table.Head>
              <Table.Head>{t('subject.subjectType')}</Table.Head>
              <Table.Head>{t('subject.gradeLevels')}</Table.Head>
              <Table.Head>{t('subject.scoringCategories')}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {subjects.map((subject: any) => {
              const levels = gradeLevelMap[subject.id] || [];
              const categories = scoringMap[subject.id] || [];
              levels.sort((a: number, b: number) => a - b);
              return (
                <ClickableRow key={subject.id} href={`/${locale}/subjects/${subject.id}`}>
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
      </Card>
    </div>
  );
}
