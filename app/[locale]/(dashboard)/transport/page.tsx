import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Bus, MapPin, Plus } from 'lucide-react';
import { getTransportData } from '@/lib/supabase/cached-queries';
import { formatCurrency, formatDriverName, formatPhone } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import SearchBar from '@/components/SearchBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function TransportPage({
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
  const isAr = locale === 'ar';
  const isPrint = sp?.print === '1';
  const search = sp?.search?.toLowerCase() || '';

  const { areas: allAreas, buses, transports, busStudentCount, busesByArea } = await getTransportData();
  const areas = search
    ? allAreas.filter((area: any) => {
        const nameMatch = area.name?.toLowerCase().includes(search) || area.name_ar?.includes(search);
        const busMatch = (busesByArea[area.id] || []).some((bus: any) =>
          bus.bus_number?.toLowerCase().includes(search) || bus.plate_number?.toLowerCase().includes(search)
        );
        return nameMatch || busMatch;
      })
    : allAreas;

  return (
    <div className="max-w-[1200px]">
      {isPrint && <AutoPrint />}

      <div className="print-header hidden print:flex items-center gap-3 pb-2 mb-3 border-b border-gray-300">
        <Image src="/logo.svg" alt="" width={40} height={40} className="print-logo" />
        <div className="flex-1">
          <p className="print-school-name font-bold text-[14px] text-black leading-tight">{t('common.schoolName')}</p>
          <p className="print-date text-[9px] text-gray-500">
            {new Date().toLocaleDateString(isAr ? 'ar-OM' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="print-student-banner hidden print:flex items-center gap-4 py-4 mb-4 border-b border-gray-200">
        <div>
          <h2 className="print-student-name text-[16px] font-extrabold text-black leading-tight">
            {t('transport.title')}
          </h2>
          <p className="text-[9px] text-gray-500 mt-1">
            {areas.length} {t('transport.areas')} · {buses.length} {t('transport.buses')} · {transports.length} {t('navigation.students')}
          </p>
        </div>
      </div>

      <div className="print:hidden">
        <PageHeader
          title={t('transport.title')}
          subtitle={`${allAreas.length} ${t('transport.areas')} · ${buses.length} ${t('transport.buses')} · ${transports.length} ${t('navigation.students')}`}
          actions={
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/transport/areas/new`}>
                <Button variant="accent" size="sm" icon={<Plus size={14} />}>{t('transport.addArea')}</Button>
              </Link>
              <PrintButton label={t('common.print')} />
            </div>
          }
        />
        <div className="mb-4 w-72">
          <SearchBar placeholder={t('transport.searchPlaceholder')} locale={locale} />
        </div>
      </div>

      <div className="space-y-4">
        {areas.map((area: any) => {
          const areaBuses = busesByArea[area.id] || [];
          return (
            <Card key={area.id}>
              <Card.Header>
                <Link href={`/${locale}/transport/areas/${area.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <MapPin size={15} className="text-brand-teal" />
                  <Card.Title>{isAr ? area.name_ar : area.name}</Card.Title>
                </Link>
                <div className="flex items-center gap-2">
                  <Badge variant="orange">{formatCurrency(area.annual_fee)} / {isAr ? 'سنة' : 'year'}</Badge>
                  <Link href={`/${locale}/transport/buses/new?area=${area.id}`} className="print:hidden">
                    <Button variant="glass" size="sm" icon={<Plus size={12} />}>{t('transport.addBus')}</Button>
                  </Link>
                </div>
              </Card.Header>

              {areaBuses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {areaBuses.map((bus: any) => {
                    const count = busStudentCount[bus.id] || 0;
                    return (
                      <Link key={bus.id} href={`/${locale}/transport/buses/${bus.id}`} className="glass rounded-lg p-3 space-y-2 hover:ring-1 hover:ring-brand-teal/30 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bus size={14} className="text-accent-orange" />
                            <span className="text-[12px] font-bold text-text-primary">{bus.bus_number}</span>
                          </div>
                          <Badge variant={count >= bus.capacity ? 'danger' : 'success'}>
                            {count}/{bus.capacity}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">{t('transport.plateNumber')}</span>
                            <span className="text-text-primary font-mono">{bus.plate_number || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">{t('transport.driverName')}</span>
                            <span className="text-text-primary">{formatDriverName(bus, locale)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">{t('transport.driverPhone')}</span>
                            <span className="text-text-secondary">{formatPhone(bus.driver_phone)}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-text-tertiary">{t('common.noData')}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
