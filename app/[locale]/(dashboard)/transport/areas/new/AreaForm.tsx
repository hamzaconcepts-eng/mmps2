'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createArea } from '../actions';

interface AreaFormProps {
  locale: string;
  labels: Record<string, string>;
}

export default function AreaForm({ locale, labels }: AreaFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', name_ar: '', annual_fee: '' });
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
    const result = await createArea(form);
    if (result.success) {
      setMessage({ type: 'success', text: labels.createSuccess });
      setTimeout(() => { router.push(`/${locale}/transport/areas/${result.areaId}`); router.refresh(); }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.createFailed });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {message.text}
        </div>
      )}
      <p className="text-xs text-text-tertiary"><span className="text-danger">*</span> {labels.requiredField}</p>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-brand-teal" />
            <Card.Title>{labels.areaName}</Card.Title>
          </div>
        </Card.Header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label={labels.areaName} value={form.name} onChange={(e) => handleChange('name', e.target.value)} required disabled={loading} locale={locale} />
          <Input label={labels.areaNameAr} value={form.name_ar} onChange={(e) => handleChange('name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
          <Input label={labels.annualFee} type="number" step="0.001" value={form.annual_fee} onChange={(e) => handleChange('annual_fee', e.target.value)} required disabled={loading} locale={locale} placeholder="150.000" />
        </div>
      </Card>
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/transport`)} disabled={loading}>{labels.cancel}</Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>{loading ? labels.saving : labels.save}</Button>
      </div>
    </form>
  );
}
