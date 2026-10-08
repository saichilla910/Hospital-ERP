import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Key,
  ShieldCheck,
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useHospital } from '../../context/HospitalContext';
import { getStoredUsers, registerUser, ROLES } from '../../services/authService';
import { AccessDenied } from '../../components/common/AccessDenied';

export const Users = () => {
  const { showToast, currentUser, setActiveNav } = useHospital();

  if (currentUser?.role !== 'admin') {
    return (
      <AccessDenied
        role={currentUser?.role}
        moduleName="Staff Account Provisioning"
        onGoToDashboard={() => setActiveNav({ module: 'dashboard', subModule: null })}
      />
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state for creating a new staff account
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'doctor',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  // Reload users helper
  const loadUsers = () => {
    const stored = getStoredUsers();
    return stored.map((u, idx) => ({
      id: u.id || idx + 1,
      username: u.username || u.email?.split('@')[0] || `user_${idx + 1}`,
      name: u.name,
      role: u.role,
      roleLabel: ROLES[u.role]?.label || u.roleTitle || u.role,
      roleTag: ROLES[u.role]?.tag || 'Hospital Staff',
      email: u.email,
      lastLogin: u.lastLogin || 'Today 08:00 AM',
      status: u.status || 'Active'
    }));
  };

  const [users, setUsers] = useState(loadUsers);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Account for ${u.name} set to ${newStatus}.`, newStatus === 'Active' ? 'success' : 'warning');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleResetPassword = (name) => {
    showToast(`Password reset link sent to ${name}'s verified email.`, 'info');
  };

  // Validation function
  const validateField = (field, value, allValues = formData) => {
    let error = '';
    const trimmed = (value || '').trim();

    if (field === 'name') {
      if (!trimmed) {
        error = 'Full name is required.';
      } else if (trimmed.length < 3) {
        error = 'Name must be at least 3 characters.';
      }
    } else if (field === 'email') {
      if (!trimmed) {
        error = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Please enter a valid email (e.g. name@hospitalcare.org).';
      }
    } else if (field === 'username') {
      if (!trimmed) {
        error = 'Username is required.';
      } else if (trimmed.length < 3) {
        error = 'Username must be at least 3 characters.';
      }
    } else if (field === 'password') {
      if (!value) {
        error = 'Password is required.';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters.';
      }
    } else if (field === 'confirmPassword') {
      const pwd = allValues.password;
      if (!value) {
        error = 'Please confirm password.';
      } else if (value !== pwd) {
        error = 'Passwords do not match.';
      }
    }
    return error;
  };

  const handleFieldChange = (field, value) => {
    const nextForm = { ...formData, [field]: value };
    // Auto populate username when email changes if username is empty or matching previous prefix
    if (field === 'email' && value.includes('@')) {
      const prefix = value.split('@')[0];
      if (!formData.username || formData.username === formData.email.split('@')[0]) {
        nextForm.username = prefix;
      }
    }

    setFormData(nextForm);
    if (formTouched[field]) {
      const err = validateField(field, value, nextForm);
      setFormErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleFieldBlur = (field) => {
    setFormTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setFormErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const usernameErr = validateField('username', formData.username);
    const passwordErr = validateField('password', formData.password);
    const confirmErr = validateField('confirmPassword', formData.confirmPassword);

    const errors = {
      name: nameErr,
      email: emailErr,
      username: usernameErr,
      password: passwordErr,
      confirmPassword: confirmErr
    };

    setFormTouched({
      name: true,
      email: true,
      username: true,
      password: true,
      confirmPassword: true
    });
    setFormErrors(errors);

    if (nameErr || emailErr || usernameErr || passwordErr || confirmErr) {
      showToast('Please fix all highlighted errors in the form.', 'error');
      return;
    }

    try {
      registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role
      });

      // Refresh users list
      setUsers(loadUsers());
      showToast(
        `Staff account for "${formData.name}" created with role "${ROLES[formData.role]?.name}" successfully!`,
        'success'
      );

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        username: '',
        role: 'doctor',
        password: '',
        confirmPassword: ''
      });
      setFormErrors({});
      setFormTouched({});
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to create staff account.', 'error');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.roleLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main flex items-center gap-2">
            <span>Hospital Staff Accounts & Role Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold border border-teal-500/25">
              Admin Authorized
            </span>
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Create new staff logins, assign role-based permissions, and manage account credentials.
          </p>
        </div>

        <button
          className="btn btn-primary shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
          onClick={() => {
            setFormData({
              name: '',
              email: '',
              username: '',
              role: 'doctor',
              password: '',
              confirmPassword: ''
            });
            setFormErrors({});
            setFormTouched({});
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Create Staff Account
        </button>
      </div>

      {/* Search Input */}
      <div className="glass-card p-3.5">
        <div className="relative w-full flex items-center">
          <Search size={16} className="text-teal-600 dark:text-teal-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search staff by name, username, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input form-search-input h-11 pr-10 text-sm rounded-xl w-full"
            style={{ paddingLeft: '42px' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 text-text-dim hover:text-text-main p-1 rounded-md transition-colors"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Staff Table */}
      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Assigned Role</th>
              <th>Email Address</th>
              <th>Account Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const roleMeta = ROLES[u.role] || ROLES.admin;
              return (
                <tr key={u.id}>
                  <td>
                    <span className="mono font-bold text-teal-700 dark:text-teal-300 bg-bg-surface-elevated px-2.5 py-1 rounded-lg border border-border-subtle text-xs">
                      @{u.username}
                    </span>
                  </td>
                  <td className="font-bold text-text-main">
                    <div className="flex items-center gap-2">
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge text-xs font-semibold px-2.5 py-0.5 rounded-full border ${roleMeta.badgeClass}`}>
                      {roleMeta.emoji} {roleMeta.name}
                    </span>
                  </td>
                  <td className="text-[0.85rem] text-text-muted">{u.email}</td>
                  <td>
                    <Badge variant={u.status === 'Active' ? 'emerald' : 'rose'} size="sm">
                      {u.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleResetPassword(u.name)}
                        title="Send Password Reset"
                      >
                        <Key size={13} /> Reset
                      </button>
                      <button
                        className={`btn btn-sm ${u.status === 'Active' ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => toggleStatus(u.id)}
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── CREATE STAFF ACCOUNT MODAL ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-[fadeIn_0.15s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-bg-surface border border-border-strong rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-7 relative max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main font-display">
                    Provision New Staff Account
                  </h3>
                  <p className="text-xs text-text-muted">
                    Create authorized login credentials and select clinical role.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-bg-surface-elevated hover:bg-bg-surface-hover text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateUser} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-text-main mb-1">
                  Full Staff Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none z-10" />
                  <input
                    type="text"
                    className={`form-input h-10.5 text-xs rounded-xl w-full ${
                      formTouched.name && formErrors.name ? 'border-rose-500 bg-rose-500/5' : ''
                    }`}
                    style={{ paddingLeft: '44px' }}
                    placeholder="Enter full staff name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => handleFieldBlur('name')}
                  />
                </div>
                {formTouched.name && formErrors.name && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                    <AlertCircle size={12} /> {formErrors.name}
                  </p>
                )}
              </div>

              {/* Grid: Email and Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">
                    Hospital Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none z-10" />
                    <input
                      type="email"
                      className={`form-input h-10.5 text-xs rounded-xl w-full ${
                        formTouched.email && formErrors.email ? 'border-rose-500 bg-rose-500/5' : ''
                      }`}
                      style={{ paddingLeft: '44px' }}
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                    />
                  </div>
                  {formTouched.email && formErrors.email && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                      <AlertCircle size={12} /> {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">
                    Login Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-text-dim pointer-events-none z-10">@</span>
                    <input
                      type="text"
                      className={`form-input h-10.5 text-xs rounded-xl w-full font-mono ${
                        formTouched.username && formErrors.username ? 'border-rose-500 bg-rose-500/5' : ''
                      }`}
                      style={{ paddingLeft: '38px' }}
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={(e) => handleFieldChange('username', e.target.value)}
                      onBlur={() => handleFieldBlur('username')}
                    />
                  </div>
                  {formTouched.username && formErrors.username && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                      <AlertCircle size={12} /> {formErrors.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-text-main mb-1.5">
                  Assign Staff Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(ROLES).map((role) => {
                    const isSelected = formData.role === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleFieldChange('role', role.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-500/15 border-teal-500 text-teal-700 dark:text-teal-300 font-bold shadow-xs'
                            : 'bg-bg-surface-elevated border-border-subtle text-text-muted hover:text-text-main hover:bg-bg-surface'
                        }`}
                      >
                        <span className="text-lg">{role.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{role.name}</div>
                          <div className="text-[10px] text-text-dim truncate">{role.tag}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">
                    Account Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input h-10.5 text-xs rounded-xl w-full ${
                        formTouched.password && formErrors.password ? 'border-rose-500 bg-rose-500/5' : ''
                      }`}
                      style={{ paddingLeft: '44px', paddingRight: '40px' }}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onBlur={() => handleFieldBlur('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main p-1 cursor-pointer z-10"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {formTouched.password && formErrors.password && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                      <AlertCircle size={12} /> {formErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input h-10.5 text-xs rounded-xl w-full ${
                        formTouched.confirmPassword && formErrors.confirmPassword
                          ? 'border-rose-500 bg-rose-500/5'
                          : ''
                      }`}
                      style={{ paddingLeft: '44px' }}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      onBlur={() => handleFieldBlur('confirmPassword')}
                    />
                  </div>
                  {formTouched.confirmPassword && formErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                      <AlertCircle size={12} /> {formErrors.confirmPassword}
                    </p>
                  )}
                  {formTouched.confirmPassword && !formErrors.confirmPassword && formData.confirmPassword && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                      <CheckCircle2 size={12} /> Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-10 px-5 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <UserCheck size={15} />
                  <span>Create & Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
