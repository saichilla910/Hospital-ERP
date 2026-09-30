import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Check } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const PreOp = () => {
  const { showToast } = useHospital();
  const [checklist, setChecklist] = useState({
    identityConfirmed: true,
    siteMarked: true,
    anesthesiaMachineChecked: true,
    pulseOximeterFunctioning: true,
    knownAllergiesReviewed: true,
    airwayDifficultAssessment: true,
    bloodLossRiskEstimated: true,
    preOpFastingVerified: true
  });

  const toggleCheck = (k, label) => {
    setChecklist((prev) => {
      const nextVal = !prev[k];
      showToast(`${label}: ${nextVal ? 'Checked' : 'Unchecked'}`, 'info');
      return { ...prev, [k]: nextVal };
    });
  };

  const handleCheckAll = () => {
    setChecklist({
      identityConfirmed: true,
      siteMarked: true,
      anesthesiaMachineChecked: true,
      pulseOximeterFunctioning: true,
      knownAllergiesReviewed: true,
      airwayDifficultAssessment: true,
      bloodLossRiskEstimated: true,
      preOpFastingVerified: true
    });
    showToast('All pre-surgery safety checks marked completed!', 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Pre-Surgery Safety Checklist
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Mandatory patient safety checks before beginning surgery. Click any check to toggle.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleCheckAll}>
          <Check size={14} /> Check All Items
        </button>
      </div>

      <div className="glass-card flex flex-col gap-4">
        <h3 className="text-[1.05rem] text-teal-600 flex items-center gap-2 font-bold">
          <ShieldCheck size={18} /> Step 1: Before Anesthesia & Incision
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'identityConfirmed', label: 'Patient name, surgery type, and signed consent confirmed' },
            { key: 'siteMarked', label: 'Surgery body part marked clearly by surgeon' },
            { key: 'anesthesiaMachineChecked', label: 'Anesthesia equipment and medications checked & ready' },
            { key: 'pulseOximeterFunctioning', label: 'Pulse and oxygen monitor connected and working' },
            { key: 'knownAllergiesReviewed', label: 'Allergies and drug warnings checked with doctor' },
            { key: 'airwayDifficultAssessment', label: 'Breathing tube and airway equipment ready' },
            { key: 'bloodLossRiskEstimated', label: 'Blood bags reserved and on standby if needed' },
            { key: 'preOpFastingVerified', label: 'Patient fasting verified (minimum 6 hours)' }
          ].map((item) => {
            const isChecked = checklist[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key, item.label)}
                className={`glass-card-interactive p-3 sm:px-3.5 rounded-md flex items-center gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-500/10 border border-emerald-500'
                    : 'bg-bg-surface-elevated border border-border-subtle hover:border-text-muted/30'
                }`}
              >
                <div
                  className={`w-[22px] h-[22px] rounded border flex items-center justify-center text-white shrink-0 ${
                    isChecked ? 'border-emerald-500 bg-emerald-600' : 'border-text-dim/60 bg-transparent'
                  }`}
                >
                  {isChecked && <CheckCircle2 size={15} />}
                </div>
                <span className={`text-[0.85rem] ${isChecked ? 'text-text-main font-semibold' : 'text-text-muted font-normal'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
