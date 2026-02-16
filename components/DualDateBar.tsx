'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar } from 'lucide-react';

/**
 * Dual date bar: Hijri date on top, Gregorian below.
 * Both dates are rendered in the page's current language.
 * AR page → both dates in Arabic script
 * EN page → both dates in English script
 */
export default function DualDateBar({ variant = 'default' }: { variant?: 'default' | 'sidebar' }) {
  const isSidebar = variant === 'sidebar';
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [dates, setDates] = useState<{ hijri: string; gregorian: string }>({ hijri: '', gregorian: '' });

  useEffect(() => {
    const now = new Date();

    if (locale === 'ar') {
      // Arabic page: both dates in Arabic — day name on Hijri only
      const hijri = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      const gregorian = now.toLocaleDateString('ar-OM', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      setDates({ hijri, gregorian });
    } else {
      // English page: both dates in English — day name on Hijri only
      const hijri = now.toLocaleDateString('en-SA-u-ca-islamic-umalqura', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      const gregorian = now.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      setDates({ hijri, gregorian });
    }
  }, [locale]);

  if (!dates.hijri) return null;

  return (
    <div className={`flex items-center gap-2 px-1 ${isSidebar ? '' : 'mb-4'}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Calendar size={14} className={`flex-shrink-0 ${isSidebar ? 'text-brand-teal/70' : 'text-brand-teal'}`} />
      <div className="flex flex-col">
        <span className={`text-[11px] font-semibold leading-tight ${isSidebar ? 'text-white/90' : 'text-text-primary'}`}>
          {dates.hijri}
        </span>
        <span className={`text-[10px] font-medium leading-tight ${isSidebar ? 'text-white/40' : 'text-text-tertiary'}`}>
          {dates.gregorian}
        </span>
      </div>
    </div>
  );
}
