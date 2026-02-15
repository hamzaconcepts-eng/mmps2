'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  locale?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, locale = 'en', className = '', ...props }, ref) => {
    const isRTL = locale === 'ar';

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={props.id} className="block text-xs font-bold text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span
              className="absolute top-1/2 -translate-y-1/2 text-text-tertiary"
              style={{ [isRTL ? 'right' : 'left']: '0.75rem' }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full glass-input rounded-md
              py-2.5 text-sm text-white placeholder:text-text-tertiary
              focus:outline-none
              transition-all
              ${icon ? (isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3') : 'px-3'}
              ${error ? 'border-danger/50' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
