import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Calendar } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { Card } from '@/components/ui/Card';

export default async function TimetablePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="max-w-[1200px]">
      <PageHeader title={t('timetable.title')} />
      <Card>
        <EmptyState
          icon={<Calendar size={40} className="text-text-tertiary" />}
          title={t('common.comingSoon')}
          description={t('common.comingSoonDesc')}
        />
      </Card>
    </div>
  );
}
