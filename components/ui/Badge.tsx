const variantStyles: Record<string, string> = {
  brand: 'bg-brand-teal/20 text-brand-teal',
  orange: 'bg-brand-orange/20 text-brand-orange',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/20 text-danger',
  dark: 'bg-white/[0.1] text-text-secondary',
  teal: 'bg-accent-teal/25 text-accent-teal',
  ice: 'bg-accent-ice/20 text-accent-ice',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variantStyles;
  className?: string;
}

export function Badge({ children, variant = 'brand', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-lg
        text-[10px] font-extrabold tracking-wide
        border border-black/[0.06]
        ${variantStyles[variant] || variantStyles.brand}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
