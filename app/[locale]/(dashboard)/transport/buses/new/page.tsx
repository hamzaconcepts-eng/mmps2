import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import BusCreateForm from './BusCreateForm';

export default async function BusNewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ area?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const { data: areas } = await supabase
    .from('transport_areas')
    .select('id, name, name_ar')
    .eq('academic_year', '2025-2026')
    .eq('is_active', true)
    .order('name');

  return (
    <div className="max-w-[900px]">
      <PageHeader
        title={t('transport.addBus')}
        actions={
          <Link href={`/${locale}/transport`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>{t('common.back')}</Button>
          </Link>
        }
      />
      <BusCreateForm
        areas={areas || []}
        locale={locale}
        defaultAreaId={sp?.area || ''}
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
          save: t('common.save'),
          saving: t('transport.saving'),
          cancel: t('common.cancel'),
          createSuccess: t('transport.createSuccess'),
          createFailed: t('transport.createFailed'),
          requiredField: t('common.requiredField'),
        }}
      />
    </div>
  );
}
