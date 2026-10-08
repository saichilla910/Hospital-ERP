import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  UserPlus,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  FlaskConical,
  ScanLine,
  Pill,
  ReceiptText,
  Building,
  ArrowRight,
  LogIn
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const CommandPalette = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    patients,
    doctors,
    setSelectedPatient,
    setActiveNav,
    setPatientOnboardingModalOpen,
    canAccess
  } = useHospital();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredPatients = query
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.mrn.toLowerCase().includes(query.toLowerCase()) ||
          p.id.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredDoctors = query
    ? doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.specialty.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const allQuickNavs = [
    { label: 'Register New Patient (EHR Intake Form)', icon: UserPlus, module: 'patientManagement', sub: 'registration', bgClass: 'bg-teal-500/15', textClass: 'text-teal-600' },
    { label: 'Patient Portal Login (Existing Account)', icon: LogIn, module: 'patientManagement', sub: 'login', bgClass: 'bg-indigo-500/15', textClass: 'text-indigo-600' },
    { label: 'Patient Management & Profiles', icon: Users, module: 'patientManagement', sub: 'directory', bgClass: 'bg-teal-500/15', textClass: 'text-teal-600' },
    { label: 'OPD Appointments & Queue', icon: Calendar, module: 'opd', sub: 'appointments', bgClass: 'bg-blue-500/15', textClass: 'text-blue-600' },
    { label: 'Emergency Trauma Triage', icon: AlertCircle, module: 'emergency', sub: 'triage', bgClass: 'bg-rose-500/15', textClass: 'text-rose-600' },
    { label: 'IPD Ward & Bed Matrix', icon: Building, module: 'ipd', sub: 'beds', bgClass: 'bg-cyan-500/15', textClass: 'text-cyan-600' },
    { label: 'Pharmacy Medicine Dispense', icon: Pill, module: 'pharmacy', sub: 'dispensing', bgClass: 'bg-emerald-500/15', textClass: 'text-emerald-600' },
    { label: 'Billing Invoices', icon: ReceiptText, module: 'billing', sub: 'opdBilling', bgClass: 'bg-indigo-500/15', textClass: 'text-indigo-600' }
  ];

  const quickNavs = allQuickNavs.filter(nav => canAccess ? canAccess(nav.module) : true);

  return (
    <div
      className="fixed inset-0 bg-[#0f172a]/50 backdrop-blur-[4px] z-[1100] flex items-start justify-center pt-[12vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCommandPaletteOpen(false);
      }}
    >
      <div className="w-full max-w-[640px] bg-bg-surface border border-border-subtle rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar — Generous Height & Typography */}
        <div className="flex items-center gap-3.5 h-16 px-5 border-b border-border-subtle bg-bg-surface-elevated shrink-0">
          <Search size={22} className="text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            type="text"
            placeholder="Search patients, MRN, doctors, beds, medications, or jump to module..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-text-main text-base sm:text-lg font-sans font-medium placeholder:text-text-dim"
          />
          <span className="text-xs bg-bg-surface border border-border-strong py-1 px-2 rounded-md text-text-muted font-mono font-bold shrink-0 shadow-xs">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[420px] overflow-y-auto p-3">
          {/* Quick Actions / Shortcuts */}
          {!query && (
            <div className="mb-4">
              <div className="text-xs font-bold text-text-dim uppercase py-1.5 px-2.5 tracking-wider">
                Quick Navigation & Workflows
              </div>
              {quickNavs.map((nav, i) => {
                const Icon = nav.icon;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (nav.action) {
                        nav.action();
                      } else {
                        setActiveNav({ module: nav.module, subModule: nav.sub });
                      }
                      setCommandPaletteOpen(false);
                    }}
                    className="glass-card-interactive flex items-center justify-between py-2.5 px-3 rounded-md cursor-pointer transition-all duration-120 mb-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${nav.bgClass} ${nav.textClass}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-semibold text-text-main">{nav.label}</span>
                    </div>
                    <ArrowRight size={15} className="text-text-dim" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Filtered Patients */}
          {filteredPatients.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold text-text-dim uppercase py-1.5 px-2.5 tracking-wider">
                Patients ({filteredPatients.length})
              </div>
              {filteredPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p);
                    setActiveNav({ module: 'patientManagement', subModule: 'profile' });
                    setCommandPaletteOpen(false);
                  }}
                  className="glass-card-interactive flex items-center justify-between py-2.5 px-3 rounded-md cursor-pointer bg-bg-surface-elevated mb-1.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-main">{p.name}</div>
                      <div className="text-xs text-text-muted">
                        {p.mrn} • {p.age} yrs ({p.gender}) • Status: <span className="text-teal-600 font-semibold">{p.status}</span>
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-teal text-xs">View Dossier</span>
                </div>
              ))}
            </div>
          )}

          {/* Filtered Doctors */}
          {filteredDoctors.length > 0 && (
            <div>
              <div className="text-xs font-bold text-text-dim uppercase py-1.5 px-2.5 tracking-wider">
                Consultant Specialists ({filteredDoctors.length})
              </div>
              {filteredDoctors.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setActiveNav({ module: 'opd', subModule: 'consultation' });
                    setCommandPaletteOpen(false);
                  }}
                  className="glass-card-interactive flex items-center justify-between py-2.5 px-3 rounded-md cursor-pointer bg-bg-surface-elevated mb-1.5"
                >
                  <div>
                    <div className="text-sm font-semibold text-text-main">{d.name}</div>
                    <div className="text-xs text-text-muted">{d.specialty} • {d.room}</div>
                  </div>
                  <span className="badge badge-indigo text-xs">{d.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="py-2.5 px-4 bg-bg-surface-elevated border-t border-border-subtle flex justify-between text-xs text-text-dim">
          <span>Tip: Press <kbd className="bg-bg-surface px-1 py-0.5 rounded border border-border-subtle font-mono">Ctrl + K</kbd> anytime to open</span>
          <span>HospitalCare ERP Universal Search</span>
        </div>
      </div>
    </div>
  );
};
