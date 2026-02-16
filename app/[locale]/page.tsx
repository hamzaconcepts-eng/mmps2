import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Users, GraduationCap, BookOpen, DollarSign, ArrowRight } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isRTL = locale === 'ar';

  const features = [
    {
      icon: Users,
      title: t('landing.features.students.title'),
      desc: t('landing.features.students.description'),
      bg: 'bg-brand-teal/70',
      iconBg: 'bg-accent-teal/30',
    },
    {
      icon: GraduationCap,
      title: t('landing.features.teachers.title'),
      desc: t('landing.features.teachers.description'),
      bg: 'bg-accent-ice/60',
      iconBg: 'bg-white/20',
    },
    {
      icon: BookOpen,
      title: t('landing.features.academics.title'),
      desc: t('landing.features.academics.description'),
      bg: 'bg-accent-orange/70',
      iconBg: 'bg-white/20',
    },
    {
      icon: DollarSign,
      title: t('landing.features.finance.title'),
      desc: t('landing.features.finance.description'),
      bg: 'bg-accent-teal/50',
      iconBg: 'bg-white/20',
    },
  ];

  return (
    <main className="h-screen flex flex-col overflow-hidden relative">

      {/* Top Bar — just language switcher */}
      <header className="flex items-center justify-end px-8 py-4 flex-shrink-0 relative z-10">
        <LanguageSwitcher />
      </header>

      {/* Main Content — both columns stretch to same height */}
      <div className="flex-1 flex gap-6 px-8 pb-6 min-h-0 relative z-10">
        {/* Left Column: Hero card */}
        <div className="flex flex-col justify-center flex-shrink-0 w-[380px]">
          <div className="glass-strong rounded-2xl p-8">
            {/* Logo with soft glow */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <Image
                  src="/logo.svg"
                  alt="Mashaail"
                  width={90}
                  height={90}
                  className="relative"
                  style={{ filter: 'brightness(0) invert(1) drop-shadow(0 4px 20px rgba(115,192,207,0.3))' }}
                />
              </div>
            </div>

            <h1 className="text-2xl font-black text-white text-center leading-tight mb-1" dir={isRTL ? 'rtl' : 'ltr'}>
              {t('common.schoolName')}
            </h1>
            <p className="text-xs text-text-secondary text-center mb-6">{t('landing.subtitle')}</p>

            <Link
              href={`/${locale}/auth/login`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md
                       bg-accent-orange text-white font-bold text-sm
                       shadow-[0_4px_20px_rgba(240,144,33,0.35)]
                       hover:shadow-[0_8px_30px_rgba(240,144,33,0.45)]
                       hover:-translate-y-0.5
                       transition-all duration-300"
            >
              {t('auth.signIn')}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>

        {/* Right Column: Feature Cards Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 content-center min-h-0">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`${feature.bg} rounded-2xl p-6 text-white
                           border border-white/15
                           shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                           transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]
                           flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-extrabold mb-1.5">{feature.title}</h3>
                  <p className="text-xs leading-relaxed opacity-70">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer strip */}
      <footer className="px-8 py-3 flex-shrink-0 border-t border-white/[0.06] relative z-10">
        <p className="text-[11px] text-text-tertiary text-center font-medium">
          {t('landing.footer')}
        </p>
      </footer>
    </main>
  );
}
