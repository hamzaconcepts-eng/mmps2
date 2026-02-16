'use client';

import { Loader2 } from 'lucide-react';

const variantStyles: Record<string, string> = {
  brand: 'bg-gradient-brand-btn text-white shadow-glass hover:shadow-glass-hover',
  teal: 'bg-gradient-teal-btn text-text-dark shadow-glass hover:shadow-glass-hover',
  orange: 'bg-gradient-orange-btn text-white shadow-glass hover:shadow-glass-hover',
  accent: 'bg-accent-orange text-white shadow-[0_4px_20px_rgba(240,144,33,0.3)] hover:shadow-[0_8px_30px_rgba(240,144,33,0.4)]',
  success: 'bg-success text-white hover:brightness-110',
  danger: 'bg-danger text-white hover:brightness-110',
  glass: 'glass text-text-primary hover:bg-gray-50',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-black/[0.04]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-[11px] gap-1.5',
  md: 'px-5 py-2 text-xs gap-2',
  lg: 'px-6 py-2.5 text-sm gap-2',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'teal' | 'orange' | 'accent' | 'success' | 'danger' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'brand',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-bold rounded-md
        transition-all duration-300
        hover:-translate-y-0.5 active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={size === 'sm' ? 12 : 14} className="animate-spin" />
          {children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
