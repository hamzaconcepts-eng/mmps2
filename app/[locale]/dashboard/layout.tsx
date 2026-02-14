import Sidebar from '@/components/Sidebar';
import { setRequestLocale } from 'next-intl/server';

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
    <div className="min-h-screen relative">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-dream-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-drift-slow" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-dream-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-drift-slower" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-dream-sky rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-drift" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-dream-peach rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-drift-slow" />
      </div>

      <Sidebar locale={locale} />

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300
                   ${isRTL ? 'lg:mr-72' : 'lg:ml-72'}`}
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
