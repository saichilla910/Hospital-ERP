import React, { useState } from 'react';
import { AlertTriangle, Plus, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Allergies = () => {
  const { selectedPatient, patients, showToast } = useHospital();
  const patient = selectedPatient || patients[0];

  const [allergyList, setAllergyList] = useState([
    { allergen: 'Penicillin Antibiotic', type: 'Medicine', reaction: 'Skin rash, facial swelling & breathing difficulty', severity: 'Severe / Critical' },
    { allergen: 'Sulfa Drugs', type: 'Medicine', reaction: 'Red itching skin rashes', severity: 'High' },
    { allergen: 'Painkillers (Aspirin / Ibuprofen)', type: 'Medicine', reaction: 'Stomach burning & wheezing', severity: 'Moderate' },
    { allergen: 'X-Ray Contrast Dye', type: 'Scan Dye', reaction: 'Nausea & dizziness', severity: 'Severe / Critical' }
  ]);

  const [newAllergen, setNewAllergen] = useState('');
  const [newType, setNewType] = useState('Medicine');
  const [newReaction, setNewReaction] = useState('');
  const [newSeverity, setNewSeverity] = useState('Severe / Critical');

  const commonAllergies = [
    { allergen: 'Penicillin', type: 'Medicine', reaction: 'Swelling & severe rash', severity: 'Severe / Critical' },
    { allergen: 'Peanuts', type: 'Food', reaction: 'Throat tightness & hives', severity: 'Severe / Critical' },
    { allergen: 'Sulfa Antibiotics', type: 'Medicine', reaction: 'Skin itchiness & blisters', severity: 'High' },
    { allergen: 'Latex Gloves', type: 'Material', reaction: 'Hand contact dermatitis', severity: 'Moderate' },
    { allergen: 'Seafood / Prawns', type: 'Food', reaction: 'Facial swelling & vomiting', severity: 'Severe / Critical' }
  ];

  const handleQuickAdd = (item) => {
    setNewAllergen(item.allergen);
    setNewType(item.type);
    setNewReaction(item.reaction);
    setNewSeverity(item.severity);
    showToast(`Loaded "${item.allergen}" allergy template. Click "+ Save Allergy" to add.`, 'info');
  };

  const addAllergy = () => {
    if (!newAllergen || !newReaction) {
      showToast('Please enter allergen name and reaction', 'error');
      return;
    }
    setAllergyList([...allergyList, { allergen: newAllergen, type: newType, reaction: newReaction, severity: newSeverity }]);
    setNewAllergen('');
    setNewReaction('');
    showToast(`Added allergy "${newAllergen}" to ${patient.name}'s safety record.`, 'success');
  };

  const removeAllergy = (index) => {
    const item = allergyList[index];
    setAllergyList(allergyList.filter((_, idx) => idx !== index));
    showToast(`Removed allergy alert: ${item.allergen}`, 'info');
  };

  const severeCount = allergyList.filter((a) => a.severity.includes('Severe')).length;
  const drugCount = allergyList.filter((a) => a.type === 'Medicine').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border-subtle/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            Patient Allergies & Adverse Drug Reactions (ADR)
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-normal">
            Clinical Safety Dossier for <strong className="text-text-main font-semibold">{patient.name}</strong> ({patient.mrn}) • Blocks contra-indicated medications across OPD, IPD, and Pharmacy dispensing.
          </p>
        </div>
      </div>

      {/* Clinical Allergy Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card glass-card-interactive p-4 sm:p-5 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col justify-between">
          <span className="text-xs font-semibold text-text-muted">Total Recorded Allergies</span>
          <span className="text-2xl sm:text-3xl font-bold text-text-main mt-1 font-mono">{allergyList.length}</span>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 mt-2 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Active in Safety EHR
          </span>
        </div>
        <div className="glass-card glass-card-interactive p-4 sm:p-5 rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-bg-surface flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Critical / Severe Risk</span>
          <span className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">{severeCount}</span>
          <span className="text-[11px] text-rose-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Anaphylaxis Caution
          </span>
        </div>
        <div className="glass-card glass-card-interactive p-4 sm:p-5 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col justify-between">
          <span className="text-xs font-semibold text-text-muted">Drug / Medication Alerts</span>
          <span className="text-2xl sm:text-3xl font-bold text-text-main mt-1 font-mono">{drugCount}</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Cross-reaction check
          </span>
        </div>
        <div className="glass-card glass-card-interactive p-4 sm:p-5 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-bg-surface flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Safety Status</span>
          <span className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Verified Attending
          </span>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-2 font-medium">EMR Lock Active</span>
        </div>
      </div>

      {/* Quick Select Common Allergens Strip */}
      <div className="glass-card p-4 sm:p-5 bg-bg-surface-elevated/70 border border-border-subtle rounded-2xl">
        <div className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
          <Sparkles size={16} /> Quick-Select Standard High-Risk Allergens:
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {commonAllergies.map((a, i) => (
            <button
              key={i}
              type="button"
              className="chip-btn py-1.5 px-3.5 text-xs font-semibold rounded-xl bg-bg-surface text-text-main border-border-subtle hover:border-rose-500/50 hover:text-rose-600 transition-all cursor-pointer shadow-2xs"
              onClick={() => handleQuickAdd(a)}
            >
              <Plus size={13} className="text-rose-500" />
              <span>{a.allergen}</span>
              <span className="text-[10.5px] text-text-dim font-normal">({a.type})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Allergy Box */}
      <div className="glass-card p-5 sm:p-6 bg-bg-surface border border-border-subtle rounded-2xl">
        <h4 className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
          <Plus size={18} /> Record New Patient Allergy or Adverse Reaction
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="form-label text-xs font-bold text-text-main mb-1.5">Allergen / Drug Name *</label>
            <input
              type="text"
              className="form-input h-11 text-sm rounded-xl font-medium"
              placeholder="e.g. Penicillin, Peanuts, Latex"
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="form-label text-xs font-bold text-text-main mb-1.5">Category *</label>
            <select
              className="form-select h-11 text-sm rounded-xl font-medium"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="Medicine">Medicine / Drug</option>
              <option value="Food">Food Item</option>
              <option value="Material">Material (Latex, etc.)</option>
              <option value="Scan Dye">Scan Contrast Dye</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="form-label text-xs font-bold text-text-main mb-1.5">Observed Symptoms / Reaction *</label>
            <input
              type="text"
              className="form-input h-11 text-sm rounded-xl font-medium"
              placeholder="e.g. Facial swelling, hives, breathing trouble"
              value={newReaction}
              onChange={(e) => setNewReaction(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="form-label text-xs font-bold text-text-main mb-1.5">Severity *</label>
            <select
              className="form-select h-11 text-sm rounded-xl font-medium"
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value)}
            >
              <option value="Severe / Critical">Severe / Critical</option>
              <option value="Moderate">Moderate</option>
              <option value="Mild">Mild</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              className="btn btn-danger w-full h-11 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
              onClick={addAllergy}
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container rounded-2xl border border-border-subtle bg-bg-surface overflow-hidden">
        <table className="medicore-table">
          <thead>
            <tr>
              <th className="py-3.5 px-5">Allergen / Substance</th>
              <th className="py-3.5 px-5">Category</th>
              <th className="py-3.5 px-5">Observed Reaction & Symptoms</th>
              <th className="py-3.5 px-5">Severity Grade</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allergyList.map((a, i) => (
              <tr key={i} className="hover:bg-bg-surface-elevated/70 transition-colors">
                <td className="py-4 px-5 font-bold text-rose-600 dark:text-rose-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {a.allergen}
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="badge badge-gray font-semibold">{a.type}</span>
                </td>
                <td className="py-4 px-5 text-text-main text-sm max-w-[340px] leading-relaxed">
                  {a.reaction}
                </td>
                <td className="py-4 px-5">
                  <Badge
                    variant={a.severity.includes('Severe') ? 'rose' : a.severity.includes('Moderate') ? 'amber' : 'teal'}
                    dot={a.severity.includes('Severe')}
                  >
                    {a.severity}
                  </Badge>
                </td>
                <td className="py-4 px-5 text-right">
                  <button
                    className="btn-icon btn-sm rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 ml-auto"
                    onClick={() => removeAllergy(i)}
                    title="Remove Allergy Alert"
                  >
                    <Trash2 size={15} className="text-rose-600 dark:text-rose-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
