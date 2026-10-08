import React, { useState } from 'react';
import { Search, Plus, Trash2, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Diagnosis = () => {
  const { selectedPatient, patients, showToast } = useHospital();
  const patient = selectedPatient || patients[0];

  const [diagnoses, setDiagnoses] = useState([
    { code: 'HTN-01', desc: 'High Blood Pressure (Hypertension)', type: 'Primary', onset: '2023-04-10', status: 'Active' },
    { code: 'DIA-02', desc: 'Type 2 Diabetes Mellitus', type: 'Secondary', onset: '2023-04-10', status: 'Under Control' },
    { code: 'LIP-03', desc: 'High Cholesterol (Hyperlipidemia)', type: 'Secondary', onset: '2025-11-20', status: 'Active' },
    { code: 'CAD-04', desc: 'Chest Discomfort / Post-Angioplasty Care', type: 'Primary', onset: '2026-03-12', status: 'Stable' }
  ]);

  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('Primary');

  const commonConditions = [
    { code: 'FEV-10', desc: 'Viral Fever & Body Aches', type: 'Primary' },
    { code: 'GAS-20', desc: 'Acid Reflux / Gastritis', type: 'Primary' },
    { code: 'BRN-30', desc: 'Bronchitis / Persistent Cough', type: 'Primary' },
    { code: 'OST-40', desc: 'Knee Osteoarthritis Joint Pain', type: 'Secondary' },
    { code: 'MIG-50', desc: 'Migraine Headache', type: 'Primary' }
  ];

  const handleQuickAdd = (item) => {
    setNewCode(item.code);
    setNewDesc(item.desc);
    setNewType(item.type);
    showToast(`Loaded "${item.desc}" into form. Click "+ Add Condition" to save.`, 'info');
  };

  const addDiagnosis = () => {
    if (!newDesc) {
      showToast('Please enter a condition description', 'error');
      return;
    }
    const code = newCode || `DX-${Math.floor(100 + Math.random() * 900)}`;
    setDiagnoses([
      ...diagnoses,
      {
        code,
        desc: newDesc,
        type: newType,
        onset: new Date().toISOString().split('T')[0],
        status: 'Active'
      }
    ]);
    setNewCode('');
    setNewDesc('');
    showToast(`Added condition "${newDesc}" to ${patient.name}'s record.`, 'success');
  };

  const removeDiagnosis = (index) => {
    const item = diagnoses[index];
    setDiagnoses(diagnoses.filter((_, i) => i !== index));
    showToast(`Removed condition: ${item.desc}`, 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center pb-2 border-b border-border-subtle/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display">
            Patient Diagnosed Conditions & Health History
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-normal">
            Patient: <strong className="text-text-main font-semibold">{patient.name}</strong> ({patient.mrn}) • Active medical issues and ongoing conditions
          </p>
        </div>
      </div>

      {/* Quick Select Common Diagnoses */}
      <div className="glass-card p-4 sm:p-5 bg-bg-surface border border-border-subtle rounded-2xl">
        <div className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-1.5">
          <Sparkles size={16} /> Quick-Select Common Medical Conditions:
        </div>
        <div className="flex flex-wrap gap-2.5">
          {commonConditions.map((cond, i) => (
            <button
              key={i}
              type="button"
              className="chip-btn py-2 px-3.5 text-xs sm:text-sm font-semibold rounded-xl"
              onClick={() => handleQuickAdd(cond)}
            >
              + {cond.desc}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Diagnosis Bar */}
      <div className="glass-card p-5 sm:p-6 bg-bg-surface rounded-2xl border border-border-subtle shadow-xs">
        <h4 className="text-sm sm:text-base text-text-main font-bold mb-4 flex items-center gap-2 pb-3 border-b border-border-subtle">
          <Plus size={16} className="text-teal-600 dark:text-teal-400" /> Add New Medical Condition
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="form-label text-xs font-semibold mb-1.5">ICD / Code</label>
            <input
              type="text"
              className="form-input mono rounded-xl h-11 text-xs sm:text-sm"
              placeholder="e.g. HTN-01"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
          </div>
          <div className="lg:col-span-6">
            <label className="form-label text-xs font-semibold mb-1.5">Condition Description *</label>
            <input
              type="text"
              className="form-input rounded-xl h-11 text-xs sm:text-sm"
              placeholder="e.g. Type 2 Diabetes, High Blood Pressure, Gastritis"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="form-label text-xs font-semibold mb-1.5">Priority</label>
            <select
              className="form-select rounded-xl h-11 text-xs sm:text-sm"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="Primary">Primary (Main)</option>
              <option value="Secondary">Secondary</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <button className="btn btn-primary w-full rounded-xl h-11 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-teal-600/20" onClick={addDiagnosis}>
              <Plus size={16} /> Add Condition
            </button>
          </div>
        </div>
      </div>

      {/* Diagnosis Table */}
      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Medical Condition</th>
              <th>Priority</th>
              <th>Diagnosed On</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.map((d, idx) => (
              <tr key={idx}>
                <td>
                  <span className="mono font-extrabold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded">
                    {d.code}
                  </span>
                </td>
                <td className="font-semibold text-text-main">{d.desc}</td>
                <td>
                  <Badge variant={d.type === 'Primary' ? 'rose' : 'teal'}>{d.type}</Badge>
                </td>
                <td className="text-[0.8rem] text-text-muted">{d.onset}</td>
                <td>
                  <span className="badge badge-emerald">{d.status}</span>
                </td>
                <td className="text-right">
                  <button
                    className="btn-icon btn-sm btn-icon-danger"
                    onClick={() => removeDiagnosis(idx)}
                    title="Remove Condition"
                  >
                    <Trash2 size={20} strokeWidth={2.2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
