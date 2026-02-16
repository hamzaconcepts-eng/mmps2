interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  colorScheme?: 'teal' | 'ice' | 'orange' | 'light';
  className?: string;
}

const colorSchemes: Record<string, { bg: string; textColor: string; glow: string }> = {
  teal: {
    bg: 'bg-accent-teal/80',
    textColor: 'text-text-dark',
    glow: 'shadow-[0_4px_30px_rgba(115,192,207,0.25)]',
  },
  ice: {
    bg: 'bg-accent-ice/70',
    textColor: 'text-text-dark',
    glow: 'shadow-[0_4px_30px_rgba(150,199,211,0.2)]',
  },
  orange: {
    bg: 'bg-accent-orange/85',
    textColor: 'text-white',
    glow: 'shadow-[0_4px_30px_rgba(240,144,33,0.25)]',
  },
  light: {
    bg: 'bg-accent-light/80',
    textColor: 'text-text-dark',
    glow: 'shadow-[0_4px_30px_rgba(228,228,228,0.15)]',
  },
};

export function StatCard({
  icon,
  label,
  value,
  change,
  colorScheme = 'teal',
  className = '',
}: StatCardProps) {
  const scheme = colorSchemes[colorScheme];

  return (
    <div
      className={`
        ${scheme.bg} rounded-lg p-4 ${scheme.textColor}
               border border-white/20
        ${scheme.glow}
        transition-all duration-300
        hover:-translate-y-1 hover:brightness-105
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-md flex items-center justify-center bg-white/20 backdrop-blur-sm">
          {icon}
        </div>
        {change && (
          <span className="text-[10px] font-extrabold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-xl font-black mb-0.5">{value}</h3>
      <p className="text-[11px] opacity-70 font-semibold">{label}</p>
    </div>
  );
}
