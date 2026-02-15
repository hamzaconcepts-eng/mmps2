'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface ClassFilterProps {
  classes: { id: string; name: string; name_ar: string }[];
  locale: string;
  placeholder: string;
  currentValue: string;
}

export default function ClassFilter({ classes, locale, placeholder, currentValue }: ClassFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value) {
      params.set('class', value);
    } else {
      params.delete('class');
    }
    // Reset page when filter changes
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="w-full glass-input rounded-md py-2.5 px-3 text-sm text-white focus:outline-none transition-all appearance-none"
    >
      <option value="">{placeholder}</option>
      {classes.map((cls) => (
        <option key={cls.id} value={cls.id}>
          {locale === 'ar' ? cls.name_ar : cls.name}
        </option>
      ))}
    </select>
  );
}
