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
export default function DualDateBar() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [dates, setDates] = useState<{ hijri: string; gregorian: string }>({ hijri: '', gregorian: '' });

  useEffect(() => {
    const now = new Date();

    if (locale === 'ar') {
      // Arabic page: both dates in Arabic
      const hijri = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      const gregorian = now.toLocaleDateString('ar-OM', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      setDates({ hijri, gregorian });
    } else {
      // English page: both dates in English
      const hijri = now.toLocaleDateString('en-SA-u-ca-islamic-umalqura', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      const gregorian = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      setDates({ hijri, gregorian });
    }
  }, [locale]);

  if (!dates.hijri) return null;

  return (
    <div className="flex items-center gap-2 mb-4 px-1" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Calendar size={14} className="text-brand-teal flex-shrink-0" />
      <div className="flex flex-col">
        <span className="text-[11px] text-text-primary font-semibold leading-tight">
          {dates.hijri}
        </span>
        <span className="text-[10px] text-text-tertiary font-medium leading-tight">
          {dates.gregorian}
        </span>
      </div>
    </div>
  );
}
