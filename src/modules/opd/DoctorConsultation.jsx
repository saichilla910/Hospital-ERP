import React, { useState } from 'react';
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
  ScanLine
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
    doctors
  } = useHospital();

  const patient = selectedPatient || patients[0];
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[1]); // Dr. Ananya Mukherjee (Cardiology)

  // Clinical inputs
  const [chiefComplaint, setChiefComplaint] = useState('Patient reports mild exertion-related shortness of breath and heaviness in left arm for 3 days.');
  const [clinicalExam, setClinicalExam] = useState('Heart sounds S1 S2 heard regular, no murmurs. Chest clear bilaterally. No pedal edema.');
  const [icdDiagnosis, setIcdDiagnosis] = useState('I20.0 - Unstable Angina, Stabilized');
  const [dietAdvice, setDietAdvice] = useState('Low sodium, restricted fat intake, adequate hydration, strict avoidance of strenuous physical exertion.');
  const [followUp, setFollowUp] = useState('Review in OPD after 2 weeks or immediately in Emergency if chest pain recurs.');

  // Rx Items
  const [rxItems, setRxItems] = useState([
    { name: 'Tab. Ticagrelor 90mg (Brilinta)', dosage: '1 tab BID (Twice daily)', duration: '30 Days', instructions: 'After food' },
    { name: 'Tab. Rosuvastatin 20mg + Ezetimibe 10mg', dosage: '1 tab HS (Bedtime)', duration: '30 Days', instructions: 'Night after dinner' },
    { name: 'Tab. Metoprolol Succinate ER 25mg', dosage: '1 tab OD (Morning)', duration: '30 Days', instructions: 'Empty stomach' }
  ]);

  const [newDrug, setNewDrug] = useState({ name: '', dosage: '1 tab OD (Morning)', duration: '14 Days', instructions: 'After food' });

  const addDrugItem = () => {
    if (!newDrug.name) return;
    setRxItems([...rxItems, newDrug]);
    setNewDrug({ name: '', dosage: '1 tab OD (Morning)', duration: '14 Days', instructions: 'After food' });
  };

  const removeDrugItem = (index) => {
    setRxItems(rxItems.filter((_, i) => i !== index));
  };

  const handleSaveAndIssueRx = () => {
    const rxRecord = {
      id: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      patientId: patient.id,
      patientName: patient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      diagnosis: icdDiagnosis,
      items: rxItems,
      dietAdvice,
      followUp
    };

    addPrescription(rxRecord);
    openModal('prescription', rxRecord);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Patient & Doctor Workspace Selector */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border-subtle flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-bg-surface-elevated/80">
        <div className="flex items-center gap-4">
          <img
            src={patient.photo}
            alt={patient.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-teal-500/80 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-text-main tracking-tight font-display">{patient.name}</h3>
              <Badge variant="teal">{patient.mrn}</Badge>
              <span className="badge badge-rose font-mono">Blood: {patient.bloodGroup}</span>
            </div>
            <div className="text-xs sm:text-sm text-text-muted mt-1 font-medium flex items-center gap-2 flex-wrap">
              <span>{patient.age} yrs • {patient.gender}</span>
              <span className="text-text-dim">•</span>
              <span className="font-mono bg-bg-surface px-2 py-0.5 rounded border border-border-subtle text-xs">
                BP {patient.vitals.bp} | Pulse {patient.vitals.pulse} bpm | SpO2 {patient.vitals.spo2}
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
                <option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Allergies Warning Banner */}
      {patient.allergies.length > 0 && patient.allergies[0] !== 'None known' && (
        <div className="bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-rose-500/5 border border-rose-500/30 rounded-2xl p-4 sm:p-4.5 flex items-center gap-3.5 shadow-xs glow-rose">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30 shadow-2xs">
            <AlertTriangle size={20} strokeWidth={2.3} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Critical Allergy Alert
            </div>
            <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 font-semibold leading-relaxed mt-0.5">
              {patient.allergies.join(', ')} — Exercise strict vigilance when prescribing antibiotics, NSAIDs, or contrast media.
            </p>
          </div>
        </div>
      )}

      {/* Two Column Consultation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Complaints, Exam & ICD-10 (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-card p-5 sm:p-7 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col gap-5">
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
        <div className="lg:col-span-6 glass-card p-5 sm:p-7 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col gap-5">
          <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
            <h4 className="text-base sm:text-lg text-teal-600 dark:text-teal-400 flex items-center gap-2 font-bold">
              <Pill size={20} /> Prescribed Medications (e-Rx)
            </h4>
            <span className="mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md">
              {rxItems.length} Drugs Active
            </span>
          </div>

          {/* Quick-Add Common Medicines */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-muted">Quick-Add Standard Formulations:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { name: 'Tab. Paracetamol 650mg (Dolo)', dosage: '1 tab TDS (Thrice daily)', duration: '5 Days', instructions: 'After food' },
                { name: 'Tab. Pantoprazole 40mg (Pan-40)', dosage: '1 tab OD (Morning)', duration: '14 Days', instructions: 'Before breakfast' },
                { name: 'Tab. Amoxicillin + Clav 625mg (Augmentin)', dosage: '1 tab BD (Twice daily)', duration: '5 Days', instructions: 'After food' },
                { name: 'Tab. Cetirizine 10mg (Cetzine)', dosage: '1 tab HS (Bedtime)', duration: '5 Days', instructions: 'Night' },
                { name: 'Tab. Azithromycin 500mg (Azithral)', dosage: '1 tab OD (Morning)', duration: '3 Days', instructions: 'After lunch' },
                { name: 'Tab. Telmisartan 40mg (Telma)', dosage: '1 tab OD (Morning)', duration: '30 Days', instructions: 'After breakfast' }
              ].map((med, i) => (
                <button
                  key={i}
                  type="button"
                  className="chip-btn py-1.5 px-3 text-xs font-semibold rounded-xl bg-bg-surface-elevated text-text-main border-border-subtle hover:border-teal-500/50"
                  onClick={() => setRxItems([...rxItems, med])}
                  title={`Click to add ${med.name}`}
                >
                  <Plus size={12} className="text-teal-600 dark:text-teal-400" /> {med.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Drug Row */}
          <div className="bg-bg-surface-elevated/80 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-end border border-border-subtle">
            <div className="sm:col-span-6">
              <label className="form-label text-xs font-bold text-text-main mb-1.5">Custom Medicine Name</label>
              <input
                type="text"
                className="form-input h-10 text-xs sm:text-sm rounded-lg"
                placeholder="e.g. Tab. Montelukast 10mg"
                value={newDrug.name}
                onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
              />
            </div>
            <div className="sm:col-span-4">
              <label className="form-label text-xs font-bold text-text-main mb-1.5">Dosage Frequency</label>
              <select
                className="form-select h-10 text-xs sm:text-sm rounded-lg"
                value={newDrug.dosage}
                onChange={(e) => setNewDrug({ ...newDrug, dosage: e.target.value })}
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
                className="btn btn-secondary w-full h-10 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                onClick={addDrugItem}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* List of Medicines */}
          <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {rxItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-bg-surface-elevated/70 border border-border-subtle rounded-xl p-3 sm:px-4 flex items-center justify-between hover:border-teal-500/40 transition-colors"
              >
                <div>
                  <div className="text-sm font-extrabold text-text-main">{item.name}</div>
                  <div className="text-xs text-text-muted mt-0.5 font-medium">
                    {item.dosage} • Duration: {item.duration} • ({item.instructions})
                  </div>
                </div>
                <button
                  className="btn-icon btn-sm rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  onClick={() => removeDrugItem(idx)}
                  title="Remove Drug"
                >
                  <Trash2 size={15} className="text-rose-500" />
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
          <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
            <button
              className="btn btn-primary btn-lg h-12 px-6 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20"
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
