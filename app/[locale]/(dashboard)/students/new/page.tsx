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

  // Fetch classes and buses in parallel
  const [classesRes, busesRes] = await Promise.all([
    supabase
      .from('classes')
      .select('id, name, name_ar, grade_level, section')
      .eq('is_active', true)
      .order('grade_level', { ascending: true })
      .order('section', { ascending: true }),
    supabase
      .from('buses')
      .select('id, bus_number, transport_area_id, transport_areas(name, name_ar)')
      .eq('is_active', true)
      .order('bus_number', { ascending: true }),
  ]);

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
        classes={classesRes.data || []}
        buses={busesRes.data || []}
        locale={locale}
        labels={{
          // Section headers
          englishNames: t('student.englishNames'),
          arabicNames: t('student.arabicNames'),
          personalInfo: t('student.personalInfo'),
          academicInfo: t('student.academicInfo'),
          guardianInfo: t('student.guardianInfo'),
          transportSection: t('student.transportSection'),
          // Student name fields
          firstName: t('student.firstName'),
          fatherName: t('student.fatherName'),
          grandfatherName: t('student.grandfatherName'),
          familyName: t('student.familyName'),
          firstNameAr: t('student.firstNameAr'),
          fatherNameAr: t('student.fatherNameAr'),
          grandfatherNameAr: t('student.grandfatherNameAr'),
          familyNameAr: t('student.familyNameAr'),
          // Personal info
          dateOfBirth: t('student.dateOfBirth'),
          gender: t('student.gender'),
          male: t('student.male'),
          female: t('student.female'),
          nationality: t('student.nationality'),
          nationalId: t('student.nationalId'),
          // Academic
          class: t('student.class'),
          enrollmentDate: t('student.enrollmentDate'),
          // Guardian
          guardianFirstName: t('student.guardianFirstName'),
          guardianFirstNameAr: t('student.guardianFirstNameAr'),
          guardianFatherName: t('student.guardianFatherName'),
          guardianFatherNameAr: t('student.guardianFatherNameAr'),
          guardianFamilyName: t('student.guardianFamilyName'),
          guardianFamilyNameAr: t('student.guardianFamilyNameAr'),
          relationship: t('student.relationship'),
          selectRelationship: t('student.selectRelationship'),
          father: t('student.father'),
          mother: t('student.mother'),
          guardianRelative: t('student.guardianRelative'),
          guardianPhone: t('student.guardianPhone'),
          guardianEmail: t('student.guardianEmail'),
          // Transport + Location
          selectBus: t('student.selectBus'),
          noTransportAssigned: t('student.noTransportAssigned'),
          gpsLocation: t('student.gpsLocation'),
          // Actions
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
