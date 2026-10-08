import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Pill,
  Plus,
  Trash2,
  FileCheck,
  Printer,
  HeartPulse,
  AlertTriangle,
  FlaskConical,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Info,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const DoctorConsultation = () => {
  const {
    patients,
    selectedPatient,
    setSelectedPatient,
    addPrescription,
    openModal,
    doctors,
    drugsMaster = [],
    validatePrescriptionSafety,
    showToast
  } = useHospital();

  const patient = selectedPatient || patients[0];
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[1] || doctors[0]);

  // Clinical inputs
  const [chiefComplaint, setChiefComplaint] = useState('Patient reports mild exertion-related shortness of breath and heaviness in left arm for 3 days.');
  const [clinicalExam, setClinicalExam] = useState('Heart sounds S1 S2 heard regular, no murmurs. Chest clear bilaterally. No pedal edema.');
  const [icdDiagnosis, setIcdDiagnosis] = useState('I20.0 - Unstable Angina, Stabilized');
  const [dietAdvice, setDietAdvice] = useState('Low sodium, restricted fat intake, adequate hydration, strict avoidance of strenuous physical exertion.');
  const [followUp, setFollowUp] = useState('Review in OPD after 2 weeks or immediately in Emergency if chest pain recurs.');

  // Clinical override state for allergy warnings
  const [overrideAllergy, setOverrideAllergy] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  // Rx Items
  const [rxItems, setRxItems] = useState([
    {
      name: 'Tab. Brilinta 90mg',
      genericName: 'Ticagrelor',
      strength: '90mg',
      dosage: '1 tab BID (Twice daily)',
      duration: '30 Days',
      instructions: 'After food, do not skip'
    },
    {
      name: 'Tab. Rozavel-EZ 20/10',
      genericName: 'Rosuvastatin + Ezetimibe',
      strength: '20mg + 10mg',
      dosage: '1 tab HS (Bedtime)',
      duration: '30 Days',
      instructions: 'Night after dinner'
    },
    {
      name: 'Tab. Telma 40',
      genericName: 'Telmisartan',
      strength: '40mg',
      dosage: '1 tab OD (Morning)',
      duration: '30 Days',
      instructions: 'Empty stomach'
    }
  ]);

  const [selectedMasterDrugId, setSelectedMasterDrugId] = useState('');
  const [customDrugName, setCustomDrugName] = useState('');
  const [customDosage, setCustomDosage] = useState('1 tab OD (Morning)');
  const [customDuration, setCustomDuration] = useState('14 Days');
  const [customInstructions, setCustomInstructions] = useState('After food');

  // Real-time Safety Validation
  const safetyReport = useMemo(() => {
    if (!validatePrescriptionSafety) return { isValid: true, allergyWarnings: [], interactionWarnings: [], doseWarnings: [] };
    return validatePrescriptionSafety({
      patientId: patient.id,
      drugItems: rxItems
    });
  }, [patient.id, rxItems, validatePrescriptionSafety]);

  const handleAddMasterDrug = (drug) => {
    if (!drug) return;
    const item = {
      name: `Tab. ${drug.brandName}`,
      genericName: drug.genericName,
      strength: drug.strength,
      dosage: drug.defaultFrequency || '1 tab OD (Morning)',
      duration: '14 Days',
      instructions: 'After meals'
    };
    setRxItems((prev) => [...prev, item]);
    showToast(`Added ${drug.brandName} (${drug.genericName}) to prescription. Safety checks running...`, 'info');
  };

  const handleAddCustomDrug = () => {
    if (!customDrugName.trim() && !selectedMasterDrugId) return;

    if (selectedMasterDrugId) {
      const master = drugsMaster.find((d) => d.id === selectedMasterDrugId);
      if (master) {
        setRxItems((prev) => [
          ...prev,
          {
            name: `Tab. ${master.brandName}`,
            genericName: master.genericName,
            strength: master.strength,
            dosage: customDosage,
            duration: customDuration,
            instructions: customInstructions
          }
        ]);
        setSelectedMasterDrugId('');
        showToast(`Added ${master.brandName} to prescription.`, 'success');
        return;
      }
    }

    setRxItems((prev) => [
      ...prev,
      {
        name: customDrugName,
        genericName: customDrugName,
        strength: 'Standard',
        dosage: customDosage,
        duration: customDuration,
        instructions: customInstructions
      }
    ]);
    setCustomDrugName('');
    showToast(`Added ${customDrugName} to prescription.`, 'success');
  };

  const removeDrugItem = (index) => {
    setRxItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAndIssueRx = () => {
    // If hard allergy warnings exist without override, block issuing!
    if (safetyReport.allergyWarnings.length > 0 && !overrideAllergy) {
      showToast('Prescription blocked: Critical allergy contraindication detected! You must provide an explicit clinical justification to override.', 'error');
      return;
    }

    if (safetyReport.allergyWarnings.length > 0 && overrideAllergy && !overrideReason.trim()) {
      showToast('Please enter an explicit clinical rationale justifying the allergy override.', 'warning');
      return;
    }

    const rxRecord = {
      id: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      patientId: patient.id,
      patientName: patient.name,
      patientUhid: patient.uhid || patient.mrn,
      patientAge: patient.age,
      patientWeight: patient.weightKg || patient.vitals?.weight,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      diagnosis: icdDiagnosis,
      items: rxItems,
      dietAdvice,
      followUp,
      safetyCheck: {
        checkedAt: new Date().toISOString(),
        allergyWarningsCount: safetyReport.allergyWarnings.length,
        interactionWarningsCount: safetyReport.interactionWarnings.length,
        doseWarningsCount: safetyReport.doseWarnings.length,
        isOverridden: overrideAllergy,
        overrideReason: overrideReason || null
      }
    };

    addPrescription(rxRecord);
    openModal('prescription', rxRecord);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Patient & Doctor Workspace Selector */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border-subtle flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-bg-surface-elevated/80 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={patient.photo}
            alt={patient.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-teal-500/80 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-text-main tracking-tight font-display">{patient.name}</h3>
              <Badge variant="teal">{patient.uhid || patient.mrn}</Badge>
              {patient.abhaId && (
                <span className="badge badge-indigo text-xs font-mono">ABHA: {patient.abhaId}</span>
              )}
              <span className="badge badge-rose font-mono">Blood: {patient.bloodGroup}</span>
            </div>
            <div className="text-xs sm:text-sm text-text-muted mt-1 font-medium flex items-center gap-2 flex-wrap">
              <span>{patient.age} yrs • {patient.gender} • Weight: <strong className="text-text-main">{patient.weightKg || 70} kg</strong></span>
              <span className="text-text-dim">•</span>
              <span className="font-mono bg-bg-surface px-2 py-0.5 rounded border border-border-subtle text-xs">
                BP {patient.vitals?.bp || '120/80'} | Pulse {patient.vitals?.pulse || '72'} bpm | SpO2 {patient.vitals?.spo2 || '99%'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full sm:w-auto">
            <span className="text-[11px] font-bold text-text-dim uppercase tracking-wider block mb-1">
              Active Patient EHR
            </span>
            <select
              className="form-select h-11 text-sm font-medium rounded-xl min-w-[240px]"
              value={patient.id}
              onChange={(e) => {
                const p = patients.find((pat) => pat.id === e.target.value);
                if (p) setSelectedPatient(p);
              }}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.uhid || p.mrn})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Allergies Warning Banner */}
      {patient.allergies?.length > 0 && patient.allergies[0] !== 'None known' && (
        <div className="bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-rose-500/5 border border-rose-500/30 rounded-2xl p-4 sm:p-4.5 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30 shadow-2xs">
            <AlertTriangle size={20} strokeWidth={2.3} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Documented Patient Allergies
            </div>
            <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 font-semibold leading-relaxed mt-0.5">
              {patient.allergies.join(', ')} — Automatic contraindication protection active across prescription builder.
            </p>
          </div>
        </div>
      )}

      {/* Real-time Safety Check Alert Notifications */}
      {safetyReport.allergyWarnings.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500/80 shadow-md flex flex-col gap-3">
          <div className="flex items-center gap-3 text-rose-700 dark:text-rose-300">
            <ShieldAlert size={24} className="shrink-0 text-rose-600 animate-pulse" />
            <div>
              <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                ⛔ Hard Allergy Warning — Severe Contraindication
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5 font-medium">
                The prescribed medicine directly conflicts with patient allergy records.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pl-9">
            {safetyReport.allergyWarnings.map((w, idx) => (
              <div key={idx} className="bg-rose-100/80 dark:bg-rose-900/40 p-3 rounded-xl border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 font-semibold">
                • {w.message}
              </div>
            ))}
          </div>

          <div className="mt-2 pt-3 border-t border-rose-200 dark:border-rose-900/60 pl-9 flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-rose-900 dark:text-rose-200 cursor-pointer">
              <input
                type="checkbox"
                checked={overrideAllergy}
                onChange={(e) => setOverrideAllergy(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Doctor Override: Proceed with extreme clinical caution</span>
            </label>
            {overrideAllergy && (
              <input
                type="text"
                placeholder="Enter mandatory clinical override rationale..."
                className="form-input h-9 text-xs flex-1 rounded-lg border-rose-300 dark:border-rose-800"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
              />
            )}
          </div>
        </div>
      )}

      {safetyReport.interactionWarnings.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-400/80 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
            <AlertTriangle size={22} className="shrink-0 text-amber-600" />
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wide">
                ⚠️ Drug-Drug Interaction Alert ({safetyReport.interactionWarnings.length} Pair{safetyReport.interactionWarnings.length > 1 ? 's' : ''})
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                The chosen drug combination exhibits known pharmacological synergy or metabolic inhibition.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pl-8">
            {safetyReport.interactionWarnings.map((inter, idx) => (
              <div key={idx} className="bg-amber-100/80 dark:bg-amber-900/30 p-3 rounded-xl border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <div className="font-extrabold flex items-center justify-between">
                  <span>{inter.drugA} + {inter.drugB}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${inter.severity === 'Severe' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-black'}`}>
                    {inter.severity} Risk
                  </span>
                </div>
                <p className="mt-1 font-medium leading-relaxed">{inter.clinicalEffect}</p>
                <div className="mt-1 text-[11px] text-amber-800 dark:text-amber-300 font-bold">
                  Recommendation: {inter.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {safetyReport.doseWarnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-400/70 shadow-xs flex items-center gap-3 text-blue-900 dark:text-blue-200 text-xs">
          <Info size={20} className="shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <div className="font-extrabold uppercase tracking-wide">Dose-Range Validation Notice (Age & Weight Adjusted)</div>
            {safetyReport.doseWarnings.map((dw, i) => (
              <p key={i} className="mt-0.5 font-medium">• {dw.message}</p>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Consultation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Complaints, Exam & ICD-10 (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-card p-5 sm:p-7 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col gap-5 shadow-xs">
            <h4 className="text-base sm:text-lg text-teal-600 dark:text-teal-400 flex items-center gap-2 font-bold pb-3 border-b border-border-subtle">
              <Stethoscope size={20} /> Clinical Notes & Physical Exam
            </h4>

            <div className="form-group mb-0">
              <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                Chief Complaint & History of Present Illness (HPI) *
              </label>
              <textarea
                rows={3}
                className="form-textarea text-sm rounded-xl min-h-[95px] p-3.5"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                Physical Examination & Systemic Findings *
              </label>
              <textarea
                rows={3}
                className="form-textarea text-sm rounded-xl min-h-[95px] p-3.5"
                value={clinicalExam}
                onChange={(e) => setClinicalExam(e.target.value)}
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs sm:text-sm font-bold text-text-main mb-1.5">
                ICD-10 Diagnostic Code & Impression *
              </label>
              <select
                className="form-select h-11 text-sm font-medium rounded-xl"
                value={icdDiagnosis}
                onChange={(e) => setIcdDiagnosis(e.target.value)}
              >
                <option value="I20.0 - Unstable Angina, Stabilized">I20.0 - Unstable Angina, Stabilized</option>
                <option value="I10 - Essential (Primary) Hypertension">I10 - Essential (Primary) Hypertension</option>
                <option value="E11.9 - Type 2 Diabetes Mellitus without complications">E11.9 - Type 2 Diabetes Mellitus</option>
                <option value="J20.9 - Acute Bronchitis, unspecified">J20.9 - Acute Bronchitis</option>
                <option value="M54.5 - Low Back Pain / Lumbar Radiculopathy">M54.5 - Low Back Pain / Lumbar Radiculopathy</option>
                <option value="K21.9 - Gastro-esophageal Reflux Disease (GERD)">K21.9 - GERD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Prescription Builder (6 cols) */}
        <div className="lg:col-span-6 glass-card p-5 sm:p-7 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col gap-5 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
            <h4 className="text-base sm:text-lg text-teal-600 dark:text-teal-400 flex items-center gap-2 font-bold">
              <Pill size={20} /> Prescribed Medications (e-Rx)
            </h4>
            <div className="flex items-center gap-2">
              <span className="mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md">
                {rxItems.length} Drugs Active
              </span>
              <span className={`text-[11px] font-bold py-1 px-2.5 rounded-md flex items-center gap-1 ${safetyReport.isValid ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'}`}>
                {safetyReport.isValid ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                {safetyReport.isValid ? 'Safety Checked' : 'Warnings Active'}
              </span>
            </div>
          </div>

          {/* Quick-Add from Drugs Master */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-muted">Quick-Select from Drug Master Catalog:</span>
            <div className="flex gap-2 flex-wrap">
              {drugsMaster.slice(0, 6).map((dm) => (
                <button
                  key={dm.id}
                  type="button"
                  className="chip-btn py-1.5 px-3 text-xs font-semibold rounded-xl bg-bg-surface-elevated text-text-main border-border-subtle hover:border-teal-500/50 flex items-center gap-1"
                  onClick={() => handleAddMasterDrug(dm)}
                  title={`Add ${dm.brandName} (${dm.genericName})`}
                >
                  <Plus size={12} className="text-teal-600 dark:text-teal-400" />
                  <span>{dm.brandName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom / Drug Master Selector */}
          <div className="bg-bg-surface-elevated/80 p-4 rounded-xl flex flex-col gap-3 border border-border-subtle">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-12">
                <label className="form-label text-xs font-bold text-text-main mb-1.5">
                  Select from Drugs Master (Generic & Max Daily Dose)
                </label>
                <select
                  className="form-select h-10 text-xs sm:text-sm rounded-lg"
                  value={selectedMasterDrugId}
                  onChange={(e) => {
                    setSelectedMasterDrugId(e.target.value);
                    const matched = drugsMaster.find((d) => d.id === e.target.value);
                    if (matched) {
                      setCustomDrugName(`Tab. ${matched.brandName}`);
                      setCustomDosage(matched.defaultFrequency || '1 tab OD (Morning)');
                    }
                  }}
                >
                  <option value="">-- Or choose from Drugs Master list --</option>
                  {drugsMaster.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.brandName} ({d.genericName} {d.strength}) • Max: {d.maxDailyDoseMg}mg/day • {d.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-6">
                <label className="form-label text-xs font-bold text-text-main mb-1.5">Custom Medicine Name / Salt</label>
                <input
                  type="text"
                  className="form-input h-10 text-xs sm:text-sm rounded-lg"
                  placeholder="e.g. Tab. Montelukast 10mg"
                  value={customDrugName}
                  onChange={(e) => setCustomDrugName(e.target.value)}
                />
              </div>
              <div className="sm:col-span-4">
                <label className="form-label text-xs font-bold text-text-main mb-1.5">Dosage Frequency</label>
                <select
                  className="form-select h-10 text-xs sm:text-sm rounded-lg"
                  value={customDosage}
                  onChange={(e) => setCustomDosage(e.target.value)}
                >
                  <option value="1 tab OD (Morning)">1 tab OD (Morning)</option>
                  <option value="1 tab BID (Twice daily)">1 tab BID (Twice daily)</option>
                  <option value="1 tab TID (Thrice daily)">1 tab TID (Thrice daily)</option>
                  <option value="1 tab HS (Bedtime)">1 tab HS (Bedtime)</option>
                  <option value="SOS (As needed)">SOS (As needed)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  className="btn btn-primary w-full h-10 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                  onClick={handleAddCustomDrug}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* List of Medicines with Prominent Generic Names */}
          <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
            {rxItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-bg-surface-elevated/70 border border-border-subtle rounded-xl p-3 sm:px-4 flex items-center justify-between hover:border-teal-500/40 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-text-main">{item.name}</span>
                    {item.genericName && (
                      <span className="badge badge-teal text-[11px] font-bold py-0.5">
                        Generic: {item.genericName}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted mt-1 font-medium flex items-center gap-2 flex-wrap">
                    <span>{item.dosage}</span>
                    <span className="text-text-dim">•</span>
                    <span>Duration: {item.duration}</span>
                    <span className="text-text-dim">•</span>
                    <span className="italic">({item.instructions})</span>
                  </div>
                </div>
                <button
                  className="btn-icon btn-sm btn-icon-danger shrink-0 ml-2"
                  onClick={() => removeDrugItem(idx)}
                  title="Remove Drug"
                >
                  <Trash2 size={18} strokeWidth={2.2} />
                </button>
              </div>
            ))}
          </div>

          {/* Advice & Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="form-group mb-0">
              <label className="form-label text-xs font-bold text-text-main mb-1.5">Dietary / Lifestyle Advice</label>
              <input
                type="text"
                className="form-input h-10 text-xs sm:text-sm rounded-xl"
                value={dietAdvice}
                onChange={(e) => setDietAdvice(e.target.value)}
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label text-xs font-bold text-text-main mb-1.5">Follow-up Instructions</label>
              <input
                type="text"
                className="form-input h-10 text-xs sm:text-sm rounded-xl"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center gap-3 pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
              <ShieldCheck size={16} className="text-teal-600 dark:text-teal-400" />
              <span>Generic salt & safety rules enforced</span>
            </div>
            <button
              className="btn btn-primary btn-lg h-12 px-6 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer"
              onClick={handleSaveAndIssueRx}
            >
              <FileCheck size={18} /> Sign & Issue Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
