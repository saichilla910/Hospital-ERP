import React, { useState } from 'react';
import { ShieldCheck, Check, X, Lock, Sparkles } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const Permissions = () => {
  const { showToast } = useHospital();

  const [matrix, setMatrix] = useState([
    { id: 1, module: 'Hospital Dashboard', admin: true, doctor: true, nurse: true, pharmacy: true, billing: true },
    { id: 2, module: 'Patient Records & Directory', admin: true, doctor: true, nurse: true, pharmacy: false, billing: true },
    { id: 3, module: 'Doctor Consultation & e-Prescription', admin: true, doctor: true, nurse: false, pharmacy: false, billing: false },
    { id: 4, module: 'Inpatient Beds & Ward Admissions', admin: true, doctor: true, nurse: true, pharmacy: false, billing: false },
    { id: 5, module: 'Emergency & Urgent Care', admin: true, doctor: true, nurse: true, pharmacy: false, billing: true },
    { id: 6, module: 'Medical Records & Health History', admin: true, doctor: true, nurse: false, pharmacy: false, billing: false },
    { id: 7, module: 'Lab Tests & Blood Reports', admin: true, doctor: true, nurse: false, pharmacy: false, billing: false },
    { id: 8, module: 'Scans & X-Rays (Radiology)', admin: true, doctor: true, nurse: false, pharmacy: false, billing: false },
    { id: 9, module: 'Pharmacy Medicine Dispensing', admin: true, doctor: false, nurse: false, pharmacy: true, billing: false },
    { id: 10, module: 'Hospital Billing & Invoices', admin: true, doctor: false, nurse: false, pharmacy: false, billing: true },
    { id: 11, module: 'Surgery & Operation Theatre', admin: true, doctor: true, nurse: true, pharmacy: false, billing: false },
    { id: 12, module: 'System Settings & Security', admin: true, doctor: false, nurse: false, pharmacy: false, billing: false }
  ]);

  const togglePermission = (id, roleKey, roleName, moduleName) => {
    if (roleKey === 'admin') {
      showToast('Admin role must have access to all modules.', 'warning');
      return;
    }

    setMatrix((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const nextVal = !row[roleKey];
          showToast(`${roleName} access for "${moduleName}": ${nextVal ? 'ENABLED' : 'DISABLED'}`, 'info');
          return { ...row, [roleKey]: nextVal };
        }
        return row;
      })
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Staff Role Permissions Matrix
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Control which features each staff role can access. Click any checkmark or X to enable/disable access.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Hospital Feature / Section</th>
              <th className="text-center">Hospital Admin</th>
              <th className="text-center">Doctor</th>
              <th className="text-center">Nurse</th>
              <th className="text-center">Pharmacist</th>
              <th className="text-center">Billing Desk</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.id}>
                <td className="font-bold text-text-main">{row.module}</td>
                
                <td
                  className="text-center cursor-pointer"
                  onClick={() => togglePermission(row.id, 'admin', 'Admin', row.module)}
                  title="Admin always has full access"
                >
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded bg-emerald-500/15">
                    <Check size={18} className="text-emerald-600" strokeWidth={2.5} />
                  </div>
                </td>

                <td
                  className="text-center cursor-pointer"
                  onClick={() => togglePermission(row.id, 'doctor', 'Doctor', row.module)}
                  title="Click to toggle Doctor access"
                >
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${row.doctor ? 'bg-emerald-500/15' : 'bg-bg-surface-elevated border border-border-subtle'}`}>
                    {row.doctor ? <Check size={18} className="text-emerald-600" strokeWidth={2.5} /> : <X size={16} className="text-text-muted" />}
                  </div>
                </td>

                <td
                  className="text-center cursor-pointer"
                  onClick={() => togglePermission(row.id, 'nurse', 'Nurse', row.module)}
                  title="Click to toggle Nurse access"
                >
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${row.nurse ? 'bg-emerald-500/15' : 'bg-bg-surface-elevated border border-border-subtle'}`}>
                    {row.nurse ? <Check size={18} className="text-emerald-600" strokeWidth={2.5} /> : <X size={16} className="text-text-muted" />}
                  </div>
                </td>

                <td
                  className="text-center cursor-pointer"
                  onClick={() => togglePermission(row.id, 'pharmacy', 'Pharmacist', row.module)}
                  title="Click to toggle Pharmacist access"
                >
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${row.pharmacy ? 'bg-emerald-500/15' : 'bg-bg-surface-elevated border border-border-subtle'}`}>
                    {row.pharmacy ? <Check size={18} className="text-emerald-600" strokeWidth={2.5} /> : <X size={16} className="text-text-muted" />}
                  </div>
                </td>

                <td
                  className="text-center cursor-pointer"
                  onClick={() => togglePermission(row.id, 'billing', 'Billing Desk', row.module)}
                  title="Click to toggle Billing access"
                >
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${row.billing ? 'bg-emerald-500/15' : 'bg-bg-surface-elevated border border-border-subtle'}`}>
                    {row.billing ? <Check size={18} className="text-emerald-600" strokeWidth={2.5} /> : <X size={16} className="text-text-muted" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
