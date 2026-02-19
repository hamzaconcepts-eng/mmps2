import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, DoorOpen, School, Users, Calendar } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatGradeLevel, formatClassName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import EntityActions from '@/components/EntityActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { deleteRoom } from './actions';
import EmbeddedTimetable from '@/app/[locale]/(dashboard)/timetable/EmbeddedTimetable';

const TYPE_BADGE: Record<string, 'teal' | 'orange' | 'success' | 'dark'> = {
  classroom: 'teal',
  lab: 'orange',
  sports: 'success',
  music_room: 'orange',
  library: 'dark',
  other: 'dark',
};

export default async function RoomDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { locale, id } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();
  const isAr = locale === 'ar';
  const isPrint = sp?.print === '1';

  const [roomRes, classesRes] = await Promise.all([
    supabase.from('facilities').select('*').eq('id', id).single(),
    supabase
      .from('classes')
      .select('id, name, name_ar, grade_level, section, class_supervisor_id, teachers!classes_class_supervisor_id_fkey(id, first_name, first_name_ar, last_name, last_name_ar, gender)')
      .eq('facility_id', id)
      .eq('is_active', true)
      .eq('academic_year', '2025-2026')
      .order('grade_level')
      .order('section'),
  ]);

  const room = roomRes.data;
  if (!room) notFound();
  const assignedClasses = classesRes.data || [];

  const printDate = new Date().toLocaleDateString(isAr ? 'ar-OM' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-[900px]">
      {isPrint && <AutoPrint />}

      <div className="print-header hidden print:flex items-center gap-3 pb-2 mb-3 border-b border-gray-300">
        <Image src="/logo.svg" alt="" width={40} height={40} className="print-logo" />
        <div className="flex-1">
          <p className="print-school-name font-bold text-[14px] text-black leading-tight">{t('common.schoolName')}</p>
          <p className="print-date text-[9px] text-gray-500">{printDate}</p>
        </div>
      </div>

      <div className="print-student-banner hidden print:flex items-center gap-4 py-4 mb-4 border-b border-gray-200">
        <div>
          <h2 className="print-student-name text-[16px] font-extrabold text-black leading-tight">
            {isAr ? room.name_ar : room.name}
          </h2>
          <p className="text-[9px] text-gray-500 mt-1">{t('room.code')}: {room.code}</p>
        </div>
      </div>

      <div className="print:hidden">
        <PageHeader
          title={isAr ? room.name_ar : room.name}
          subtitle={`${t('room.code')}: ${room.code}`}
          actions={
            <div className="flex items-center gap-2">
              <EntityActions
                entityId={id}
                editHref={`/${locale}/rooms/${id}/edit`}
                deleteAction={deleteRoom}
                redirectHref={`/${locale}/rooms`}
                labels={{
                  edit: t('room.editRoom'),
                  delete: t('room.deleteRoom'),
                  confirmTitle: t('common.confirmDelete'),
                  confirmMessage: t('common.confirmDeleteMessage'),
                  cancel: t('common.cancel'),
                  deleting: t('room.deleting'),
                }}
              />
              <PrintButton label={t('common.print')} />
              <Link href={`/${locale}/rooms`}>
                <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>{t('common.back')}</Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <DoorOpen size={15} className="text-brand-teal" />
              <Card.Title>{t('room.roomInfo')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('room.code')} value={room.code} />
            <InfoRow label={t('room.roomName')} value={isAr ? room.name_ar : room.name} />
            <InfoRow label={t('room.type')}>
              <Badge variant={TYPE_BADGE[room.type] || 'dark'}>{t(`room.type_${room.type}`)}</Badge>
            </InfoRow>
            <InfoRow label={t('room.capacity')} value={room.capacity?.toString() ?? '—'} />
            <InfoRow label={t('room.shared')}>
              <Badge variant={room.is_shared ? 'orange' : 'teal'}>
                {room.is_shared ? t('room.sharedYes') : t('room.sharedNo')}
              </Badge>
            </InfoRow>
            <InfoRow label={t('common.status')}>
              <Badge variant={room.is_active ? 'success' : 'dark'}>
                {room.is_active ? t('student.active') : t('student.inactive')}
              </Badge>
            </InfoRow>
          </div>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <School size={15} className="text-accent-orange" />
              <Card.Title>{t('room.assignedClass')} ({assignedClasses.length})</Card.Title>
            </div>
          </Card.Header>
          {assignedClasses.length > 0 ? (
            <div className="space-y-2">
              {assignedClasses.map((cls: any) => (
                <Link
                  key={cls.id}
                  href={`/${locale}/classes/${cls.id}`}
                  className="flex items-center justify-between glass rounded-lg px-3 py-2 hover:ring-1 hover:ring-brand-teal/30 transition-all"
                >
                  <div>
                    <p className="text-[12px] font-bold text-text-primary">{formatClassName(cls, locale)}</p>
                    <p className="text-[10px] text-text-tertiary">{formatGradeLevel(cls.grade_level, locale)}</p>
                  </div>
                  <Badge variant="teal">{cls.section}</Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
          )}
        </Card>
      </div>
      {/* Room Timetable */}
      <Card className="lg:col-span-2">
        <Card.Header>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-brand-teal" />
            <Card.Title>{t('timetable.roomTimetable')}</Card.Title>
          </div>
        </Card.Header>
        <EmbeddedTimetable mode="room" entityId={id} locale={locale} />
      </Card>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-text-tertiary font-medium">{label}:</span>
      {children || <span className="text-[12px] text-text-primary font-semibold">{value || '—'}</span>}
    </div>
  );
}
