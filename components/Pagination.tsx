import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  locale?: string;
}

export default function Pagination({ currentPage, totalPages, basePath, locale = 'en' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const isRTL = locale === 'ar';
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  // Show max 5 page numbers around current
  const getPages = () => {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const buildHref = (page: number) => {
    const url = new URL(basePath, 'http://localhost');
    url.searchParams.set('page', page.toString());
    return `${url.pathname}${url.search}`;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="p-2 rounded-lg glass hover:bg-black/[0.04] transition-all text-text-secondary hover:text-text-primary"
        >
          <PrevIcon size={14} />
        </Link>
      ) : (
        <span className="p-2 rounded-lg text-text-tertiary/30 cursor-not-allowed">
          <PrevIcon size={14} />
        </span>
      )}

      {/* Page Numbers */}
      {getPages().map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-[12px] font-bold transition-all
            ${page === currentPage
              ? 'bg-accent-orange/85 text-white shadow-[0_2px_12px_rgba(240,144,33,0.25)]'
              : 'glass hover:bg-black/[0.04] text-text-secondary hover:text-text-primary'
            }`}
        >
          {page}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="p-2 rounded-lg glass hover:bg-black/[0.04] transition-all text-text-secondary hover:text-text-primary"
        >
          <NextIcon size={14} />
        </Link>
      ) : (
        <span className="p-2 rounded-lg text-text-tertiary/30 cursor-not-allowed">
          <NextIcon size={14} />
        </span>
      )}
    </div>
  );
}
