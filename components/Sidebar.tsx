'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SignOutButton from './SignOutButton';
import DualDateBar from './DualDateBar';
import {
  Home, Users, GraduationCap, BookOpen, School,
  ClipboardCheck, FileText, Calendar, DollarSign,
  CreditCard, Receipt, MessageSquare, Megaphone,
  BarChart3, Settings, ChevronLeft, ChevronRight, Bus,
} from 'lucide-react';

interface SidebarProps {
  locale: string;
  userRole?: string;
}

type NavItem = { key: string; icon: typeof Home; href: string; roles: string[] };
type NavGroup = { labelKey: string; items: NavItem[] };

export default function Sidebar({ locale, userRole = 'admin' }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isRTL = locale === 'ar';

  const navGroups: NavGroup[] = [
    {
      labelKey: 'sidebar.main',
      items: [
        { key: 'home', icon: Home, href: `/${locale}/dashboard`, roles: ['owner','admin','teacher','class_supervisor','student','parent','accountant'] },
        { key: 'students', icon: Users, href: `/${locale}/students`, roles: ['owner','admin','teacher','class_supervisor'] },
        { key: 'teachers', icon: GraduationCap, href: `/${locale}/teachers`, roles: ['owner','admin'] },
        { key: 'classes', icon: School, href: `/${locale}/classes`, roles: ['owner','admin','teacher','class_supervisor'] },
        { key: 'subjects', icon: BookOpen, href: `/${locale}/subjects`, roles: ['owner','admin','teacher'] },
        { key: 'transport', icon: Bus, href: `/${locale}/transport`, roles: ['owner','admin'] },
      ],
    },
    {
      labelKey: 'sidebar.academics',
      items: [
        { key: 'attendance', icon: ClipboardCheck, href: `/${locale}/attendance`, roles: ['owner','admin','teacher','class_supervisor'] },
        { key: 'grades', icon: FileText, href: `/${locale}/grades`, roles: ['owner','admin','teacher','class_supervisor','student','parent'] },
        { key: 'exams', icon: Calendar, href: `/${locale}/exams`, roles: ['owner','admin','teacher','class_supervisor'] },
        { key: 'timetable', icon: Calendar, href: `/${locale}/timetable`, roles: ['owner','admin','teacher','class_supervisor','student'] },
      ],
    },
    {
      labelKey: 'sidebar.financeSection',
      items: [
        { key: 'invoices', icon: Receipt, href: `/${locale}/invoices`, roles: ['owner','admin','accountant','parent'] },
        { key: 'payments', icon: CreditCard, href: `/${locale}/payments`, roles: ['owner','admin','accountant'] },
        { key: 'finance', icon: DollarSign, href: `/${locale}/finance`, roles: ['owner','admin','accountant'] },
      ],
    },
    {
      labelKey: 'sidebar.communication',
      items: [
        { key: 'messages', icon: MessageSquare, href: `/${locale}/messages`, roles: ['owner','admin','teacher','class_supervisor','student','parent'] },
        { key: 'announcements', icon: Megaphone, href: `/${locale}/announcements`, roles: ['owner','admin','teacher','class_supervisor','student','parent'] },
        { key: 'reports', icon: BarChart3, href: `/${locale}/reports`, roles: ['owner','admin','teacher','class_supervisor','accountant'] },
      ],
    },
    {
      labelKey: 'sidebar.system',
      items: [
        { key: 'administration', icon: Settings, href: `/${locale}/admin`, roles: ['owner','admin'] },
      ],
    },
  ];

  const isActive = (href: string, key: string) => {
    if (key === 'home') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const CollapseIcon = isRTL ? ChevronRight : ChevronLeft;
  const ExpandIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <aside
      className={`fixed top-0 h-screen z-40
                 sidebar-dark
                 transition-all duration-300 flex flex-col
                 ${isRTL ? 'right-0' : 'left-0'}
                 ${isCollapsed ? 'w-[68px]' : 'w-[220px]'}`}
      style={{ borderRight: isRTL ? 'none' : undefined, borderLeft: isRTL ? undefined : 'none' }}
    >
      {/* Logo + School Name */}
      <div className="px-4 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="Mashaail"
            width={isCollapsed ? 28 : 32}
            height={isCollapsed ? 28 : 32}
            className="transition-all duration-200 brightness-0 invert"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-[13px] text-white whitespace-nowrap leading-tight">
                {isRTL ? '\u0645\u062f\u0631\u0633\u0629 \u0645\u0634\u0627\u0639\u0644 \u0645\u0633\u0642\u0637' : 'Mashaail Muscat'}
              </span>
              <span className="text-[9px] text-white/50 font-medium whitespace-nowrap leading-tight">
                {isRTL ? '\u0627\u0644\u062e\u0627\u0635\u0629' : 'Private School'}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-6 h-6 rounded
                     hover:bg-white/[0.08] transition-colors text-white/40 hover:text-white/60"
        >
          {isCollapsed ? <ExpandIcon size={14} /> : <CollapseIcon size={14} />}
        </button>
      </div>

      {/* User */}
      <div className={`px-3 pb-3 flex-shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Link
          href={`/${locale}/profile`}
          className={`flex items-center gap-2.5 px-2 py-2 rounded-lg
                     hover:bg-white/[0.06] transition-all duration-200
                     ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-brand-teal/30 flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 border border-white/15">
            {isRTL ? '\u0645' : 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[12px] text-white truncate">
                {isRTL ? '\u0645\u0633\u062a\u062e\u062f\u0645' : 'User'}
              </p>
              <p className="text-[10px] text-white/40 truncate">
                {t(`roles.${userRole}`)}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.labelKey} className="mb-1">
              {!isCollapsed && (
                <p className="text-[9px] font-extrabold tracking-[1.5px] uppercase text-white/40 px-3 pt-3 pb-1">
                  {t(group.labelKey)}
                </p>
              )}
              {isCollapsed && <div className="h-2" />}

              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.key);

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                                 transition-all duration-200 group relative
                                 ${active
                                   ? 'bg-accent-orange/85 text-white font-bold shadow-[0_2px_12px_rgba(240,144,33,0.25)]'
                                   : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                                 }
                                 ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <Icon size={16} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-[12px] font-semibold whitespace-nowrap">
                          {t(`navigation.${item.key}`)}
                        </span>
                      )}

                      {isCollapsed && (
                        <div className={`absolute ${isRTL ? 'right-full mr-2' : 'left-full ml-2'}
                                        px-2.5 py-1.5 rounded-lg bg-brand-deep text-white text-[11px] font-semibold
                                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                        transition-all duration-200 whitespace-nowrap z-50
                                        shadow-[0_4px_12px_rgba(0,0,0,0.2)]`}>
                          {t(`navigation.${item.key}`)}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Date */}
      {!isCollapsed && (
        <div className="px-3 py-2 flex-shrink-0 border-t border-white/[0.06]">
          <DualDateBar variant="sidebar" />
        </div>
      )}

      {/* Sign Out */}
      {!isCollapsed && (
        <div className="px-3 py-3 flex-shrink-0 border-t border-white/[0.06]">
          <SignOutButton locale={locale} />
        </div>
      )}
    </aside>
  );
}
