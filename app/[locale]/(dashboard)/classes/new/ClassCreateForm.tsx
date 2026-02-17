'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, School } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatTeacherName } from '@/lib/utils/format';
import { createClass } from '../actions';

interface ClassCreateFormProps {
  teachers: any[];
  locale: string;
  labels: Record<string, string>;
}

const GRADE_LEVELS = [
  { value: -1, labelEn: 'KG-1', labelAr: 'روضة أولى' },
  { value: 0, labelEn: 'KG-2', labelAr: 'روضة ثانية' },
  { value: 1, labelEn: 'Grade 1', labelAr: 'الصف ١' },
  { value: 2, labelEn: 'Grade 2', labelAr: 'الصف ٢' },
  { value: 3, labelEn: 'Grade 3', labelAr: 'الصف ٣' },
  { value: 4, labelEn: 'Grade 4', labelAr: 'الصف ٤' },
  { value: 5, labelEn: 'Grade 5', labelAr: 'الصف ٥' },
  { value: 6, labelEn: 'Grade 6', labelAr: 'الصف ٦' },
  { value: 7, labelEn: 'Grade 7', labelAr: 'الصف ٧' },
  { value: 8, labelEn: 'Grade 8', labelAr: 'الصف ٨' },
];

export default function ClassCreateForm({
  teachers,
  locale,
  labels,
}: ClassCreateFormProps) {
  const router = useRouter();
  const isAr = locale === 'ar';

  const [form, setForm] = useState({
    name: '',
    name_ar: '',
    grade_level: '',
    section: '',
    capacity: '30',
    room_number: '',
    class_supervisor_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await createClass({
      ...form,
      grade_level: parseInt(form.grade_level, 10),
      capacity: parseInt(form.capacity, 10) || 30,
    });

    if (result.success) {
      setMessage({ type: 'success', text: labels.createSuccess });
      setTimeout(() => {
        router.push(`/${locale}/classes/${result.classId}`);
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
            <School size={15} className="text-brand-teal" />
            <Card.Title>{labels.className}</Card.Title>
          </div>
        </Card.Header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input label={labels.className} value={form.name} onChange={(e) => handleChange('name', e.target.value)} required disabled={loading} locale={locale} />
          <Input label={labels.classNameAr} value={form.name_ar} onChange={(e) => handleChange('name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
          <Select label={labels.gradeLevel} value={form.grade_level} onChange={(e) => handleChange('grade_level', e.target.value)} required disabled={loading} locale={locale}>
            <option value="">—</option>
            {GRADE_LEVELS.map((gl) => (
              <option key={gl.value} value={gl.value}>
                {isAr ? gl.labelAr : gl.labelEn}
              </option>
            ))}
          </Select>
          <Input label={labels.section} value={form.section} onChange={(e) => handleChange('section', e.target.value)} required disabled={loading} locale={locale} placeholder="A" />
          <Input label={labels.capacity} type="number" value={form.capacity} onChange={(e) => handleChange('capacity', e.target.value)} required disabled={loading} locale={locale} />
          <Input label={labels.roomNumber} value={form.room_number} onChange={(e) => handleChange('room_number', e.target.value)} disabled={loading} locale={locale} />
          <Select label={labels.supervisor} value={form.class_supervisor_id} onChange={(e) => handleChange('class_supervisor_id', e.target.value)} disabled={loading} locale={locale}>
            <option value="">{labels.selectSupervisor}</option>
            {teachers.map((t: any) => (
              <option key={t.id} value={t.id}>
                {formatTeacherName(t, locale)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/classes`)} disabled={loading}>
          {labels.cancel}
        </Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
