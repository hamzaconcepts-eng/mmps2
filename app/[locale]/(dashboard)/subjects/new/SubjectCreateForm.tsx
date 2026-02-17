'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createSubject } from '../actions';

interface SubjectCreateFormProps {
  locale: string;
  labels: Record<string, string>;
}

export default function SubjectCreateForm({
  locale,
  labels,
}: SubjectCreateFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    code: '',
    name: '',
    name_ar: '',
    is_activity: false,
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await createSubject(form);

    if (result.success) {
      setMessage({ type: 'success', text: labels.createSuccess });
      setTimeout(() => {
        router.push(`/${locale}/subjects/${result.subjectId}`);
        router.refresh();
      }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.createFailed });
      setLoading(false);
    }
  };

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

      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-brand-teal" />
            <Card.Title>{labels.subjectName}</Card.Title>
          </div>
        </Card.Header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input label={labels.subjectCode} value={form.code} onChange={(e) => handleChange('code', e.target.value)} required disabled={loading} locale={locale} placeholder="MATH" />
          <Input label={labels.subjectName} value={form.name} onChange={(e) => handleChange('name', e.target.value)} required disabled={loading} locale={locale} />
          <Input label={labels.subjectNameAr} value={form.name_ar} onChange={(e) => handleChange('name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
          <Select label={labels.subjectType} value={form.is_activity ? 'activity' : 'academic'} onChange={(e) => handleChange('is_activity', e.target.value === 'activity')} required disabled={loading} locale={locale}>
            <option value="academic">{labels.academic}</option>
            <option value="activity">{labels.activity}</option>
          </Select>
          <div className="sm:col-span-2">
            <Input label={labels.description} value={form.description} onChange={(e) => handleChange('description', e.target.value)} disabled={loading} locale={locale} />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/subjects`)} disabled={loading}>
          {labels.cancel}
        </Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
