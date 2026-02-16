'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  locale?: string;
}

export default function SearchBar({ placeholder = 'Search...', locale = 'en' }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') || '');
  const isRTL = locale === 'ar';

  const updateSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set('search', term);
        params.delete('page'); // Reset page on new search
      } else {
        params.delete('search');
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, updateSearch]);

  return (
    <div className="relative">
      <Search
        size={15}
        className={`absolute top-1/2 -translate-y-1/2 text-text-tertiary ${isRTL ? 'right-3' : 'left-3'}`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full glass-input rounded-md py-2.5 text-sm text-text-primary placeholder:text-text-tertiary
                   focus:outline-none transition-all
                   ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </div>
  );
}
