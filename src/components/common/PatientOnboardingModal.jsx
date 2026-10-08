import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  HeartPulse,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity,
  X,
  Stethoscope,
  Droplet,
  Check,
  CreditCard,
  Building2,
  Calendar,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&auto=format&fit=crop&q=80'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const COMMON_ALLERGIES = [
  'Penicillin',
  'Sulfa Drugs',
  'Aspirin',
  'Latex',
  'Peanuts',
  'Dust & Pollen',
  'None known'
];

const COMMON_CONDITIONS = [
  'Hypertension',
  'Type 2 Diabetes',
  'Asthma / COPD',
  'Thyroid Disorder',
  'Heart Disease',
  'None reported'
];

const ADMISSION_STATUSES = [
  { id: 'Outpatient', label: 'Outpatient (OPD)' },
  { id: 'Inpatient', label: 'Inpatient (Ward)' },
  { id: 'ICU', label: 'Intensive Care (ICU)' },
  { id: 'Emergency', label: 'Emergency Trauma' }
];

export const PatientOnboardingModal = () => {
  const {
    patientOnboardingModalOpen,
    setPatientOnboardingModalOpen,
    addPatient,
    registerPatientWithUhid,
    checkPatientDuplicates,
    setActiveNav,
    setSelectedPatient,
    doctors,
    patients,
    showToast
  } = useHospital();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    abhaId: '',
    address: '',
    emergencyContact: '',
    emergencyRelation: 'Spouse',
    photo: AVATAR_OPTIONS[3],
    status: 'Outpatient',

    // Vitals
    height: '170',
    weight: '70',
    bpSystolic: '120',
    bpDiastolic: '80',
    pulse: '72',
    spo2: '99',
    temp: '98.6',

    // Medical history
    allergiesList: ['None known'],
    conditionsList: ['None reported'],
    customAllergy: '',
    customCondition: '',

    // Scheme & Doctor
    insuranceProvider: 'Star Health Insurance',
    policyNo: '',
    coverage: '₹5,00,000',
    attendingDoctor: doctors?.[0]?.name || 'Dr. Arvind Swaminathan'
  });

  const [duplicateMatches, setDuplicateMatches] = useState([]);

  // Pre-save duplicate check trigger
  React.useEffect(() => {
    if ((formData.phone && formData.phone.length >= 7) || (formData.name && formData.name.trim().length >= 4)) {
      if (checkPatientDuplicates) {
        const matches = checkPatientDuplicates({
          name: formData.name,
          phone: formData.phone,
          dob: formData.dob,
          age: formData.age
        });
        setDuplicateMatches(matches);
      }
    } else {
      setDuplicateMatches([]);
    }
  }, [formData.name, formData.phone, formData.dob, formData.age, checkPatientDuplicates]);

  // Dynamic preview MRN
  const previewMrn = useMemo(() => {
    const nextNum = (patients?.length || 0) + 98808;
    return `MRN-0${nextNum}`;
  }, [patients]);

  // Live BMI calculation
  const bmiInfo = useMemo(() => {
    const w = parseFloat(formData.weight) || 70;
    const h = (parseFloat(formData.height) || 170) / 100;
    if (h <= 0) return { val: '22.8', status: 'Normal', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' };
    const bmiVal = (w / (h * h)).toFixed(1);
    const num = parseFloat(bmiVal);
    if (num < 18.5) return { val: bmiVal, status: 'Underweight', color: 'text-amber-600 bg-amber-500/10 border-amber-500/30' };
    if (num < 25) return { val: bmiVal, status: 'Normal Weight', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' };
    if (num < 30) return { val: bmiVal, status: 'Overweight', color: 'text-amber-600 bg-amber-500/10 border-amber-500/30' };
    return { val: bmiVal, status: 'Obese', color: 'text-rose-600 bg-rose-500/10 border-rose-500/30' };
  }, [formData.weight, formData.height]);

  if (!patientOnboardingModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleReset = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      emergencyRelation: 'Spouse',
      photo: AVATAR_OPTIONS[3],
      status: 'Outpatient',
      height: '170',
      weight: '70',
      bpSystolic: '120',
      bpDiastolic: '80',
      pulse: '72',
      spo2: '99',
      temp: '98.6',
      allergiesList: ['None known'],
      conditionsList: ['None reported'],
      customAllergy: '',
      customCondition: '',
      insuranceProvider: 'Self-Pay (Cash / UPI / Card)',
      policyNo: '',
      coverage: '₹0',
      attendingDoctor: doctors?.[0]?.name || 'Dr. Arvind Swaminathan'
    });
  };

  const handleAllergyToggle = (allergy) => {
    setFormData((prev) => {
      let list = [...prev.allergiesList];
      if (allergy === 'None known') return { ...prev, allergiesList: ['None known'] };
      list = list.filter((a) => a !== 'None known');
      if (list.includes(allergy)) {
        list = list.filter((a) => a !== allergy);
        if (list.length === 0) list = ['None known'];
      } else {
        list.push(allergy);
      }
      return { ...prev, allergiesList: list };
    });
  };

  const addCustomAllergy = () => {
    if (!formData.customAllergy.trim()) return;
    setFormData((prev) => {
      const list = prev.allergiesList.filter((a) => a !== 'None known');
      list.push(prev.customAllergy.trim());
      return { ...prev, allergiesList: list, customAllergy: '' };
    });
  };

  const handleConditionToggle = (cond) => {
    setFormData((prev) => {
      let list = [...prev.conditionsList];
      if (cond === 'None reported') return { ...prev, conditionsList: ['None reported'] };
      list = list.filter((c) => c !== 'None reported');
      if (list.includes(cond)) {
        list = list.filter((c) => c !== cond);
        if (list.length === 0) list = ['None reported'];
      } else {
        list.push(cond);
      }
      return { ...prev, conditionsList: list };
    });
  };

  const addCustomCondition = () => {
    if (!formData.customCondition.trim()) return;
    setFormData((prev) => {
      const list = prev.conditionsList.filter((c) => c !== 'None reported');
      list.push(prev.customCondition.trim());
      return { ...prev, conditionsList: list, customCondition: '' };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in patient full name and contact phone number to register.');
      return;
    }

    if (duplicateMatches.length > 0) {
      const firstDup = duplicateMatches[0];
      const proceed = window.confirm(
        `⚠️ Possible existing patient record detected for "${firstDup.name}" (UHID: ${firstDup.uhid || firstDup.mrn}, Phone: ${firstDup.phone}, Match: ${firstDup.matchReason || 'Similar demographics'}).\n\nClick OK to confirm and register as a new separate record, or Cancel to open/review existing patient record.`
      );
      if (!proceed) return;
    }

    const bpString = `${formData.bpSystolic || 120}/${formData.bpDiastolic || 80} mmHg`;

    const newPatient = {
      name: formData.name.trim(),
      age: parseInt(formData.age) || 30,
      dob: formData.dob || '',
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone.trim(),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      abhaId: formData.abhaId.trim() || '',
      address: formData.address.trim() || 'Hyderabad, Telangana',
      emergencyContact: formData.emergencyContact.trim()
        ? `${formData.emergencyRelation ? formData.emergencyRelation + ': ' : ''}${formData.emergencyContact.trim()}`
        : `Family Contact - ${formData.phone}`,
      allergies: formData.allergiesList,
      chronicConditions: formData.conditionsList,
      vitals: {
        bp: bpString,
        pulse: `${formData.pulse || 72} bpm`,
        temp: `${formData.temp || 98.6} °F`,
        spo2: `${formData.spo2 || 99}%`,
        weight: `${formData.weight || 70} kg`,
        height: `${formData.height || 170} cm`,
        bmi: bmiInfo.val
      },
      vitalsHistory: [
        {
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          systolic: parseInt(formData.bpSystolic) || 120,
          diastolic: parseInt(formData.bpDiastolic) || 80,
          pulse: parseInt(formData.pulse) || 72,
          spo2: parseInt(formData.spo2) || 99,
          temp: parseFloat(formData.temp) || 98.6,
          bloodSugar: 100,
          weight: parseFloat(formData.weight) || 70,
          notes: 'Intake examination vitals'
        }
      ],
      insurance: {
        provider: formData.insuranceProvider,
        policyNo: formData.policyNo || 'N/A',
        coverage: formData.coverage || (formData.insuranceProvider.includes('Self-Pay') ? '₹0' : '₹5,00,000'),
        approvedPreAuth: '₹0',
        tpa: formData.insuranceProvider.includes('Self-Pay') ? 'Direct' : 'Medi Assist TPA'
      },
      status: formData.status,
      ward: 'N/A',
      bedNo: 'N/A',
      attendingDoctor: formData.attendingDoctor,
      photo: formData.photo
    };

    const savedPatient = registerPatientWithUhid ? registerPatientWithUhid(newPatient) : addPatient(newPatient);
    setSelectedPatient(savedPatient);
    setPatientOnboardingModalOpen(false);
    if (showToast) {
      showToast(`Patient ${savedPatient.name} registered successfully! (UHID: ${savedPatient.uhid || savedPatient.mrn})`, 'success');
    }
  };

  return (
    <div
      className="onboarding-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setPatientOnboardingModalOpen(false);
      }}
    >
      <div className="onboarding-modal-frame max-w-4xl sm:max-w-5xl border-2 border-border-strong shadow-2xl bg-bg-surface overflow-hidden">
        {/* Header */}
        <div className="onboarding-modal-header border-b-2 border-border-subtle bg-bg-surface-elevated py-4 px-6 sm:px-8">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30 shrink-0">
              <UserPlus size={24} className="stroke-[2.3]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-text-main tracking-tight font-display truncate">
                  New Patient Intake & Registration Form
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                  Site Registration
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5 font-medium truncate">
                Register a new patient into the hospital site, intake baseline vitals, and assign an attending specialist.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="h-9 px-3.5 rounded-xl text-xs font-bold bg-bg-surface hover:bg-bg-surface-hover text-text-muted border-2 border-border-strong transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset fields"
            >
              <RefreshCw size={13} />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setPatientOnboardingModalOpen(false)}
              className="w-9 h-9 rounded-full bg-bg-surface flex items-center justify-center text-text-muted hover:text-text-main border-2 border-border-strong hover:bg-bg-surface-hover transition-all cursor-pointer shadow-2xs"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Patient Quick Strip Preview */}
        <div className="px-6 sm:px-8 py-3 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white border-b-2 border-teal-700/40 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={formData.photo}
                alt="Patient"
                className="w-10 h-10 rounded-xl object-cover border-2 border-teal-400 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 px-1 rounded text-[9px] font-semibold bg-rose-600 text-white">
                {formData.bloodGroup}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-2">
                <span>{formData.name.trim() || 'New Patient'}</span>
                <span className="text-[10px] font-mono text-teal-300 font-bold px-1.5 py-0.2 rounded bg-teal-400/20">
                  {previewMrn}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                {formData.age ? `${formData.age} Yrs` : '-- Yrs'} • {formData.gender} • Status: <strong className="text-teal-300">{formData.status}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-slate-400 block font-sans">Baseline BP & Pulse</span>
              <span className="text-teal-300 font-bold">{formData.bpSystolic}/{formData.bpDiastolic} mmHg • {formData.pulse} bpm</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold font-sans ${bmiInfo.color}`}>
              BMI: {bmiInfo.val} ({bmiInfo.status})
            </div>
          </div>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(88vh-140px)] p-6 sm:p-8 space-y-6">

          {/* ⚠️ DUPLICATE PATIENT DETECTION WARNING BANNER */}
          {duplicateMatches.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-center gap-2.5 font-bold text-sm sm:text-base">
                <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span>⚠️ Possible Existing Patient Detected ({duplicateMatches.length} Match{duplicateMatches.length > 1 ? 'es' : ''})</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                A patient matching this phone number, date of birth, or name was found in the hospital registry. Please review to avoid split EMR records:
              </p>
              <div className="flex flex-col gap-2 pt-1">
                {duplicateMatches.map((dup) => (
                  <div key={dup.id} className="p-3 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div>
                      <strong className="text-text-main text-sm">{dup.name}</strong> • UHID: <span className="mono font-bold text-teal-600 dark:text-teal-400">{dup.uhid || dup.mrn}</span> • Phone: <span className="mono font-semibold">{dup.phone}</span> • Age: {dup.age} yrs
                      {dup.matchReason && <span className="ml-2 badge badge-amber text-[10px]">{dup.matchReason}</span>}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs text-xs font-bold rounded-lg"
                      onClick={() => {
                        setSelectedPatient(dup);
                        setPatientOnboardingModalOpen(false);
                        if (setActiveNav) setActiveNav({ module: 'patientManagement', subModule: 'profile' });
                      }}
                    >
                      Open Existing Patient
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 1: PERSONAL & CONTACT IDENTITY ── */}
          <div className="rounded-2xl bg-bg-surface border-2 border-border-strong p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all hover:border-teal-500/60">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold border border-teal-500/20">
                  <User size={16} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight uppercase">
                  1. Patient Identity & Contact Information
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wide">* Required Fields</span>
            </div>

            {/* Avatar Selection */}
            <div className="mb-5 p-3 rounded-xl bg-bg-surface-elevated border border-border-strong">
              <label className="block text-xs font-semibold text-text-main mb-2 uppercase tracking-wide">
                Patient Portrait / Photo
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {AVATAR_OPTIONS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: av })}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                      formData.photo === av
                        ? 'border-teal-500 ring-3 ring-teal-500/30 scale-105 shadow-md'
                        : 'border-border-strong opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                    {formData.photo === av && (
                      <div className="absolute inset-0 bg-teal-600/30 flex items-center justify-center">
                        <Check size={16} className="text-white stroke-[3] drop-shadow" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="flex items-center justify-between text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs"
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Age (Years) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  min="0"
                  max="125"
                  required
                  placeholder="e.g. 32"
                  className="w-full h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs font-mono"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              {/* Biological Gender - Visual Toggle */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Biological Gender <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`h-11 rounded-xl text-xs font-bold flex items-center justify-center border-2 transition-all cursor-pointer ${
                        formData.gender === g
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-bg-surface border-border-strong text-text-muted hover:border-teal-500/50 hover:text-text-main'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Group - 8-Button Grid */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5">
                    <Droplet size={14} className="text-rose-500 fill-rose-500" />
                    Blood Group Classification
                  </span>
                  <span className="text-rose-600 font-bold text-xs">Selected: {formData.bloodGroup}</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                      className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center border-2 transition-all cursor-pointer ${
                        formData.bloodGroup === bg
                          ? 'bg-gradient-to-br from-rose-600 to-rose-700 text-white border-rose-600 shadow-sm'
                          : 'bg-bg-surface border-border-strong text-text-main hover:border-rose-400 hover:text-rose-600'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Mobile Phone <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs font-mono"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. rahul.sharma@example.com"
                    className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="e.g. Priya Sharma (+91 98765 43210)"
                  className="w-full h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>

              {/* ABHA ID (Ayushman Bharat Digital Health Account) */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  <span>ABHA ID (Ayushman Bharat)</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">ABDM Verified</span>
                </label>
                <input
                  type="text"
                  name="abhaId"
                  placeholder="14-digit ABHA ID (e.g. 14-8842-9901-3421)"
                  className="w-full h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs font-mono"
                  value={formData.abhaId}
                  onChange={handleChange}
                />
              </div>

              {/* Date of Birth (DOB) */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Date of Birth (DOB)
                </label>
                <input
                  type="date"
                  name="dob"
                  className="w-full h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Flat / House No., Street, Landmark, Area, City, PIN"
                    className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: CLINICAL VITALS INTAKE & ADMISSION ── */}
          <div className="rounded-2xl bg-bg-surface border-2 border-border-strong p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all hover:border-emerald-500/60">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                  <HeartPulse size={16} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight uppercase">
                  2. Clinical Vitals Baseline & Admission Triage
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Intake Vitals</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* BP Systolic */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">BP Systolic</label>
                <div className="relative">
                  <input
                    type="number"
                    name="bpSystolic"
                    placeholder="120"
                    className="w-full h-11 px-3 pr-11 text-xs sm:text-sm rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 font-mono font-bold transition-all shadow-2xs text-center"
                    value={formData.bpSystolic}
                    onChange={handleChange}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-dim pointer-events-none">mmHg</span>
                </div>
              </div>

              {/* BP Diastolic */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">BP Diastolic</label>
                <div className="relative">
                  <input
                    type="number"
                    name="bpDiastolic"
                    placeholder="80"
                    className="w-full h-11 px-3 pr-11 text-xs sm:text-sm rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 font-mono font-bold transition-all shadow-2xs text-center"
                    value={formData.bpDiastolic}
                    onChange={handleChange}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-dim pointer-events-none">mmHg</span>
                </div>
              </div>

              {/* Pulse */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">Heart Pulse</label>
                <div className="relative">
                  <input
                    type="number"
                    name="pulse"
                    placeholder="72"
                    className="w-full h-11 px-3 pr-10 text-xs sm:text-sm rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 font-mono font-bold transition-all shadow-2xs text-center"
                    value={formData.pulse}
                    onChange={handleChange}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-500 pointer-events-none">bpm</span>
                </div>
              </div>

              {/* SpO2 */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">SpO2 Oxygen</label>
                <div className="relative">
                  <input
                    type="number"
                    name="spo2"
                    placeholder="99"
                    className="w-full h-11 px-3 pr-8 text-xs sm:text-sm rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 font-mono font-bold transition-all shadow-2xs text-center"
                    value={formData.spo2}
                    onChange={handleChange}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-cyan-600 pointer-events-none">%</span>
                </div>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">Body Temp</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    name="temp"
                    placeholder="98.6"
                    className="w-full h-11 px-3 pr-8 text-xs sm:text-sm rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 font-mono font-bold transition-all shadow-2xs text-center"
                    value={formData.temp}
                    onChange={handleChange}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-500 pointer-events-none">°F</span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  placeholder="170"
                  className="w-full h-11 px-3 text-xs sm:text-sm rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 font-mono font-bold transition-all shadow-2xs text-center"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>

              {/* Weight */}
              <div className="col-span-1 sm:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  placeholder="70"
                  className="w-full h-11 px-3 text-xs sm:text-sm rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 font-mono font-bold transition-all shadow-2xs text-center"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              {/* Calculated BMI */}
              <div className="col-span-1 sm:col-span-2 flex flex-col justify-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">Calculated BMI</span>
                <div className={`h-11 px-3.5 rounded-xl border-2 flex items-center justify-between font-extrabold text-xs shadow-2xs ${bmiInfo.color}`}>
                  <span className="font-mono text-sm">{bmiInfo.val} kg/m²</span>
                  <span className="text-[10px] font-semibold uppercase">{bmiInfo.status}</span>
                </div>
              </div>

              {/* Admission Status Selector */}
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-1">Admission Department</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ADMISSION_STATUSES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st.id })}
                      className={`h-11 px-2 rounded-xl text-xs font-semibold flex items-center justify-center border-2 transition-all cursor-pointer ${
                        formData.status === st.id
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-bg-surface border-border-strong text-text-muted hover:border-teal-500/60 hover:text-text-main'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3: HEALTH ALERTS & ALLERGIES ── */}
          <div className="rounded-2xl bg-bg-surface border-2 border-border-strong p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all hover:border-rose-500/60">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold border border-rose-500/20">
                  <AlertTriangle size={16} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight uppercase">
                  3. Health Alerts, Allergies & Diagnoses
                </h3>
              </div>
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Clinical Flags</span>
            </div>

            <div className="space-y-4">
              {/* Allergies */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-2">
                  Known Drug & Environmental Allergies
                </label>
                <div className="flex gap-2 flex-wrap mb-2.5">
                  {COMMON_ALLERGIES.map((allg) => {
                    const selected = formData.allergiesList.includes(allg);
                    return (
                      <button
                        key={allg}
                        type="button"
                        onClick={() => handleAllergyToggle(allg)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selected
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-bg-surface text-text-main border-2 border-border-strong hover:border-rose-500/60'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '} {allg}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Iodine, Morphine, Shellfish..."
                    className="flex-1 h-10 px-3.5 text-xs rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-medium transition-all shadow-2xs"
                    value={formData.customAllergy}
                    onChange={(e) => setFormData({ ...formData, customAllergy: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAllergy();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="h-10 px-4 rounded-xl font-bold text-xs bg-rose-600 text-white cursor-pointer hover:bg-rose-700 transition-all shrink-0"
                    onClick={addCustomAllergy}
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Conditions */}
              <div className="pt-3 border-t border-border-subtle">
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-main mb-2">
                  Diagnosed Chronic Health Conditions
                </label>
                <div className="flex gap-2 flex-wrap mb-2.5">
                  {COMMON_CONDITIONS.map((cond) => {
                    const selected = formData.conditionsList.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => handleConditionToggle(cond)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selected
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-bg-surface text-text-main border-2 border-border-strong hover:border-teal-500/60'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '} {cond}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Migraine, Epilepsy, Thyroid..."
                    className="flex-1 h-10 px-3.5 text-xs rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium transition-all shadow-2xs"
                    value={formData.customCondition}
                    onChange={(e) => setFormData({ ...formData, customCondition: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomCondition();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="h-10 px-4 rounded-xl font-bold text-xs bg-teal-600 text-white cursor-pointer hover:bg-teal-700 transition-all shrink-0"
                    onClick={addCustomCondition}
                  >
                    Add Condition
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 4: PHYSICIAN ASSIGNMENT & BILLING SCHEME ── */}
          <div className="rounded-2xl bg-bg-surface border-2 border-border-strong p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all hover:border-indigo-500/60">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
                  <ShieldCheck size={16} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight uppercase">
                  4. Attending Specialist & Health Insurance Desk
                </h3>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Staff Assignment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Doctor */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Assigned Attending Specialist
                </label>
                <div className="relative">
                  <Stethoscope size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-600 dark:text-teal-400 pointer-events-none" />
                  <select
                    name="attendingDoctor"
                    className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm font-bold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-2xs cursor-pointer"
                    value={formData.attendingDoctor}
                    onChange={handleChange}
                  >
                    {doctors?.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} — {d.specialty} ({d.room || 'Consultation Suite'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Insurance Scheme */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Insurance / Payment Scheme
                </label>
                <select
                  name="insuranceProvider"
                  className="w-full h-11 px-4 text-xs sm:text-sm font-bold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs cursor-pointer"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                >
                  <option value="Self-Pay (Cash / UPI / Card)">Self-Pay (Cash / UPI / Card)</option>
                  <option value="Star Health Insurance">Star Health Insurance</option>
                  <option value="HDFC ERGO Health">HDFC ERGO Health</option>
                  <option value="Care Health Insurance">Care Health Insurance</option>
                  <option value="Niva Bupa Health Insurance">Niva Bupa Health Insurance</option>
                  <option value="Bajaj Allianz General">Bajaj Allianz General</option>
                </select>
              </div>

              {/* Policy No */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Policy / TPA Number
                </label>
                <div className="relative">
                  <CreditCard size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                  <input
                    type="text"
                    name="policyNo"
                    placeholder="e.g. POL-8829410"
                    className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs font-mono"
                    value={formData.policyNo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Coverage */}
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5 uppercase tracking-wide">
                  Approved Coverage Amount
                </label>
                <input
                  type="text"
                  name="coverage"
                  placeholder="e.g. ₹5,00,000"
                  className="w-full h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-bg-surface border-2 border-border-strong text-text-main placeholder:text-text-dim outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs font-mono"
                  value={formData.coverage}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Modal Action Bar */}
          <div className="pt-4 border-t-2 border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3.5 sticky bottom-0 bg-bg-surface/95 backdrop-blur-sm p-4 rounded-2xl border-2 border-border-strong shadow-lg">
            <div className="text-xs text-text-muted flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Record will be saved immediately to patient database with active EHR.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                className="flex-1 sm:flex-initial h-12 px-6 rounded-xl font-bold text-xs sm:text-sm cursor-pointer border-2 border-border-strong bg-bg-surface hover:bg-bg-surface-elevated text-text-muted transition-all"
                onClick={() => setPatientOnboardingModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial h-12 px-8 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-teal-600/30 flex items-center justify-center gap-2.5 cursor-pointer bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white transition-all active:scale-[0.98]"
              >
                <Check size={18} className="stroke-[3]" />
                <span>Register Patient to Site</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
