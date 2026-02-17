import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import StudentCreateForm from './StudentCreateForm';

export default async function NewStudentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, name_ar, grade_level, section')
    .eq('is_active', true)
    .order('grade_level', { ascending: true })
    .order('section', { ascending: true });

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={t('student.addStudent')}
        actions={
          <Link href={`/${locale}/students`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <StudentCreateForm
        classes={classes || []}
        locale={locale}
        labels={{
          englishNames: t('student.englishNames'),
          arabicNames: t('student.arabicNames'),
          personalInfo: t('student.personalInfo'),
          academicInfo: t('student.academicInfo'),
          locationMedical: t('student.locationMedical'),
          firstName: t('student.firstName'),
          fatherName: t('student.fatherName'),
          grandfatherName: t('student.grandfatherName'),
          familyName: t('student.familyName'),
          firstNameAr: t('student.firstNameAr'),
          fatherNameAr: t('student.fatherNameAr'),
          grandfatherNameAr: t('student.grandfatherNameAr'),
          familyNameAr: t('student.familyNameAr'),
          dateOfBirth: t('student.dateOfBirth'),
          gender: t('student.gender'),
          male: t('student.male'),
          female: t('student.female'),
          nationality: t('student.nationality'),
          nationalId: t('student.nationalId'),
          class: t('student.class'),
          enrollmentDate: t('student.enrollmentDate'),
          active: t('student.active'),
          inactive: t('student.inactive'),
          status: t('common.status'),
          gpsLocation: t('student.gpsLocation'),
          medicalNotes: t('student.medicalNotes'),
          save: t('common.save'),
          saving: t('student.saving'),
          cancel: t('common.cancel'),
          createSuccess: t('student.createSuccess'),
          createFailed: t('student.createFailed'),
        }}
      />
    </div>
  );
}
