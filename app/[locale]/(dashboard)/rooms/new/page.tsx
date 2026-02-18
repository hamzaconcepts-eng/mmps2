import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import RoomCreateForm from './RoomCreateForm';

export default async function RoomNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, name_ar, grade_level, section')
    .eq('is_active', true)
    .eq('academic_year', '2025-2026')
    .order('grade_level')
    .order('section');

  return (
    <div className="max-w-[700px]">
      <PageHeader
        title={t('room.addRoom')}
        actions={
          <Link href={`/${locale}/rooms`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>{t('common.back')}</Button>
          </Link>
        }
      />
      <RoomCreateForm
        classes={classes || []}
        locale={locale}
        labels={{
          roomInfo: t('room.roomInfo'),
          roomNameEn: t('room.roomNameEn'),
          roomNameAr: t('room.roomNameAr'),
          code: t('room.code'),
          type: t('room.type'),
          capacity: t('room.capacity'),
          shared: t('room.shared'),
          sharedYes: t('room.sharedYes'),
          sharedNo: t('room.sharedNo'),
          assignedClass: t('room.assignedClass'),
          selectClass: t('room.selectClass'),
          type_classroom: t('room.type_classroom'),
          type_lab: t('room.type_lab'),
          type_sports: t('room.type_sports'),
          type_music_room: t('room.type_music_room'),
          type_library: t('room.type_library'),
          type_other: t('room.type_other'),
          save: t('common.save'),
          saving: t('room.saving'),
          cancel: t('common.cancel'),
          createSuccess: t('room.createSuccess'),
          createFailed: t('room.createFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
