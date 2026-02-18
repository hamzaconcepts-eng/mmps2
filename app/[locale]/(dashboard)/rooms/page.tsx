import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { DoorOpen, Plus } from 'lucide-react';
import { getRoomsWithAssignments } from '@/lib/supabase/cached-queries';
import { formatGradeLevel } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import ClickableRow from '@/components/ClickableRow';
import SearchBar from '@/components/SearchBar';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const TYPE_BADGE: Record<string, 'teal' | 'orange' | 'success' | 'dark'> = {
  classroom: 'teal',
  lab: 'orange',
  sports: 'success',
  music_room: 'orange',
  library: 'dark',
  other: 'dark',
};

export default async function RoomsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ print?: string; search?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isPrint = sp?.print === '1';
  const search = sp?.search?.toLowerCase() || '';
  const isAr = locale === 'ar';

  const { facilities: allRooms, classByFacility } = await getRoomsWithAssignments();

  const rooms = search
    ? allRooms.filter((r: any) =>
        r.name?.toLowerCase().includes(search) ||
        r.name_ar?.includes(search) ||
        r.code?.toLowerCase().includes(search) ||
        r.type?.toLowerCase().includes(search)
      )
    : allRooms;

  return (
    <div className="max-w-[1200px]">
      {isPrint && <AutoPrint />}
      <PageHeader
        title={t('room.allRooms')}
        subtitle={`${allRooms.length} ${t('navigation.rooms')}`}
        actions={
          <Link href={`/${locale}/rooms/new`}>
            <Button variant="accent" size="sm" icon={<Plus size={14} />}>
              {t('room.addRoom')}
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex items-center justify-between px-2 py-2 print:hidden">
          <div className="w-64">
            <SearchBar placeholder={t('room.searchPlaceholder')} locale={locale} />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-text-tertiary">
              {rooms.length} {t('navigation.rooms')}
            </p>
            <PrintButton label={t('common.print')} />
          </div>
        </div>

        <Table>
          <colgroup>
            <col className="w-[40px]" />
            <col className="w-[100px]" />
            <col />
            <col className="w-[120px]" />
            <col className="w-[80px]" />
            <col className="w-[80px]" />
            <col />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.Head>#</Table.Head>
              <Table.Head>{t('room.code')}</Table.Head>
              <Table.Head>{t('room.roomName')}</Table.Head>
              <Table.Head>{t('room.type')}</Table.Head>
              <Table.Head>{t('room.capacity')}</Table.Head>
              <Table.Head>{t('room.shared')}</Table.Head>
              <Table.Head>{t('room.assignedClass')}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rooms.map((room: any, index: number) => {
              const assignedClasses = classByFacility[room.id] || [];
              return (
                <ClickableRow key={room.id} href={`/${locale}/rooms/${room.id}`}>
                  <Table.Cell className="text-text-tertiary text-[11px] font-mono">{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-[11px] text-brand-teal font-bold">{room.code}</span>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-text-primary">
                    {isAr ? room.name_ar : room.name}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={TYPE_BADGE[room.type] || 'dark'}>
                      {t(`room.type_${room.type}`)}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary">{room.capacity ?? '—'}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={room.is_shared ? 'orange' : 'teal'}>
                      {room.is_shared ? t('room.sharedYes') : t('room.sharedNo')}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {assignedClasses.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {assignedClasses.map((cls: any) => (
                          <span key={cls.id} className="text-[10px] glass px-1.5 py-0.5 rounded text-text-secondary">
                            {isAr ? cls.name_ar : cls.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-text-tertiary text-[11px]">—</span>
                    )}
                  </Table.Cell>
                </ClickableRow>
              );
            })}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
