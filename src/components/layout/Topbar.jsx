import React from 'react';
import { Search, Bell, ShieldAlert, Sun, Moon, Menu, UserPlus } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { BrandLogo } from '../common/BrandLogo';

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
    authenticatedPatient,
    setPatientOnboardingModalOpen,
    loginAsStaff
  } = useHospital();

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
              style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)' }}>
              <BrandLogo size={18} color="#ffffff" />
            </div>
            <span className="text-[15px] font-bold text-text-main tracking-tight whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)' }}>
              MediCore
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

          {/* Patient register / portal button */}
          <button
            onClick={() => {
              if (userRole === 'patient') {
                setActiveNav({ module: 'patientManagement', subModule: 'profile' });
              } else {
                setActiveNav({ module: 'patientManagement', subModule: 'registration' });
              }
            }}
            className="hidden md:flex items-center gap-2 h-10 px-3.5 rounded-lg text-xs font-semibold
              transition-all duration-150 shrink-0 cursor-pointer border"
            style={userRole === 'patient' ? {
              background: 'var(--teal-600)',
              color: '#fff',
              borderColor: 'var(--teal-600)',
              boxShadow: '0 1px 3px rgba(13,148,136,0.25)',
            } : {
              background: 'rgba(13, 148, 136, 0.08)',
              color: 'var(--teal-700)',
              borderColor: 'rgba(13, 148, 136, 0.25)',
            }}
            title="Register new patient or log in to Patient Portal"
          >
            <UserPlus size={16} className="shrink-0" />
            <span>{userRole === 'patient' ? 'Patient Portal' : 'Register / Log In'}</span>
          </button>

          {/* User profile badge */}
          {userRole === 'patient' && authenticatedPatient ? (
            <div
              onClick={() => setActiveNav({ module: 'patientManagement', subModule: 'profile' })}
              className="flex items-center gap-2.5 h-10 pl-2 pr-3 rounded-lg cursor-pointer
                select-none transition-all duration-150 bg-bg-surface border border-teal-500/30 hover:border-teal-500 shadow-2xs shrink-0"
              title={`Logged in as ${authenticatedPatient.name}`}
            >
              <img
                src={authenticatedPatient.photo}
                alt={authenticatedPatient.name}
                className="w-7 h-7 rounded-md object-cover shrink-0 border border-teal-500/30"
              />
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold text-text-main max-w-[90px] truncate">
                  {authenticatedPatient.name}
                </div>
                <div className="text-[10px] font-medium text-teal-600 dark:text-teal-400">
                  {authenticatedPatient.mrn}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); loginAsStaff(); }}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md cursor-pointer
                  transition-colors duration-150 border-none ml-1 bg-bg-surface-elevated text-text-muted hover:bg-rose-600 hover:text-white"
                title="Switch back to Staff Mode"
              >
                Exit
              </button>
            </div>
          ) : (
            <div
              onClick={() => setActiveNav({ module: 'administration', subModule: 'users' })}
              className="flex items-center gap-2.5 h-10 pl-2 pr-3 rounded-lg cursor-pointer
                select-none transition-all duration-150 bg-bg-surface border border-border-subtle hover:border-teal-500/40 hover:shadow-2xs shrink-0"
              title="Dr. Sarah Jenkins — CMO / Admin"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-[11px] shrink-0 shadow-2xs"
                style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)' }}
              >
                SJ
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold text-text-main leading-tight">Dr. Sarah</div>
                <div className="text-[10px] font-medium leading-tight text-teal-600 dark:text-teal-400">
                  CMO / Admin
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
