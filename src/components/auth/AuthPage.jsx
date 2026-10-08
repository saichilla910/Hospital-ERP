import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { ROLES } from '../../services/authService';
import { useHospital } from '../../context/HospitalContext';
import { BrandLogo } from '../common/BrandLogo';

export const AuthPage = () => {
  const { login, theme, toggleTheme } = useHospital();

  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  // Login form state
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginTouched, setLoginTouched] = useState({});

  const roleList = Object.values(ROLES);

  // The 7 official modules specified in user table
  const permissionColumns = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'patients', label: 'Patients' },
    { key: 'appointment', label: 'Appointments' },
    { key: 'billing', label: 'Billing' },
    { key: 'pharmacy', label: 'Pharmacy' },
    { key: 'reports', label: 'Reports' },
    { key: 'users', label: 'Users' }
  ];

  // Validation engine for sign in form
  const validateField = (fieldName, value) => {
    let error = '';
    const trimmed = (value || '').trim();

    if (fieldName === 'identifier') {
      if (!trimmed) {
        error = 'Staff username or email is required.';
      } else if (trimmed.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Please enter a valid email format (e.g. name@hospitalcare.org).';
      } else if (!trimmed.includes('@') && trimmed.length < 3) {
        error = 'Username must be at least 3 characters.';
      }
    } else if (fieldName === 'password') {
      if (!value) {
        error = 'Account password is required.';
      } else if (value.length < 4) {
        error = 'Password must be at least 4 characters.';
      }
    }
    return error;
  };

  // Field change handlers with live error clearing
  const handleLoginChange = (field, value) => {
    const nextForm = { ...loginForm, [field]: value };
    setLoginForm(nextForm);
    if (loginTouched[field]) {
      const err = validateField(field, value);
      setLoginErrors(prev => ({ ...prev, [field]: err }));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleLoginBlur = (field) => {
    setLoginTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, loginForm[field]);
    setLoginErrors(prev => ({ ...prev, [field]: err }));
  };

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const effectiveIdentifier = loginForm.identifier.trim() || selectedRole;

    const identifierErr = validateField('identifier', effectiveIdentifier);
    const passwordErr = validateField('password', loginForm.password);

    const errors = {
      identifier: loginForm.identifier ? identifierErr : '',
      password: passwordErr
    };

    setLoginTouched({ identifier: true, password: true });
    setLoginErrors(errors);

    if (passwordErr) {
      setShakeKey(prev => prev + 1);
      setErrorMsg('Please enter your account password to sign in.');
      return;
    }

    setLoading(true);
    try {
      login(effectiveIdentifier, loginForm.password, selectedRole);
    } catch (err) {
      setShakeKey(prev => prev + 1);
      const isPassError = err.message && err.message.toLowerCase().includes('password');
      if (isPassError) {
        setErrorMsg('Incorrect password. Please verify your password and try again.');
        setLoginErrors(prev => ({ ...prev, password: 'Password does not match this account.' }));
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
      }
      setLoading(false);
    }
  };

  const currentRoleMeta = ROLES[selectedRole] || ROLES.admin;

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between relative overflow-x-hidden selection:bg-teal-500 selection:text-white"
      style={{
        background: 'var(--bg-app)',
        color: 'var(--text-main)',
        fontFamily: 'var(--font-main)'
      }}
    >
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-teal-500/10 blur-[130px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-cyan-500/10 blur-[140px] opacity-60" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-border-subtle bg-bg-surface/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
            <BrandLogo size={22} color="#ffffff" />
          </div>
          <div>
            <div className="text-base font-bold font-display tracking-tight text-text-main leading-tight flex items-center gap-2">
              <span>HospitalCare ERP</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/25">
                NABH Enterprise
              </span>
            </div>
            <p className="text-[11px] text-text-muted">Enterprise Hospital Role-Based Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>256-Bit HIPAA Portal</span>
          </div>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-bg-surface border border-border-subtle text-text-muted hover:text-text-main flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl w-full mx-auto">
        <div
          key={shakeKey}
          className={`w-full bg-bg-surface border border-border-subtle rounded-3xl shadow-xl p-6 sm:p-8 backdrop-blur-xl ${
            shakeKey > 0 ? 'auth-shake-animate' : ''
          }`}
        >
          {/* Heading */}
          <div className="text-center max-w-md mx-auto mb-6">
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-main">
              Staff & Clinical Portal Login
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5">
              Select your department role and enter your authorized credentials.
            </p>
          </div>

          {/* General Alert Banner */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5 animate-[fadeIn_0.18s_ease-out]">
              <ShieldAlert size={16} className="shrink-0" />
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          {/* ── STEP 1: SELECT YOUR ROLE ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-text-main flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck size={14} className="text-teal-600" />
                Select Your Assigned Hospital Role:
              </label>
              <span className="text-[11px] font-semibold text-text-muted">
                Active: <strong className="text-text-main">{currentRoleMeta.emoji} {currentRoleMeta.name}</strong>
              </span>
            </div>

            {/* 6 Role Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
              {roleList.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r.id);
                      setErrorMsg('');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 relative ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                        : 'bg-bg-surface-elevated border-border-subtle hover:border-teal-500/40 hover:bg-bg-surface'
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className={`text-xs font-bold truncate max-w-full ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-text-main'}`}>
                      {r.name}
                    </span>
                    <span className="text-[10px] text-text-muted truncate max-w-full line-clamp-1">
                      {r.tag}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── STEP 2: LIVE ROLE PERMISSIONS MATRIX ── */}
          <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Module Privileges for <strong className="text-text-main">{currentRoleMeta.emoji} {currentRoleMeta.name}</strong>:
              </span>
              <span className="text-[10px] text-text-dim">
                Role-Based Access Control
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {permissionColumns.map((col) => {
                const isAllowed = currentRoleMeta.permissions[col.key];
                return (
                  <div
                    key={col.key}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                      isAllowed
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                        : 'bg-bg-surface text-text-dim border-border-subtle opacity-70'
                    }`}
                  >
                    <span className="truncate">{col.label}</span>
                    {isAllowed ? (
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 ml-1" />
                    ) : (
                      <XCircle size={13} className="text-rose-500/60 shrink-0 ml-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── STEP 3: SIGN IN FORM ── */}
          <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username / Email field */}
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Staff Username or Email <span className="text-rose-500">*</span>
                </label>
                <div
                  className={`auth-input-group ${
                    loginTouched.identifier && loginErrors.identifier
                      ? 'has-error'
                      : loginTouched.identifier && !loginErrors.identifier && loginForm.identifier
                      ? 'has-valid'
                      : ''
                  }`}
                >
                  <span className="auth-field-icon">
                    <Mail size={16} />
                  </span>
                  <input
                    type="text"
                    className={`auth-input-field ${
                      loginTouched.identifier && loginErrors.identifier
                        ? 'input-error'
                        : loginTouched.identifier && !loginErrors.identifier && loginForm.identifier
                        ? 'input-valid'
                        : ''
                    }`}
                    placeholder="Enter email or username"
                    value={loginForm.identifier}
                    onChange={(e) => handleLoginChange('identifier', e.target.value)}
                    onBlur={() => handleLoginBlur('identifier')}
                    autoComplete="username"
                  />
                </div>
                {loginTouched.identifier && loginErrors.identifier && (
                  <div className="auth-field-feedback error-text">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{loginErrors.identifier}</span>
                  </div>
                )}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div
                  className={`auth-input-group ${
                    loginTouched.password && loginErrors.password
                      ? 'has-error'
                      : loginTouched.password && !loginErrors.password && loginForm.password
                      ? 'has-valid'
                      : ''
                  }`}
                >
                  <span className="auth-field-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`auth-input-field has-action ${
                      loginTouched.password && loginErrors.password
                        ? 'input-error'
                        : loginTouched.password && !loginErrors.password && loginForm.password
                        ? 'input-valid'
                        : ''
                    }`}
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => handleLoginChange('password', e.target.value)}
                    onBlur={() => handleLoginBlur('password')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-toggle-pwd"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {loginTouched.password && loginErrors.password && (
                  <div className="auth-field-feedback error-text">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{loginErrors.password}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Provisioning Notice */}
            <div className="p-3 bg-bg-surface-elevated rounded-xl border border-border-subtle text-xs text-text-muted flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-teal-600 shrink-0 mt-0.5" />
              <span>
                Role-based clinical security is active. Hospital staff accounts and position privileges are provisioned and managed by the <strong>System Administrator</strong>.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2 transition-all hover:shadow-md"
            >
              <span>Sign In as {currentRoleMeta.emoji} {currentRoleMeta.name}</span>
              <ArrowRight size={16} />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 text-center text-xs text-text-dim border-t border-border-subtle bg-bg-surface/50">
        HospitalCare Information System • Role-Based Clinical Access Control (RBAC) • Enterprise NABH Standards
      </footer>
    </div>
  );
};
