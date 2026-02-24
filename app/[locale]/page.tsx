import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users, GraduationCap, BookOpen, DollarSign, ArrowRight, Bus,
  CalendarDays, Building2, MessageSquare, Globe, ShieldCheck,
  LayoutDashboard, Printer, Zap, ChevronRight, CheckCircle2, Menu,
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isRTL = locale === 'ar';

  const features = [
    { icon: Users,         key: 'students',      color: 'from-brand-teal to-[#5AAFBE]',        iconBg: 'bg-brand-teal/20'   },
    { icon: GraduationCap, key: 'teachers',       color: 'from-accent-ice to-brand-teal-soft',  iconBg: 'bg-accent-ice/30'   },
    { icon: BookOpen,      key: 'academics',      color: 'from-brand-orange to-accent-orange-soft', iconBg: 'bg-brand-orange/20' },
    { icon: DollarSign,    key: 'finance',        color: 'from-[#254E58] to-[#35707C]',        iconBg: 'bg-brand-deep/20'   },
    { icon: CalendarDays,  key: 'timetable',      color: 'from-[#6C5CE7] to-[#A29BFE]',        iconBg: 'bg-[#6C5CE7]/20'   },
    { icon: Bus,           key: 'transport',      color: 'from-[#00B894] to-[#55EFC4]',        iconBg: 'bg-[#00B894]/20'   },
    { icon: Building2,     key: 'rooms',          color: 'from-[#E17055] to-[#FAB1A0]',        iconBg: 'bg-[#E17055]/20'   },
    { icon: MessageSquare, key: 'communication',  color: 'from-[#0984E3] to-[#74B9FF]',        iconBg: 'bg-[#0984E3]/20'   },
  ];

  const highlights = [
    { icon: Globe,          key: 'bilingual' },
    { icon: ShieldCheck,    key: 'roles'     },
    { icon: LayoutDashboard,key: 'realtime'  },
    { icon: Printer,        key: 'print'     },
    { icon: ShieldCheck,    key: 'secure'    },
    { icon: Zap,            key: 'modern'    },
  ];

  const stats = [
    { value: '10+', label: t('landing.stats.modules')   },
    { value: '7',   label: t('landing.stats.roles')     },
    { value: '2',   label: t('landing.stats.languages') },
    { value: '99%', label: t('landing.stats.uptime')    },
  ];

  return (
    <main className="min-h-screen bg-surface overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo + Name */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Mashaail" width={36} height={36} />
            <span className="text-lg font-extrabold text-brand-deep hidden sm:inline">
              {isRTL ? 'مشاعل' : 'Mashaail'}
            </span>
          </Link>

          {/* Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-secondary">
            <a href="#features" className="hover:text-brand-deep transition-colors">{t('landing.nav.features')}</a>
            <a href="#modules" className="hover:text-brand-deep transition-colors">{t('landing.nav.modules')}</a>
            <a href="#why-us" className="hover:text-brand-deep transition-colors">{t('landing.nav.whyUs')}</a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/auth/login`}
              className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full bg-brand-deep text-white text-sm font-bold hover:bg-[#1B4A54] transition-colors shadow-md"
            >
              {t('landing.nav.signIn')}
              <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </nav>


      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-60px] w-[400px] h-[400px] bg-brand-orange/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent-ice/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-deep text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              {t('landing.tech.stack')}
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-teal/20 rounded-full blur-2xl scale-150" />
                <Image
                  src="/logo.svg"
                  alt="Mashaail"
                  width={100}
                  height={100}
                  className="relative"
                  style={{ filter: 'drop-shadow(0 8px 32px rgba(115,192,207,0.35))' }}
                />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-deep leading-tight mb-4 tracking-tight">
              {t('landing.hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-4 leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
            <p className="text-sm text-text-tertiary max-w-xl mx-auto mb-10">
              {t('landing.hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/auth/login`}
                className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-orange to-accent-orange text-white font-bold text-base shadow-[0_8px_30px_rgba(240,144,33,0.35)] hover:shadow-[0_12px_40px_rgba(240,144,33,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {t('landing.hero.cta')}
                <ArrowRight size={18} className={`transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand-deep/15 text-brand-deep font-bold text-base hover:border-brand-deep/30 hover:bg-brand-deep/5 transition-all duration-300"
              >
                {t('landing.hero.demo')}
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section className="relative py-8 bg-brand-deep">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-black text-white mb-1">{stat.value}</span>
                <span className="text-xs sm:text-sm text-brand-teal-soft font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════ FEATURES GRID ═══════════════════ */}
      <section id="features" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold mb-4">
              {t('landing.featuresSection.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-deep mb-4 leading-tight">
              {t('landing.featuresSection.title')}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              {t('landing.featuresSection.subtitle')}
            </p>
          </div>

          {/* Feature Cards */}
          <div id="modules" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 scroll-mt-20">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-glass hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Gradient accent top bar */}
                  <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${feature.color}`} />

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} className="text-brand-deep" />
                  </div>

                  {/* Text */}
                  <h3 className="text-base font-extrabold text-brand-deep mb-2">
                    {t(`landing.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {t(`landing.features.${feature.key}.description`)}
                  </p>

                  {/* Hover arrow */}
                  <div className={`mt-4 flex items-center gap-1 text-brand-teal text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{isRTL ? 'اكتشف المزيد' : 'Learn more'}</span>
                    <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════ WHY US / HIGHLIGHTS ═══════════════════ */}
      <section id="why-us" className="py-24 bg-gradient-to-br from-[#F8FAFB] to-[#EEF3F6] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-brand-deep/10 text-brand-deep text-xs font-bold mb-4">
              {t('landing.highlights.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-deep mb-4 leading-tight">
              {t('landing.highlights.title')}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              {t('landing.highlights.subtitle')}
            </p>
          </div>

          {/* Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-7 border border-gray-100 shadow-glass hover:shadow-glass-hover transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-teal/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-brand-teal" />
                  </div>
                  <h3 className="text-base font-extrabold text-brand-deep mb-2">
                    {t(`landing.highlights.items.${item.key}.title`)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(`landing.highlights.items.${item.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep to-[#1B4A54]" />
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-brand-teal/15 rounded-full blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] bg-brand-orange/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            {t('landing.cta.title')}
          </h2>
          <p className="text-brand-teal-soft text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {t('landing.cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/auth/login`}
              className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-orange to-accent-orange text-white font-bold text-base shadow-[0_8px_30px_rgba(240,144,33,0.4)] hover:shadow-[0_12px_40px_rgba(240,144,33,0.55)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('landing.cta.button')}
              <ArrowRight size={18} className={`transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/20 text-white font-bold text-base hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              {t('landing.cta.demo')}
            </a>
          </div>
        </div>
      </section>


      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-[#1A3A42] py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo + Copyright */}
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Mashaail" width={28} height={28} className="opacity-70" />
              <span className="text-sm text-white/50 font-medium">
                &copy; {new Date().getFullYear()} {t('landing.footer.copyright')}
              </span>
            </div>

            {/* Built by */}
            <span className="text-xs text-white/30 font-medium">
              {t('landing.footer.built')}
            </span>
          </div>
        </div>
      </footer>

    </main>
  );
}
