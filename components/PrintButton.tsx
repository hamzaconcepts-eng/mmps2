'use client';

import { Printer } from 'lucide-react';

interface PrintButtonProps {
  label: string;
}

export default function PrintButton({ label }: PrintButtonProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => window.print()}
      onKeyDown={(e) => e.key === 'Enter' && window.print()}
      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md
                 bg-brand-teal/10 text-brand-teal border border-brand-teal/20
                 hover:bg-brand-teal/20 hover:-translate-y-0.5
                 active:scale-[0.97] transition-all duration-300 cursor-pointer select-none print:hidden"
    >
      <Printer size={14} />
      {label}
    </span>
  );
}
