import React, { useState } from 'react';
import { ShieldCheck, Users, Key, Plus, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useHospital } from '../../context/HospitalContext';

export const Roles = () => {
  const { showToast, setActiveNav } = useHospital();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [rolesList, setRolesList] = useState([
    {
      id: 'admin',
      name: 'Super Admin & Hospital Head',
      usersCount: 2,
      desc: 'Full access to all sections including patient admissions, billing, staff accounts, and hospital settings.',
      color: 'teal'
    },
    {
      id: 'doctor',
      name: 'Doctor & Specialist',
      usersCount: 18,
      desc: 'Write prescriptions, add doctor notes, order blood and scan tests, and prepare discharge papers.',
      color: 'blue'
    },
    {
      id: 'nurse',
      name: 'Nurse & Ward Staff',
      usersCount: 64,
      desc: 'Record patient vitals (BP, pulse, oxygen), give scheduled medicines, and update bed occupancy.',
      color: 'indigo'
    },
    {
      id: 'pharmacist',
      name: 'Pharmacist',
      usersCount: 8,
      desc: 'Dispense medicines at the pharmacy counter, manage stock levels, and track expiring batches.',
      color: 'emerald'
    },
    {
      id: 'billing',
      name: 'Billing & Cashier',
      usersCount: 12,
      desc: 'Create patient bills, collect cash / card / UPI payments, and verify insurance claims.',
      color: 'amber'
    },
    {
      id: 'lab',
      name: 'Lab & Scan Technician',
      usersCount: 14,
      desc: 'Collect blood samples, enter lab test values, and upload radiology scan reports.',
      color: 'cyan'
    }
  ]);

  // Form state for creating custom role
  const [roleForm, setRoleForm] = useState({
    name: '',
    code: '',
    description: '',
    emoji: '🛡️',
    permissions: {
      dashboard: true,
      patients: true,
      appointment: true,
      billing: false,
      pharmacy: false,
      reports: true,
      users: false
    }
  });

  const [roleErrors, setRoleErrors] = useState({});
  const [roleTouched, setRoleTouched] = useState({});

  const handleRoleClick = (role) => {
    setSelectedRole(role.id);
    showToast(`Selected "${role.name}" — ${role.usersCount} staff members currently assigned.`, 'info');
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    const nameTrimmed = roleForm.name.trim();
    const codeTrimmed = roleForm.code.trim();

    const errors = {};
    if (!nameTrimmed) errors.name = 'Role title is required.';
    if (!codeTrimmed) errors.code = 'Role code identifier is required.';

    setRoleTouched({ name: true, code: true, description: true });
    setRoleErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast('Please fill out all required role fields.', 'error');
      return;
    }

    const newRoleObj = {
      id: codeTrimmed.toLowerCase().replace(/\s+/g, '_'),
      name: nameTrimmed,
      usersCount: 0,
      desc: roleForm.description || 'Custom department staff role.',
      color: 'teal'
    };

    setRolesList((prev) => [...prev, newRoleObj]);
    showToast(`New staff role "${nameTrimmed}" defined successfully!`, 'success');
    setIsRoleModalOpen(false);
    setRoleForm({
      name: '',
      code: '',
      description: '',
      emoji: '🛡️',
      permissions: {
        dashboard: true,
        patients: true,
        appointment: true,
        billing: false,
        pharmacy: false,
        reports: true,
        users: false
      }
    });
    setRoleErrors({});
    setRoleTouched({});
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main flex items-center gap-2">
            <span>Hospital Staff Roles</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold border border-teal-500/25">
              RBAC Configured
            </span>
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Define department role access matrices and assign module permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            className="btn btn-secondary cursor-pointer flex items-center gap-2 text-xs font-semibold"
            onClick={() => setIsRoleModalOpen(true)}
          >
            <Plus size={15} /> Define Custom Role
          </button>
          <button
            className="btn btn-primary cursor-pointer flex items-center gap-2 text-xs font-bold"
            onClick={() => setActiveNav({ module: 'administration', subModule: 'users' })}
          >
            <Users size={15} /> Provision Staff for Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rolesList.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <div
              key={r.id}
              className={`glass-card glass-card-interactive flex flex-col gap-3 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-teal-500 bg-teal-50 dark:bg-teal-950/30'
                  : 'border border-border-subtle bg-bg-surface hover:border-text-muted/30'
              }`}
              onClick={() => handleRoleClick(r)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-[1.05rem] text-text-main font-bold">
                  {r.name}
                </h3>
                <Badge variant={isSelected ? 'teal' : 'indigo'} size="sm">
                  {r.usersCount} Staff Members
                </Badge>
              </div>

              <p className="text-[0.825rem] text-text-muted leading-relaxed">
                {r.desc}
              </p>

              <div className="mt-auto pt-2.5 border-t border-border-subtle flex justify-between items-center text-[0.75rem] text-text-dim">
                <span>Click to inspect permissions</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Active Role
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DEFINE CUSTOM ROLE MODAL ── */}
      {isRoleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-[fadeIn_0.15s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRoleModalOpen(false);
          }}
        >
          <div className="bg-bg-surface border border-border-strong rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main font-display">
                    Define New Staff Role
                  </h3>
                  <p className="text-xs text-text-muted">
                    Configure role titles, access tags, and privilege levels.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-bg-surface-elevated hover:bg-bg-surface-hover text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRole} noValidate className="space-y-4">
              {/* Role Title */}
              <div>
                <label className="block text-xs font-bold text-text-main mb-1">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none z-10" />
                  <input
                    type="text"
                    className={`form-input h-10.5 text-xs rounded-xl w-full ${
                      roleTouched.name && roleErrors.name ? 'border-rose-500 bg-rose-500/5' : ''
                    }`}
                    style={{ paddingLeft: '44px' }}
                    placeholder="e.g. Emergency Triage Specialist"
                    value={roleForm.name}
                    onChange={(e) => {
                      setRoleForm({
                        ...roleForm,
                        name: e.target.value,
                        code: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_')
                      });
                    }}
                  />
                </div>
                {roleTouched.name && roleErrors.name && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                    <AlertCircle size={12} /> {roleErrors.name}
                  </p>
                )}
              </div>

              {/* Role Code */}
              <div>
                <label className="block text-xs font-bold text-text-main mb-1">
                  Role Identifier Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-text-dim pointer-events-none z-10">#</span>
                  <input
                    type="text"
                    className="form-input h-10.5 text-xs rounded-xl w-full font-mono"
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. triage_specialist"
                    value={roleForm.code}
                    onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-text-main mb-1">
                  Role Responsibilities & Scope
                </label>
                <textarea
                  rows="3"
                  className="form-input text-xs rounded-xl w-full p-3 h-auto"
                  placeholder="Describe the clinical or administrative duties of this role..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="btn btn-secondary h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-10 px-5 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <ShieldCheck size={15} />
                  <span>Create & Register Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
