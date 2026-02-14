'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createUser, CreateUserData } from './actions';
import { UserPlus, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        text: `User "${formData.username}" created successfully!`
      });
      // Reset form
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
        text: result.error || 'Failed to create user'
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass p-8 rounded-3xl border border-white/20">
        <h1 className="text-4xl font-black text-brand-deep mb-2">
          User Management
        </h1>
        <p className="text-gray-600 text-lg">
          Create and manage system users
        </p>
      </div>

      {/* Create User Form */}
      <div className="glass p-8 rounded-3xl border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-sky to-brand-deep
                         flex items-center justify-center shadow-lg">
            <UserPlus size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-brand-deep">
            Create New User
          </h2>
        </div>

        {/* Message */}
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border
                          ${message.type === 'success'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'}`}>
            {message.type === 'success' ? (
              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
            ) : (
              <XCircle size={20} className="text-red-600 flex-shrink-0" />
            )}
            <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                Username *
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-white/50 border border-gray-200 rounded-2xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent
                         transition-all duration-200"
                placeholder="e.g., teacher01, admin, student123"
                disabled={loading}
                pattern="[a-zA-Z][a-zA-Z0-9_]{2,19}"
                title="3-20 characters, start with letter, letters/numbers/underscore only"
              />
              <p className="text-xs text-gray-500">
                3-20 chars, start with letter, no spaces or special chars
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password *
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/50 border border-gray-200 rounded-2xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent
                         transition-all duration-200"
                placeholder="Secure password"
                disabled={loading}
                minLength={8}
              />
              <p className="text-xs text-gray-500">
                Minimum 8 characters
              </p>
            </div>

            {/* Full Name (English) */}
            <div className="space-y-2">
              <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700">
                Full Name (English) *
              </label>
              <input
                id="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-white/50 border border-gray-200 rounded-2xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent
                         transition-all duration-200"
                placeholder="Ahmed Al-Said"
                disabled={loading}
              />
            </div>

            {/* Full Name (Arabic) */}
            <div className="space-y-2">
              <label htmlFor="full_name_ar" className="block text-sm font-semibold text-gray-700">
                Full Name (Arabic) *
              </label>
              <input
                id="full_name_ar"
                type="text"
                required
                dir="rtl"
                value={formData.full_name_ar}
                onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
                className="w-full bg-white/50 border border-gray-200 rounded-2xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent
                         transition-all duration-200"
                placeholder="أحمد السعيد"
                disabled={loading}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                Role *
              </label>
              <select
                id="role"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-white/50 border border-gray-200 rounded-2xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent
                         transition-all duration-200"
                disabled={loading}
              >
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="class_supervisor">Class Supervisor</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="accountant">Accountant</option>
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/50 border border-gray-200 rounded-2xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent
                         transition-all duration-200"
                placeholder="+968 9123 4567"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-brand-deep to-brand-sky text-white
                       px-8 py-3 rounded-2xl font-bold text-lg
                       hover:shadow-xl hover:scale-105 active:scale-95
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Instructions */}
      <div className="glass p-6 rounded-3xl border border-white/20">
        <h3 className="text-lg font-bold text-brand-deep mb-3">
          ℹ️ Instructions
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Username</strong>: Must be unique, 3-20 characters, start with a letter</li>
          <li>• <strong>Password</strong>: Minimum 8 characters, will be used to login</li>
          <li>• <strong>No Email Required</strong>: System automatically handles email internally</li>
          <li>• <strong>Login</strong>: Users login with username + password only</li>
        </ul>
      </div>
    </div>
  );
}
