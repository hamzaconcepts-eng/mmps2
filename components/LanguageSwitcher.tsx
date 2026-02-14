'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';

    // Remove current locale from pathname and add new locale
    const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, '');
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <button
      onClick={switchLocale}
      className="glass fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl
                 text-brand-deep font-semibold transition-all duration-300 hover:shadow-lg
                 hover:scale-105 border border-white/20"
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Languages size={20} />
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
