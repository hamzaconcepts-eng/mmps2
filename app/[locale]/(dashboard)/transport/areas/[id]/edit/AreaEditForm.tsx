'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateArea } from '../../actions';

interface AreaEditFormProps {
  area: any;
  locale: string;
  labels: Record<string, string>;
}

export default function AreaEditForm({ area, locale, labels }: AreaEditFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: area.name || '',
    name_ar: area.name_ar || '',
    annual_fee: String(area.annual_fee || ''),
    is_active: area.is_active ?? true,
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
    const result = await updateArea(area.id, form);
    if (result.success) {
      setMessage({ type: 'success', text: labels.updateSuccess });
      setTimeout(() => { router.push(`/${locale}/transport/areas/${area.id}`); router.refresh(); }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.updateFailed });
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
          <Input label={labels.annualFee} type="number" step="0.001" value={form.annual_fee} onChange={(e) => handleChange('annual_fee', e.target.value)} required disabled={loading} locale={locale} />
          <Select label={labels.status} value={form.is_active ? 'active' : 'inactive'} onChange={(e) => handleChange('is_active', e.target.value === 'active')} disabled={loading} locale={locale}>
            <option value="active">{labels.active}</option>
            <option value="inactive">{labels.inactive}</option>
          </Select>
        </div>
      </Card>
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/transport/areas/${area.id}`)} disabled={loading}>{labels.cancel}</Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>{loading ? labels.saving : labels.save}</Button>
      </div>
    </form>
  );
}
