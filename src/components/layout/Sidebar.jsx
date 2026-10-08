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
  Pill,
  ShieldCheck,
  X,
  Activity,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { BrandLogo } from '../common/BrandLogo';
import { ROLES } from '../../services/authService';

export const Sidebar = () => {
  const {
    activeNav,
    setActiveNav,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    currentUser,
    canAccess,
    logout
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

  const allNavSections = [
    {
      group: 'CLINICAL OPERATIONS',
      items: [
        { key: 'dashboard',   label: 'Dashboard',       icon: LayoutGrid, permKey: 'dashboard' },
        { key: 'patients',    aliases: ['patients', 'patientManagement'], label: 'Patients', icon: Users, permKey: 'patients' },
        { key: 'doctors',     label: 'Doctors',          icon: Stethoscope, permKey: 'doctors' },
        { key: 'appointment', aliases: ['appointment', 'opd'],            label: 'Appointments', icon: Calendar, permKey: 'appointment' },
        { key: 'bedroom',     aliases: ['bedroom', 'ipd'],                label: 'IPD / Beds',   icon: Bed, permKey: 'ipd' },
        { key: 'emergency',   aliases: ['emergency'],                     label: 'Emergency (ER)', icon: ShieldAlert, permKey: 'emergency' },
      ]
    },
    {
      group: 'DIAGNOSTICS & FINANCE',
      items: [
        { key: 'pharmacy',    label: 'Pharmacy',         icon: Pill, permKey: 'pharmacy' },
        { key: 'labReports',  aliases: ['labReports', 'laboratory'],      label: 'Lab Reports',  icon: FlaskConical, permKey: 'laboratory' },
        { key: 'transaction', aliases: ['transaction', 'billing'],        label: 'Billing',      icon: Receipt, permKey: 'billing' },
        { key: 'reports',     label: 'Reports & Stats',  icon: BarChart3, permKey: 'reports' },
        { key: 'finance',     label: 'Finance',          icon: TrendingUp, permKey: 'finance' },
      ]
    },
    {
      group: 'CONFIGURATION & USERS',
      items: [
        { key: 'administration', aliases: ['administration', 'users'], label: 'Users & Staff', icon: ShieldCheck, permKey: 'users' },
        { key: 'settings',    label: 'Settings',     icon: SettingsIcon, permKey: 'settings' },
      ]
    }
  ];

  // Role-filtered navigation sections
  const navSections = allNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccess(item.permKey || item.key))
    }))
    .filter((section) => section.items.length > 0);

  const currentRoleMeta = ROLES[currentUser?.role] || ROLES.admin;

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
                HospitalCare ERP
              </span>
            </div>
            <p className="text-xs font-medium text-teal-700 dark:text-teal-400 truncate mt-0.5">
              Clinical & Resource Management
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

      {/* ── Active Staff Role & Hospital Status Footer ── */}
      <div className="p-3.5 shrink-0 border-t border-border-subtle bg-bg-surface flex flex-col gap-2">
        {/* User Role Card */}
        {currentUser && (
          <div className="p-2.5 rounded-xl bg-bg-surface-elevated border border-border-subtle flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-teal-500/30 flex items-center justify-center bg-teal-500/10 text-base">
                {currentRoleMeta.emoji}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-text-main truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 truncate">
                  <span>{currentRoleMeta.name}</span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out of HospitalCare ERP"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        {/* Live Hospital Status */}
        <div className="px-2.5 py-1.5 rounded-lg bg-bg-surface flex items-center justify-between text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-text-main">NABH Enterprise</span>
          </div>
          <span className="text-[10px] text-text-dim">v2.4 Online</span>
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
