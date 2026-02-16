interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>
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

function TableHead({ children, className = '' }: TableProps) {
  return (
    <th className={`text-left text-[10px] font-bold text-text-tertiary uppercase tracking-wider py-2 px-2 ${className}`}>
      {children}
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
