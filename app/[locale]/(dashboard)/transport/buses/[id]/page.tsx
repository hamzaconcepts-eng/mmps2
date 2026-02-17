import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Bus, MapPin, Users, Phone } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatDriverName, formatPhone, formatStudentName, formatCurrency } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import EntityActions from '@/components/EntityActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { deleteBus } from '../actions';

export default async function BusDetailPage({
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

  const [busRes, studentsRes] = await Promise.all([
    supabase
      .from('buses')
      .select('*, transport_areas(id, name, name_ar, annual_fee)')
      .eq('id', id)
      .single(),
    supabase
      .from('student_transport')
      .select('*, students(id, student_id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, gender)')
      .eq('bus_id', id)
      .eq('academic_year', '2025-2026')
      .eq('is_active', true),
  ]);

  const bus = busRes.data;
  if (!bus) notFound();

  const studentTransports = studentsRes.data || [];
  const cleanDriverPhone = formatPhone(bus.driver_phone || '');

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
            {t('transport.busNumber')}: {bus.bus_number}
          </h2>
          <p className="text-[9px] text-gray-500 mt-1">
            {isAr ? bus.transport_areas?.name_ar : bus.transport_areas?.name} · {studentTransports.length}/{bus.capacity} {t('navigation.students')}
          </p>
        </div>
      </div>

      <div className="print:hidden">
        <PageHeader
          title={`${t('transport.busNumber')}: ${bus.bus_number}`}
          subtitle={isAr ? bus.transport_areas?.name_ar : bus.transport_areas?.name}
          actions={
            <div className="flex items-center gap-2">
              <EntityActions
                entityId={id}
                editHref={`/${locale}/transport/buses/${id}/edit`}
                deleteAction={deleteBus}
                redirectHref={`/${locale}/transport`}
                labels={{
                  edit: t('transport.editBus'),
                  delete: t('transport.deleteBus'),
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Bus Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Bus size={15} className="text-brand-teal" />
              <Card.Title>{t('transport.busInfo')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('transport.busNumber')} value={bus.bus_number} />
            <InfoRow label={t('transport.plateNumber')} value={bus.plate_number || '—'} />
            <InfoRow label={t('transport.capacity')}>
              <Badge variant={studentTransports.length >= bus.capacity ? 'danger' : 'success'}>
                {studentTransports.length} / {bus.capacity}
              </Badge>
            </InfoRow>
            <InfoRow label={t('transport.area')} value={isAr ? bus.transport_areas?.name_ar : bus.transport_areas?.name} />
            {bus.transport_areas?.annual_fee && (
              <InfoRow label={t('transport.annualFee')} value={formatCurrency(bus.transport_areas.annual_fee)} />
            )}
          </div>
        </Card>

        {/* Driver Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Users size={15} className="text-accent-orange" />
              <Card.Title>{t('transport.driverInfo')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('transport.driverName')} value={formatDriverName(bus, locale)} />
            {cleanDriverPhone && cleanDriverPhone !== '—' && (
              <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                <Phone size={12} />
                <a href={`tel:+968${cleanDriverPhone}`} className="hover:text-brand-teal transition-colors">
                  {cleanDriverPhone}
                </a>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Assigned Students */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-success" />
            <Card.Title>{t('transport.assignedStudents')} ({studentTransports.length})</Card.Title>
          </div>
        </Card.Header>
        {studentTransports.length > 0 ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('student.studentId')}</Table.Head>
                <Table.Head>{t('student.fullName')}</Table.Head>
                <Table.Head>{t('student.gender')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {studentTransports.map((st: any) => {
                const s = st.students;
                if (!s) return null;
                return (
                  <Table.Row key={st.id}>
                    <Table.Cell>
                      <Link href={`/${locale}/students/${s.id}`} className="font-mono text-[11px] text-brand-teal hover:text-brand-teal-soft transition-colors">
                        {s.student_id}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link href={`/${locale}/students/${s.id}`} className="font-semibold text-text-primary hover:text-brand-teal transition-colors text-[12px]">
                        {formatStudentName(s, locale)}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={s.gender === 'male' ? 'teal' : 'ice'}>
                        {s.gender === 'male' ? t('student.male') : t('student.female')}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : (
          <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
        )}
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
