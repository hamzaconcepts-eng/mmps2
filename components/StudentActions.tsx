'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ConfirmDialog from '@/components/ConfirmDialog';
import { deleteStudent } from '@/app/[locale]/(dashboard)/students/[id]/actions';

interface StudentActionsProps {
  studentId: string;
  locale: string;
  labels: {
    edit: string;
    delete: string;
    confirmTitle: string;
    confirmMessage: string;
    cancel: string;
    deleting: string;
  };
}

export default function StudentActions({
  studentId,
  locale,
  labels,
}: StudentActionsProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteStudent(studentId);
    if (result.success) {
      router.push(`/${locale}/students`);
    } else {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Button
        variant="teal"
        size="sm"
        icon={<Pencil size={14} />}
        onClick={() => router.push(`/${locale}/students/${studentId}/edit`)}
      >
        {labels.edit}
      </Button>
      <Button
        variant="danger"
        size="sm"
        icon={<Trash2 size={14} />}
        onClick={() => setShowConfirm(true)}
      >
        {labels.delete}
      </Button>

      <ConfirmDialog
        open={showConfirm}
        title={labels.confirmTitle}
        message={labels.confirmMessage}
        confirmLabel={loading ? labels.deleting : labels.delete}
        cancelLabel={labels.cancel}
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
