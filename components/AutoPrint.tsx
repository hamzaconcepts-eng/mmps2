'use client';

import { useEffect } from 'react';

/**
 * Auto-triggers window.print() on mount, then closes the tab.
 * Used in the print window opened by PrintButton.
 */
export default function AutoPrint() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
      // Close the print tab after the dialog closes
      window.close();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
