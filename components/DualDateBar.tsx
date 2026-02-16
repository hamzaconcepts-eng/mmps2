'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

export default function DualDateBar() {
  const [dates, setDates] = useState<{ en: string; ar: string }>({ en: '', ar: '' });

  useEffect(() => {
    const now = new Date();
    const en = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const ar = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setDates({ en, ar });
  }, []);

  if (!dates.en) return null;

  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-2 text-[11px] text-text-secondary font-medium">
        <Calendar size={13} className="text-brand-teal" />
        <span>{dates.en}</span>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-text-secondary font-medium" dir="rtl">
        <Calendar size={13} className="text-brand-teal" />
        <span>{dates.ar}</span>
      </div>
    </div>
  );
}
