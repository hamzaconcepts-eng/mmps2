import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full table-fixed ${className}`}>
        {children}
      </table>
    </div>
  );
}

function TableHeader({ children, className = '' }: TableProps) {
  return <thead className={className}>{children}</thead>;
}

function TableBody({ children, className = '' }: TableProps) {
  return <tbody className={className}>{children}</tbody>;
}

function TableRow({ children, className = '' }: TableProps) {
  return (
    <tr className={`border-b border-gray-100 last:border-0 ${className}`}>
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: (key: string) => void;
}

function TableHead({ children, className = '', sortKey, sortDirection, onSort }: TableHeadProps) {
  const isSortable = sortKey && onSort;

  return (
    <th
      className={`text-left text-[10px] font-bold text-text-tertiary uppercase tracking-wider py-2 px-2
                  ${isSortable ? 'cursor-pointer select-none hover:text-text-secondary transition-colors' : ''}
                  ${className}`}
      onClick={isSortable ? () => onSort(sortKey) : undefined}
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {isSortable && (
          <span className="inline-flex flex-shrink-0">
            {sortDirection === 'asc' ? (
              <ChevronUp size={12} className="text-brand-teal" />
            ) : sortDirection === 'desc' ? (
              <ChevronDown size={12} className="text-brand-teal" />
            ) : (
              <ChevronsUpDown size={10} className="text-text-tertiary opacity-50" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

function TableCell({ children, className = '' }: TableProps) {
  return (
    <td className={`py-2.5 px-2 text-[12px] ${className}`}>
      {children}
    </td>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
