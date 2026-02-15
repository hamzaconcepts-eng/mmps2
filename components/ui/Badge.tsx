const variantStyles: Record<string, string> = {
  brand: 'bg-brand-teal/20 text-brand-teal backdrop-blur-sm',
  orange: 'bg-brand-orange/20 text-brand-orange backdrop-blur-sm',
  success: 'bg-success/20 text-success backdrop-blur-sm',
  warning: 'bg-warning/20 text-warning backdrop-blur-sm',
  danger: 'bg-danger/20 text-danger backdrop-blur-sm',
  dark: 'bg-white/[0.1] text-text-secondary backdrop-blur-sm',
  teal: 'bg-accent-teal/25 text-accent-teal backdrop-blur-sm',
  ice: 'bg-accent-ice/20 text-accent-ice backdrop-blur-sm',
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
        border border-white/[0.08]
        ${variantStyles[variant] || variantStyles.brand}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
