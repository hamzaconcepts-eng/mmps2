'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  label: string;
}

export default function PrintButton({ label }: PrintButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePrint = () => {
    // Open a new window with all rows (no pagination), print, then close it.
    // The current page stays exactly as it is.
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    params.set('print', '1');
    window.open(`${pathname}?${params.toString()}`, '_blank');
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handlePrint}
      onKeyDown={(e) => e.key === 'Enter' && handlePrint()}
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
