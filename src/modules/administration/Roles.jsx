import React, { useState } from 'react';
import { ShieldCheck, Users, Key, Plus, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useHospital } from '../../context/HospitalContext';

export const Roles = () => {
  const { showToast } = useHospital();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
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
  ];

  const handleRoleClick = (role) => {
    setSelectedRole(role.id);
    showToast(`Selected "${role.name}" — ${role.usersCount} staff members currently assigned.`, 'info');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Hospital Staff Roles
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Choose what each staff member can view and do in the hospital system.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => showToast('Role creation dialog opened. Assign custom access easily.', 'info')}
        >
          <Plus size={16} /> Add New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map((r) => {
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
    </div>
  );
};
