import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BarChart3 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { Card } from '@/components/ui/Card';

export default async function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="max-w-[1200px]">
      <PageHeader title={t('navigation.reports')} />
      <Card>
        <EmptyState
          icon={<BarChart3 size={40} className="text-text-tertiary" />}
          title={t('common.comingSoon')}
          description={t('common.comingSoonDesc')}
        />
      </Card>
    </div>
  );
}
