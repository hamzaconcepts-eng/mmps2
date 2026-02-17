import Sidebar from '@/components/Sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DualDateBar from '@/components/DualDateBar';
import { setRequestLocale } from 'next-intl/server';
import { getCurrentUserRole } from '@/lib/auth/get-current-user-role';

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
  const currentUser = await getCurrentUserRole();

  return (
    <div className="h-screen overflow-hidden flex relative">
      <Sidebar locale={locale} userRole={currentUser?.role || 'admin'} />

      <main
        className={`flex-1 h-screen overflow-y-auto relative z-10
                   transition-all duration-200
                   ${isRTL ? 'lg:mr-[220px]' : 'lg:ml-[220px]'}`}
      >
        <div className="p-5 lg:p-6">
          <div className="flex items-center justify-between mb-2 print:hidden">
            <DualDateBar />
            <LanguageSwitcher variant="light" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
