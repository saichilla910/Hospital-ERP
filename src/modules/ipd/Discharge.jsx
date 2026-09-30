import React, { useState } from 'react';
import { FileText, CheckCircle2, ShieldCheck, Printer, AlertTriangle, Building, CreditCard, Sparkles, Check } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Discharge = () => {
  const { patients, showToast, openModal, billingInvoices } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [clearance, setClearance] = useState({
    consultantFitness: true,
    pharmacyReturn: true,
    nursingStation: true,
    diagnosticLab: true,
    tpaInsuranceSettlement: false,
    accountsSettlement: false
  });

  const [dischargeSummary, setDischargeSummary] = useState({
    conditionOnDischarge: 'Stable, Normal vitals, Walking comfortably, No fever.',
    hospitalCourse: 'Patient admitted with chest discomfort following angioplasty. Monitored in Cardiology ward. Blood pressure and heart rate stabilized. ECG is normal.',
    dischargeMeds: '1. Tab. Blood Thinner 90mg — 1 tablet morning & night (after food)\n2. Tab. Cholesterol 20mg — 1 tablet at bedtime\n3. Tab. BP Medicine 40mg — 1 tablet in morning',
    followUpPlan: 'Come for review in Cardiology OPD after 10 days, or immediately if feeling chest pain or dizziness.'
  });

  const toggleClearance = (key, label) => {
    setClearance((prev) => {
      const nextVal = !prev[key];
      showToast(`${label}: ${nextVal ? 'Marked as Cleared' : 'Marked as Pending'}`, 'info');
      return { ...prev, [key]: nextVal };
    });
  };

  const handleClearAll = () => {
    setClearance({
      consultantFitness: true,
      pharmacyReturn: true,
      nursingStation: true,
      diagnosticLab: true,
      tpaInsuranceSettlement: true,
      accountsSettlement: true
    });
    showToast('All discharge clearance steps approved!', 'success');
  };

  const handlePrintDischargeSummary = () => {
    showToast(`Discharge Summary printed for ${patient.name}.`, 'success');
    window.print();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="glass-card flex justify-between items-center flex-wrap gap-3.5 bg-bg-surface-elevated">
        <div>
          <h2 className="text-2xl font-extrabold text-text-main">
            Patient Discharge & Summary
          </h2>
          <p className="text-xs text-text-muted">
            Complete department clearance checklist and write take-home instructions for the patient.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-text-muted font-semibold">Select Patient:</span>
          <select
            className="form-select"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.ward !== 'N/A' ? `${p.ward} • Bed ${p.bedNo}` : 'OPD'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Two Columns */}
      <div className="responsive-grid-split">
        {/* Left: Clearance Checklist */}
        <div className="no-print glass-card flex flex-col justify-between h-full gap-4 rounded-lg bg-bg-surface border border-border-subtle shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base text-teal-600 flex items-center gap-2 font-bold">
              <ShieldCheck size={18} /> Discharge Checklist (Click to toggle)
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={handleClearAll}>
              <Check size={13} /> Clear All
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { key: 'consultantFitness', label: 'Doctor Discharge Approval', dept: 'Doctor Team' },
              { key: 'pharmacyReturn', label: 'Pharmacy Medicine Return & Check', dept: 'Pharmacy' },
              { key: 'nursingStation', label: 'Ward Nursing Handover & Consumables', dept: 'Ward 4B' },
              { key: 'diagnosticLab', label: 'Lab Reports & Scan Reports Handover', dept: 'Lab & Diagnostics' },
              { key: 'tpaInsuranceSettlement', label: 'Insurance / TPA Final Clearance', dept: 'Insurance Desk' },
              { key: 'accountsSettlement', label: 'Final Hospital Bill Payment', dept: 'Billing Dept' }
            ].map((item) => {
              const isChecked = clearance[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleClearance(item.key, item.label)}
                  className={`rounded-md p-3 md:p-3.5 flex items-center justify-between cursor-pointer glass-card-interactive ${
                    isChecked
                      ? 'bg-emerald-500/12 border border-emerald-500'
                      : 'bg-bg-surface-elevated border border-border-subtle'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5.5 h-5.5 rounded flex items-center justify-center text-white ${
                        isChecked
                          ? 'border-2 border-emerald-500 bg-emerald-600'
                          : 'border-2 border-text-dim bg-transparent'
                      }`}
                    >
                      {isChecked && <CheckCircle2 size={15} />}
                    </div>
                    <div>
                      <div className="text-[0.85rem] font-semibold text-text-main">{item.label}</div>
                      <div className="text-[0.725rem] text-text-muted">Dept: {item.dept}</div>
                    </div>
                  </div>
                  <Badge variant={isChecked ? 'emerald' : 'amber'} size="sm">
                    {isChecked ? 'Cleared' : 'Pending'}
                  </Badge>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-3.5 border-t border-border-subtle">
            <button
              className="btn btn-outline btn-sm w-full"
              onClick={() => {
                const matchedInv = billingInvoices.find((b) => b.patientId === patient.id || b.patientName === patient.name);
                openModal('invoice', matchedInv || billingInvoices[0]);
              }}
            >
              <CreditCard size={14} /> View Final Hospital Bill
            </button>
          </div>
        </div>

        {/* Right: Discharge Clinical Summary */}
        <div className="printable-area glass-card flex flex-col justify-between h-full gap-3.5 rounded-lg bg-bg-surface border border-border-subtle shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base text-teal-600 flex items-center gap-2 font-bold">
              <FileText size={18} /> Official Discharge Summary & Care Plan
            </h3>
            <button className="btn btn-primary btn-sm" onClick={handlePrintDischargeSummary}>
              <Printer size={14} /> Print Summary
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Patient Health Condition on Discharge</label>
            <input
              type="text"
              className="form-input"
              value={dischargeSummary.conditionOnDischarge}
              onChange={(e) => setDischargeSummary({ ...dischargeSummary, conditionOnDischarge: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Treatment Summary & Hospital Stay Notes</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={dischargeSummary.hospitalCourse}
              onChange={(e) => setDischargeSummary({ ...dischargeSummary, hospitalCourse: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prescribed Medicines to Take at Home</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={dischargeSummary.dischargeMeds}
              onChange={(e) => setDischargeSummary({ ...dischargeSummary, dischargeMeds: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Follow-Up Instructions & Doctor Advice</label>
            <input
              type="text"
              className="form-input"
              value={dischargeSummary.followUpPlan}
              onChange={(e) => setDischargeSummary({ ...dischargeSummary, followUpPlan: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
