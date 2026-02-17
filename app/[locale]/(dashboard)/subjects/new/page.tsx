import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import SubjectCreateForm from './SubjectCreateForm';

export default async function SubjectNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={t('subject.addSubject')}
        actions={
          <Link href={`/${locale}/subjects`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <SubjectCreateForm
        locale={locale}
        labels={{
          subjectCode: t('subject.subjectCode'),
          subjectName: t('subject.subjectName'),
          subjectNameAr: t('subject.subjectNameAr'),
          subjectType: t('subject.subjectType'),
          academic: t('subject.academic'),
          activity: t('subject.activity'),
          description: t('subject.description'),
          save: t('common.save'),
          saving: t('subject.saving'),
          cancel: t('common.cancel'),
          createSuccess: t('subject.createSuccess'),
          createFailed: t('subject.createFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
