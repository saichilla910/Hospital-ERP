import React from 'react';
import {
  Bed,
  Users,
  Siren,
  Building2,
  Clock,
  Calendar,
  Activity,
  UserPlus,
  ChevronRight,
  Menu
} from 'lucide-react';

export const DoctorWelcomeBanner = ({
  doctor = {
    name: 'Dr. Sarah Jenkins',
    title: 'Lead CMO',
    status: 'Live On Duty',
    campus: 'Cyberabad Super Speciality Campus',
    mobileCampus: 'Cyberabad Campus',
    shift: 'Morning Clinical Shift',
    shiftHours: '07:00 - 15:30',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80'
  },
  stats = {
    vacantBeds: 10,
    opdInflow: 6,
    erTraumaBays: 3
  },
  onNewPatientClick,
  onBedClick,
  onOpdClick,
  onErClick,
  onMenuClick
}) => {
  // Current date formatted dynamically as in mockup: Tue, Sep 29, 2026
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-teal-500/25 dark:border-teal-500/20 p-5 sm:p-6 lg:p-7 shadow-xs transition-all duration-300 bg-bg-surface"
      style={{
        background:
          'linear-gradient(135deg, rgba(240, 253, 250, 0.75) 0%, rgba(244, 253, 251, 0.6) 35%, rgba(236, 254, 255, 0.5) 70%, var(--bg-surface) 100%)'
      }}
    >
      {/* Top Ambient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500" />

      {/* Subtle ECG Heartbeat Watermark in Background */}
      <svg
        className="absolute right-12 sm:right-24 md:right-40 lg:right-56 top-6 sm:top-8 w-60 sm:w-80 md:w-96 lg:w-[460px] h-20 sm:h-24 opacity-25 dark:opacity-15 pointer-events-none text-teal-500"
        viewBox="0 0 400 80"
        fill="none"
      >
        <path
          d="M0 40 H110 L120 18 L132 64 L142 32 L150 48 L158 40 H230 L240 12 L252 68 L262 28 L272 52 L280 40 H400"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ── TOP SECTION: Doctor Profile, Hierarchy & Primary Actions ── */}
      <div className="relative z-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">
        {/* Left: Avatar + Details Hierarchy */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0 flex-1">
          {/* Avatar with Status Beacon */}
          <div className="relative shrink-0 mt-0.5 sm:mt-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden p-[2px] bg-gradient-to-tr from-teal-500 via-cyan-400 to-indigo-500 shadow-sm">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-full h-full rounded-[14px] object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-2xs flex items-center justify-center"
              title="Online & Active on Shift"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          {/* Texts & Visual Hierarchy (Title -> Subtitle -> Metadata) */}
          <div className="min-w-0 flex-1">
            {/* 1. Page Title & Greeting */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-text-main tracking-tight font-display leading-snug">
                <span>Welcome back, </span>
                <span className="text-teal-700 dark:text-teal-300 font-bold">
                  {doctor.name}
                </span>{' '}
                <span className="inline-block hover:rotate-12 transition-transform duration-200">
                  👋
                </span>
              </h2>

              {/* Status Badge */}
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shrink-0 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{doctor.status} • {doctor.title}</span>
              </span>
            </div>

            {/* 2. Hospital / Campus & Shift Information (8px-12px below title) */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-text-muted mt-2 flex-wrap">
              <div className="flex items-center gap-1.5 font-medium text-text-main">
                <Building2 size={15} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{doctor.campus}</span>
              </div>

              <span className="text-border-strong font-light">•</span>

              <div className="flex items-center gap-1.5 text-text-muted">
                <Clock size={15} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="font-semibold text-teal-700 dark:text-teal-300">
                  {doctor.shift}
                </span>
                <span className="text-text-dim">
                  ({doctor.shiftHours})
                </span>
              </div>
            </div>
          </div>

          {/* Mobile hamburger menu button */}
          <button
            onClick={onMenuClick}
            className="flex sm:hidden p-2 text-text-dim hover:text-text-main transition-colors ml-auto self-start cursor-pointer"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right: Primary Action Button & Date Widget */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* New Patient Intake Button */}
          <button
            onClick={onNewPatientClick}
            className="btn btn-primary h-[42px] px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm shadow-teal-600/20"
          >
            <UserPlus size={16} />
            <span>+ New Patient Intake</span>
          </button>

          {/* Date Widget Card */}
          <div className="h-[42px] px-4 rounded-xl bg-bg-surface-elevated border border-border-subtle shadow-2xs flex items-center gap-3 shrink-0">
            <Calendar size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs sm:text-sm font-semibold text-text-main whitespace-nowrap">
                {formattedDate}
              </span>
              <span className="text-[10px] text-text-dim font-medium">
                Today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Today's Pulse with 3 Stat Cards ── */}
      <div className="relative z-1 mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-border-subtle flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        {/* Pulse Section Heading */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-text-main leading-tight">
              Today's Pulse
            </h3>
            <p className="text-xs text-text-muted font-normal mt-0.5 leading-tight">
              Real-time hospital overview
            </p>
          </div>
        </div>

        {/* 3 Quick Stat Cards with Consistent Heights & Padding */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 flex-1 md:max-w-[580px] lg:max-w-[620px]">
          {/* 1. Vacant Beds Card */}
          <div
            onClick={onBedClick}
            className="group flex items-center gap-3 h-[54px] sm:h-[58px] px-3.5 sm:px-4 rounded-xl bg-bg-surface-elevated border border-border-subtle hover:border-emerald-500/40 hover:shadow-2xs transition-all duration-200 cursor-pointer"
            title="View Ward Bed Availability"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bed size={17} />
            </div>

            <div className="flex flex-col leading-tight min-w-0 flex-1">
              <span className="text-base sm:text-lg font-bold font-mono text-text-main">
                {stats.vacantBeds}
              </span>
              <span className="text-xs font-medium text-text-muted truncate">
                Vacant Beds
              </span>
            </div>

            <div className="w-6 h-6 rounded-full bg-bg-surface flex items-center justify-center text-text-dim group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0">
              <ChevronRight size={13} />
            </div>
          </div>

          {/* 2. OPD Inflow Card */}
          <div
            onClick={onOpdClick}
            className="group flex items-center gap-3 h-[54px] sm:h-[58px] px-3.5 sm:px-4 rounded-xl bg-bg-surface-elevated border border-border-subtle hover:border-blue-500/40 hover:shadow-2xs transition-all duration-200 cursor-pointer"
            title="View OPD Appointments"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users size={17} />
            </div>

            <div className="flex flex-col leading-tight min-w-0 flex-1">
              <span className="text-base sm:text-lg font-bold font-mono text-text-main">
                {stats.opdInflow}
              </span>
              <span className="text-xs font-medium text-text-muted truncate">
                OPD Inflow
              </span>
            </div>

            <div className="w-6 h-6 rounded-full bg-bg-surface flex items-center justify-center text-text-dim group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0">
              <ChevronRight size={13} />
            </div>
          </div>

          {/* 3. ER Trauma Bays Card */}
          <div
            onClick={onErClick}
            className="group flex items-center gap-3 h-[54px] sm:h-[58px] px-3.5 sm:px-4 rounded-xl bg-bg-surface-elevated border border-border-subtle hover:border-rose-500/40 hover:shadow-2xs transition-all duration-200 cursor-pointer"
            title="View ER Trauma Bays"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Siren size={17} />
            </div>

            <div className="flex flex-col leading-tight min-w-0 flex-1">
              <span className="text-base sm:text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                {stats.erTraumaBays}
              </span>
              <span className="text-xs font-medium text-text-muted truncate">
                ER Trauma Bays
              </span>
            </div>

            <div className="w-6 h-6 rounded-full bg-bg-surface flex items-center justify-center text-text-dim group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0">
              <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorWelcomeBanner;
