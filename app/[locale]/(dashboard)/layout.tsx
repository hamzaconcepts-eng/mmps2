import Sidebar from '@/components/Sidebar';
import { setRequestLocale } from 'next-intl/server';

// All dashboard pages use Supabase queries at request time
export const dynamic = 'force-dynamic';

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
      {/* Subtle background orbs for dashboard */}
      <div className="orb orb-teal w-[400px] h-[400px] -top-40 right-20 opacity-20 animate-drift-slow" />
      <div className="orb orb-orange w-[250px] h-[250px] bottom-20 left-40 opacity-15 animate-drift" />

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
