import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Users, GraduationCap, BookOpen, DollarSign } from 'lucide-react';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = useTranslations();

  const features = [
    {
      icon: Users,
      title: t('landing.features.students.title'),
      description: t('landing.features.students.description'),
      color: 'from-dream-pink to-dream-lavender',
    },
    {
      icon: GraduationCap,
      title: t('landing.features.teachers.title'),
      description: t('landing.features.teachers.description'),
      color: 'from-dream-lavender to-dream-sky',
    },
    {
      icon: BookOpen,
      title: t('landing.features.academics.title'),
      description: t('landing.features.academics.description'),
      color: 'from-dream-sky to-dream-mint',
    },
    {
      icon: DollarSign,
      title: t('landing.features.finance.title'),
      description: t('landing.features.finance.description'),
      color: 'from-dream-peach to-dream-yellow',
    },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-dream-pink rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-drift-slow" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-dream-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-drift-slower" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-dream-sky rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-drift" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-dream-peach rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-drift-slow" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-dream-mint rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-drift-slower" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo with Glow Effect */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-sky/30 blur-3xl rounded-full" />
              <Image
                src="/logo.svg"
                alt="Mashaail Logo"
                width={180}
                height={180}
                className="relative drop-shadow-2xl animate-float"
                priority
              />
            </div>
          </div>

          {/* Bilingual Headers */}
          <div className="space-y-3 mb-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-brand-deep leading-tight" dir="rtl">
              {t('common.schoolName')}
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-brand-sky to-brand-deep bg-clip-text text-transparent">
              {t('landing.hero.subtitle')}
            </h2>
          </div>

          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('landing.hero.description')}
          </p>

          <button className="glass px-10 py-4 rounded-3xl text-lg font-bold text-brand-deep
                           transition-all duration-300 hover:scale-105 hover:shadow-2xl
                           border-2 border-brand-sky/30 hover:border-brand-sky/60">
            {t('landing.hero.cta')}
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass p-8 rounded-3xl hover:scale-105 transition-all duration-500
                         border border-white/20 hover:shadow-2xl group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color}
                              flex items-center justify-center mb-6
                              group-hover:scale-110 transition-transform duration-300
                              shadow-lg`}>
                <feature.icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-deep mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-6 py-20">
        <div className="glass max-w-4xl mx-auto p-12 rounded-3xl text-center border border-white/20">
          <h3 className="text-2xl font-bold text-brand-deep mb-4">
            {t('landing.tech.title')}
          </h3>
          <p className="text-lg text-gray-600 font-mono">
            {t('landing.tech.stack')}
          </p>
        </div>
      </section>
    </main>
  );
}
