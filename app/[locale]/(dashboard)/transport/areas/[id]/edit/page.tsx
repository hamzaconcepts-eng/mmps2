import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import AreaEditForm from './AreaEditForm';

export default async function AreaEditPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const { data: area } = await supabase.from('transport_areas').select('*').eq('id', id).single();
  if (!area) notFound();
  const isAr = locale === 'ar';

  return (
    <div className="max-w-[600px]">
      <PageHeader
        title={`${t('transport.editArea')}: ${isAr ? area.name_ar : area.name}`}
        actions={
          <Link href={`/${locale}/transport/areas/${id}`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>{t('common.back')}</Button>
          </Link>
        }
      />
      <AreaEditForm
        area={area}
        locale={locale}
        labels={{
          areaInfo: t('transport.areaInfo'),
          areaNameEn: t('transport.areaNameEn'),
          areaNameAr: t('transport.areaNameAr'),
          annualFee: t('transport.annualFee'),
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
