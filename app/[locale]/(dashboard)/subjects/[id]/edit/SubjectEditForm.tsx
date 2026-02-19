'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, BookOpen, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateSubject } from '../actions';

interface SubjectEditFormProps {
  subject: any;
  existingGrades: number[];
  locale: string;
  labels: Record<string, string>;
}

const GRADE_OPTIONS = [
  { value: -1, labelEn: 'KG 1', labelAr: 'KG 1' },
  { value: 0,  labelEn: 'KG 2', labelAr: 'KG 2' },
  { value: 1,  labelEn: 'Grade 1', labelAr: 'الصف 1' },
  { value: 2,  labelEn: 'Grade 2', labelAr: 'الصف 2' },
  { value: 3,  labelEn: 'Grade 3', labelAr: 'الصف 3' },
  { value: 4,  labelEn: 'Grade 4', labelAr: 'الصف 4' },
  { value: 5,  labelEn: 'Grade 5', labelAr: 'الصف 5' },
  { value: 6,  labelEn: 'Grade 6', labelAr: 'الصف 6' },
  { value: 7,  labelEn: 'Grade 7', labelAr: 'الصف 7' },
  { value: 8,  labelEn: 'Grade 8', labelAr: 'الصف 8' },
];

export default function SubjectEditForm({
  subject,
  existingGrades,
  locale,
  labels,
}: SubjectEditFormProps) {
  const router = useRouter();
  const isAr = locale === 'ar';

  const [form, setForm] = useState({
    code: subject.code || '',
    name: subject.name || '',
    name_ar: subject.name_ar || '',
    is_activity: subject.is_activity ?? false,
    description: subject.description || '',
    is_active: subject.is_active ?? true,
  });

  const [selectedGrades, setSelectedGrades] = useState<number[]>(existingGrades);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const toggleGrade = (value: number) => {
    setSelectedGrades((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  };

  const toggleAll = () => {
    if (selectedGrades.length === GRADE_OPTIONS.length) {
      setSelectedGrades([]);
    } else {
      setSelectedGrades(GRADE_OPTIONS.map((g) => g.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await updateSubject(subject.id, { ...form, grades: selectedGrades });

    if (result.success) {
      setMessage({ type: 'success', text: labels.updateSuccess });
      setTimeout(() => {
        router.push(`/${locale}/subjects/${subject.id}`);
        router.refresh();
      }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.updateFailed });
      setLoading(false);
    }
  };

  const allSelected = selectedGrades.length === GRADE_OPTIONS.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {message.text}
        </div>
      )}

      <p className="text-xs text-text-tertiary">
        <span className="text-danger">*</span> {labels.requiredField}
      </p>

      {/* Subject Info */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-brand-teal" />
            <Card.Title>{labels.subjectName}</Card.Title>
          </div>
        </Card.Header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input label={labels.subjectCode} value={form.code} onChange={(e) => handleChange('code', e.target.value)} required disabled={loading} locale={locale} />
          <Input label={labels.subjectName} value={form.name} onChange={(e) => handleChange('name', e.target.value)} required disabled={loading} locale={locale} lang="en" inputMode="text" />
          <Input label={labels.subjectNameAr} value={form.name_ar} onChange={(e) => handleChange('name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" lang="ar" inputMode="text" />
          <Select label={labels.subjectType} value={form.is_activity ? 'activity' : 'academic'} onChange={(e) => handleChange('is_activity', e.target.value === 'activity')} required disabled={loading} locale={locale}>
            <option value="academic">{labels.academic}</option>
            <option value="activity">{labels.activity}</option>
          </Select>
          <Select label={labels.status} value={form.is_active ? 'active' : 'inactive'} onChange={(e) => handleChange('is_active', e.target.value === 'active')} disabled={loading} locale={locale}>
            <option value="active">{labels.active}</option>
            <option value="inactive">{labels.inactive}</option>
          </Select>
          <div className="sm:col-span-1">
            <Input label={labels.description} value={form.description} onChange={(e) => handleChange('description', e.target.value)} disabled={loading} locale={locale} />
          </div>
        </div>
      </Card>

      {/* Grade Levels */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-brand-teal" />
              <Card.Title>{labels.gradeLevels}</Card.Title>
            </div>
            <button
              type="button"
              onClick={toggleAll}
              disabled={loading}
              className="text-xs text-brand-teal hover:opacity-70 transition-opacity font-medium"
            >
              {allSelected ? labels.deselectAll : labels.selectAll}
            </button>
          </div>
        </Card.Header>
        <div className="flex flex-wrap gap-2">
          {GRADE_OPTIONS.map((g) => {
            const checked = selectedGrades.includes(g.value);
            return (
              <button
                key={g.value}
                type="button"
                disabled={loading}
                onClick={() => toggleGrade(g.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  checked
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-text-secondary border-gray-200 hover:border-brand-teal hover:text-brand-teal'
                }`}
              >
                {isAr ? g.labelAr : g.labelEn}
              </button>
            );
          })}
        </div>
        {selectedGrades.length === 0 && (
          <p className="text-xs text-text-tertiary mt-2">{labels.noGradesSelected}</p>
        )}
      </Card>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/subjects/${subject.id}`)} disabled={loading}>
          {labels.cancel}
        </Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
