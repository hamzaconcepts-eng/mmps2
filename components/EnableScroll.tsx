'use client';
import { useEffect } from 'react';

/** Overrides the global `overflow: hidden` on body for pages that need to scroll. */
export default function EnableScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = '';
    };
  }, []);
  return null;
}
