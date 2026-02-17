import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUserRole, isAdminOrOwner } from '@/lib/auth/get-current-user-role';
import { formatStudentName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import StudentEditForm from './StudentEditForm';

export default async function StudentEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  // Role gate + all data in parallel
  const [currentUser, studentRes, classesRes, busesRes, guardianLinkRes, transportRes] =
    await Promise.all([
      getCurrentUserRole(),
      supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single(),
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
      supabase
        .from('student_guardians')
        .select('*, guardians(*)')
        .eq('student_id', id)
        .eq('is_primary_contact', true)
        .maybeSingle(),
      supabase
        .from('student_transport')
        .select('*, buses(id, bus_number, transport_area_id)')
        .eq('student_id', id)
        .eq('academic_year', '2025-2026')
        .maybeSingle(),
    ]);

  // Unauthorized → redirect back to student detail
  if (!currentUser || !isAdminOrOwner(currentUser.role)) {
    redirect(`/${locale}/students/${id}`);
  }

  const student = studentRes.data;
  if (!student) notFound();

  const classes = classesRes.data || [];
  const buses = busesRes.data || [];
  const guardian = guardianLinkRes.data?.guardians || null;
  const guardianId = guardian?.id || null;
  const transport = transportRes.data;

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={`${t('student.editStudent')}: ${formatStudentName(student, locale)}`}
        subtitle={`${t('student.studentId')}: ${student.student_id}`}
        actions={
          <Link href={`/${locale}/students/${id}`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <StudentEditForm
        student={student}
        guardian={guardian}
        guardianId={guardianId}
        transport={transport}
        classes={classes}
        buses={buses}
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
          active: t('student.active'),
          inactive: t('student.inactive'),
          status: t('common.status'),
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
          updateSuccess: t('student.updateSuccess'),
          updateFailed: t('student.updateFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
