import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Bus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency, formatDriverName, formatPhone } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import EntityActions from '@/components/EntityActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { deleteArea } from '../actions';

export default async function AreaDetailPage({
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

  const [areaRes, busesRes, transportRes] = await Promise.all([
    supabase.from('transport_areas').select('*').eq('id', id).single(),
    supabase.from('buses').select('*').eq('transport_area_id', id).eq('is_active', true).order('bus_number'),
    supabase.from('student_transport').select('bus_id').eq('transport_area_id', id).eq('academic_year', '2025-2026').eq('is_active', true),
  ]);

  const area = areaRes.data;
  if (!area) notFound();

  const buses = busesRes.data || [];
  const transports = transportRes.data || [];

  const busStudentCount: Record<string, number> = {};
  transports.forEach((t: any) => {
    busStudentCount[t.bus_id] = (busStudentCount[t.bus_id] || 0) + 1;
  });

  const printDate = new Date().toLocaleDateString(isAr ? 'ar-OM' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-[1000px]">
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
            {isAr ? area.name_ar : area.name}
          </h2>
          <p className="text-[9px] text-gray-500 mt-1">
            {formatCurrency(area.annual_fee)} / {isAr ? 'سنة' : 'year'} · {buses.length} {t('transport.buses')} · {transports.length} {t('navigation.students')}
          </p>
        </div>
      </div>

      <div className="print:hidden">
        <PageHeader
          title={isAr ? area.name_ar : area.name}
          subtitle={`${formatCurrency(area.annual_fee)} / ${isAr ? 'سنة' : 'year'}`}
          actions={
            <div className="flex items-center gap-2">
              <EntityActions
                entityId={id}
                editHref={`/${locale}/transport/areas/${id}/edit`}
                deleteAction={deleteArea}
                redirectHref={`/${locale}/transport`}
                labels={{
                  edit: t('transport.editArea'),
                  delete: t('transport.deleteArea'),
                  confirmTitle: t('common.confirmDelete'),
                  confirmMessage: t('common.confirmDeleteMessage'),
                  cancel: t('common.cancel'),
                  deleting: t('transport.deleting'),
                }}
              />
              <PrintButton label={t('common.print')} />
              <Link href={`/${locale}/transport`}>
                <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>{t('common.back')}</Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-brand-teal" />
              <Card.Title>{t('transport.area')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('transport.areaName')} value={area.name} />
            <InfoRow label={t('transport.areaNameAr')} value={area.name_ar} />
            <InfoRow label={t('transport.annualFee')} value={formatCurrency(area.annual_fee)} />
            <InfoRow label={t('transport.buses')} value={buses.length.toString()} />
            <InfoRow label={t('transport.assignedStudents')} value={transports.length.toString()} />
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {buses.map((bus: any) => {
          const count = busStudentCount[bus.id] || 0;
          return (
            <Link key={bus.id} href={`/${locale}/transport/buses/${bus.id}`} className="block">
              <Card hover>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bus size={14} className="text-accent-orange" />
                    <span className="text-[12px] font-bold text-text-primary">{bus.bus_number}</span>
                  </div>
                  <Badge variant={count >= bus.capacity ? 'danger' : 'success'}>
                    {count}/{bus.capacity}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-text-tertiary">{t('transport.plateNumber')}: </span>
                    <span className="text-text-primary font-mono">{bus.plate_number || '—'}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">{t('transport.driverName')}: </span>
                    <span className="text-text-primary">{formatDriverName(bus, locale)}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">{t('transport.driverPhone')}: </span>
                    <span className="text-text-secondary">{formatPhone(bus.driver_phone)}</span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
        {buses.length === 0 && (
          <p className="text-sm text-text-tertiary text-center py-4">{t('common.noData')}</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-text-tertiary font-medium">{label}:</span>
      <span className="text-[12px] text-text-primary font-semibold">{value || '—'}</span>
    </div>
  );
}
