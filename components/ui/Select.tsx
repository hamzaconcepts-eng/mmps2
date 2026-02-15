'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  locale?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, locale = 'en', className = '', children, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={props.id} className="block text-xs font-bold text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full glass-input rounded-md
              py-2.5 px-3 text-sm text-white appearance-none
              focus:outline-none
              transition-all
              ${error ? 'border-danger/50' : ''}
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={14}
            className={`absolute top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none
                       ${locale === 'ar' ? 'left-3' : 'right-3'}`}
          />
        </div>
        {error && <p className="text-[11px] text-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
