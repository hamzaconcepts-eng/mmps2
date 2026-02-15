import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FileText } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { Card } from '@/components/ui/Card';

export default async function GradesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="max-w-[1200px]">
      <PageHeader title={t('navigation.grades')} />
      <Card>
        <EmptyState
          icon={<FileText size={40} className="text-text-tertiary" />}
          title={t('common.comingSoon')}
          description={t('common.comingSoonDesc')}
        />
      </Card>
    </div>
  );
}
