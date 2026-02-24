import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users, GraduationCap, BookOpen, DollarSign, ArrowRight, Bus,
  CalendarDays, Building2, MessageSquare, Globe, ShieldCheck,
  LayoutDashboard, Printer, Zap, ChevronRight,
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import EnableScroll from '@/components/EnableScroll';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isRTL = locale === 'ar';

  // span: 2 = wide bento card, span: 1 = regular
  const features = [
    { icon: Users,         key: 'students',     color: 'from-brand-teal to-[#5AAFBE]',           iconBg: 'bg-brand-teal/15',     span: 2 },
    { icon: GraduationCap, key: 'teachers',      color: 'from-[#6C5CE7] to-[#A29BFE]',            iconBg: 'bg-[#6C5CE7]/15',      span: 1 },
    { icon: BookOpen,      key: 'academics',     color: 'from-brand-orange to-[#F5A623]',          iconBg: 'bg-brand-orange/15',   span: 1 },
    { icon: DollarSign,    key: 'finance',       color: 'from-[#254E58] to-[#35707C]',            iconBg: 'bg-brand-deep/15',     span: 1 },
    { icon: CalendarDays,  key: 'timetable',     color: 'from-[#6C5CE7] to-[#A29BFE]',            iconBg: 'bg-[#6C5CE7]/15',      span: 2 },
    { icon: Bus,           key: 'transport',     color: 'from-[#00B894] to-[#55EFC4]',            iconBg: 'bg-[#00B894]/15',      span: 1 },
    { icon: Building2,     key: 'rooms',         color: 'from-[#E17055] to-[#FAB1A0]',            iconBg: 'bg-[#E17055]/15',      span: 2 },
    { icon: MessageSquare, key: 'communication', color: 'from-[#0984E3] to-[#74B9FF]',            iconBg: 'bg-[#0984E3]/15',      span: 2 },
  ];

  const highlights = [
    { icon: Globe,           key: 'bilingual', accent: 'text-brand-teal',   glow: 'bg-brand-teal/20'   },
    { icon: ShieldCheck,     key: 'roles',     accent: 'text-[#A29BFE]',    glow: 'bg-[#6C5CE7]/20'   },
    { icon: LayoutDashboard, key: 'realtime',  accent: 'text-brand-orange', glow: 'bg-brand-orange/20' },
    { icon: Printer,         key: 'print',     accent: 'text-[#55EFC4]',    glow: 'bg-[#00B894]/20'   },
    { icon: ShieldCheck,     key: 'secure',    accent: 'text-[#FAB1A0]',    glow: 'bg-[#E17055]/20'   },
    { icon: Zap,             key: 'modern',    accent: 'text-[#74B9FF]',    glow: 'bg-[#0984E3]/20'   },
  ];

  const stats = [
    { value: '8',     label: t('landing.stats.modules')   },
    { value: '5',     label: t('landing.stats.roles')     },
    { value: '2',     label: t('landing.stats.languages') },
    { value: '99.9%', label: t('landing.stats.uptime')    },
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <EnableScroll />

      {/* ══════════════════════════════════ NAVBAR ══════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="School Management System" width={32} height={32} />
            <span className="text-[15px] font-extrabold text-brand-deep hidden sm:inline tracking-tight">
              {isRTL ? 'نظام إدارة المدارس' : 'School Management System'}
            </span>
          </Link>

          {/* Nav links — absolutely centered so they stay dead-center regardless of side widths */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-secondary absolute left-1/2 -translate-x-1/2">
            <a href="#features" className="hover:text-brand-deep transition-colors">{t('landing.nav.features')}</a>
            <a href="#modules" className="hover:text-brand-deep transition-colors">{t('landing.nav.modules')}</a>
            <a href="#why-us" className="hover:text-brand-deep transition-colors">{t('landing.nav.whyUs')}</a>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/auth/login`}
              className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-deep text-white text-sm font-bold hover:bg-[#1B4A54] transition-all duration-200 shadow-sm"
            >
              {t('landing.nav.signIn')}
              <ArrowRight size={13} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </nav>


      {/* ══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Subtle radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(115,192,207,0.11)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_80%,rgba(240,144,33,0.07)_0%,transparent_60%)]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.4,
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">

            {/* Logo card */}
            <div className="flex justify-center mb-10">
              <div className="relative p-5 rounded-[20px] bg-white border border-gray-100/80 shadow-[0_8px_40px_rgba(115,192,207,0.22),0_1px_3px_rgba(0,0,0,0.06)]">
                <Image src="/logo.svg" alt="School Management System" width={72} height={72} />
                <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-brand-teal/5 to-transparent" />
              </div>
            </div>

            {/* Headline */}
            <h1 className={`text-5xl sm:text-6xl lg:text-[4.5rem] font-black text-brand-deep tracking-[-0.02em] mb-6 ${isRTL ? 'leading-[1.5]' : 'leading-[1.06]'}`}>
              {isRTL
                ? <>نظام إدارة<br /><span className="bg-gradient-to-r from-brand-teal to-[#4FAFC0] bg-clip-text text-transparent">مدرسي متكامل</span></>
                : <>The Complete<br /><span className="bg-gradient-to-r from-brand-teal to-[#4FAFC0] bg-clip-text text-transparent">School OS</span></>
              }
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-3 leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
            <p className="text-sm text-text-tertiary max-w-xl mx-auto mb-10 leading-relaxed">
              {t('landing.hero.description')}
            </p>

            {/* CTA buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap mb-14">
              <Link
                href={`/${locale}/auth/login`}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-[#F5A623] text-white font-bold text-sm shadow-[0_8px_28px_rgba(240,144,33,0.38)] hover:shadow-[0_14px_40px_rgba(240,144,33,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {t('landing.hero.cta')}
                <ArrowRight size={15} className={`transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-200 bg-white text-brand-deep font-bold text-sm hover:border-brand-teal/40 hover:bg-brand-teal/5 hover:-translate-y-0.5 transition-all duration-300"
              >
                {isRTL ? 'استكشف المزايا' : 'Explore Features'}
                <ChevronRight size={15} className={isRTL ? 'rotate-180' : ''} />
              </a>
            </div>

            {/* Stat pills row */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 border border-gray-100 shadow-sm text-xs font-semibold text-text-secondary backdrop-blur-sm"
                >
                  <span className="font-black text-brand-deep text-sm">{s.value}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════ STATS STRIP ══════════════════════════════ */}
      <div className="bg-brand-deep">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-white mb-1 tracking-tight">{s.value}</div>
                <div className="text-[11px] font-semibold text-white/45 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ════════════════════════════ FEATURES BENTO ════════════════════════════ */}
      <section id="features" className="py-28 scroll-mt-20 bg-[#F8FAFB]">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-[11px] font-black mb-5 tracking-widest uppercase">
              {t('landing.featuresSection.badge')}
            </span>
            <h2 className={`text-4xl sm:text-5xl font-black text-brand-deep mb-4 tracking-[-0.02em] ${isRTL ? 'leading-[1.45]' : 'leading-tight'}`}>
              {t('landing.featuresSection.title')}
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
              {t('landing.featuresSection.subtitle')}
            </p>
          </div>

          {/* Bento grid
              Layout (4-col desktop):
              Row 1: [Students 2-col] [Teachers 1-col] [Academics 1-col]
              Row 2: [Finance 1-col]  [Timetable 2-col] [Transport 1-col]
              Row 3: [Rooms 2-col]    [Communication 2-col]
          */}
          <div id="modules" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-mt-20">
            {features.map((f, i) => {
              const Icon = f.icon;
              const isWide = f.span === 2;

              return (
                <div
                  key={i}
                  className={[
                    'group relative bg-white rounded-3xl border border-gray-100/80 overflow-hidden',
                    'shadow-[0_1px_4px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.04)]',
                    'hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1',
                    'transition-all duration-300',
                    isWide ? 'lg:col-span-2' : '',
                    isWide ? 'p-8' : 'p-6',
                  ].join(' ')}
                >
                  {/* Gradient top accent */}
                  <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${f.color}`} />

                  {/* Decorative corner orb on wide cards */}
                  {isWide && (
                    <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-30 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 100% 100%, rgba(115,192,207,0.15), transparent 70%)` }}
                    />
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon size={22} className="text-brand-deep" />
                  </div>

                  {/* Text */}
                  <h3 className={`font-extrabold text-brand-deep mb-2 ${isWide ? 'text-xl' : 'text-[15px]'}`}>
                    {t(`landing.features.${f.key}.title`)}
                  </h3>
                  <p className={`text-text-secondary leading-relaxed ${isWide ? 'text-sm max-w-xs' : 'text-xs'}`}>
                    {t(`landing.features.${f.key}.description`)}
                  </p>

                  {/* Learn more (hover) */}
                  <div className={`flex items-center gap-1.5 text-brand-teal text-xs font-bold mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{isRTL ? 'اكتشف المزيد' : 'Learn more'}</span>
                    <ChevronRight size={13} className={isRTL ? 'rotate-180' : ''} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════ WHY US — DARK ════════════════════════════ */}
      <section id="why-us" className="py-28 bg-brand-deep relative overflow-hidden scroll-mt-20">
        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(115,192,207,0.25) 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }}
        />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(240,144,33,0.2) 0%, transparent 70%)', transform: 'translate(40%, 40%)' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-[11px] font-black mb-5 tracking-widest uppercase">
              {t('landing.highlights.badge')}
            </span>
            <h2 className={`text-4xl sm:text-5xl font-black text-white mb-4 tracking-[-0.02em] ${isRTL ? 'leading-[1.45]' : 'leading-tight'}`}>
              {t('landing.highlights.title')}
            </h2>
            <p className="text-white/55 leading-relaxed text-sm sm:text-base">
              {t('landing.highlights.subtitle')}
            </p>
          </div>

          {/* Highlight cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group bg-white/[0.06] rounded-2xl p-7 border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.glow} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon size={22} className={item.accent} />
                  </div>
                  <h3 className="text-[15px] font-extrabold text-white mb-2">
                    {t(`landing.highlights.items.${item.key}.title`)}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {t(`landing.highlights.items.${item.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════ FINAL CTA ═══════════════════════════ */}
      <section className="py-28 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(115,192,207,0.08)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.35,
          }}
        />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(115,192,207,0.2)] mb-8">
            <Image src="/logo.svg" alt="" width={38} height={38} />
          </div>
          <h2 className={`text-4xl sm:text-5xl font-black text-brand-deep mb-4 tracking-[-0.02em] ${isRTL ? 'leading-[1.45]' : 'leading-tight'}`}>
            {t('landing.cta.title')}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <Link
              href={`/${locale}/auth/login`}
              className="group inline-flex items-center gap-2 px-9 py-4 rounded-full bg-gradient-to-r from-brand-orange to-[#F5A623] text-white font-bold text-sm shadow-[0_8px_28px_rgba(240,144,33,0.38)] hover:shadow-[0_14px_40px_rgba(240,144,33,0.52)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('landing.cta.button')}
              <ArrowRight size={15} className={`transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <footer className="bg-[#F8FAFB] border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="" width={24} height={24} className="opacity-40" />
              <span className="text-sm text-text-tertiary font-medium">
                &copy; {new Date().getFullYear()} {t('landing.footer.copyright')}
              </span>
            </div>
            <span className="text-xs text-text-tertiary font-medium">
              {t('landing.footer.built')}
            </span>
          </div>
        </div>
      </footer>

    </main>
  );
}
