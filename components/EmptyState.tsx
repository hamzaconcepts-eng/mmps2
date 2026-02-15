import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon = <Inbox size={40} className="text-text-tertiary" />,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 opacity-40">{icon}</div>
      <h3 className="text-sm font-bold text-text-secondary mb-1">{title}</h3>
      {description && (
        <p className="text-[11px] text-text-tertiary max-w-sm">{description}</p>
      )}
    </div>
  );
}
