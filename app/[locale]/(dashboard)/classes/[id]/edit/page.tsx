import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatClassName, formatTeacherName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import ClassEditForm from './ClassEditForm';

export default async function ClassEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const [classRes, teachersRes] = await Promise.all([
    supabase.from('classes').select('*').eq('id', id).single(),
    supabase
      .from('teachers')
      .select('id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, last_name, last_name_ar, gender')
      .eq('is_active', true)
      .order('first_name'),
  ]);

  const cls = classRes.data;
  if (!cls) notFound();

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={`${t('class.editClass')}: ${formatClassName(cls, locale)}`}
        actions={
          <Link href={`/${locale}/classes/${id}`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <ClassEditForm
        cls={cls}
        teachers={teachersRes.data || []}
        locale={locale}
        labels={{
          className: t('class.className'),
          classNameAr: t('class.classNameAr'),
          gradeLevel: t('class.gradeLevel'),
          section: t('class.section'),
          capacity: t('class.capacity'),
          roomNumber: t('class.roomNumber'),
          supervisor: t('class.supervisor'),
          selectSupervisor: t('class.selectSupervisor'),
          status: t('common.status'),
          active: t('student.active'),
          inactive: t('student.inactive'),
          save: t('common.save'),
          saving: t('class.saving'),
          cancel: t('common.cancel'),
          updateSuccess: t('class.updateSuccess'),
          updateFailed: t('class.updateFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
