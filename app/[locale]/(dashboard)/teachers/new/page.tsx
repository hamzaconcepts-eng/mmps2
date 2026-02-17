import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import TeacherCreateForm from './TeacherCreateForm';

export default async function TeacherNewPage({
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
        title={t('teacher.addTeacher')}
        actions={
          <Link href={`/${locale}/teachers`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <TeacherCreateForm
        locale={locale}
        labels={{
          englishNames: t('teacher.englishNames'),
          arabicNames: t('teacher.arabicNames'),
          professionalInfo: t('teacher.professionalInfo'),
          firstName: t('teacher.firstName'),
          lastName: t('teacher.lastName'),
          firstNameAr: t('teacher.firstNameAr'),
          lastNameAr: t('teacher.lastNameAr'),
          gender: t('student.gender'),
          male: t('student.male'),
          female: t('student.female'),
          phone: t('teacher.phone'),
          email: t('teacher.email'),
          specialization: t('teacher.specialization'),
          specializationAr: t('teacher.specializationAr'),
          qualifications: t('teacher.qualifications'),
          hireDate: t('teacher.hireDate'),
          nationalId: t('teacher.nationalId'),
          save: t('common.save'),
          saving: t('teacher.saving'),
          cancel: t('common.cancel'),
          createSuccess: t('teacher.createSuccess'),
          createFailed: t('teacher.createFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
