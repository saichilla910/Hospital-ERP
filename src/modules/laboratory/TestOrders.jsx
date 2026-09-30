import React, { useState } from 'react';
import { FlaskConical, Plus, Search, CheckCircle2, User, Sparkles } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const TestOrders = () => {
  const { patients, doctors, showToast } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0].id);
  const [testCategory, setTestCategory] = useState('Biochemistry');
  const [testName, setTestName] = useState('Complete Blood Count (CBC)');
  const [urgency, setUrgency] = useState('Routine');

  const popularTests = [
    { name: 'Complete Blood Count (CBC)', cat: 'Hematology', urg: 'Routine' },
    { name: 'Kidney Function Test (KFT / RFT)', cat: 'Biochemistry', urg: 'Routine' },
    { name: 'Liver Function Test (LFT)', cat: 'Biochemistry', urg: 'Routine' },
    { name: 'HbA1c (Diabetes Sugar)', cat: 'Biochemistry', urg: 'Routine' },
    { name: 'Cardiac Biomarker (Troponin-I)', cat: 'Cardiac & Emergency', urg: 'Urgent (Within 45m)' },
    { name: 'Lipid Profile (Cholesterol)', cat: 'Biochemistry', urg: 'Routine' },
    { name: 'Urine Routine & Microscopy', cat: 'Clinical Pathology', urg: 'Routine' },
    { name: 'Blood Grouping & Crossmatch', cat: 'Blood Bank', urg: 'Urgent (Within 45m)' }
  ];

  const handleSelectQuickTest = (test) => {
    setTestName(test.name);
    setTestCategory(test.cat);
    setUrgency(test.urg);
    showToast(`Selected "${test.name}" panel.`, 'info');
  };

  const handleOrderTest = (e) => {
    e.preventDefault();
    const p = patients.find((pat) => pat.id === selectedPatientId);
    showToast(`Lab test "${testName}" ordered for ${p.name}. Transmitted to sample collection desk.`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border-subtle/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <FlaskConical size={20} />
            </div>
            Order Laboratory Diagnostics
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-normal">
            Requisition blood tests, biochemistry panels, and microbiological cultures for OPD or admitted inpatients.
          </p>
        </div>
      </div>

      {/* Quick Select Popular Lab Tests Strip */}
      <div className="glass-card p-4 sm:p-5 bg-bg-surface-elevated/70 border border-border-subtle rounded-2xl">
        <div className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-2">
          <Sparkles size={16} /> Quick-Select High-Frequency Panels:
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {popularTests.map((t, idx) => {
            const isSelected = testName === t.name;
            return (
              <button
                key={idx}
                type="button"
                className={`chip-btn py-2 px-3.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                  isSelected
                    ? 'active bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                    : 'bg-bg-surface text-text-main border-border-subtle hover:border-teal-500/50'
                }`}
                onClick={() => handleSelectQuickTest(t)}
              >
                <Plus size={14} className={isSelected ? 'text-white' : 'text-teal-600 dark:text-teal-400'} />
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Responsive Layout: Order Form + Protocol & Specimen Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Test Order Form (7 cols) */}
        <div className="lg:col-span-7 glass-card p-5 sm:p-7 rounded-2xl border border-border-subtle bg-bg-surface">
          <h3 className="text-base sm:text-lg font-bold text-text-main mb-5 flex items-center gap-2 pb-3 border-b border-border-subtle">
            <FlaskConical size={18} className="text-teal-600 dark:text-teal-400" />
            Lab Test Order Requisition
          </h3>

          <form onSubmit={handleOrderTest} className="flex flex-col gap-5">
            <div className="form-group mb-0">
              <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                Target Patient *
              </label>
              <select
                className="form-select h-11 text-sm font-medium rounded-xl"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.mrn}) • Age: {p.age} • Location: {p.ward !== 'N/A' ? p.ward : 'OPD'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                  Ordering Consultant *
                </label>
                <select
                  className="form-select h-11 text-sm font-medium rounded-xl"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                  Urgency / Priority SLA
                </label>
                <select
                  className="form-select h-11 text-sm font-medium rounded-xl"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option value="Routine">Routine (Within 4 Hours)</option>
                  <option value="Urgent (Within 45m)">Urgent STAT (Within 45 Mins)</option>
                  <option value="Critical Care">Critical Care / ICU Immediate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                  Diagnostic Category
                </label>
                <input
                  type="text"
                  className="form-input h-11 text-sm font-medium rounded-xl"
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  placeholder="e.g. Biochemistry, Hematology"
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                  Test Panel Name *
                </label>
                <input
                  type="text"
                  className="form-input h-11 text-sm font-medium rounded-xl"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Complete Blood Count (CBC)"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-text-muted">
                Sample barcodes will be dispatched to central phlebotomy station.
              </span>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full sm:w-auto h-11 px-6 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Order Test & Transmit to Lab
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Specimen Guidelines & Patient Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Patient Card Preview */}
          {(() => {
            const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
            return (
              <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border-subtle bg-bg-surface-elevated/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentPatient.photo}
                      alt={currentPatient.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/80"
                    />
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-text-main leading-tight">
                        {currentPatient.name}
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        {currentPatient.mrn} • {currentPatient.age} yrs • {currentPatient.gender}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-teal font-mono">{currentPatient.bloodGroup}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border-subtle text-xs">
                  <div>
                    <span className="text-text-dim block">Location</span>
                    <span className="font-bold text-text-main">
                      {currentPatient.ward !== 'N/A' ? currentPatient.ward : 'OPD Clinic'}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-dim block">Attending Doctor</span>
                    <span className="font-bold text-text-main">{currentPatient.doctor}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Phlebotomy Specimen Vacutainer Guide */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col gap-4">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400" />
              Phlebotomy & Specimen Collection Protocol
            </h4>

            <div className="flex flex-col gap-2.5 text-xs text-text-muted leading-relaxed">
              <div className="p-3 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20">
                <strong className="text-teal-700 dark:text-teal-300 block mb-1">
                  Required Sample: {testCategory} Panel
                </strong>
                {testName.includes('CBC') && 'Lavender Top Tube (K2-EDTA 3ml). Invert gently 8-10 times. Do not centrifuge.'}
                {testName.includes('KFT') && 'Gold / Yellow SST Top (Gel Clot Activator 4ml). Centrifuge at 3000 RPM for 10 min.'}
                {testName.includes('LFT') && 'Gold / Yellow SST Top (Serum Separator 4ml). Protect from prolonged direct light.'}
                {testName.includes('HbA1c') && 'Lavender EDTA Whole Blood tube. Fasting not strictly mandatory for HbA1c.'}
                {testName.includes('Troponin') && 'Light Green Heparin tube / Gold SST. STAT process within 20 minutes for ACS triage.'}
                {testName.includes('Lipid') && 'Gold SST Tube. Strictly 10-12 hours overnight fasting mandatory.'}
                {testName.includes('Urine') && 'Sterile screw-cap container. Mid-stream clean catch specimen required.'}
                {testName.includes('Blood Grouping') && 'Pink EDTA or Red Top Tube. Barcode cross-match verification mandatory.'}
                {!['CBC','KFT','LFT','HbA1c','Troponin','Lipid','Urine','Blood Grouping'].some(k => testName.includes(k)) &&
                  'Standard blood or body fluid collection protocol applies. Verify fasting requirements.'}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle">
                <span className="text-text-dim">Expected Turnaround:</span>
                <span className={`font-bold ${urgency.includes('Urgent') ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'}`}>
                  {urgency.includes('Urgent') ? 'STAT (< 45 Mins)' : 'Routine (< 4 Hours)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle">
                <span className="text-text-dim">Lab Section Supervisor:</span>
                <span className="font-semibold text-text-main">Dr. Sunita Deshmukh (MD Pathology)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
