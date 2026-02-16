'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createUser, CreateUserData } from './actions';
import { UserPlus, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Input, Select, Button, Card } from '@/components/ui';

export default function AdminUsersPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    password: '',
    role: 'teacher',
    full_name: '',
    full_name_ar: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await createUser(formData);

    if (result.success) {
      setMessage({
        type: 'success',
        text: t('admin.userCreatedSuccess', { username: formData.username }),
      });
      setFormData({
        username: '',
        password: '',
        role: 'teacher',
        full_name: '',
        full_name_ar: '',
        phone: '',
      });
    } else {
      setMessage({
        type: 'error',
        text: result.error || t('admin.userCreateFailed'),
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-[900px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white mb-0.5">
          {t('admin.userManagement')}
        </h1>
        <p className="text-xs text-text-secondary">
          {t('admin.userManagementDesc')}
        </p>
      </div>

      {/* Create User Form */}
      <Card padding="lg">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-lg bg-accent-orange/80 flex items-center justify-center border border-white/15">
            <UserPlus size={18} className="text-white" />
          </div>
          <h2 className="text-base font-extrabold text-white">
            {t('admin.createUser')}
          </h2>
        </div>

        {/* Message */}
        {message && (
          <div className={`flex items-center gap-2.5 p-3 rounded-lg mb-5 border
                          ${message.type === 'success'
                            ? 'bg-success/15 border-success/25'
                            : 'bg-danger/15 border-danger/25'}`}>
            {message.type === 'success' ? (
              <CheckCircle size={16} className="text-success flex-shrink-0" />
            ) : (
              <XCircle size={16} className="text-danger flex-shrink-0" />
            )}
            <p className={`text-xs font-medium ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <Input
                id="username"
                type="text"
                required
                label={`${t('auth.username')} *`}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g., teacher01"
                disabled={loading}
                locale={locale}
                pattern="[a-zA-Z][a-zA-Z0-9_]{2,19}"
              />
              <p className="text-[10px] text-text-tertiary mt-1 font-medium">
                {t('admin.usernameRule')}
              </p>
            </div>

            {/* Password */}
            <div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-text-secondary">
                  {t('auth.password')} *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full glass-input rounded-md
                             px-3 py-2.5 text-sm text-white placeholder:text-text-tertiary
                             focus:outline-none
                             transition-all disabled:opacity-50
                             ${isRTL ? 'pl-10' : 'pr-10'}`}
                    placeholder={t('auth.password')}
                    disabled={loading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-text-tertiary hover:text-brand-teal transition-colors
                               ${isRTL ? 'left-3' : 'right-3'}`}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-text-tertiary mt-1 font-medium">
                {t('admin.passwordRule')}
              </p>
            </div>

            {/* Full Name EN */}
            <Input
              id="full_name"
              type="text"
              required
              label={`${t('admin.fullNameEn')} *`}
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Ahmed Al-Said"
              disabled={loading}
              locale={locale}
            />

            {/* Full Name AR */}
            <Input
              id="full_name_ar"
              type="text"
              required
              label={`${t('admin.fullNameAr')} *`}
              value={formData.full_name_ar}
              onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
              placeholder={"\u0623\u062d\u0645\u062f \u0627\u0644\u0633\u0639\u064a\u062f"}
              disabled={loading}
              locale={locale}
              dir="rtl"
            />

            {/* Role */}
            <Select
              id="role"
              required
              label={`${t('admin.role')} *`}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={loading}
              locale={locale}
            >
              <option value="owner">{t('roles.owner')}</option>
              <option value="admin">{t('roles.admin')}</option>
              <option value="teacher">{t('roles.teacher')}</option>
              <option value="class_supervisor">{t('roles.class_supervisor')}</option>
              <option value="student">{t('roles.student')}</option>
              <option value="parent">{t('roles.parent')}</option>
              <option value="accountant">{t('roles.accountant')}</option>
            </Select>

            {/* Phone */}
            <Input
              id="phone"
              type="tel"
              label={t('admin.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+968 9123 4567"
              disabled={loading}
              locale={locale}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="accent"
              size="md"
              loading={loading}
              icon={!loading ? <UserPlus size={15} /> : undefined}
            >
              {loading ? t('admin.creating') : t('admin.createUser')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Instructions */}
      <Card padding="md">
        <h3 className="text-sm font-extrabold text-white mb-3">
          {t('admin.instructions')}
        </h3>
        <ul className="space-y-1.5 text-[11px] text-text-secondary">
          <li className="flex gap-2">
            <span className="text-accent-orange font-bold">1.</span>
            <span><strong className="text-white">{t('auth.username')}</strong>: {t('admin.usernameRule')}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent-orange font-bold">2.</span>
            <span><strong className="text-white">{t('auth.password')}</strong>: {t('admin.passwordRule')}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent-orange font-bold">3.</span>
            <span>{t('admin.noEmailRule')}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent-orange font-bold">4.</span>
            <span>{t('admin.loginRule')}</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
