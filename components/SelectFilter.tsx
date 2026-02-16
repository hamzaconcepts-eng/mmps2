'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface SelectFilterProps {
  paramKey: string;
  placeholder: string;
  options: { value: string; label: string }[];
  currentValue: string;
}

/**
 * Generic URL-param-based select filter.
 * Resets pagination when value changes.
 */
export default function SelectFilter({ paramKey, placeholder, options, currentValue }: SelectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="w-full glass-input rounded-md py-2.5 px-3 text-sm text-text-primary focus:outline-none transition-all appearance-none"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
