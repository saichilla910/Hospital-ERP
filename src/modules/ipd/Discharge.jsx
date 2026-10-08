import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  Printer,
  AlertTriangle,
  Building,
  CreditCard,
  Sparkles,
  Check,
  Bed,
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Discharge = () => {
  const {
    patients,
    showToast,
    openModal,
    billingInvoices,
    dischargePatientAndMarkCleaning,
    setActiveNav
  } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const [isDischargedSuccess, setIsDischargedSuccess] = useState(false);

  const [clearance, setClearance] = useState({
    consultantFitness: true,
    pharmacyReturn: true,
    nursingStation: true,
    diagnosticLab: true,
    tpaInsuranceSettlement: true,
    accountsSettlement: true
  });

  const [dischargeSummary, setDischargeSummary] = useState({
    conditionOnDischarge: 'Stable, Normal vitals, Walking comfortably, Afebrile.',
    hospitalCourse: 'Patient completed post-procedure inpatient observation. Clinical markers normalized. Discharged in hemodynamically stable condition.',
    dischargeMeds: '1. Tab. Blood Thinner 90mg — 1 tablet BID after food\n2. Tab. Cholesterol 20mg — 1 tablet at bedtime\n3. Tab. Multivitamin — 1 tablet OD after breakfast',
    followUpPlan: 'Review in Outpatient Department in 7 days or SOS if fever or acute pain occurs.'
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

  const isAllCleared = Object.values(clearance).every(Boolean);

  const handleFinalizeDischarge = () => {
    if (!isAllCleared) {
      const proceed = window.confirm('Some department clearance items are still pending. Do you wish to override and proceed with discharge?');
      if (!proceed) return;
    }

    const currentBed = patient.bedNo !== 'N/A' ? patient.bedNo : '4B-101';
    dischargePatientAndMarkCleaning(patient.id, currentBed, {
      summary: dischargeSummary.conditionOnDischarge,
      housekeeper: 'Housekeeping Station 3'
    });
    setIsDischargedSuccess(true);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="glass-card flex justify-between items-center flex-wrap gap-3.5 bg-bg-surface-elevated p-5 sm:p-6 rounded-2xl border border-border-subtle">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-main flex items-center gap-2">
            Patient Discharge & Bed Clearance
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Department clearance checklist, clinical summary generation, and automatic bed sanitization handoff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-bold">Select Inpatient:</span>
            <select
              className="form-select text-xs sm:text-sm font-semibold rounded-xl h-10"
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                setIsDischargedSuccess(false);
              }}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.ward !== 'N/A' ? `${p.ward} • Bed ${p.bedNo}` : 'OPD'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Discharged Notification Banner */}
      {isDischargedSuccess && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">
                Discharge Completed for {patient.name}!
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Bed <span className="font-bold text-text-main">{patient.bedNo}</span> was automatically marked as <strong>Cleaning</strong> on the Real-Time Bed Board. Housekeeping alerted for sanitization.
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm flex items-center gap-1.5 rounded-xl"
            onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
          >
            <Bed size={15} /> View Real-Time Bed Board <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Responsive Two Columns */}
      <div className="responsive-grid-split">
        {/* Left: Clearance Checklist */}
        <div className="no-print glass-card flex flex-col justify-between h-full gap-4 rounded-2xl bg-bg-surface border border-border-subtle p-5 sm:p-6 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
            <div>
              <h3 className="text-base text-teal-600 dark:text-teal-400 flex items-center gap-2 font-bold">
                <ShieldCheck size={18} /> Department Clearance Checklist
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Click each milestone to verify department sign-off</p>
            </div>
            <button className="btn btn-secondary btn-sm rounded-lg text-xs" onClick={handleClearAll}>
              <Check size={13} /> Clear All
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { key: 'consultantFitness', label: 'Doctor Discharge Fitness Note', dept: 'Primary Consultant' },
              { key: 'pharmacyReturn', label: 'Pharmacy Medicine Return & Audit', dept: 'Inpatient Pharmacy' },
              { key: 'nursingStation', label: 'Ward Nursing Handover & Consumables Check', dept: 'Ward 4B Nursing' },
              { key: 'diagnosticLab', label: 'Lab & Diagnostic Reports Handed Over', dept: 'Central Diagnostic Lab' },
              { key: 'tpaInsuranceSettlement', label: 'Insurance / TPA Final Discharge Authorization', dept: 'TPA Desk' },
              { key: 'accountsSettlement', label: 'Final Hospital Bill Payment / Settled', dept: 'Billing & Finance' }
            ].map((item) => {
              const isChecked = clearance[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleClearance(item.key, item.label)}
                  className={`rounded-xl p-3 sm:p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-500/10 border border-emerald-500/40 text-text-main shadow-2xs'
                      : 'bg-bg-surface-elevated border border-border-subtle text-text-muted hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border-2 border-border-subtle bg-bg-surface'
                      }`}
                    >
                      {isChecked && <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-text-main">{item.label}</div>
                      <div className="text-[11px] text-text-muted">Dept: {item.dept}</div>
                    </div>
                  </div>
                  <Badge variant={isChecked ? 'emerald' : 'amber'} size="sm">
                    {isChecked ? 'Cleared' : 'Pending'}
                  </Badge>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-border-subtle flex flex-col gap-2.5">
            <button
              className="btn btn-outline btn-sm w-full h-10 rounded-xl justify-center font-bold"
              onClick={() => {
                const matchedInv = billingInvoices.find((b) => b.patientId === patient.id || b.patientName === patient.name);
                openModal('invoice', matchedInv || billingInvoices[0]);
              }}
            >
              <CreditCard size={15} /> Review Final Hospital Bill & Advance Deductions
            </button>

            <button
              className={`btn btn-lg w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                isAllCleared
                  ? 'btn-primary bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'btn-warning bg-amber-500 hover:bg-amber-600 text-white'
              }`}
              onClick={handleFinalizeDischarge}
            >
              <Bed size={18} />
              Finalize Discharge & Release Bed ({patient.bedNo !== 'N/A' ? `Bed ${patient.bedNo}` : 'Ward Bed'})
            </button>
            <p className="text-[11px] text-center text-text-muted">
              Releases bed automatically to <strong>Cleaning</strong> queue on the real-time bed board.
            </p>
          </div>
        </div>

        {/* Right: Discharge Clinical Summary */}
        <div className="printable-area glass-card flex flex-col justify-between h-full gap-4 rounded-2xl bg-bg-surface border border-border-subtle p-5 sm:p-6 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
            <div>
              <h3 className="text-base text-teal-600 dark:text-teal-400 flex items-center gap-2 font-bold">
                <FileText size={18} /> Official Discharge Summary & Care Plan
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Clinical documentation to be provided to patient attendant</p>
            </div>
            <button className="btn btn-primary btn-sm rounded-lg" onClick={handlePrintDischargeSummary}>
              <Printer size={14} /> Print Summary
            </button>
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs font-bold text-text-main mb-1.5">
              Patient Health Condition on Discharge
            </label>
            <input
              type="text"
              className="form-input text-xs sm:text-sm font-medium rounded-xl h-10"
              value={dischargeSummary.conditionOnDischarge}
              onChange={(e) => setDischargeSummary({ ...dischargeSummary, conditionOnDischarge: e.target.value })}
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs font-bold text-text-main mb-1.5">
              Treatment Summary & Hospital Course Notes
            </label>
            <textarea
              rows={3}
              className="form-textarea text-xs sm:text-sm font-medium rounded-xl"
              value={dischargeSummary.hospitalCourse}
              onChange={(e) => setDischargeSummary({ ...dischargeSummary, hospitalCourse: e.target.value })}
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs font-bold text-text-main mb-1.5">
              Prescribed Take-Home Medicines (Generic Formulations)
            </label>
            <textarea
              rows={3}
              className="form-textarea text-xs sm:text-sm font-medium rounded-xl font-mono"
              value={dischargeSummary.dischargeMeds}
              onChange={(e) => setDischargeSummary({ ...dischargeSummary, dischargeMeds: e.target.value })}
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs font-bold text-text-main mb-1.5">
              Follow-Up Care Instructions & Emergency SOS Signs
            </label>
            <input
              type="text"
              className="form-input text-xs sm:text-sm font-medium rounded-xl h-10"
              value={dischargeSummary.followUpPlan}
              onChange={(e) => setDischargeSummary({ ...dischargeSummary, followUpPlan: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

