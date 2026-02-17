import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import AreaForm from './AreaForm';

export default async function AreaNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="max-w-[600px]">
      <PageHeader
        title={t('transport.addArea')}
        actions={
          <Link href={`/${locale}/transport`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>{t('common.back')}</Button>
          </Link>
        }
      />
      <AreaForm
        locale={locale}
        labels={{
          areaName: t('transport.areaName'),
          areaNameAr: t('transport.areaNameAr'),
          annualFee: t('transport.annualFee'),
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
