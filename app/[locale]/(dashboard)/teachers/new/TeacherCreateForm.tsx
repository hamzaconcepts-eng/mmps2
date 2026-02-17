'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, User, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createTeacher } from '../actions';

interface TeacherCreateFormProps {
  locale: string;
  labels: Record<string, string>;
}

export default function TeacherCreateForm({
  locale,
  labels,
}: TeacherCreateFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [teacher, setTeacher] = useState({
    first_name: '',
    last_name: '',
    first_name_ar: '',
    last_name_ar: '',
    gender: 'male',
    phone: '',
    email: '',
    specialization: '',
    specialization_ar: '',
    qualifications: '',
    hire_date: today,
    national_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: string, value: string) => {
    setTeacher((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await createTeacher({ teacher });

    if (result.success) {
      setMessage({ type: 'success', text: labels.createSuccess });
      setTimeout(() => {
        router.push(`/${locale}/teachers/${result.teacherId}`);
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
            <Input label={labels.firstName} value={teacher.first_name} onChange={(e) => handleChange('first_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.lastName} value={teacher.last_name} onChange={(e) => handleChange('last_name', e.target.value)} required disabled={loading} locale={locale} />
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
            <Input label={labels.firstNameAr} value={teacher.first_name_ar} onChange={(e) => handleChange('first_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.lastNameAr} value={teacher.last_name_ar} onChange={(e) => handleChange('last_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
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
              <Select label={labels.gender} value={teacher.gender} onChange={(e) => handleChange('gender', e.target.value)} required disabled={loading} locale={locale}>
                <option value="male">{labels.male}</option>
                <option value="female">{labels.female}</option>
              </Select>
              <Input label={labels.phone} value={teacher.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={loading} locale={locale} placeholder="91234567" />
              <Input label={labels.email} value={teacher.email} onChange={(e) => handleChange('email', e.target.value)} required disabled={loading} locale={locale} type="email" />
              <Input label={labels.specialization} value={teacher.specialization} onChange={(e) => handleChange('specialization', e.target.value)} disabled={loading} locale={locale} />
              <Input label={labels.specializationAr} value={teacher.specialization_ar} onChange={(e) => handleChange('specialization_ar', e.target.value)} disabled={loading} locale={locale} dir="rtl" />
              <Input label={labels.qualifications} value={teacher.qualifications} onChange={(e) => handleChange('qualifications', e.target.value)} disabled={loading} locale={locale} />
              <Input label={labels.hireDate} type="date" value={teacher.hire_date} onChange={(e) => handleChange('hire_date', e.target.value)} required disabled={loading} locale={locale} />
              <Input label={labels.nationalId} value={teacher.national_id} onChange={(e) => handleChange('national_id', e.target.value)} disabled={loading} locale={locale} />
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/teachers`)} disabled={loading}>
          {labels.cancel}
        </Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
