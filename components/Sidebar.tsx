'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import SignOutButton from './SignOutButton';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  School,
  ClipboardCheck,
  FileText,
  Calendar,
  DollarSign,
  CreditCard,
  Receipt,
  MessageSquare,
  Megaphone,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  locale: string;
  userRole?: string;
}

export default function Sidebar({ locale, userRole = 'admin' }: SidebarProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isRTL = locale === 'ar';

  const navigationItems = [
    {
      key: 'home',
      icon: Home,
      href: `/${locale}/dashboard`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor', 'student', 'parent', 'accountant'],
    },
    {
      key: 'students',
      icon: Users,
      href: `/${locale}/students`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor'],
    },
    {
      key: 'teachers',
      icon: GraduationCap,
      href: `/${locale}/teachers`,
      roles: ['owner', 'admin'],
    },
    {
      key: 'classes',
      icon: School,
      href: `/${locale}/classes`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor'],
    },
    {
      key: 'subjects',
      icon: BookOpen,
      href: `/${locale}/subjects`,
      roles: ['owner', 'admin', 'teacher'],
    },
    {
      key: 'attendance',
      icon: ClipboardCheck,
      href: `/${locale}/attendance`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor'],
    },
    {
      key: 'grades',
      icon: FileText,
      href: `/${locale}/grades`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor', 'student', 'parent'],
    },
    {
      key: 'exams',
      icon: Calendar,
      href: `/${locale}/exams`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor'],
    },
    {
      key: 'timetable',
      icon: Calendar,
      href: `/${locale}/timetable`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor', 'student'],
    },
    {
      key: 'invoices',
      icon: Receipt,
      href: `/${locale}/invoices`,
      roles: ['owner', 'admin', 'accountant', 'parent'],
    },
    {
      key: 'payments',
      icon: CreditCard,
      href: `/${locale}/payments`,
      roles: ['owner', 'admin', 'accountant'],
    },
    {
      key: 'finance',
      icon: DollarSign,
      href: `/${locale}/finance`,
      roles: ['owner', 'admin', 'accountant'],
    },
    {
      key: 'messages',
      icon: MessageSquare,
      href: `/${locale}/messages`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor', 'student', 'parent'],
    },
    {
      key: 'announcements',
      icon: Megaphone,
      href: `/${locale}/announcements`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor', 'student', 'parent'],
    },
    {
      key: 'reports',
      icon: BarChart3,
      href: `/${locale}/reports`,
      roles: ['owner', 'admin', 'teacher', 'class_supervisor', 'accountant'],
    },
    {
      key: 'administration',
      icon: Settings,
      href: `/${locale}/admin`,
      roles: ['owner', 'admin'],
    },
  ];

  const filteredNavigation = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const CollapseIcon = isRTL ? ChevronRight : ChevronLeft;
  const ExpandIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 z-50 lg:hidden glass p-3 rounded-2xl text-brand-deep
                   transition-all duration-300 hover:scale-105 border border-white/20"
        style={{ [isRTL ? 'left' : 'right']: '6rem' }}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 h-screen glass border-e border-white/20 z-40
                   transition-all duration-300 flex flex-col
                   ${isRTL ? 'right-0' : 'left-0'}
                   ${isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
                   lg:translate-x-0
                   ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Mashaail Logo"
                width={isCollapsed ? 40 : 48}
                height={isCollapsed ? 40 : 48}
                className="transition-all duration-300"
              />
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h2 className="font-bold text-lg text-brand-deep whitespace-nowrap">
                    {isRTL ? 'مشاعل' : 'Mashaail'}
                  </h2>
                  <p className="text-xs text-gray-600 whitespace-nowrap">
                    {t('common.appName').split(' ')[0]}
                  </p>
                </div>
              )}
            </div>

            {/* Collapse Toggle - Desktop Only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl
                         hover:bg-white/50 transition-colors text-brand-deep"
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ExpandIcon size={18} /> : <CollapseIcon size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 scrollbar-thin">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl
                           transition-all duration-300 group relative
                           hover:bg-white/50 hover:shadow-md
                           text-gray-700 hover:text-brand-deep
                           ${isCollapsed ? 'justify-center' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">
                    {t(`navigation.${item.key}`)}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className={`absolute ${isRTL ? 'right-full mr-2' : 'left-full ml-2'}
                                  px-3 py-2 rounded-xl glass text-sm font-medium
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                  transition-all duration-200 whitespace-nowrap z-50
                                  border border-white/20`}>
                    {t(`navigation.${item.key}`)}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href={`/${locale}/profile`}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl
                       transition-all duration-300 hover:bg-white/50
                       ${isCollapsed ? 'justify-center' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-sky to-brand-deep
                          flex items-center justify-center text-white font-bold flex-shrink-0">
              {isRTL ? 'م' : 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-deep truncate">
                  {isRTL ? 'مستخدم' : 'User'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {t(`roles.${userRole}`)}
                </p>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <SignOutButton locale={locale} />
          )}
        </div>
      </aside>
    </>
  );
}
