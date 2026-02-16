'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PrintButtonProps {
  label: string;
}

export default function PrintButton({ label }: PrintButtonProps) {
  return (
    <Button
      variant="glass"
      size="sm"
      icon={<Printer size={14} />}
      onClick={() => window.print()}
    >
      {label}
    </Button>
  );
}
