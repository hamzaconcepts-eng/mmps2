'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';

interface ResetFiltersProps {
  label: string;
}

/**
 * Icon button that resets all filters/search/sort by linking to the bare page URL.
 * Only visible when filters are active.
 */
export default function ResetFilters({ label }: ResetFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hide if no real filters are set (ignore internal params like 'print')
  const params = new URLSearchParams(searchParams.toString());
  params.delete('print');
  if (params.toString().length === 0) return null;

  return (
    <Link
      href={pathname}
      className="inline-flex items-center justify-center gap-1 px-2.5 py-2.5 text-[11px] font-bold rounded-md
                 bg-red-50 text-red-500 border border-red-200
                 hover:bg-red-100 hover:-translate-y-0.5
                 active:scale-[0.97] transition-all duration-300 select-none"
      title={label}
    >
      <X size={14} />
    </Link>
  );
}
