interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-5">
      <div>
        <h1 className="text-xl font-extrabold text-white">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-text-tertiary mt-0.5 font-medium">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
