import Sidebar from '@/components/Sidebar';
import { setRequestLocale } from 'next-intl/server';

// ISR: cache pages for 60s, then revalidate in background.
// School data changes infrequently — 60s staleness is fine.
export const revalidate = 60;

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRTL = locale === 'ar';

  return (
    <div className="h-screen overflow-hidden flex relative">
      <Sidebar locale={locale} />

      <main
        className={`flex-1 h-screen overflow-y-auto relative z-10
                   transition-all duration-200
                   ${isRTL ? 'lg:mr-[220px]' : 'lg:ml-[220px]'}`}
      >
        <div className="p-5 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
