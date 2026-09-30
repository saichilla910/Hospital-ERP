import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Users,
  Stethoscope,
  Calendar,
  Bed,
  ShieldAlert,
  FlaskConical,
  Receipt,
  BarChart3,
  TrendingUp,
  Settings as SettingsIcon,
  X,
  Activity
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { BrandLogo } from '../common/BrandLogo';

export const Sidebar = () => {
  const {
    activeNav,
    setActiveNav,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useHospital();

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (modKey, subKey = null) => {
    setActiveNav({ module: modKey, subModule: subKey });
    if (isMobile) setMobileSidebarOpen(false);
  };

  const navSections = [
    {
      group: 'CLINICAL OPERATIONS',
      items: [
        { key: 'dashboard',   label: 'Dashboard',       icon: LayoutGrid },
        { key: 'patients',    aliases: ['patients', 'patientManagement'], label: 'Patients', icon: Users },
        { key: 'doctors',     label: 'Doctors',          icon: Stethoscope },
        { key: 'appointment', aliases: ['appointment', 'opd'],            label: 'Appointments', icon: Calendar },
        { key: 'bedroom',     aliases: ['bedroom', 'ipd'],                label: 'IPD / Beds',   icon: Bed },
        { key: 'emergency',   aliases: ['emergency'],                     label: 'Emergency (ER)', icon: ShieldAlert },
      ]
    },
    {
      group: 'DIAGNOSTICS & FINANCE',
      items: [
        { key: 'labReports',  aliases: ['labReports', 'laboratory'],      label: 'Lab Reports',  icon: FlaskConical },
        { key: 'transaction', aliases: ['transaction', 'billing'],        label: 'Billing',      icon: Receipt },
        { key: 'reports',     label: 'Reports & Stats',  icon: BarChart3 },
        { key: 'finance',     label: 'Finance',          icon: TrendingUp },
      ]
    },
    {
      group: 'CONFIGURATION',
      items: [
        { key: 'settings',    aliases: ['settings', 'administration'],    label: 'Settings',     icon: SettingsIcon },
      ]
    }
  ];

  const isItemActive = (item) => {
    if (item.aliases) return item.aliases.includes(activeNav.module);
    return activeNav.module === item.key;
  };

  const sidebarContent = (
    <aside
      className={`w-[260px] shrink-0 h-screen flex flex-col top-0 left-0 bottom-0 overflow-hidden select-none
        transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        border-r border-border-subtle
        ${isMobile ? 'fixed z-[1200]' : 'sticky z-[950]'}
        ${
          isMobile
            ? mobileSidebarOpen
              ? 'translate-x-0 shadow-2xl'
              : '-translate-x-full shadow-none'
            : 'translate-x-0'
        }
      `}
      style={{
        background: 'var(--bg-sidebar)',
      }}
    >
      {/* ── Brand Header — Exactly 64px high to match Topbar baseline ── */}
      <div className="h-16 px-4 flex items-center justify-between shrink-0 border-b border-border-subtle">
        <div
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
          title="Go to Dashboard"
        >
          {/* Logo mark with subtle ambient presence */}
          <div className="relative group-hover:scale-105 transition-transform duration-200 shrink-0">
            <BrandLogo size={34} />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>

          <div className="overflow-hidden min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="text-[15px] font-bold text-text-main tracking-tight leading-tight truncate"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                MediCore ERP
              </span>
            </div>
            <p className="text-xs font-medium text-teal-700 dark:text-teal-400 truncate mt-0.5">
              Enterprise NABH Care
            </p>
          </div>
        </div>

        {isMobile && (
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border-subtle bg-bg-surface hover:bg-bg-surface-elevated text-text-muted hover:text-text-main cursor-pointer ml-1 transition-colors"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Navigation Items List with 12–16px inner padding and 4px gap between items ── */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col no-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={section.group} className={sIdx > 0 ? 'mt-6' : 'mt-1'}>
            <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-text-dim uppercase select-none whitespace-nowrap">
              {section.group}
            </div>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);

                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    className={`
                      relative w-full h-11 flex items-center gap-3 px-3 rounded-[10px] cursor-pointer
                      text-sm text-left transition-colors duration-150 group select-none
                      ${
                        active
                          ? 'bg-teal-50 text-teal-800 dark:bg-teal-400/15 dark:text-teal-200 font-semibold border border-teal-200/70 dark:border-teal-400/25 before:content-[""] before:absolute before:left-[-1px] before:top-2.5 before:bottom-2.5 before:w-[3px] before:rounded-full before:bg-teal-600 dark:before:bg-teal-300'
                          : 'text-text-muted hover:text-text-main hover:bg-bg-surface-elevated border border-transparent font-medium'
                      }
                    `}
                  >
                    {/* Fixed optical icon container */}
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        active
                          ? 'text-teal-700 dark:text-teal-200'
                          : 'text-text-dim group-hover:text-teal-600 dark:group-hover:text-teal-400'
                      }`}
                    >
                      <Icon
                        size={17}
                        strokeWidth={active ? 2.4 : 1.9}
                      />
                    </div>

                    {/* Label with generous left space */}
                    <span className="truncate flex-1 tracking-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Live Hospital Status Footer ── */}
      <div className="p-4 shrink-0 border-t border-border-subtle bg-bg-surface">
        <div className="p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-emerald-500/25 shadow-xs"
            style={{ background: 'rgba(16,185,129,0.12)' }}
          >
            <Activity size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-text-main truncate">
              MediCore Hospital
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 truncate">
                NABH Enterprise Care
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-[1150] animate-[fadeIn_0.2s_ease]"
          style={{ background: 'rgba(8,14,26,0.6)', backdropFilter: 'blur(4px)' }}
        />
      )}
      {sidebarContent}
    </>
  );
};
