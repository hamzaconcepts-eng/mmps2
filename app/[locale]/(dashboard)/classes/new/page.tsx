import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTeacherName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import ClassCreateForm from './ClassCreateForm';

export default async function ClassNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  // Fetch active teachers and classroom rooms for dropdowns
  const [{ data: teachers }, { data: rooms }] = await Promise.all([
    supabase
      .from('teachers')
      .select('id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, last_name, last_name_ar, gender')
      .eq('is_active', true)
      .order('first_name'),
    supabase
      .from('facilities')
      .select('id, name, name_ar, code')
      .eq('is_active', true)
      .eq('type', 'classroom')
      .order('code'),
  ]);

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={t('class.addClass')}
        actions={
          <Link href={`/${locale}/classes`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <ClassCreateForm
        teachers={teachers || []}
        rooms={rooms || []}
        locale={locale}
        labels={{
          classInfo: t('class.classInfo'),
          classNameEn: t('class.classNameEn'),
          classNameAr: t('class.classNameAr'),
          gradeLevel: t('class.gradeLevel'),
          section: t('class.section'),
          capacity: t('class.capacity'),
          roomNumber: t('class.roomNumber'),
          selectRoom: t('class.selectRoom'),
          supervisor: t('class.supervisor'),
          selectSupervisor: t('class.selectSupervisor'),
          save: t('common.save'),
          saving: t('class.saving'),
          cancel: t('common.cancel'),
          createSuccess: t('class.createSuccess'),
          createFailed: t('class.createFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
