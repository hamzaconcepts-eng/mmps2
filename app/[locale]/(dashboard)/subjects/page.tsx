import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BookOpen } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatGradeLevel } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default async function SubjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const [subjectsRes, gradeSubjectsRes, scoringRes] = await Promise.all([
    supabase.from('subjects').select('*').eq('is_active', true).order('code'),
    supabase.from('grade_subjects').select('subject_id, grade_level').eq('is_active', true),
    supabase.from('scoring_categories').select('subject_id, name, name_ar, percentage, grade_level').eq('is_active', true).eq('academic_year', '2025-2026').order('sort_order'),
  ]);

  const subjects = subjectsRes.data || [];
  const gradeSubjects = gradeSubjectsRes.data || [];
  const scoringCategories = scoringRes.data || [];

  // Group grade levels per subject
  const gradeLevelMap: Record<string, number[]> = {};
  gradeSubjects.forEach((gs: any) => {
    if (!gradeLevelMap[gs.subject_id]) gradeLevelMap[gs.subject_id] = [];
    gradeLevelMap[gs.subject_id].push(gs.grade_level);
  });

  // Group scoring categories per subject
  const scoringMap: Record<string, any[]> = {};
  scoringCategories.forEach((sc: any) => {
    if (!scoringMap[sc.subject_id]) scoringMap[sc.subject_id] = [];
    if (!scoringMap[sc.subject_id].find((c: any) => c.name === sc.name)) {
      scoringMap[sc.subject_id].push(sc);
    }
  });

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
                  <Table.Cell className="font-semibold text-white">
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
