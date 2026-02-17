'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, User, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateTeacher } from '../actions';

interface TeacherEditFormProps {
  teacher: any;
  locale: string;
  labels: Record<string, string>;
}

export default function TeacherEditForm({
  teacher,
  locale,
  labels,
}: TeacherEditFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: teacher.first_name || '',
    last_name: teacher.last_name || '',
    first_name_ar: teacher.first_name_ar || '',
    last_name_ar: teacher.last_name_ar || '',
    gender: teacher.gender || 'male',
    phone: teacher.phone || '',
    email: teacher.email || '',
    specialization: teacher.specialization || '',
    specialization_ar: teacher.specialization_ar || '',
    qualifications: teacher.qualifications || '',
    hire_date: teacher.hire_date || '',
    national_id: teacher.national_id || '',
    is_active: teacher.is_active ?? true,
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

    const result = await updateTeacher(teacher.id, form);

    if (result.success) {
      setMessage({ type: 'success', text: labels.updateSuccess });
      setTimeout(() => {
        router.push(`/${locale}/teachers/${teacher.id}`);
        router.refresh();
      }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.updateFailed });
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* English Names */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-brand-teal" />
              <Card.Title>{labels.englishNames}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.firstName} value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.lastName} value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} required disabled={loading} locale={locale} />
          </div>
        </Card>

        {/* Arabic Names */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-accent-orange" />
              <Card.Title>{labels.arabicNames}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.firstNameAr} value={form.first_name_ar} onChange={(e) => handleChange('first_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.lastNameAr} value={form.last_name_ar} onChange={(e) => handleChange('last_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
          </div>
        </Card>

        {/* Professional Info */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <GraduationCap size={15} className="text-success" />
                <Card.Title>{labels.professionalInfo}</Card.Title>
              </div>
            </Card.Header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Select label={labels.gender} value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} required disabled={loading} locale={locale}>
                <option value="male">{labels.male}</option>
                <option value="female">{labels.female}</option>
              </Select>
              <Input label={labels.phone} value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={loading} locale={locale} placeholder="91234567" />
              <Input label={labels.email} value={form.email} onChange={(e) => handleChange('email', e.target.value)} required disabled={loading} locale={locale} type="email" />
              <Input label={labels.specialization} value={form.specialization} onChange={(e) => handleChange('specialization', e.target.value)} disabled={loading} locale={locale} />
              <Input label={labels.specializationAr} value={form.specialization_ar} onChange={(e) => handleChange('specialization_ar', e.target.value)} disabled={loading} locale={locale} dir="rtl" />
              <Input label={labels.qualifications} value={form.qualifications} onChange={(e) => handleChange('qualifications', e.target.value)} disabled={loading} locale={locale} />
              <Input label={labels.hireDate} type="date" value={form.hire_date} onChange={(e) => handleChange('hire_date', e.target.value)} required disabled={loading} locale={locale} />
              <Input label={labels.nationalId} value={form.national_id} onChange={(e) => handleChange('national_id', e.target.value)} disabled={loading} locale={locale} />
              <Select label={labels.status} value={form.is_active ? 'active' : 'inactive'} onChange={(e) => handleChange('is_active', e.target.value === 'active')} disabled={loading} locale={locale}>
                <option value="active">{labels.active}</option>
                <option value="inactive">{labels.inactive}</option>
              </Select>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/teachers/${teacher.id}`)} disabled={loading}>
          {labels.cancel}
        </Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
