import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTeacherName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import TeacherEditForm from './TeacherEditForm';

export default async function TeacherEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const { data: teacher } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (!teacher) notFound();

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={`${t('teacher.editTeacher')}: ${formatTeacherName(teacher, locale)}`}
        subtitle={`${t('teacher.employeeId')}: ${teacher.employee_id}`}
        actions={
          <Link href={`/${locale}/teachers/${id}`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <TeacherEditForm
        teacher={teacher}
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
          status: t('common.status'),
          active: t('student.active'),
          inactive: t('student.inactive'),
          save: t('common.save'),
          saving: t('teacher.saving'),
          cancel: t('common.cancel'),
          updateSuccess: t('teacher.updateSuccess'),
          updateFailed: t('teacher.updateFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
