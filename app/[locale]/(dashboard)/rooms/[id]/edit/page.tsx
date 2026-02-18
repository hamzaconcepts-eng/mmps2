import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import RoomEditForm from './RoomEditForm';

export default async function RoomEditPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();
  const isAr = locale === 'ar';

  const [roomRes, classesRes] = await Promise.all([
    supabase.from('facilities').select('*').eq('id', id).single(),
    supabase
      .from('classes')
      .select('id, name, name_ar, grade_level, section, facility_id')
      .eq('is_active', true)
      .eq('academic_year', '2025-2026')
      .order('grade_level')
      .order('section'),
  ]);

  const room = roomRes.data;
  if (!room) notFound();

  return (
    <div className="max-w-[700px]">
      <PageHeader
        title={`${t('room.editRoom')}: ${isAr ? room.name_ar : room.name}`}
        actions={
          <Link href={`/${locale}/rooms/${id}`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>{t('common.back')}</Button>
          </Link>
        }
      />
      <RoomEditForm
        room={room}
        classes={classesRes.data || []}
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
          status: t('common.status'),
          active: t('student.active'),
          inactive: t('student.inactive'),
          save: t('common.save'),
          saving: t('room.saving'),
          cancel: t('common.cancel'),
          updateSuccess: t('room.updateSuccess'),
          updateFailed: t('room.updateFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
