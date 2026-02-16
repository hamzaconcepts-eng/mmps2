import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Bus, MapPin } from 'lucide-react';
import { getTransportData } from '@/lib/supabase/cached-queries';
import { formatCurrency } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function TransportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isAr = locale === 'ar';

  const { areas, buses, transports, busStudentCount, busesByArea } = await getTransportData();

  return (
    <div className="max-w-[1200px]">
      <PageHeader
        title={t('transport.title')}
        subtitle={`${areas.length} ${t('transport.areas')} · ${buses.length} ${t('transport.buses')} · ${transports.length} ${t('navigation.students')}`}
      />

      <div className="space-y-4">
        {areas.map((area: any) => {
          const areaBuses = busesByArea[area.id] || [];
          return (
            <Card key={area.id}>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-brand-teal" />
                  <Card.Title>{isAr ? area.name_ar : area.name}</Card.Title>
                </div>
                <Badge variant="orange">{formatCurrency(area.annual_fee)} / {isAr ? 'سنة' : 'year'}</Badge>
              </Card.Header>

              {areaBuses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {areaBuses.map((bus: any) => {
                    const count = busStudentCount[bus.id] || 0;
                    return (
                      <div key={bus.id} className="glass rounded-lg p-3 space-y-2">
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
                            <span className="text-text-primary">{isAr ? bus.driver_name_ar : bus.driver_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">{t('transport.driverPhone')}</span>
                            <span className="text-text-secondary">{bus.driver_phone}</span>
                          </div>
                        </div>
                      </div>
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
