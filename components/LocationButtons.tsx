'use client';

import { useState } from 'react';
import { ExternalLink, Share2, Check } from 'lucide-react';

interface LocationButtonsProps {
  url: string;
  locale: string;
}

/**
 * Two buttons for a GPS location:
 * 1. Open in browser (new tab)
 * 2. Share / copy link to clipboard
 */
export default function LocationButtons({ url, locale }: LocationButtonsProps) {
  const [copied, setCopied] = useState(false);
  const isAr = locale === 'ar';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Open in browser */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md
                   bg-brand-teal/10 text-brand-teal border border-brand-teal/20
                   hover:bg-brand-teal/20 transition-all"
      >
        <ExternalLink size={13} />
        {isAr ? 'فتح الموقع' : 'Open Location'}
      </a>

      {/* Copy / Share */}
      <span
        role="button"
        tabIndex={0}
        onClick={handleCopy}
        onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md
                   border transition-all cursor-pointer select-none
                   ${copied
                     ? 'bg-success/10 text-success border-success/20'
                     : 'bg-accent-orange/10 text-accent-orange border-accent-orange/20 hover:bg-accent-orange/20'
                   }`}
      >
        {copied ? <Check size={13} /> : <Share2 size={13} />}
        {copied
          ? (isAr ? 'تم النسخ!' : 'Copied!')
          : (isAr ? 'مشاركة الموقع' : 'Share Location')
        }
      </span>
    </div>
  );
}
