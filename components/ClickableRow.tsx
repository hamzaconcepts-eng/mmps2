'use client';

import { useRouter } from 'next/navigation';

interface ClickableRowProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a table row to make the entire row clickable.
 * Uses Next.js router for client-side navigation.
 */
export default function ClickableRow({ href, children, className = '' }: ClickableRowProps) {
  const router = useRouter();

  return (
    <tr
      className={`border-b border-gray-100 last:border-0
                  even:bg-gray-50/50
                  hover:bg-brand-teal/[0.04] transition-colors duration-150
                  cursor-pointer
                  ${className}`}
      onClick={() => router.push(href)}
    >
      {children}
    </tr>
  );
}
