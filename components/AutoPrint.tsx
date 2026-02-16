'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Auto-triggers window.print() on mount, then navigates back to the original URL.
 */
export default function AutoPrint() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl');

    // Small delay to let the full table render
    const timer = setTimeout(() => {
      window.print();
      // After print dialog closes, go back to where the user was
      if (returnUrl) {
        router.replace(returnUrl);
      } else {
        router.back();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return null;
}
