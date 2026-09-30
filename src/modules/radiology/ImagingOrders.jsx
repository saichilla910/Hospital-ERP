import React, { useState } from 'react';
import { ScanLine, Plus, CheckCircle2, User, Sparkles } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const ImagingOrders = () => {
  const { patients, doctors, showToast } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const [modality, setModality] = useState('MRI Scan');
  const [bodyPart, setBodyPart] = useState('Spine / Back');
  const [urgency, setUrgency] = useState('Routine');
  const [clinicalIndication, setClinicalIndication] = useState('Lower back pain and numbness');

  const quickScans = [
    { label: 'Chest X-Ray', mod: 'Digital X-Ray', part: 'Chest (PA View)', reason: 'Cough and chest congestion' },
    { label: 'Brain MRI', mod: 'MRI Scan', part: 'Brain & Head', reason: 'Persistent headache evaluation' },
    { label: 'Abdomen Ultrasound', mod: 'Ultrasound', part: 'Full Abdomen & Pelvis', reason: 'Abdominal discomfort' },
    { label: 'Spine CT Scan', mod: 'CT Scan', part: 'Lumbosacral Spine', reason: 'Lower back radiating pain' },
    { label: 'Knee X-Ray', mod: 'Digital X-Ray', part: 'Right Knee Joint (AP/Lat)', reason: 'Joint stiffness & pain' }
  ];

  const handleSelectQuickScan = (item) => {
    setModality(item.mod);
    setBodyPart(item.part);
    setClinicalIndication(item.reason);
    showToast(`Selected quick template: ${item.label}`, 'info');
  };

  const handleOrder = (e) => {
    e.preventDefault();
    const p = patients.find((pat) => pat.id === selectedPatientId);
    showToast(`Scan order booked: ${modality} (${bodyPart}) for ${p ? p.name : 'patient'}!`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border-subtle/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <ScanLine size={20} />
            </div>
            Book Diagnostic Scan & Radiology
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-normal">
            Order X-Rays, MRI, CT Scans, and Ultrasound for outpatients, admitted patients, and emergency trauma.
          </p>
        </div>
      </div>

      {/* Quick Common Scans Chips Strip */}
      <div className="glass-card p-4 sm:p-5 bg-bg-surface-elevated/70 border border-border-subtle rounded-2xl">
        <div className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-2">
          <Sparkles size={16} /> Quick-Select Standard Scan Protocols:
        </div>
        <div className="flex flex-wrap gap-2.5">
          {quickScans.map((qs, i) => (
            <button
              key={i}
              type="button"
              className="chip-btn py-2 px-3.5 text-xs sm:text-sm font-semibold rounded-xl"
              onClick={() => handleSelectQuickScan(qs)}
            >
              + {qs.label} <span className="text-[11px] text-text-dim font-normal">({qs.mod})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Responsive Layout: Order Form + Protocol & Safety Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Comprehensive Order Booking Form (7 cols) */}
        <div className="lg:col-span-7 glass-card p-5 sm:p-7 rounded-2xl border border-border-subtle bg-bg-surface">
          <h3 className="text-base sm:text-lg font-bold text-text-main mb-5 flex items-center gap-2 pb-3 border-b border-border-subtle">
            <ScanLine size={18} className="text-teal-600 dark:text-teal-400" />
            Scan Requisition Details
          </h3>

          <form onSubmit={handleOrder} className="flex flex-col gap-5">
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
                    {p.name} ({p.mrn}) • Age: {p.age} • Ward: {p.ward !== 'N/A' ? p.ward : 'OPD'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                  Modality / Machine *
                </label>
                <select
                  className="form-select h-11 text-sm font-medium rounded-xl"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                >
                  <option value="Digital X-Ray">Digital X-Ray (Fixed / Flat-Panel)</option>
                  <option value="CT Scan">CT Scan (128-Slice High Speed)</option>
                  <option value="MRI Scan">MRI Scan (3.0 Tesla Silent Scan)</option>
                  <option value="Ultrasound">Color Doppler Ultrasound</option>
                  <option value="Mammography">Digital 3D Mammography</option>
                  <option value="PET-CT Scan">Whole Body PET-CT Scan</option>
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                  Clinical Priority
                </label>
                <select
                  className="form-select h-11 text-sm font-medium rounded-xl"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option value="Routine">Routine (Within 4 Hours)</option>
                  <option value="Emergency (Immediate)">STAT Emergency (Immediate / Red Alert)</option>
                  <option value="Bedside Portable">Bedside Portable (ICU / HDU Bay)</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                Anatomical Region / Scan View *
              </label>
              <input
                type="text"
                className="form-input h-11 text-sm font-medium rounded-xl"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                placeholder="e.g. Chest (PA View), Lumbosacral Spine, Right Knee"
                required
              />
              <span className="text-[12px] text-text-dim mt-1">Specify exact views or anatomical regions required.</span>
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                Clinical Indication & Relevant Diagnostic Findings *
              </label>
              <textarea
                className="form-textarea text-sm rounded-xl min-h-[95px] p-3.5"
                value={clinicalIndication}
                onChange={(e) => setClinicalIndication(e.target.value)}
                placeholder="e.g. Severe acute lower back radiating pain, numbness in lower limb, rule out disc prolapse"
                required
              />
            </div>

            <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-text-muted">
                PACS requisition will be routed to Radiology console instantly.
              </span>
              <button type="submit" className="btn btn-primary btn-lg w-full sm:w-auto h-11 px-6 rounded-xl font-bold flex items-center justify-center gap-2">
                <Plus size={18} /> Transmit Scan Order
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary, Turnaround SLA & Safety Checklist (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Patient Quick Info Card */}
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
                    <span className="text-text-dim block">Assigned Ward / Bed</span>
                    <span className="font-bold text-text-main">{currentPatient.ward !== 'N/A' ? currentPatient.ward : 'OPD Registration'}</span>
                  </div>
                  <div>
                    <span className="text-text-dim block">Primary Consultant</span>
                    <span className="font-bold text-text-main">{currentPatient.doctor}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Imaging Protocol & Safety Rules Card */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col gap-4">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400" />
              Department Protocol & Turnaround SLA
            </h4>

            <div className="flex flex-col gap-3 text-xs text-text-muted leading-relaxed">
              <div className="p-3 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20">
                <strong className="text-teal-700 dark:text-teal-300 block mb-1">
                  Selected Modality: {modality}
                </strong>
                {modality.includes('MRI') && 'Screen patient for ferromagnetic implants, cardiac pacemakers, or claustrophobia prior to gantry entry.'}
                {modality.includes('CT') && 'Ensure fasting 4 hours prior if intravenous iodinated contrast is ordered. Verify Serum Creatinine.'}
                {modality.includes('X-Ray') && 'Instant direct radiography panel acquisition. Radiation badge monitor protocol active.'}
                {modality.includes('Ultrasound') && 'Full bladder required for pelvic/lower abdomen scanning. NPO 6 hours for upper abdomen.'}
                {modality.includes('Mammography') && 'Avoid deodorants or powders. High-resolution tomosynthesis protocol active.'}
                {modality.includes('PET') && 'Fasting blood glucose must be <150 mg/dL. 18F-FDG tracer administered 60 min pre-scan.'}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle">
                <span className="text-text-dim">Estimated Reporting SLA:</span>
                <span className={`font-bold ${urgency.includes('Emergency') ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'}`}>
                  {urgency.includes('Emergency') ? 'STAT (< 30 Mins)' : 'Routine (2 - 4 Hours)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle">
                <span className="text-text-dim">Duty Radiologist:</span>
                <span className="font-semibold text-text-main">Dr. Vikramaditya Rao (MD, DNB Rad)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
