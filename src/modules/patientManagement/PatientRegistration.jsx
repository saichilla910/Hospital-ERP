import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  ShieldCheck,
  HeartPulse,
  User,
  Phone,
  MapPin,
  AlertTriangle,
  Check,
  Mail,
  Stethoscope,
  Activity,
  Droplet,
  RefreshCw,
  Building2,
  CreditCard,
  CheckCircle2,
  Users,
  LogIn,
  KeyRound,
  Lock,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

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

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const PatientRegistration = ({ initialMode = 'register' }) => {
  const {
    addPatient,
    registerPatientWithUhid,
    checkPatientDuplicates,
    setActiveNav,
    setSelectedPatient,
    showToast,
    doctors,
    patients,
    loginAsPatient,
    userRole,
    setAuthenticatedPatient
  } = useHospital();

  const [mode, setMode] = useState(initialMode);
  const [duplicateMatches, setDuplicateMatches] = useState([]);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Registration Form State
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
    attendingDoctor: doctors?.[0]?.name || 'Dr. Arvind Swaminathan',
    status: 'Outpatient',
    ward: 'N/A',
    bedNo: 'N/A',
    allergies: 'None known',
    chronicConditions: 'None reported',
    insuranceProvider: 'Self-Pay (Cash)',
    policyNo: 'N/A',
    coverage: '₹0',
    bp: '120/80 mmHg',
    pulse: '72 bpm',
    temp: '98.6 °F',
    spo2: '99%',
    weight: '70 kg',
    height: '170 cm'
  });

  // Login Form State (Email / Phone only, no PIN required)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [autoLoginAfterRegister, setAutoLoginAfterRegister] = useState(true);

  // Pre-save duplicate check trigger
  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergyTagClick = (tag) => {
    setFormData((prev) => {
      let current = prev.allergies
        ? prev.allergies.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      if (tag === 'None known') {
        return { ...prev, allergies: 'None known' };
      }
      current = current.filter((item) => item !== 'None known');
      if (current.includes(tag)) {
        current = current.filter((item) => item !== tag);
        if (current.length === 0) current = ['None known'];
      } else {
        current.push(tag);
      }
      return { ...prev, allergies: current.join(', ') };
    });
  };

  const handleConditionTagClick = (tag) => {
    setFormData((prev) => {
      let current = prev.chronicConditions
        ? prev.chronicConditions.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      if (tag === 'None reported') {
        return { ...prev, chronicConditions: 'None reported' };
      }
      current = current.filter((item) => item !== 'None reported');
      if (current.includes(tag)) {
        current = current.filter((item) => item !== tag);
        if (current.length === 0) current = ['None reported'];
      } else {
        current.push(tag);
      }
      return { ...prev, chronicConditions: current.join(', ') };
    });
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
      attendingDoctor: doctors?.[0]?.name || 'Dr. Arvind Swaminathan',
      status: 'Outpatient',
      ward: 'N/A',
      bedNo: 'N/A',
      allergies: 'None known',
      chronicConditions: 'None reported',
      insuranceProvider: 'Self-Pay (Cash)',
      policyNo: 'N/A',
      coverage: '₹0',
      bp: '120/80 mmHg',
      pulse: '72 bpm',
      temp: '98.6 °F',
      spo2: '99%',
      weight: '70 kg',
      height: '170 cm'
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Please enter the patient full name and phone number', 'error');
      return;
    }

    const newPatient = {
      name: formData.name.trim(),
      age: parseInt(formData.age) || 30,
      dob: formData.dob || '',
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone.trim(),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      abhaId: formData.abhaId.trim() || '',
      address: formData.address.trim() || 'Cyberabad, Hyderabad',
      emergencyContact: formData.emergencyContact.trim() || `Family Contact - ${formData.phone}`,
      allergies: formData.allergies ? formData.allergies.split(',').map((a) => a.trim()).filter(Boolean) : ['None known'],
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map((c) => c.trim()).filter(Boolean) : ['None reported'],
      vitals: {
        bp: formData.bp || '120/80 mmHg',
        pulse: formData.pulse || '72 bpm',
        temp: formData.temp || '98.6 °F',
        spo2: formData.spo2 || '99%',
        weight: formData.weight || '70 kg',
        height: formData.height || '170 cm',
        bmi: '22.8'
      },
      vitalsHistory: [
        {
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          systolic: parseInt(formData.bp?.split('/')[0]) || 120,
          diastolic: parseInt(formData.bp?.split('/')[1]) || 80,
          pulse: parseInt(formData.pulse) || 72,
          spo2: parseInt(formData.spo2) || 99,
          temp: parseFloat(formData.temp) || 98.6,
          bloodSugar: 100,
          weight: parseFloat(formData.weight) || 70,
          notes: 'Initial intake examination vitals'
        }
      ],
      insurance: {
        provider: formData.insuranceProvider,
        policyNo: formData.policyNo || 'N/A',
        coverage: formData.coverage || '₹0',
        approvedPreAuth: '₹0',
        tpa: formData.insuranceProvider !== 'Self-Pay (Cash)' ? 'Medi Assist TPA' : 'Direct'
      },
      status: formData.status,
      ward: formData.ward,
      bedNo: formData.bedNo,
      attendingDoctor: formData.attendingDoctor,
      photo: formData.gender === 'Female'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    };

    const savedPatient = registerPatientWithUhid
      ? registerPatientWithUhid(newPatient)
      : addPatient(newPatient);
    setSelectedPatient(savedPatient);

    if (autoLoginAfterRegister || userRole === 'patient') {
      loginAsPatient(savedPatient);
    } else {
      setActiveNav({ module: 'patientManagement', subModule: 'profile' });
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const rawInput = loginIdentifier.trim();
    if (!rawInput) {
      if (patients && patients.length > 0) {
        loginAsPatient(patients[0]);
        return;
      }
      showToast('Please enter your registered email address or mobile phone number', 'warning');
      return;
    }

    const queryLower = rawInput.toLowerCase();
    const queryDigits = rawInput.replace(/\D/g, '');

    // Priority 1: Filter by registered Email address
    let matched = (patients || []).find((p) => {
      if (!p.email) return false;
      const patientEmail = p.email.toLowerCase().trim();
      return patientEmail === queryLower || (queryLower.includes('@') && patientEmail.includes(queryLower));
    });

    // Priority 2: If no email match (or input was a phone number), filter by Phone number
    if (!matched && queryDigits.length >= 4) {
      matched = (patients || []).find((p) => {
        if (!p.phone) return false;
        const patientPhoneDigits = p.phone.replace(/\D/g, '');
        return (
          patientPhoneDigits.endsWith(queryDigits) ||
          patientPhoneDigits.includes(queryDigits) ||
          queryDigits.includes(patientPhoneDigits)
        );
      });
    }

    // Priority 3: Fallback by MRN or Legal Name
    if (!matched) {
      const cleanAlpha = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const queryAlpha = cleanAlpha(rawInput);
      matched = (patients || []).find((p) => {
        const pMrn = cleanAlpha(p.mrn);
        const pId = cleanAlpha(p.id);
        const pName = (p.name || '').toLowerCase();
        return (
          (queryAlpha && (pMrn.includes(queryAlpha) || queryAlpha.includes(pMrn) || pId.includes(queryAlpha))) ||
          pName.includes(queryLower) ||
          queryLower.includes(pName)
        );
      });
    }

    if (matched) {
      loginAsPatient(matched);
    } else {
      showToast(
        `No patient found with email or phone "${rawInput}". Please check your details or select a demo patient below.`,
        'error'
      );
    }
  };

  const isAllergySelected = (tag) => {
    const list = formData.allergies ? formData.allergies.split(',').map((s) => s.trim()) : [];
    return list.includes(tag);
  };

  const isConditionSelected = (tag) => {
    const list = formData.chronicConditions ? formData.chronicConditions.split(',').map((s) => s.trim()) : [];
    return list.includes(tag);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[960px] mx-auto w-full pb-12 animate-fade-in">
      
      {/* ── MODE SWITCHER & HEADER CARD ── */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs">
        
        {/* ROW 1: Header Title, Department & Utility Actions */}
        <div className="flex items-center justify-between flex-wrap gap-5 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-4 min-w-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 shadow-teal-600/25 ring-4 ring-teal-500/10'
                : 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-indigo-600/25 ring-4 ring-indigo-500/10'
            }`}>
              {mode === 'register' ? (
                <UserPlus size={26} strokeWidth={2.4} />
              ) : (
                <LogIn size={26} strokeWidth={2.4} />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display">
                  {mode === 'register' ? 'Register New Hospital Patient' : 'Patient Portal Account Login'}
                </h2>
                <span className={`badge text-[11px] font-bold py-0.5 px-2.5 rounded-full ${
                  mode === 'register' ? 'badge-teal' : 'badge-indigo'
                }`}>
                  {mode === 'register' ? 'EHR Registration' : 'Existing Patient'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1 font-medium">
                {mode === 'register'
                  ? 'Create an official Electronic Health Record (EHR), record triage vitals, and assign an attending specialist.'
                  : 'Log in with your registered email or mobile phone number to view appointments, reports, and vital charts.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {mode === 'register' && (
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary min-h-[42px] px-4.5 py-2 flex items-center gap-2.5 text-xs font-semibold rounded-xl cursor-pointer"
                title="Reset form"
              >
                <RefreshCw size={15} className="shrink-0" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveNav({ module: 'patientManagement', subModule: 'directory' })}
              className="btn btn-secondary min-h-[42px] px-5 py-2 flex items-center gap-2.5 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <Users size={16} className="shrink-0" />
              <span>All Patients Directory</span>
            </button>
          </div>
        </div>

        {/* ROW 2: LINE 1 - Mode Switcher Tabs (With guaranteed margin space below!) */}
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <div className="inline-flex items-center p-2 rounded-2xl bg-bg-surface-elevated border border-border-strong shadow-xs flex-wrap sm:flex-nowrap gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setActiveNav({ module: 'patientManagement', subModule: 'registration' });
              }}
              className={`inline-flex items-center justify-center gap-3 min-h-[46px] px-6 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
                mode === 'register'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25 border border-teal-500'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-surface border border-transparent'
              }`}
            >
              <UserPlus size={18} strokeWidth={2.2} className="shrink-0" />
              <span className="whitespace-nowrap">Register New Patient</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setActiveNav({ module: 'patientManagement', subModule: 'login' });
              }}
              className={`inline-flex items-center justify-center gap-3 min-h-[46px] px-6 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-surface border border-transparent'
              }`}
            >
              <LogIn size={18} strokeWidth={2.2} className="shrink-0" />
              <span className="whitespace-nowrap">Already Registered? Log In</span>
            </button>
          </div>
        </div>

        {/* ROW 3: LINE 2 - Helper Notice Banner (Separated with clear margin-top!) */}
        <div style={{ marginTop: '16px' }}>
          <div className={`flex items-center gap-3.5 px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all shadow-2xs ${
            mode === 'register'
              ? 'bg-teal-500/10 border-teal-500/25 text-teal-800 dark:text-teal-200'
              : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-800 dark:text-indigo-200'
          }`}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              mode === 'register' ? 'bg-teal-600 text-white' : 'bg-indigo-600 text-white'
            }`}>
              <Info size={14} strokeWidth={2.5} />
            </div>
            <span>
              {mode === 'register'
                ? 'Already have an existing patient profile or MRN?'
                : 'Need to create a brand new patient health record?'}
            </span>
            <button
              type="button"
              onClick={() => {
                const target = mode === 'register' ? 'login' : 'register';
                setMode(target);
                setActiveNav({ module: 'patientManagement', subModule: target });
              }}
              className={`font-semibold underline underline-offset-4 cursor-pointer hover:opacity-80 ml-1 transition-opacity ${
                mode === 'register' ? 'text-teal-700 dark:text-teal-300' : 'text-indigo-700 dark:text-indigo-300'
              }`}
            >
              {mode === 'register'
                ? 'Switch to Patient Portal Log In →'
                : 'Switch to New Patient Registration →'}
            </button>
          </div>
        </div>

      </div>

      {/* ── MODE 1: LOGIN FOR EXISTING PATIENTS ── */}
      {mode === 'login' ? (
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 sm:p-9 rounded-2xl bg-bg-surface border border-border-subtle shadow-md space-y-6">
            <div className="max-w-xl mx-auto space-y-6">
              
              <div className="text-center space-y-1">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-text-main tracking-tight font-display">
                  Sign In to Patient Portal
                </h3>
                <p className="text-xs sm:text-sm text-text-muted">
                  Instant passwordless access via your registered email address or mobile phone number.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Account identifier: Email or Phone */}
                <div className="form-group mb-0">
                  <label className="form-label flex items-center justify-between text-xs sm:text-sm font-bold text-text-main">
                    <span className="flex items-center gap-1.5">
                      <Mail size={15} className="text-indigo-600" />
                      <span>Registered Email Address <span className="text-text-muted font-normal">(or Mobile Phone)</span></span>
                      <span className="text-rose-500">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="form-input h-12 text-sm sm:text-base font-medium"
                      placeholder="e.g. r.sharma@example.com or +91 98765 43210"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="flex items-start gap-1.5 mt-2 text-[11.5px] text-text-muted leading-relaxed">
                    <Phone size={13} className="shrink-0 mt-0.5 text-indigo-600" />
                    <span>
                      Authentication is verified directly by your registered email. If no email is on record, enter your 10-digit mobile number.
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-lg w-full h-12 rounded-xl text-sm sm:text-base font-extrabold bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <LogIn size={18} strokeWidth={2.4} />
                  <span>Sign In to Patient Portal</span>
                </button>
              </form>

              {/* Quick Select Existing Registered Patients for Demo */}
              <div className="pt-6 border-t border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-dim">
                    Quick Log In As Registered Patient (Demo)
                  </span>
                  <span className="text-[11px] text-indigo-600 font-bold">1-Click Access</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {patients.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => loginAsPatient(p)}
                      className="p-3.5 rounded-xl bg-bg-surface-elevated border border-border-strong hover:border-indigo-500 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-border-subtle shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-text-main truncate group-hover:text-indigo-600 transition-colors">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-text-muted truncate">
                            {p.email || 'No email registered'}
                          </div>
                          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                            {p.phone}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-0.5">
                        Log In <ArrowRight size={13} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (

        /* ── MODE 2: REGISTER NEW PATIENT ── */
        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">

          {/* ⚠️ DUPLICATE PATIENT DETECTION WARNING BANNER */}
          {duplicateMatches.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-center gap-2.5 font-bold text-sm sm:text-base">
                <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span>⚠️ Possible Existing Patient Detected ({duplicateMatches.length} Match{duplicateMatches.length > 1 ? 'es' : ''})</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                A patient matching this phone number, date of birth, or name was found in the hospital registry. Please verify to avoid split EMR records:
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
                        setActiveNav({ module: 'patientManagement', subModule: 'profile' });
                      }}
                    >
                      Open Existing Timeline
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 1: PERSONAL & CONTACT INFORMATION ── */}
          <div className="glass-card p-6 sm:p-7 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight uppercase">
                    1. Personal & Contact Information (UHID & ABHA)
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">
                    Primary demographic identifiers, unique UHID allocation, and ABDM Ayushman Bharat Health ID.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wide">
                * Required Fields
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Full Name */}
              <div className="form-group mb-0">
                <label className="form-label flex items-center justify-between">
                  <span>Patient Full Legal Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="form-input"
                  placeholder="e.g. Radhika Madhavan / Rajesh Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  autoFocus
                />
              </div>

              {/* Date of Birth (DOB) */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Date of Birth (DOB)
                </label>
                <input
                  type="date"
                  name="dob"
                  className="form-input"
                  value={formData.dob}
                  onChange={(e) => {
                    const val = e.target.value;
                    let calculatedAge = formData.age;
                    if (val) {
                      const birthYear = new Date(val).getFullYear();
                      const currentYear = new Date().getFullYear();
                      if (birthYear > 1900 && currentYear >= birthYear) {
                        calculatedAge = currentYear - birthYear;
                      }
                    }
                    setFormData((prev) => ({
                      ...prev,
                      dob: val,
                      age: calculatedAge ? String(calculatedAge) : prev.age
                    }));
                  }}
                />
              </div>

              {/* Age */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Age (Years) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  min="0"
                  max="125"
                  required
                  className="form-input mono"
                  placeholder="e.g. 34"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              {/* Biological Gender */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Biological Gender <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`h-11 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        formData.gender === g
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-bg-surface-elevated text-text-muted border-border-strong hover:border-teal-500/50 hover:text-text-main'
                      }`}
                    >
                      {formData.gender === g && <Check size={13} className="stroke-[3]" />}
                      <span>{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Group */}
              <div className="sm:col-span-2 form-group mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label mb-0 flex items-center gap-1.5">
                    <Droplet size={14} className="text-rose-500 fill-rose-500" />
                    <span>Blood Group Classification</span>
                  </label>
                  <span className="text-xs font-bold text-rose-600">Selected: {formData.bloodGroup}</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                      className={`h-10 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                        formData.bloodGroup === bg
                          ? 'bg-gradient-to-br from-rose-600 to-rose-700 text-white border-rose-600 shadow-sm'
                          : 'bg-bg-surface-elevated text-text-main border-border-strong hover:border-rose-400 hover:text-rose-600'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Mobile Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="form-input mono"
                  placeholder="+91 98450 67214"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Emergency Contact */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Emergency Contact (Name & Phone)
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  className="form-input"
                  placeholder="e.g. Spouse / Parent & Contact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>

              {/* ABHA ID (Ayushman Bharat Digital Health Account) */}
              <div className="form-group mb-0">
                <label className="form-label flex items-center justify-between">
                  <span>ABHA ID (National Health Account)</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">ABDM Verified</span>
                </label>
                <input
                  type="text"
                  name="abhaId"
                  className="form-input mono"
                  placeholder="e.g. 91-8842-9901-3421"
                  value={formData.abhaId}
                  onChange={handleChange}
                />
              </div>

              {/* Date of Birth */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Date of Birth (DOB)
                </label>
                <input
                  type="date"
                  name="dob"
                  className="form-input"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2 lg:col-span-3 form-group mb-0">
                <label className="form-label">
                  Residential Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="Flat No, Building, Street Name, Area / City"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 2: CLINICAL VITALS BASELINE & DEPARTMENT ── */}
          <div className="glass-card p-6 sm:p-7 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <HeartPulse size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight uppercase">
                    2. Clinical Vitals Baseline & Admission Triage
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">
                    Initial biometric triage measurements and attending specialist allocation.
                  </p>
                </div>
              </div>
              <span className="badge badge-emerald text-[11px] font-bold py-0.5 px-2">
                Intake Baseline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* BP */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Blood Pressure (BP)
                </label>
                <input
                  type="text"
                  name="bp"
                  className="form-input mono"
                  placeholder="120/80 mmHg"
                  value={formData.bp}
                  onChange={handleChange}
                />
              </div>

              {/* Pulse */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Heart Pulse Rate
                </label>
                <input
                  type="text"
                  name="pulse"
                  className="form-input mono"
                  placeholder="72 bpm"
                  value={formData.pulse}
                  onChange={handleChange}
                />
              </div>

              {/* SpO2 */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Oxygen (SpO2)
                </label>
                <input
                  type="text"
                  name="spo2"
                  className="form-input mono"
                  placeholder="99%"
                  value={formData.spo2}
                  onChange={handleChange}
                />
              </div>

              {/* Temperature */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Body Temperature
                </label>
                <input
                  type="text"
                  name="temp"
                  className="form-input mono"
                  placeholder="98.6 °F"
                  value={formData.temp}
                  onChange={handleChange}
                />
              </div>

              {/* Body Weight */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Body Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  className="form-input mono"
                  placeholder="70 kg"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              {/* Height */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Height / Stature
                </label>
                <input
                  type="text"
                  name="height"
                  className="form-input mono"
                  placeholder="170 cm"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>

              {/* Admission Department */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Admission Department
                </label>
                <select
                  name="status"
                  className="form-select font-bold"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Outpatient">Outpatient (OPD)</option>
                  <option value="Inpatient">Inpatient (IPD Ward)</option>
                  <option value="ICU">Intensive Care Unit (ICU)</option>
                  <option value="Emergency">Emergency Trauma (ER)</option>
                </select>
              </div>

              {/* Attending Specialist */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Assigned Specialist
                </label>
                <select
                  name="attendingDoctor"
                  className="form-select font-bold"
                  value={formData.attendingDoctor}
                  onChange={handleChange}
                >
                  {doctors?.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── SECTION 3: HEALTH ALERTS, ALLERGIES & DIAGNOSES ── */}
          <div className="glass-card p-6 sm:p-7 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight uppercase">
                    3. Health Alerts, Allergies & Diagnoses
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">
                    Select clinical warning flags and chronic medical histories.
                  </p>
                </div>
              </div>
              <span className="badge badge-rose text-[11px] font-bold py-0.5 px-2">
                Clinical Warnings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Allergies */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Known Drug & Food Allergies
                </label>
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  {COMMON_ALLERGIES.map((tag) => {
                    const active = isAllergySelected(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAllergyTagClick(tag)}
                        className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer border ${
                          active
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-bg-surface-elevated text-text-muted border-border-strong hover:border-rose-400 hover:text-rose-600'
                        }`}
                      >
                        {active ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  name="allergies"
                  className="form-input"
                  placeholder="e.g. Penicillin, Sulfa drugs, Peanuts, None known"
                  value={formData.allergies}
                  onChange={handleChange}
                />
              </div>

              {/* Chronic Conditions */}
              <div className="form-group mb-0">
                <label className="form-label">
                  Chronic Medical Conditions & History
                </label>
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  {COMMON_CONDITIONS.map((tag) => {
                    const active = isConditionSelected(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleConditionTagClick(tag)}
                        className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer border ${
                          active
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-bg-surface-elevated text-text-muted border-border-strong hover:border-teal-500 hover:text-teal-600'
                        }`}
                      >
                        {active ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  name="chronicConditions"
                  className="form-input"
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma, None reported"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 4: HEALTH INSURANCE & CASHLESS TPA DESK ── */}
          <div className="glass-card p-6 sm:p-7 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight uppercase">
                    4. Health Insurance & Cashless TPA Desk
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">
                    Third-party administrator (TPA) policy verification and cashless pre-authorization.
                  </p>
                </div>
              </div>
              <span className="badge badge-indigo text-[11px] font-bold py-0.5 px-2">
                Billing Desk
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div className="form-group mb-0">
                <label className="form-label">
                  Payment / Insurance Scheme
                </label>
                <select
                  name="insuranceProvider"
                  className="form-select font-bold"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                >
                  <option value="Self-Pay (Cash)">Self-Pay (Cash / UPI / Card)</option>
                  <option value="Star Health Insurance">Star Health Insurance</option>
                  <option value="HDFC ERGO Health">HDFC ERGO Health</option>
                  <option value="Care Health Insurance">Care Health Insurance</option>
                  <option value="Niva Bupa Health Insurance">Niva Bupa Health Insurance</option>
                  <option value="Bajaj Allianz General">Bajaj Allianz General</option>
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">
                  Policy / TPA ID Number
                </label>
                <input
                  type="text"
                  name="policyNo"
                  className="form-input mono"
                  placeholder="e.g. STAR-8829410"
                  value={formData.policyNo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">
                  Approved Coverage Limit
                </label>
                <input
                  type="text"
                  name="coverage"
                  className="form-input mono"
                  placeholder="e.g. ₹5,00,000"
                  value={formData.coverage}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ── FORM SUBMISSION BAR ── */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle shadow-md flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-text-muted flex items-center gap-3.5 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Record will be saved immediately to the hospital patient database with active EHR.</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-semibold select-none text-text-main pl-1 py-1 rounded-lg hover:text-teal-600 transition-colors">
                <input
                  type="checkbox"
                  checked={autoLoginAfterRegister}
                  onChange={(e) => setAutoLoginAfterRegister(e.target.checked)}
                  className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                />
                <span>Sign in to Patient Portal immediately after registration</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveNav({ module: 'patientManagement', subModule: 'directory' })}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
              >
                <Check size={18} className="stroke-[3]" />
                <span>Complete Registration & Open Record</span>
              </button>
            </div>
          </div>

        </form>
      )}

    </div>
  );
};
