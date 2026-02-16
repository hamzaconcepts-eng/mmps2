'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * Auto-triggers window.print() on mount, then removes the ?print param.
 */
export default function AutoPrint() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Small delay to let the full table render
    const timer = setTimeout(() => {
      window.print();
      // After print dialog closes, navigate back without ?print
      const params = new URLSearchParams(searchParams.toString());
      params.delete('print');
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [router, pathname, searchParams]);

  return null;
}
