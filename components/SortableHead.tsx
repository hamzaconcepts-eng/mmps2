'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Table } from '@/components/ui/Table';

interface SortableHeadProps {
  children: React.ReactNode;
  sortKey: string;
  className?: string;
}

/**
 * Client wrapper around Table.Head that manages sort state via URL params.
 * Reads `sort` and `dir` from searchParams and toggles on click.
 * Cycle: none → asc → desc → none
 */
export default function SortableHead({ children, sortKey, className }: SortableHeadProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort');
  const currentDir = searchParams.get('dir');

  const isActive = currentSort === sortKey;
  const direction: 'asc' | 'desc' | null = isActive
    ? (currentDir as 'asc' | 'desc') || 'asc'
    : null;

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset page on sort change

    if (!isActive) {
      // First click: sort ascending
      params.set('sort', sortKey);
      params.set('dir', 'asc');
    } else if (currentDir === 'asc') {
      // Second click: sort descending
      params.set('sort', sortKey);
      params.set('dir', 'desc');
    } else {
      // Third click: remove sort
      params.delete('sort');
      params.delete('dir');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Table.Head
      sortKey={sortKey}
      sortDirection={direction}
      onSort={handleSort}
      className={className}
    >
      {children}
    </Table.Head>
  );
}
