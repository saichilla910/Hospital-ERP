import React, { useState } from 'react';
import { FileText, Save, CheckCircle2, User, Stethoscope } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const ClinicalNotes = () => {
  const { patients, selectedPatient, showToast } = useHospital();
  const patient = selectedPatient || patients[0];

  const [soap, setSoap] = useState({
    subjective: 'Patient reports progressive retrosternal heaviness on walking > 200 meters. Relieved by rest. No diaphoresis today. Compliance with morning antihypertensives confirmed.',
    objective: 'Vitals: BP 136/84 mmHg, HR 76 bpm regular. S1 S2 normal, no murmurs or gallop. Chest: Vesicular breath sounds bilaterally without wheezing or crackles. Extremities: No peripheral pitting edema. Bilateral radial and dorsalis pedis pulses palpable 2+.',
    assessment: '1. Known CAD s/p PTCA to LAD with stable CCS Class 1 angina.\n2. Essential Hypertension - Controlled.\n3. Type 2 Diabetes Mellitus - Moderately Controlled (HbA1c 7.4%).',
    plan: '1. Continue dual antiplatelet therapy (Ticagrelor 90mg BID).\n2. Intensify Rosuvastatin to 20mg + Ezetimibe 10mg HS.\n3. Continue Telmisartan 40mg + Metoprolol 25mg OD.\n4. Repeat Lipid Profile and Liver Function Tests at 4 weeks.\n5. Advised 30 min daily brisk walking and low sodium DASH diet.'
  });

  const handleSaveSoap = () => {
    showToast('SOAP Clinical Note signed and permanently saved to EHR record.', 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Doctor Clinical Notes
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Patient: <strong className="text-text-main">{patient.name}</strong> ({patient.mrn}) • Consultation examination notes & treatment plan
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSaveSoap}>
          <Save size={16} /> Save Clinical Notes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5">
        {/* S - Subjective */}
        <div className="glass-card flex flex-col justify-between h-full gap-3 bg-bg-surface border border-border-subtle rounded-md shadow-xs p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <label className="text-sm text-teal-600 dark:text-teal-400 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-extrabold text-xs border border-teal-200 dark:border-teal-800/40">S</span>
              Subjective (Symptoms & History)
            </label>
            <span className="text-[0.675rem] text-text-dim uppercase font-semibold">Patient Verbal Report</span>
          </div>
          <textarea
            rows={4}
            className="form-textarea flex-1 min-h-[120px] rounded-md text-xs sm:text-sm resize-y"
            value={soap.subjective}
            onChange={(e) => setSoap({ ...soap, subjective: e.target.value })}
            placeholder="Record symptoms, pain duration, and patient history..."
          />
        </div>

        {/* O - Objective */}
        <div className="glass-card flex flex-col justify-between h-full gap-3 bg-bg-surface border border-border-subtle rounded-md shadow-xs p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <label className="text-sm text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-xs border border-emerald-200 dark:border-emerald-800/40">O</span>
              Objective (Exam & Vitals)
            </label>
            <span className="text-[0.675rem] text-text-dim uppercase font-semibold">Clinical Observations</span>
          </div>
          <textarea
            rows={4}
            className="form-textarea flex-1 min-h-[120px] rounded-md text-xs sm:text-sm resize-y"
            value={soap.objective}
            onChange={(e) => setSoap({ ...soap, objective: e.target.value })}
            placeholder="Record vitals, heart sounds, chest findings..."
          />
        </div>

        {/* A - Assessment */}
        <div className="glass-card flex flex-col justify-between h-full gap-3 bg-bg-surface border border-border-subtle rounded-md shadow-xs p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <label className="text-sm text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-xs border border-amber-200 dark:border-amber-800/40">A</span>
              Assessment (Diagnosis & Prognosis)
            </label>
            <span className="text-[0.675rem] text-text-dim uppercase font-semibold">ICD-10 Findings</span>
          </div>
          <textarea
            rows={4}
            className="form-textarea flex-1 min-h-[120px] rounded-md text-xs sm:text-sm resize-y"
            value={soap.assessment}
            onChange={(e) => setSoap({ ...soap, assessment: e.target.value })}
            placeholder="Record provisional/confirmed diagnoses..."
          />
        </div>

        {/* P - Plan */}
        <div className="glass-card flex flex-col justify-between h-full gap-3 bg-bg-surface border border-border-subtle rounded-md shadow-xs p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <label className="text-sm text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-xs border border-indigo-200 dark:border-indigo-800/40">P</span>
              Plan (Medication & Follow-Up)
            </label>
            <span className="text-[0.675rem] text-text-dim uppercase font-semibold">Orders & Care Plan</span>
          </div>
          <textarea
            rows={4}
            className="form-textarea flex-1 min-h-[120px] rounded-md text-xs sm:text-sm resize-y"
            value={soap.plan}
            onChange={(e) => setSoap({ ...soap, plan: e.target.value })}
            placeholder="Record medications, investigations, and follow-up..."
          />
        </div>
      </div>
    </div>
  );
};
