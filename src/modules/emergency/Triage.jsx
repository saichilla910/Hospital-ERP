import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Activity, HeartPulse, User, Plus, CheckCircle2 } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Triage = () => {
  const { emergencyCases, addEmergencyCase, setActiveNav, showToast } = useHospital();

  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [esiLevel, setEsiLevel] = useState('ESI Level 2 - Emergent');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [assignedBay, setAssignedBay] = useState('Trauma Bay 2');
  const [gcsScore, setGcsScore] = useState('15/15');
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState('98');
  const [spo2, setSpo2] = useState('94%');

  const esiLevels = [
    {
      tierNumber: '1',
      level: 'ESI Level 1 - Resuscitation',
      badgeLabel: 'STAT Critical',
      color: 'rose',
      desc: 'Immediate life-saving intervention required (e.g. cardiac arrest, severe polytrauma, airway compromise)'
    },
    {
      tierNumber: '2',
      level: 'ESI Level 2 - Emergent',
      badgeLabel: 'STAT High Risk',
      color: 'rose',
      desc: 'High risk, confused/lethargic, severe pain/distress (e.g. acute coronary syndrome, severe asthma)'
    },
    {
      tierNumber: '3',
      level: 'ESI Level 3 - Urgent',
      badgeLabel: 'Urgent Care',
      color: 'amber',
      desc: 'Multiple resources required, vitals stable (e.g. acute abdomen, moderate fracture, high fever)'
    },
    {
      tierNumber: '4',
      level: 'ESI Level 4 - Less Urgent',
      badgeLabel: 'Track Fast',
      color: 'teal',
      desc: 'One simple diagnostic or therapeutic resource required (e.g. simple laceration, mild sprain)'
    },
    {
      tierNumber: '5',
      level: 'ESI Level 5 - Non-Urgent',
      badgeLabel: 'Routine Fast',
      color: 'emerald',
      desc: 'No diagnostic/therapeutic resources required (e.g. prescription refill, mild rash check)'
    }
  ];

  const handleTriageSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !chiefComplaint) {
      alert('Please enter patient name and chief complaint');
      return;
    }

    const selectedEsi = esiLevels.find((e) => e.level === esiLevel);

    addEmergencyCase({
      patientName,
      age: parseInt(age) || 30,
      gender,
      triageLevel: esiLevel,
      triageColor: selectedEsi?.color || 'rose',
      chiefComplaint,
      vitals: { bp, hr, rr: '22/min', spo2, temp: '98.8 °F', gcs: gcsScore },
      assignedBay,
      attendingDoctor: 'Dr. Arvind Swaminathan',
      status: 'Initial stabilization in progress',
      depositPaid: 5000
    });

    setPatientName('');
    setChiefComplaint('');
    setAge('');
    setActiveNav({ module: 'emergency', subModule: 'patients' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2.5 font-display tracking-tight">
            <ShieldAlert size={24} className="text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Emergency Triage & Intake Desk</span>
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-medium">
            Rapid patient triage registration, algorithmic acuity stratification, and critical trauma bay allocation.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Triage Intake & Active ER Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
        {/* Left: Rapid Triage Intake Form (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-2xl border border-border-subtle bg-bg-surface shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-subtle flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20 shadow-2xs">
                <AlertTriangle size={17} strokeWidth={2.3} />
              </div>
              <h3 className="text-base sm:text-lg text-text-main font-bold font-display tracking-tight">
                Register & Rapid Triage Intake
              </h3>
            </div>
            <span className="badge badge-rose text-xs font-semibold px-3 py-1">
              Priority ESI Protocol
            </span>
          </div>

          <form onSubmit={handleTriageSubmit} className="flex flex-col gap-6">
            {/* ── 1. PATIENT DEMOGRAPHICS ── */}
            <div className="form-group mb-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
                <User size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>1. Patient Identification</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                <div className="sm:col-span-6 form-group mb-0">
                  <label className="block text-xs font-semibold text-text-main mb-1.5">
                    Patient Full Name / ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full h-11 px-3.5 text-xs sm:text-sm font-medium rounded-xl bg-bg-surface-elevated border border-border-subtle text-text-main outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all shadow-2xs"
                    placeholder="e.g. Unknown Trauma Male / John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3 form-group mb-0">
                  <label className="block text-xs font-semibold text-text-main mb-1.5">
                    Age (Yrs) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full h-11 px-3.5 text-xs sm:text-sm font-medium rounded-xl bg-bg-surface-elevated border border-border-subtle text-text-main outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all shadow-2xs"
                    placeholder="e.g. 42"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3 form-group mb-0">
                  <label className="block text-xs font-semibold text-text-main mb-1.5">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="w-full h-11 px-3.5 text-xs sm:text-sm font-medium rounded-xl bg-bg-surface-elevated border border-border-subtle text-text-main outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all shadow-2xs cursor-pointer"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── 2. ESI ACUITY TIER SELECTOR ── */}
            <div className="form-group mb-0">
              <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <AlertTriangle size={14} className="text-rose-500 shrink-0" />
                  <span>2. Acuity Stratification (ESI Algorithm)</span>
                </div>
                <span className="text-[11px] text-text-dim font-medium">Select single most critical tier</span>
              </div>
              <div className="flex flex-col gap-2">
                {esiLevels.map((lvl) => {
                  const isSelected = esiLevel === lvl.level;

                  const selectedBorder = lvl.color === 'rose'
                    ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 shadow-xs ring-1 ring-rose-500/25'
                    : lvl.color === 'amber'
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-xs ring-1 ring-amber-500/25'
                    : 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/30 shadow-xs ring-1 ring-teal-500/25';

                  const defaultBorder = 'border-border-subtle bg-bg-surface-elevated/60 hover:bg-bg-surface-elevated hover:border-border-strong';

                  const titleColor = isSelected
                    ? lvl.color === 'rose'
                      ? 'text-rose-900 dark:text-rose-100 font-bold'
                      : lvl.color === 'amber'
                      ? 'text-amber-900 dark:text-amber-100 font-bold'
                      : 'text-teal-900 dark:text-teal-100 font-bold'
                    : 'text-text-main font-semibold';

                  const badgeColor = lvl.color === 'rose'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                    : lvl.color === 'amber'
                    ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                    : 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30';

                  const numberBg = isSelected
                    ? lvl.color === 'rose' ? 'bg-rose-600 text-white' : lvl.color === 'amber' ? 'bg-amber-500 text-white' : 'bg-teal-600 text-white'
                    : 'bg-bg-surface text-text-muted border border-border-subtle';

                  return (
                    <div
                      key={lvl.level}
                      onClick={() => setEsiLevel(lvl.level)}
                      className={`p-3.5 sm:px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between gap-3 border transition-all ${
                        isSelected ? selectedBorder : defaultBorder
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs ${numberBg}`}>
                          {lvl.tierNumber}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs sm:text-sm tracking-tight ${titleColor}`}>
                            {lvl.level}
                          </div>
                          <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
                            {lvl.desc}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0 ml-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor} whitespace-nowrap`}>
                          {lvl.badgeLabel}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                          isSelected
                            ? lvl.color === 'rose' ? 'border-rose-600 bg-rose-600 text-white' : 'border-teal-600 bg-teal-600 text-white'
                            : 'border-border-strong bg-bg-surface'
                        }`}>
                          {isSelected && <CheckCircle2 size={13} strokeWidth={2.6} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── 3. INTAKE VITALS SIGNS ── */}
            <div className="form-group mb-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
                <HeartPulse size={14} className="text-rose-500 shrink-0" />
                <span>3. Baseline Intake Vitals</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/15 transition-all shadow-2xs">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">BP (mmHg)</span>
                  <input
                    type="text"
                    className="w-full h-8 text-sm sm:text-base font-mono font-bold text-text-main bg-transparent outline-none"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                  />
                </div>
                <div className="p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/15 transition-all shadow-2xs">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">Heart Rate (BPM)</span>
                  <input
                    type="text"
                    className="w-full h-8 text-sm sm:text-base font-mono font-bold text-text-main bg-transparent outline-none"
                    value={hr}
                    onChange={(e) => setHr(e.target.value)}
                    placeholder="98"
                  />
                </div>
                <div className="p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/15 transition-all shadow-2xs">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">SpO2 Oxygen (%)</span>
                  <input
                    type="text"
                    className="w-full h-8 text-sm sm:text-base font-mono font-bold text-text-main bg-transparent outline-none"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    placeholder="94%"
                  />
                </div>
                <div className="p-3 rounded-xl bg-bg-surface-elevated border border-border-subtle focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/15 transition-all shadow-2xs">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">GCS Score (15)</span>
                  <input
                    type="text"
                    className="w-full h-8 text-sm sm:text-base font-mono font-bold text-text-main bg-transparent outline-none"
                    value={gcsScore}
                    onChange={(e) => setGcsScore(e.target.value)}
                    placeholder="15/15"
                  />
                </div>
              </div>
            </div>

            {/* ── 4. CHIEF COMPLAINT & TRAUMA BAY ALLOCATION ── */}
            <div className="form-group mb-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
                <Activity size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>4. Presenting Complaint & Bay Assignment</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                <div className="sm:col-span-7 form-group mb-0">
                  <label className="block text-xs font-semibold text-text-main mb-1.5">
                    Chief Presenting Complaint <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full h-11 px-3.5 text-xs sm:text-sm font-medium rounded-xl bg-bg-surface-elevated border border-border-subtle text-text-main outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all shadow-2xs"
                    placeholder="e.g. Sudden severe retrosternal chest pain with diaphoresis"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-5 form-group mb-0">
                  <label className="block text-xs font-semibold text-text-main mb-1.5">
                    Assign Trauma Bay / Bed <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="w-full h-11 px-3.5 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface-elevated border border-border-subtle text-text-main outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all shadow-2xs cursor-pointer"
                    value={assignedBay}
                    onChange={(e) => setAssignedBay(e.target.value)}
                  >
                    <option value="Trauma Bay 1 (Red Critical)">Trauma Bay 1 (Red Critical)</option>
                    <option value="Trauma Bay 2 (Red Critical)">Trauma Bay 2 (Red Critical)</option>
                    <option value="Observation Bay 3 (Yellow)">Observation Bay 3 (Yellow)</option>
                    <option value="Observation Bay 4 (Yellow)">Observation Bay 4 (Yellow)</option>
                    <option value="Minor Procedure (Green Fast)">Minor Procedure (Green Fast)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── 5. SUBMIT ACTION BUTTON ── */}
            <div className="pt-6 border-t border-border-subtle">
              <button
                type="submit"
                className="w-full h-12 px-6 rounded-lg font-bold text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2.5 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white transition-all active:scale-[0.99]"
              >
                <ShieldAlert size={18} className="shrink-0" />
                <span>Record Triage & Dispatch to Trauma Bay</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Real-time Emergency Cases Stream (5 cols) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <h3 className="text-base sm:text-lg text-text-main flex items-center gap-2 font-bold">
              <Activity size={20} className="text-rose-500" /> Live ER Patients Resuscitation
            </h3>
            <span className="badge badge-rose">{emergencyCases.length} Active</span>
          </div>

          <div className="flex flex-col gap-3">
            {emergencyCases.map((er) => (
              <div
                key={er.id}
                className="bg-bg-surface-elevated/70 border border-border-subtle rounded-xl p-4 hover:border-teal-500/40 transition-all flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="mono font-bold text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/40">
                      {er.caseNo}
                    </span>
                    <span className="text-sm font-extrabold text-text-main">
                      {er.patientName}
                    </span>
                  </div>
                  <Badge variant={er.triageColor} dot size="sm">
                    {er.triageLevel.split('-')[0]}
                  </Badge>
                </div>

                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {er.chiefComplaint}
                </p>

                <div className="flex justify-between items-center text-xs text-text-dim pt-2 border-t border-border-subtle/60">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    {er.assignedBay}
                  </span>
                  <span className="font-mono text-[11px] bg-bg-surface px-2 py-0.5 rounded border border-border-subtle">
                    BP {er.vitals.bp} • HR {er.vitals.hr}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
