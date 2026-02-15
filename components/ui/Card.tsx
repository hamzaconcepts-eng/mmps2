interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingStyles: Record<string, string> = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  return (
    <div
      className={`
        glass rounded-lg
        transition-all duration-300
        ${hover ? 'hover:-translate-y-1 hover:shadow-glass-hover' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-sm font-extrabold text-white ${className}`}>
      {children}
    </h3>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
