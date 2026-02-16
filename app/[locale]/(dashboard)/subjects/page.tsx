import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BookOpen } from 'lucide-react';
import { getSubjectsWithDetails } from '@/lib/supabase/cached-queries';
import { formatGradeLevel } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default async function SubjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const { subjects, gradeLevelMap, scoringMap } = await getSubjectsWithDetails();

  return (
    <div className="max-w-[1200px]">
      <PageHeader
        title={t('subject.allSubjects')}
        subtitle={`${subjects.length} ${t('navigation.subjects')}`}
      />

      <Card>
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
              levels.sort((a, b) => a - b);
              return (
                <Table.Row key={subject.id}>
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
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
