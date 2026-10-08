import React from 'react';
import { Search, Bell, ShieldAlert, Sun, Moon, Menu, UserPlus, LogOut, Shield } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { BrandLogo } from '../common/BrandLogo';
import { ROLES } from '../../services/authService';

export const Topbar = () => {
  const {
    hospitalInfo,
    theme,
    toggleTheme,
    toggleMobileSidebar,
    setCommandPaletteOpen,
    setNotificationDrawerOpen,
    setActiveNav,
    userRole,
    currentUser,
    logout,
    canAccess,
    authenticatedPatient,
    setPatientOnboardingModalOpen,
    loginAsStaff
  } = useHospital();

  const currentRoleMeta = ROLES[currentUser?.role] || ROLES.admin;

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-[900]"
      style={{
        background: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-3.5 sm:gap-4 min-w-0">
        {/* ── LEFT: Mobile toggle + Brand + Search ── */}
        <div className="flex items-center gap-3 flex-1 min-w-0 max-w-[560px]">

          {/* Mobile hamburger */}
          <button
            onClick={toggleMobileSidebar}
            className="w-10 h-10 rounded-lg lg:hidden shrink-0 border border-border-subtle bg-bg-surface hover:bg-bg-surface-elevated text-text-main flex items-center justify-center cursor-pointer transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu size={18} />
          </button>

          {/* Mobile brand logo */}
          <div
            onClick={() => setActiveNav({ module: 'dashboard', subModule: null })}
            className="lg:hidden flex items-center gap-2 cursor-pointer select-none shrink-0"
            title="Go to Dashboard"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
              <BrandLogo size={18} color="#ffffff" />
            </div>
            <span className="text-[15px] font-bold text-text-main tracking-tight whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)' }}>
              HospitalCare
            </span>
          </div>

          {/* Search bar — 40px height, 12px inner padding, ⌘K hint comfortably inside */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-3 flex-1 min-w-0 h-10 pl-3 pr-3 rounded-lg
              text-sm cursor-pointer text-left
              transition-all duration-150
              bg-bg-surface-elevated border border-border-subtle hover:border-teal-500/50 hover:bg-bg-surface hover:shadow-2xs group"
            title="Search patients, doctors, beds (Ctrl+K)"
          >
            <Search size={16} className="shrink-0 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform" />
            <span className="flex-1 truncate font-medium text-[13px] text-text-muted group-hover:text-text-main transition-colors">
              Search patients, doctors, beds…
            </span>
            <kbd
              className="hidden sm:inline-flex items-center text-xs font-semibold shrink-0 py-0.5 px-2 rounded-md bg-bg-surface border border-border-subtle text-text-muted font-mono"
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* ── RIGHT: Controls with spacious, comfortable gaps, vertically centered ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* ER Alert badge */}
          <button
            onClick={() => setActiveNav({ module: 'emergency', subModule: 'triage' })}
            className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-lg cursor-pointer
              select-none transition-all duration-150 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 active:scale-[0.98]"
            title="Emergency Triage"
          >
            <ShieldAlert size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
              ER: 1 Active
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-0.5 shrink-0" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg bg-bg-surface border border-border-subtle hover:bg-bg-surface-elevated hover:border-border-strong text-text-muted hover:text-text-main flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light'
              ? <Moon size={16} className="text-text-muted" />
              : <Sun  size={16} className="text-amber-400" />
            }
          </button>

          {/* Notifications */}
          <button
            onClick={() => setNotificationDrawerOpen(prev => !prev)}
            className="w-10 h-10 rounded-lg bg-bg-surface border border-border-subtle hover:bg-bg-surface-elevated hover:border-border-strong text-text-muted hover:text-text-main flex items-center justify-center relative transition-all cursor-pointer shadow-2xs"
            title="Clinical Alerts & Feeds"
          >
            <Bell size={16} />
            <span
              className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full bg-rose-500 ring-2 ring-bg-surface"
            />
          </button>

          {/* New Patient Action (only if current role is authorized for Patients) */}
          {canAccess && canAccess('patients') && (
            <button
              onClick={() => setActiveNav({ module: 'patientManagement', subModule: 'registration' })}
              className="hidden md:flex items-center gap-1.5 h-10 px-3.5 rounded-lg text-xs font-semibold
                transition-all duration-150 shrink-0 cursor-pointer border
                bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25 hover:bg-teal-500/20 shadow-2xs"
              title="Register a new patient into the hospital directory"
            >
              <UserPlus size={15} className="shrink-0 text-teal-600 dark:text-teal-400" />
              <span>+ New Patient</span>
            </button>
          )}

          {/* Fixed Staff Role Profile Badge — Role is strictly locked once logged in */}
          <div
            className="flex items-center gap-2.5 h-10 pl-2.5 pr-3 rounded-lg select-none bg-bg-surface border border-border-subtle shadow-2xs shrink-0"
            title={`${currentUser?.name} — Position: ${currentRoleMeta.name} (Role is locked to this active session)`}
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600"
            >
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{currentRoleMeta.emoji}</span>
              )}
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-text-main max-w-[120px] truncate leading-tight">
                {currentUser?.name || 'Staff User'}
              </div>
              <div className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1 leading-tight">
                <span>{currentRoleMeta.emoji} {currentRoleMeta.name}</span>
              </div>
            </div>
          </div>

          {/* Direct Topbar Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border-subtle bg-bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 text-text-muted text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            title="Log out of HospitalCare to switch account or role"
          >
            <LogOut size={15} />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
