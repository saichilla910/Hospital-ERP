import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, CheckCircle2, XCircle, LogOut } from 'lucide-react';
import { ROLES } from '../../services/authService';
import { useHospital } from '../../context/HospitalContext';

export const AccessDenied = ({ role, moduleName, onGoToDashboard }) => {
  const { setActiveNav, logout } = useHospital();
  const roleMeta = ROLES[role] || ROLES.admin;

  const permissionMatrix = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'Patients', key: 'patients' },
    { name: 'Appointments', key: 'appointment' },
    { name: 'Billing', key: 'billing' },
    { name: 'Pharmacy', key: 'pharmacy' },
    { name: 'Reports', key: 'reports' },
    { name: 'Users', key: 'users' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center animate-[fadeIn_0.2s_ease-out]">
      <div className="max-w-xl w-full p-8 rounded-3xl bg-bg-surface border border-border-subtle shadow-md">
        {/* Security Beacon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <ShieldAlert size={32} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-3"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-elevated)' }}>
          <Lock size={12} className="text-amber-500" />
          <span className="text-text-muted">Clinical RBAC Protection • Role Locked</span>
        </div>

        <h2 className="text-2xl font-black text-text-main tracking-tight font-display">
          Access Restricted
        </h2>
        <p className="text-sm text-text-muted mt-2 leading-relaxed">
          Your current position (<strong className="text-text-main">{roleMeta.emoji} {roleMeta.name}</strong>) is fixed to this active session and is not authorized to access the <span className="font-semibold text-text-main capitalize">"{moduleName || 'requested'}"</span> clinical module.
        </p>

        {/* Live Permission Table for this Role */}
        <div className="mt-6 p-4 rounded-2xl bg-bg-surface-elevated border border-border-subtle text-left">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              {roleMeta.name} Privileges (Fixed):
            </span>
            <span className="text-[11px] font-semibold text-text-dim flex items-center gap-1">
              <Lock size={11} /> Locked Position
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {permissionMatrix.map((item) => {
              const allowed = roleMeta.permissions[item.key];
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border ${
                    allowed
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-bg-surface border-border-subtle text-text-dim opacity-75'
                  }`}
                >
                  {allowed ? (
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle size={13} className="text-rose-500/60 shrink-0" />
                  )}
                  <span className="truncate">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions - Role is strictly locked, only Return or Sign Out */}
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <button
            onClick={onGoToDashboard || (() => setActiveNav({ module: 'dashboard', subModule: null }))}
            className="btn btn-primary h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Return to Authorized Dashboard</span>
          </button>

          <button
            onClick={logout}
            className="btn btn-outline h-11 px-4 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer text-text-muted hover:text-rose-600 hover:border-rose-500/40"
            title="Log out if you need to sign in with a different staff account"
          >
            <LogOut size={14} />
            <span>Log Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
