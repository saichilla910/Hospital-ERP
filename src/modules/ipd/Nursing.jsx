import React, { useState } from 'react';
import { HeartPulse, Pill, Check, Clock, AlertTriangle, FileText, Activity } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Nursing = () => {
  const { patients, showToast } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [marList, setMarList] = useState([
    { id: 1, drug: 'Inj. Ceftriaxone 1g IV', scheduledTime: '08:00 AM', status: 'Given', nurse: 'Sr. Reena Mathews', notes: 'Given slow IV in 100ml NS' },
    { id: 2, drug: 'Inj. Pantoprazole 40mg IV', scheduledTime: '08:00 AM', status: 'Given', nurse: 'Sr. Reena Mathews', notes: 'Before breakfast' },
    { id: 3, drug: 'Tab. Ticagrelor 90mg PO', scheduledTime: '12:00 PM', status: 'Pending', nurse: 'Sr. Angela Kurian', notes: 'After lunch' },
    { id: 4, drug: 'Inj. Enoxaparin 40mg SC', scheduledTime: '08:00 PM', status: 'Scheduled', nurse: 'Night Duty Sister', notes: 'Abdominal subcutaneous' }
  ]);

  const [nurseNotes, setNurseNotes] = useState('Patient comfortable in bed. SpO2 maintained at 98% on room air. 2D Echo report reviewed with Dr. Ananya Mukherjee. Blood sugar checked at 11:30 AM: 142 mg/dL. Urine output adequate (650ml past 4 hrs).');

  const markAdministered = (id) => {
    setMarList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Given', nurse: 'Dr. Sarah Jenkins / Sr. Nurse' } : m))
    );
    showToast('eMAR Updated: Medication administered & time-stamped.', 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── Header & Patient Selector ── */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/50 flex items-center justify-center shrink-0 shadow-2xs">
            <HeartPulse size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-main tracking-tight font-display leading-tight">
                Central Nursing Station & eMAR Workspace
              </h2>
              <span className="badge badge-teal text-xs font-semibold py-0.5 px-2.5">
                Ward Station 04
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed font-normal">
              4-Hourly vitals monitoring, Electronic Medication Administration Record (eMAR), and shift handover.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-semibold text-text-muted whitespace-nowrap">Active Inpatient:</label>
          <select
            className="form-select h-11 text-xs sm:text-sm font-medium rounded-xl min-w-[260px] bg-bg-surface-elevated border-border-subtle"
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

      {/* ── Vitals Telemetry Row (5 Equal Columns Perfectly Aligned) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="glass-card glass-card-interactive p-4 sm:p-4.5 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            <span>Blood Pressure</span>
            <span className="text-[10px] text-text-dim">10:00 AM</span>
          </div>
          <div className="mono text-2xl font-bold text-teal-600 dark:text-teal-400 mt-2">
            {patient.vitals.bp}
          </div>
          <span className="text-[11px] text-text-dim mt-1.5 font-medium">mmHg • Normotensive</span>
        </div>

        <div className="glass-card glass-card-interactive p-4 sm:p-4.5 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            <span>Heart Rate</span>
            <span className="text-[10px] text-text-dim">Pulse</span>
          </div>
          <div className="mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {patient.vitals.pulse} <span className="text-xs font-normal text-text-dim">bpm</span>
          </div>
          <span className="text-[11px] text-text-dim mt-1.5 font-medium">Sinus rhythm steady</span>
        </div>

        <div className="glass-card glass-card-interactive p-4 sm:p-4.5 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            <span>Oxygen Saturation</span>
            <span className="text-[10px] text-text-dim">SpO2</span>
          </div>
          <div className="mono text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">
            {patient.vitals.spo2}
          </div>
          <span className="text-[11px] text-text-dim mt-1.5 font-medium">Room Air (Target &gt;95%)</span>
        </div>

        <div className="glass-card glass-card-interactive p-4 sm:p-4.5 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            <span>Body Temperature</span>
            <span className="text-[10px] text-text-dim">Axillary</span>
          </div>
          <div className="mono text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {patient.vitals.temp}
          </div>
          <span className="text-[11px] text-text-dim mt-1.5 font-medium">Afebrile (Normal range)</span>
        </div>

        <div className="glass-card glass-card-interactive p-4 sm:p-4.5 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            <span>Fluid Balance</span>
            <span className="text-[10px] text-text-dim">4-Hour</span>
          </div>
          <div className="mono text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            +450 <span className="text-xs font-normal text-text-dim">mL</span>
          </div>
          <span className="text-[11px] text-text-dim mt-1.5 font-medium">Adequate urine output</span>
        </div>
      </div>

      {/* ── Two Column Layout: eMAR & Shift Notes (Aligned Heights) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: eMAR Medication Schedule (7 cols) */}
        <div className="lg:col-span-7 glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base text-text-main flex items-center gap-2 font-bold tracking-tight">
                <Pill size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Electronic Medication Administration Record (eMAR)</span>
              </h3>
              <span className="badge badge-teal text-xs font-semibold py-0.5 px-2.5">
                Shift: Morning (07:00 - 15:00)
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {marList.map((item) => (
                <div
                  key={item.id}
                  className="bg-bg-surface-elevated/70 border border-border-subtle rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-teal-500/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold text-text-main truncate">
                      {item.drug}
                    </div>
                    <div className="text-xs text-text-muted mt-1 flex items-center gap-2 flex-wrap">
                      <span className="mono font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200/70 dark:border-teal-800/60 text-[11px]">
                        {item.scheduledTime}
                      </span>
                      <span>•</span>
                      <span className="truncate">{item.notes}</span>
                    </div>
                    {item.status === 'Given' && (
                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        ✓ Administered by: {item.nurse}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {item.status === 'Given' ? (
                      <Badge variant="emerald" size="sm" dot>Administered</Badge>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        onClick={() => markAdministered(item.id)}
                      >
                        <Check size={14} strokeWidth={2.4} />
                        <span>Administer Now</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Nursing Shift Handover Notes (5 cols) */}
        <div className="lg:col-span-5 glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-sm sm:text-base text-text-main flex items-center gap-2 font-bold tracking-tight">
                <FileText size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Nursing Shift Handover Log</span>
              </h3>
              <span className="badge badge-gray text-xs font-semibold py-0.5 px-2">
                Shift Summary
              </span>
            </div>

            <div className="form-group mb-0 mt-4">
              <label className="form-label text-xs font-semibold text-text-main mb-1.5">
                Clinical Observations & Progress Summary
              </label>
              <textarea
                rows={7}
                className="form-textarea text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl"
                value={nurseNotes}
                onChange={(e) => setNurseNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-border-subtle/80 flex-wrap gap-2.5 mt-2">
            <span className="text-xs text-text-muted font-medium">
              Signed: <strong className="text-text-main font-semibold">Sr. Reena Mathews, RN</strong>
            </span>
            <button
              className="btn btn-secondary btn-sm min-h-[38px] px-4 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs hover:border-teal-500/50"
              onClick={() => showToast('Nurse Handover Log saved to electronic chart.', 'success')}
            >
              Save Handover Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
