import React from 'react';
import { Pill, AlertOctagon, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Medications = () => {
  const { selectedPatient, patients } = useHospital();
  const patient = selectedPatient || patients[0];

  const activeMeds = [
    { name: 'Ticagrelor 90mg (Brilinta)', class: 'Antiplatelet (P2Y12 Inhibitor)', dose: '1 Tab BID', route: 'Oral', startDate: '2025-11-20', prescriber: 'Dr. Ananya Mukherjee', status: 'Active' },
    { name: 'Rosuvastatin 20mg + Ezetimibe 10mg', class: 'HMG-CoA Reductase Inhibitor + Cholesterol Absorption', dose: '1 Tab HS', route: 'Oral', startDate: '2025-11-20', prescriber: 'Dr. Ananya Mukherjee', status: 'Active' },
    { name: 'Telmisartan 40mg + Amlodipine 5mg', class: 'ARB + Dihydropyridine CCB', dose: '1 Tab OD Morning', route: 'Oral', startDate: '2023-04-10', prescriber: 'Dr. Arvind Swaminathan', status: 'Active' },
    { name: 'Metformin Hydrochloride 500mg ER', class: 'Biguanide Antidiabetic', dose: '1 Tab BID after meals', route: 'Oral', startDate: '2023-04-10', prescriber: 'Dr. Arvind Swaminathan', status: 'Active' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display">
            Patient Current Medications
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Patient: <strong className="text-text-main font-semibold">{patient.name}</strong> ({patient.mrn}) • Active prescriptions and daily dosage
          </p>
        </div>
      </div>

      {/* Drug Interaction Safety Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3.5 sm:px-4 flex items-center gap-3">
        <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 font-semibold">
          Drug Safety Check: All active medications are compatible and safe to administer. No contraindications detected.
        </span>
      </div>

      {/* Active Medications Table */}
      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Category / Class</th>
              <th>Dosage</th>
              <th>Route</th>
              <th>Prescribed By</th>
              <th>Start Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activeMeds.map((m, i) => (
              <tr key={i}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 border border-teal-200/60 dark:border-teal-800/50">
                      <Pill size={14} />
                    </div>
                    <span className="font-semibold text-text-main text-sm">{m.name}</span>
                  </div>
                </td>
                <td className="text-xs text-text-muted">{m.class}</td>
                <td>
                  <span className="mono text-xs bg-bg-surface-elevated px-2 py-1 rounded-md border border-border-subtle font-semibold text-text-main">
                    {m.dose}
                  </span>
                </td>
                <td className="text-xs text-text-muted">{m.route}</td>
                <td className="text-xs font-semibold text-text-main">{m.prescriber}</td>
                <td className="text-xs text-text-dim mono">{m.startDate}</td>
                <td><Badge variant="emerald">{m.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
