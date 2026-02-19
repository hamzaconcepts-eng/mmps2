import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatSubjectName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import SubjectEditForm from './SubjectEditForm';

export default async function SubjectEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const [{ data: subject }, { data: gradeRows }] = await Promise.all([
    supabase.from('subjects').select('*').eq('id', id).single(),
    supabase.from('grade_subjects').select('grade_level').eq('subject_id', id),
  ]);

  if (!subject) notFound();

  const existingGrades = (gradeRows ?? []).map((r: any) => r.grade_level);

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={`${t('subject.editSubject')}: ${formatSubjectName(subject, locale)}`}
        subtitle={`${t('subject.subjectCode')}: ${subject.code}`}
        actions={
          <Link href={`/${locale}/subjects/${id}`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <SubjectEditForm
        subject={subject}
        existingGrades={existingGrades}
        locale={locale}
        labels={{
          subjectCode: t('subject.subjectCode'),
          subjectName: t('subject.subjectName'),
          subjectNameAr: t('subject.subjectNameAr'),
          subjectType: t('subject.subjectType'),
          academic: t('subject.academic'),
          activity: t('subject.activity'),
          description: t('subject.description'),
          status: t('common.status'),
          active: t('student.active'),
          inactive: t('student.inactive'),
          gradeLevels: t('subject.gradeLevels'),
          selectAll: t('common.selectAll'),
          deselectAll: t('common.deselectAll'),
          noGradesSelected: t('subject.noGradesSelected'),
          save: t('common.save'),
          saving: t('subject.saving'),
          cancel: t('common.cancel'),
          updateSuccess: t('subject.updateSuccess'),
          updateFailed: t('subject.updateFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
