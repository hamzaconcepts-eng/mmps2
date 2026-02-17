import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import BusEditForm from './BusEditForm';

export default async function BusEditPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const [busRes, areasRes] = await Promise.all([
    supabase.from('buses').select('*').eq('id', id).single(),
    supabase.from('transport_areas').select('id, name, name_ar').eq('academic_year', '2025-2026').eq('is_active', true).order('name'),
  ]);

  const bus = busRes.data;
  if (!bus) notFound();

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={`${t('transport.editBus')}: ${bus.bus_number}`}
        actions={
          <Link href={`/${locale}/transport/buses/${id}`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>{t('common.back')}</Button>
          </Link>
        }
      />
      <BusEditForm
        bus={bus}
        areas={areasRes.data || []}
        locale={locale}
        labels={{
          busInfo: t('transport.busInfo'),
          driverInfo: t('transport.driverInfo'),
          busNumber: t('transport.busNumber'),
          plateNumber: t('transport.plateNumber'),
          capacity: t('transport.capacity'),
          area: t('transport.area'),
          selectArea: t('transport.selectArea'),
          driverName: t('transport.driverName'),
          driverNameAr: t('transport.driverNameAr'),
          driverFatherName: t('transport.driverFatherName'),
          driverFatherNameAr: t('transport.driverFatherNameAr'),
          driverFamilyName: t('transport.driverFamilyName'),
          driverFamilyNameAr: t('transport.driverFamilyNameAr'),
          driverPhone: t('transport.driverPhone'),
          status: t('common.status'),
          active: t('student.active'),
          inactive: t('student.inactive'),
          save: t('common.save'),
          saving: t('transport.saving'),
          cancel: t('common.cancel'),
          updateSuccess: t('transport.updateSuccess'),
          updateFailed: t('transport.updateFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
