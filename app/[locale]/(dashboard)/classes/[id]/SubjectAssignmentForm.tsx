'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Trash2, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { addClassSubject, removeClassSubject } from './actions';

interface Subject { id: string; name: string; name_ar: string; code: string; }
interface Teacher { id: string; displayName: string; }
interface Assignment { id: string; periods_per_week: number; subjects: Subject | null; teachers: { id: string; displayName: string } | null; }

interface Props {
  classId: string;
  locale: string;
  subjects: Subject[];
  teachers: Teacher[];
  assignments: Assignment[];
  labels: Record<string, string>;
}

export default function SubjectAssignmentForm({ classId, locale, subjects, teachers, assignments, labels }: Props) {
  const router = useRouter();
  const isAr = locale === 'ar';

  const [open, setOpen] = useState(false);
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [periodsPerWeek, setPeriodsPerWeek] = useState(4);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter out already-assigned subjects
  const assignedSubjectIds = assignments.map((a) => a.subjects?.id).filter(Boolean);
  const availableSubjects = subjects.filter((s) => !assignedSubjectIds.includes(s.id));

  const handleAdd = async () => {
    if (!subjectId) return;
    setLoading(true);
    setMessage(null);
    const result = await addClassSubject({
      classId,
      subjectId,
      teacherId: teacherId || null,
      periodsPerWeek,
    });
    setLoading(false);
    if (result.success) {
      setMessage({ type: 'success', text: labels.subjectAssigned });
      setSubjectId('');
      setTeacherId('');
      setPeriodsPerWeek(4);
      setOpen(false);
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error || labels.assignFailed });
    }
  };

  const handleRemove = async (assignmentId: string) => {
    setRemovingId(assignmentId);
    const result = await removeClassSubject(assignmentId, classId);
    setRemovingId(null);
    if (result.success) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-3">
      {/* Message */}
      {message && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={13} /> : <XCircle size={13} />}
          {message.text}
        </div>
      )}

      {/* Assignment rows */}
      {assignments.map((sa) => (
        <div key={sa.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] text-brand-teal bg-brand-teal/10 px-1.5 py-0.5 rounded flex-shrink-0">
              {sa.subjects?.code}
            </span>
            <span className="text-[11px] font-semibold text-text-primary truncate">
              {sa.subjects ? (isAr ? sa.subjects.name_ar : sa.subjects.name) : '—'}
            </span>
            {sa.teachers && (
              <span className="text-[10px] text-text-tertiary truncate hidden sm:block">
                · {sa.teachers.displayName}
              </span>
            )}
            <span className="text-[10px] text-text-tertiary flex-shrink-0">
              {sa.periods_per_week}p/w
            </span>
          </div>
          <button
            onClick={() => handleRemove(sa.id)}
            disabled={removingId === sa.id}
            className="flex-shrink-0 p-1 rounded text-text-tertiary hover:text-danger hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      {/* Add form */}
      {open ? (
        <div className="border border-brand-teal/20 rounded-lg p-3 bg-brand-teal/5 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Select
              label={labels.selectSubject}
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              locale={locale}
              disabled={loading}
            >
              <option value="">{labels.selectSubject}</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {isAr ? s.name_ar : s.name}
                </option>
              ))}
            </Select>
            <Select
              label={labels.selectTeacher}
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              locale={locale}
              disabled={loading}
            >
              <option value="">{labels.noTeacher}</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.displayName}</option>
              ))}
            </Select>
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1">{labels.periodsPerWeek}</label>
              <input
                type="number"
                min={1}
                max={15}
                value={periodsPerWeek}
                onChange={(e) => setPeriodsPerWeek(Number(e.target.value))}
                disabled={loading}
                className="w-full h-9 px-3 text-[12px] rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button type="button" variant="glass" size="sm" onClick={() => { setOpen(false); setMessage(null); }} disabled={loading}>
              <X size={13} />
            </Button>
            <Button type="button" variant="accent" size="sm" onClick={handleAdd} loading={loading} disabled={!subjectId}>
              {loading ? labels.saving : labels.save}
            </Button>
          </div>
          {availableSubjects.length === 0 && (
            <p className="text-[11px] text-text-tertiary">{labels.noSubjectsForGrade}</p>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="glass"
          size="sm"
          icon={<Plus size={13} />}
          onClick={() => { setOpen(true); setMessage(null); }}
        >
          {labels.assignSubject}
        </Button>
      )}
    </div>
  );
}
