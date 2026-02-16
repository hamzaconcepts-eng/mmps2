'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export default function LanguageSwitcher({ className = '', variant = 'dark' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, '');
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  const styles = variant === 'light'
    ? 'bg-white/40 border-white/50 text-[#254E58]/60 hover:bg-white/60 hover:text-[#254E58]'
    : 'glass text-text-secondary hover:bg-white/[0.16] hover:text-white';

  return (
    <button
      onClick={switchLocale}
      className={`px-3 py-1.5 rounded-lg
                 font-bold text-[11px] border
                 transition-all duration-200
                 ${styles}
                 ${className}`}
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      {locale === 'en' ? '\u0639\u0631\u0628\u064a' : 'English'}
    </button>
  );
}
