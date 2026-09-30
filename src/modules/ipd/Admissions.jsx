import React, { useState } from 'react';
import {
  Building,
  UserPlus,
  Bed,
  Calendar,
  ShieldCheck,
  DollarSign,
  CheckCircle2,
  Stethoscope,
  Activity,
  Wind,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Phone,
  Droplet,
  User,
  HeartPulse,
  Check,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Admissions = () => {
  const {
    patients,
    wards,
    doctors,
    updateBedStatus,
    showToast,
    setActiveNav,
    setSelectedPatient
  } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedWardId, setSelectedWardId] = useState(wards[0]?.id || '');
  const [selectedBedNo, setSelectedBedNo] = useState(wards[0]?.beds[3]?.bedNo || wards[0]?.beds[0]?.bedNo || 'MICU-04');
  const [admittingDoctor, setAdmittingDoctor] = useState(doctors[0]?.name || 'Dr. Arvind Swaminathan');
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('Acute Exacerbation of Bronchial Asthma');
  const [depositAmount, setDepositAmount] = useState('25000');
  const [expectedStayDays, setExpectedStayDays] = useState('4');
  const [billingScheme, setBillingScheme] = useState('TPA Cashless Pre-Auth Approved');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const selectedWard = wards.find((w) => w.id === selectedWardId) || wards[0];
  const availableBeds = selectedWard?.beds?.filter((b) => b.status === 'Available') || [];
  const selectedBed = selectedWard?.beds?.find((b) => b.bedNo === selectedBedNo);

  const commonDiagnoses = [
    'Acute Exacerbation of Bronchial Asthma',
    'Acute Coronary Syndrome (ACS)',
    'Post-Op Laparoscopic Cholecystectomy',
    'Dengue Fever with Severe Thrombocytopenia',
    'Bilateral Community-Acquired Pneumonia'
  ];

  const quickDepositAmounts = ['10000', '25000', '50000', '100000'];
  const quickStayDays = ['2', '4', '7', '14'];

  const handleAdmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      showToast('Please select a valid patient to admit.', 'warning');
      return;
    }
    if (!selectedBedNo) {
      showToast('Please select an available ward bed.', 'warning');
      return;
    }

    updateBedStatus(selectedWardId, selectedBedNo, 'Occupied', selectedPatient.name, provisionalDiagnosis);
    showToast(
      `Patient ${selectedPatient.name} successfully admitted to ${selectedWard.name} (Bed ${selectedBedNo})!`,
      'success'
    );
    setActiveNav({ module: 'ipd', subModule: 'beds' });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[960px] mx-auto w-full pb-12">
      {/* ── Top Header Card ── */}
      <div className="glass-card p-5 sm:p-6 md:p-7 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/50 flex items-center justify-center shrink-0 shadow-2xs">
            <Building size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-main tracking-tight font-display leading-tight">
                Inpatient Admission & Bed Allocation
              </h2>
              <span className="badge badge-teal text-xs font-semibold py-0.5 px-2.5">
                IPD Clinical Intake
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed font-normal">
              Assign an available ward bed, setup clinical diagnosis, and initialize IPD electronic health chart.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm min-h-[40px] px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs cursor-pointer"
          onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
        >
          <Bed size={15} className="text-teal-600 dark:text-teal-400" />
          <span>View Bed Map</span>
        </button>
      </div>

      {/* Main Admission Form */}
      <form onSubmit={handleAdmit} className="flex flex-col gap-6">
        {/* Section 1: Patient Identification */}
        <div className="glass-card p-5 sm:p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <User size={16} className="text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm sm:text-base font-semibold text-text-main">
                1. Patient Identification & Health Profile
              </h3>
            </div>
            <span className="text-xs text-text-dim font-medium">Required *</span>
          </div>

          <div className="form-group mb-0">
            <label className="form-label flex items-center justify-between">
              <span>Select Patient for Inpatient Admission *</span>
              <span className="text-[11px] font-normal text-text-dim">
                {patients.length} Registered Patients
              </span>
            </label>
            <select
              className="form-select"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrn}) • Age: {p.age} • Blood: {p.bloodGroup} • {p.ward !== 'N/A' ? `Currently: ${p.ward}` : 'OPD / Emergency Intake'}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Patient Card Preview */}
          {selectedPatient && (
            <div className="p-4 rounded-xl bg-bg-surface-elevated border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 mt-1">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={selectedPatient.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedPatient.name}
                  className="w-11 h-11 rounded-lg object-cover border border-teal-500/30 shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-bold text-text-main truncate">
                      {selectedPatient.name}
                    </span>
                    <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800/60">
                      {selectedPatient.mrn}
                    </span>
                    <span className="badge badge-rose text-[11px]">
                      {selectedPatient.bloodGroup}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted mt-1 flex items-center gap-2 flex-wrap font-normal">
                    <span>{selectedPatient.age} Years, {selectedPatient.gender}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone size={11} className="text-text-dim" /> {selectedPatient.phone}
                    </span>
                    <span>•</span>
                    <span className="text-text-main font-medium">
                      Primary: {selectedPatient.assignedDoctor || 'Dr. Arvind Swaminathan'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 self-end sm:self-center">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                  ✓ Verified for IPD Intake
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Ward & Bed Allocation */}
        <div className="glass-card p-5 sm:p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Bed size={16} className="text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm sm:text-base font-semibold text-text-main">
                2. Ward & Bed Allocation
              </h3>
            </div>
            <span className="badge badge-emerald text-[11px]">
              {availableBeds.length} Beds Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Ward Selector */}
            <div className="form-group mb-0">
              <label className="form-label flex items-center justify-between">
                <span>Select Ward / Specialty Wing *</span>
                <span className="text-[11px] font-semibold text-teal-600">
                  {selectedWard.floor}
                </span>
              </label>
              <select
                className="form-select"
                value={selectedWardId}
                onChange={(e) => {
                  setSelectedWardId(e.target.value);
                  const newWard = wards.find((w) => w.id === e.target.value);
                  const firstAvail = newWard?.beds?.find((b) => b.status === 'Available');
                  if (firstAvail) setSelectedBedNo(firstAvail.bedNo);
                }}
              >
                {wards.map((w) => {
                  const free = w.totalBeds - w.occupiedBeds;
                  return (
                    <option key={w.id} value={w.id}>
                      {w.name} ({free} free / {w.totalBeds} total)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Bed Selector */}
            <div className="form-group mb-0">
              <label className="form-label flex items-center justify-between">
                <span>Assign Ward Bed *</span>
                {selectedBed?.oxygen && (
                  <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                    <Wind size={12} /> Oxygen Ready
                  </span>
                )}
              </label>
              <select
                className="form-select"
                value={selectedBedNo}
                onChange={(e) => setSelectedBedNo(e.target.value)}
              >
                {availableBeds.length === 0 ? (
                  <option value="">No beds currently available in this ward</option>
                ) : (
                  availableBeds.map((b) => (
                    <option key={b.bedNo} value={b.bedNo}>
                      Bed {b.bedNo} {b.oxygen ? '• Central O2 Support' : '• Standard Bed'}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Bed Amenities Pill Bar */}
          <div className="p-3.5 rounded-xl bg-bg-surface-elevated border border-border-subtle flex items-center justify-between flex-wrap gap-2.5 text-xs text-text-muted font-normal">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>
                Allocating <strong className="text-text-main font-semibold">Bed {selectedBedNo}</strong> in <strong className="text-text-main font-semibold">{selectedWard.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="badge badge-cyan py-0.5 px-2">Central O2 Line</span>
              <span className="badge badge-teal py-0.5 px-2">ECG Telemetry</span>
              <span className="badge badge-gray py-0.5 px-2">Nurse Intercom</span>
            </div>
          </div>
        </div>

        {/* Section 3: Admitting Specialist & Diagnosis */}
        <div className="glass-card p-5 sm:p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Stethoscope size={16} className="text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm sm:text-base font-semibold text-text-main">
                3. Attending Specialist & Provisional Diagnosis
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Doctor in Charge */}
            <div className="form-group mb-0">
              <label className="form-label">Doctor in Charge (Attending Physician)</label>
              <select
                className="form-select"
                value={admittingDoctor}
                onChange={(e) => setAdmittingDoctor(e.target.value)}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.department}) • {d.qualification || 'MD / MS'}
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Stay */}
            <div className="form-group mb-0">
              <label className="form-label flex items-center justify-between">
                <span>Expected Inpatient Stay (Days)</span>
                <span className="text-[11px] text-text-dim">Est. Discharge: +{expectedStayDays} Days</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="form-input font-medium"
                  value={expectedStayDays}
                  onChange={(e) => setExpectedStayDays(e.target.value)}
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  {quickStayDays.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExpectedStayDays(d)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        expectedStayDays === d
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                          : 'bg-bg-surface border-border-subtle text-text-muted hover:text-text-main hover:border-teal-500/40'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Provisional Diagnosis */}
          <div className="form-group mb-0 mt-1">
            <label className="form-label flex items-center justify-between">
              <span>Provisional Admission Diagnosis *</span>
              <span className="text-[11px] text-text-dim">ICD-10 Clinical Summary</span>
            </label>
            <input
              type="text"
              className="form-input font-medium"
              value={provisionalDiagnosis}
              onChange={(e) => setProvisionalDiagnosis(e.target.value)}
              placeholder="e.g. Acute Exacerbation of Bronchial Asthma"
              required
            />

            {/* Common Diagnostic Quick Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[11px] font-semibold text-text-dim mr-1 flex items-center gap-1">
                <Sparkles size={12} className="text-teal-600" /> Quick select:
              </span>
              {commonDiagnoses.map((diag) => (
                <button
                  key={diag}
                  type="button"
                  onClick={() => setProvisionalDiagnosis(diag)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all truncate max-w-[280px] ${
                    provisionalDiagnosis === diag
                      ? 'bg-teal-500/15 text-teal-800 dark:text-teal-200 border-teal-500/40 font-semibold'
                      : 'bg-bg-surface text-text-muted border-border-subtle hover:border-teal-500/30 hover:text-text-main'
                  }`}
                  title={diag}
                >
                  {diag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Advance Deposit & Billing Scheme */}
        <div className="glass-card p-5 sm:p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm sm:text-base font-semibold text-text-main">
                4. Admission Deposit & Billing Scheme
              </h3>
            </div>
            <span className="badge badge-teal text-[11px]">
              IPD Account Billing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Advance Deposit */}
            <div className="form-group mb-0">
              <label className="form-label flex items-center justify-between">
                <span>Admission Advance Deposit (INR ₹)</span>
                <span className="text-[11px] text-text-dim">Adjustable against final bill</span>
              </label>
              <div className="form-input-prefix-wrap">
                <span className="prefix-icon text-sm text-teal-600 dark:text-teal-400">₹</span>
                <input
                  type="number"
                  className="form-input font-mono font-bold"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="25000"
                />
              </div>

              {/* Quick deposit buttons */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {quickDepositAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                      depositAmount === amt
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-bg-surface text-text-muted border-border-subtle hover:text-text-main'
                    }`}
                  >
                    ₹{parseInt(amt).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Billing Scheme */}
            <div className="form-group mb-0">
              <label className="form-label flex items-center justify-between">
                <span>Billing Scheme / Payer</span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Pre-Auth Ready
                </span>
              </label>
              <select
                className="form-select"
                value={billingScheme}
                onChange={(e) => setBillingScheme(e.target.value)}
              >
                <option value="TPA Cashless Pre-Auth Approved">TPA Cashless Pre-Auth Approved (Star Health)</option>
                <option value="Self Pay Deposit">Self Pay Direct Deposit (Cash / Card)</option>
                <option value="Corporate Tie-up">Corporate Tie-up (TCS / Infosys Empaneled)</option>
                <option value="Government Scheme (PMJAY/Aarogyasri)">Government Scheme (PMJAY / Aarogyasri)</option>
              </select>

              <p className="text-[11px] text-text-dim mt-2 font-normal">
                {billingScheme.includes('TPA')
                  ? '✓ Cashless policy active: ₹5,00,000 coverage with zero co-pay for general ward & step-down ICU.'
                  : 'Receipt will be issued immediately upon receipt of advance deposit.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex items-center justify-between flex-wrap gap-4 mt-1">
          <button
            type="button"
            className="btn btn-secondary min-h-[44px] px-6 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer"
            onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary min-h-[44px] px-7 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-teal-600/25 flex items-center gap-2.5 cursor-pointer"
          >
            <CheckCircle2 size={17} strokeWidth={2.4} />
            <span>Complete Admission & Allocate Bed</span>
          </button>
        </div>
      </form>
    </div>
  );
};
