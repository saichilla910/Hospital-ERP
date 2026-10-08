import React, { useState } from 'react';
import {
  User,
  HeartPulse,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Stethoscope,
  Pill,
  Activity,
  Bed,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  Edit,
  ArrowRight,
  TrendingUp,
  Star,
  Award,
  CheckCircle2,
  Sparkles,
  Eye,
  Plus,
  X,
  Search,
  ChevronRight,
  Thermometer,
  Droplet,
  ShieldAlert,
  UserCheck,
  Building,
  Check
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';
import { PatientVitalsGraph } from './PatientVitalsGraph';

export const PatientProfile = () => {
  const {
    selectedPatient,
    patients,
    doctors,
    setSelectedPatient,
    openModal,
    prescriptions,
    labOrders,
    radiologyOrders,
    billingInvoices,
    setActiveNav,
    userRole,
    authenticatedPatient,
    setAuthenticatedPatient,
    loginAsStaff,
    setPatientOnboardingModalOpen,
    addPatient,
    addPatientVital,
    showToast
  } = useHospital();

  const patient = (userRole === 'patient' && authenticatedPatient)
    ? authenticatedPatient
    : (selectedPatient || patients[0]);

  // Search filter for switcher
  const [switcherSearch, setSwitcherSearch] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);

  // Quick Patient Intake Form State
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    attendingDoctor: doctors[0]?.name || 'Dr. Arvind Swaminathan',
    ward: 'N/A',
    bedNo: 'N/A',
    status: 'Outpatient',
    insuranceProvider: 'Self-Pay (Cash)',
    policyNo: 'N/A',
    coverage: '₹0',
    allergies: 'None known',
    chronicConditions: 'None reported',
    bp: '120/80 mmHg',
    pulse: '72 bpm',
    temp: '98.6 °F',
    spo2: '99%',
    weight: '70 kg',
    height: '170 cm'
  });

  // Quick Vitals Entry State
  const [vitalForm, setVitalForm] = useState({
    systolic: 120,
    diastolic: 80,
    pulse: 72,
    spo2: 98,
    temp: 98.6,
    bloodSugar: 100,
    weight: 70,
    notes: 'Routine clinical check'
  });

  // Match items for this patient
  const patientPrescriptions = prescriptions.filter((rx) => rx.patientId === patient?.id);
  const patientLabOrders = labOrders.filter((l) => l.patientId === patient?.id);
  const patientRadiology = radiologyOrders.filter((r) => r.patientId === patient?.id);
  const patientBills = billingInvoices.filter((b) => b.patientId === patient?.id);

  // Match attending doctor object
  const attendingDoctorObj = doctors?.find(
    (d) => d.name.toLowerCase() === (patient?.attendingDoctor || '').toLowerCase()
  ) || doctors?.[0] || {
    id: 'DOC-101',
    name: patient?.attendingDoctor || 'Dr. Arvind Swaminathan',
    specialty: 'Primary / General Care',
    department: 'General Medicine',
    room: 'Consultation Suite 1'
  };

  // Custom user-logged medical events mapped into consultation format
  const customEventsAsConsultations = (patient?.medicalEvents || []).map((evt) => ({
    consultationId: evt.id,
    doctorId: evt.doctorId || attendingDoctorObj.id,
    doctorName: evt.doctorName || attendingDoctorObj.name,
    specialty: evt.department || attendingDoctorObj.specialty,
    department: evt.department || attendingDoctorObj.department,
    room: evt.facility || attendingDoctorObj.room,
    date: evt.date,
    time: evt.time || '10:00 AM',
    type: evt.type,
    diagnosis: evt.diagnosis || evt.title,
    vitalsAtConsult: '',
    clinicalNotes: evt.desc,
    prescribedMeds: evt.prescribedMeds || [],
    followUp: 'Recorded in EMR History',
    status: evt.status || 'Verified'
  }));

  // Consultations History array (guaranteed fallback)
  const baseConsultations = (patient?.consultationsHistory && patient.consultationsHistory.length > 0)
    ? patient.consultationsHistory
    : [
        {
          consultationId: 'CNS-2026-101',
          doctorId: attendingDoctorObj.id,
          doctorName: patient?.attendingDoctor || attendingDoctorObj.name,
          specialty: attendingDoctorObj.specialty,
          department: attendingDoctorObj.department,
          room: attendingDoctorObj.room,
          date: patient?.registeredDate || '2026-03-15',
          time: '11:00 AM',
          type: 'Primary Clinical Consultation',
          diagnosis: patient?.chronicConditions?.[0] || 'Comprehensive Clinical Evaluation',
          vitalsAtConsult: `BP ${patient?.vitals?.bp || '120/80'}, Pulse ${patient?.vitals?.pulse || '74'}, SpO2 ${patient?.vitals?.spo2 || '98%'}`,
          clinicalNotes: `Comprehensive clinical evaluation conducted under attending specialist ${patient?.attendingDoctor}. Regular monitoring and treatment schedule active.`,
          prescribedMeds: ['Tab. Multivitamin & Minerals OD', 'Tab. Calcium + Vitamin D3'],
          followUp: 'Regular follow-up in OPD.',
          status: 'Active Care'
        }
      ];

  const consultations = [...customEventsAsConsultations, ...baseConsultations].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Handle Quick Add Patient Submit
  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!newPatientForm.name || !newPatientForm.phone) {
      showToast('Please provide patient name and contact phone number.', 'error');
      return;
    }

    const created = addPatient({
      name: newPatientForm.name,
      age: parseInt(newPatientForm.age) || 32,
      gender: newPatientForm.gender,
      bloodGroup: newPatientForm.bloodGroup,
      phone: newPatientForm.phone,
      email: newPatientForm.email || `${newPatientForm.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: newPatientForm.address || 'Cyberabad, Hyderabad',
      emergencyContact: newPatientForm.emergencyContact || `Family Member - ${newPatientForm.phone}`,
      allergies: newPatientForm.allergies ? newPatientForm.allergies.split(',').map((a) => a.trim()) : ['None known'],
      chronicConditions: newPatientForm.chronicConditions ? newPatientForm.chronicConditions.split(',').map((c) => c.trim()) : ['None reported'],
      vitals: {
        bp: newPatientForm.bp || '120/80 mmHg',
        pulse: newPatientForm.pulse || '72 bpm',
        temp: newPatientForm.temp || '98.6 °F',
        spo2: newPatientForm.spo2 || '99%',
        weight: newPatientForm.weight || '70 kg',
        height: newPatientForm.height || '170 cm',
        bmi: '22.8'
      },
      vitalsHistory: [
        {
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          systolic: parseInt(newPatientForm.bp?.split('/')[0]) || 120,
          diastolic: parseInt(newPatientForm.bp?.split('/')[1]) || 80,
          pulse: parseInt(newPatientForm.pulse) || 72,
          spo2: parseInt(newPatientForm.spo2) || 99,
          temp: parseFloat(newPatientForm.temp) || 98.6,
          bloodSugar: 100,
          weight: parseFloat(newPatientForm.weight) || 70,
          notes: 'Intake examination vitals'
        }
      ],
      insurance: {
        provider: newPatientForm.insuranceProvider,
        policyNo: newPatientForm.policyNo || 'N/A',
        coverage: newPatientForm.coverage || '₹0',
        approvedPreAuth: '₹0',
        tpa: newPatientForm.insuranceProvider !== 'Self-Pay (Cash)' ? 'Medi Assist TPA' : 'Direct'
      },
      status: newPatientForm.status,
      ward: newPatientForm.ward,
      bedNo: newPatientForm.bedNo,
      attendingDoctor: newPatientForm.attendingDoctor,
      photo: `https://images.unsplash.com/photo-${newPatientForm.gender === 'Female' ? '1544005313-94ddf0286df2' : '1535713875002-d1d0cf377fde'}?w=150&auto=format&fit=crop&q=80`
    });

    setSelectedPatient(created);
    setIsQuickAddOpen(false);
    showToast(`Patient ${created.name} registered and selected!`, 'success');
  };

  // Handle Quick Vitals Submit
  const handleVitalsSubmit = (e) => {
    e.preventDefault();
    if (!patient) return;
    addPatientVital(patient.id, vitalForm);
    setIsVitalsModalOpen(false);
    showToast(`New clinical vitals logged for ${patient.name}!`, 'success');
  };

  if (!patient) {
    return (
      <div className="p-12 text-center bg-bg-surface rounded-2xl border border-border-subtle">
        <User size={40} className="mx-auto mb-2 text-text-dim opacity-40" />
        <h3 className="text-lg font-bold text-text-main">No Patient Selected</h3>
        <p className="text-xs text-text-muted mt-1">Select a patient from directory or register a new one.</p>
        <button
          className="btn btn-primary btn-sm mt-4"
          onClick={() => setActiveNav({ module: 'patientManagement', subModule: 'registration' })}
        >
          <Plus size={14} /> + Register New Patient
        </button>
      </div>
    );
  }

  // Parse current vitals
  const currentBp = patient.vitals?.bp || '120/80 mmHg';
  const currentSystolic = parseInt(currentBp.split('/')[0]) || 120;
  const currentPulse = patient.vitals?.pulse || '72 bpm';
  const currentSpo2 = patient.vitals?.spo2 || '99%';
  const currentTemp = patient.vitals?.temp || '98.6 °F';
  const currentWeight = patient.vitals?.weight || '70 kg';
  const currentBmi = patient.vitals?.bmi || '22.4';
  const currentSugar = patient.vitalsHistory?.[patient.vitalsHistory.length - 1]?.bloodSugar || 100;

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(switcherSearch.toLowerCase()) ||
    p.mrn.toLowerCase().includes(switcherSearch.toLowerCase()) ||
    p.phone.includes(switcherSearch)
  );

  return (
    <div className="flex flex-col gap-5">
      {/* ── Patient Portal Mode Active Banner ── */}
      {userRole === 'patient' && (
        <div className="glass-card p-4 rounded-xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 border border-teal-500/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-text-main">
              You are logged in as <strong className="text-teal-600">{patient.name}</strong> ({patient.mrn}) — Viewing Personal Health Dossier
            </span>
          </div>
          <button
            onClick={loginAsStaff}
            className="btn btn-sm btn-secondary text-xs font-bold text-text-muted hover:text-text-main"
          >
            Exit Portal / Switch to Staff Mode
          </button>
        </div>
      )}

      {/* ── 1. PATIENT SWITCHER BAR & QUICK ACTIONS ── */}
      {userRole !== 'patient' && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Quick Avatar Switcher Bar */}
          <div className="patient-switcher-bar flex-1 min-w-[300px]">
            <span className="text-xs font-bold text-text-dim uppercase tracking-wider shrink-0 flex items-center gap-1">
              <UserCheck size={13} className="text-teal-600" /> Switch:
            </span>

            {filteredPatients.slice(0, 8).map((p) => {
              const isActive = p.id === patient.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`patient-pill-btn ${isActive ? 'active' : ''}`}
                  title={`${p.name} • ${p.mrn} • ${p.ward !== 'N/A' ? p.ward : 'OPD'}`}
                >
                  <img
                    src={p.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="patient-pill-avatar"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="text-left leading-tight">
                    <span className="patient-pill-name block">{p.name.split(' ')[0]}</span>
                    <span className="patient-pill-mrn">{p.bloodGroup}</span>
                  </div>
                </button>
              );
            })}

            {/* Quick Add New Patient Pill */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="patient-pill-btn border-dashed border-teal-500/50 bg-teal-500/5 hover:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold"
              title="Add New Patient Instantly"
            >
              <Plus size={14} />
              <span className="text-xs">+ New Patient</span>
            </button>
          </div>

          {/* Search Dropdown alternative */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="patient-act-btn patient-act-btn-primary"
              onClick={() => setIsQuickAddOpen(true)}
              title="Open Easy Patient Intake Form"
            >
              <Plus size={15} />
              <span>+ Quick Intake</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 2. HERO PATIENT MASTER CARD ── */}
      <div className="patient-hero-card">
        <div className="patient-hero-content">
          {/* Avatar + Main Identity */}
          <div className="flex items-start gap-4.5 flex-1 min-w-[280px]">
            <div className="patient-avatar-wrap">
              <img
                src={patient.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                alt={patient.name}
                className="patient-avatar-main"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
                }}
              />
              <span
                className={`patient-status-dot ${
                  patient.status === 'ICU' || patient.status === 'Emergency'
                    ? 'bg-rose-500'
                    : patient.status === 'Inpatient'
                    ? 'bg-teal-500'
                    : 'bg-emerald-500'
                }`}
                title={`Status: ${patient.status}`}
              />
            </div>

            <div className="patient-info-block">
              {/* Name & Primary Badges */}
              <div className="patient-title-row">
                <h2 className="patient-display-name truncate">
                  {patient.name}
                </h2>
                <span className="badge badge-teal font-mono text-xs py-0.5 px-2.5 font-bold shrink-0">
                  UHID: {patient.uhid || patient.mrn}
                </span>
                {patient.abhaId && (
                  <span className="badge badge-emerald font-mono text-[11px] py-0.5 px-2 font-bold shrink-0" title="Ayushman Bharat Health Account (ABDM Verified)">
                    ABHA: {patient.abhaId}
                  </span>
                )}
                <span className="badge badge-rose text-xs py-0.5 px-2 font-bold shrink-0">
                  🩸 {patient.bloodGroup}
                </span>
                <Badge
                  variant={
                    patient.status === 'ICU' || patient.status === 'Emergency'
                      ? 'rose'
                      : patient.status === 'Inpatient'
                      ? 'teal'
                      : 'emerald'
                  }
                  dot
                >
                  {patient.status}
                </Badge>
              </div>

              {/* Metadata row */}
              <div className="patient-meta-chips">
                <span className="patient-meta-chip">
                  <User size={13} className="text-teal-600 shrink-0" />
                  <span>Age: <strong>{patient.age} yrs</strong> ({patient.gender})</span>
                </span>
                <span className="text-text-dim">•</span>
                <span className="patient-meta-chip">
                  <Phone size={13} className="text-teal-600 shrink-0" />
                  <span><strong>{patient.phone}</strong></span>
                </span>
                <span className="text-text-dim">•</span>
                <span className="patient-meta-chip">
                  <MapPin size={13} className="text-teal-600 shrink-0" />
                  <span className="text-teal-600 dark:text-teal-400 font-bold">
                    {patient.ward !== 'N/A' ? `${patient.ward} • Bed ${patient.bedNo}` : 'OPD Consultation'}
                  </span>
                </span>
                <span className="text-text-dim">•</span>
                <span className="patient-meta-chip">
                  <Stethoscope size={13} className="text-teal-600 shrink-0" />
                  <span
                    className="cursor-pointer hover:underline text-text-main font-semibold"
                    onClick={() => openModal('doctorProfile', attendingDoctorObj)}
                    title="Click to view physician profile"
                  >
                    Attending: <strong>{patient.attendingDoctor}</strong>
                  </span>
                </span>
              </div>

              {/* Allergies Alert Strip */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-[0.7rem] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle size={13} /> Allergies:
                </span>
                {patient.allergies && patient.allergies.length > 0 ? (
                  patient.allergies.map((alg, i) => (
                    <span
                      key={i}
                      className={`text-xs font-bold py-0.5 px-2.5 rounded-full border ${
                        alg.toLowerCase().includes('none')
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {alg}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-text-dim font-medium">None known</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Cluster Buttons */}
          <div className="patient-quick-actions">
            <button
              className="patient-act-btn patient-act-btn-secondary"
              onClick={() => setIsVitalsModalOpen(true)}
              title="Record fresh clinical vitals"
            >
              <HeartPulse size={14} className="text-rose-600" />
              <span>+ Record Vitals</span>
            </button>

            <button
              className="patient-act-btn patient-act-btn-primary"
              onClick={() => openModal('doctorConsult', attendingDoctorObj)}
              title="Book 1-click consultation with attending doctor"
            >
              <Stethoscope size={14} />
              <span>Book Consult</span>
            </button>

            <button
              className="patient-act-btn patient-act-btn-secondary bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-500/20"
              onClick={() => setActiveNav({ module: 'patientManagement', subModule: 'history' })}
              title="View unified chronological timeline: Visits, Admissions, Labs, Prescriptions, Bills"
            >
              <FileText size={14} className="text-teal-600 dark:text-teal-400" />
              <span>Unified Timeline</span>
            </button>

            <button
              className="patient-act-btn patient-act-btn-secondary"
              onClick={() => window.print()}
              title="Print complete electronic health record summary"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print EHR</span>
            </button>
          </div>
        </div>

        {/* ── 3. LIVE VITALS 6-METRIC SCORECARD STRIP ── */}
        <div className="patient-vitals-strip">
          {/* Blood Pressure */}
          <div className="patient-vital-card">
            <div className="patient-vital-top">
              <div className="patient-vital-icon bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <HeartPulse size={15} />
              </div>
              <span
                className={`patient-vital-badge ${
                  currentSystolic > 140
                    ? 'text-rose-600 dark:text-rose-400'
                    : currentSystolic <= 120
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-500'
                }`}
              >
                {currentSystolic > 140 ? 'High' : currentSystolic <= 120 ? 'Optimal' : 'Normal'}
              </span>
            </div>
            <span className="patient-vital-label">Blood Pressure</span>
            <div className="patient-vital-value text-blue-600 dark:text-blue-400">
              {currentBp}
            </div>
          </div>

          {/* Pulse Rate */}
          <div className="patient-vital-card">
            <div className="patient-vital-top">
              <div className="patient-vital-icon bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Activity size={15} />
              </div>
              <span className="patient-vital-badge text-emerald-600 dark:text-emerald-400">Normal</span>
            </div>
            <span className="patient-vital-label">Heart Rate</span>
            <div className="patient-vital-value text-rose-600 dark:text-rose-400">
              {currentPulse}
            </div>
          </div>

          {/* Oxygen SpO2 */}
          <div className="patient-vital-card">
            <div className="patient-vital-top">
              <div className="patient-vital-icon bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Sparkles size={15} />
              </div>
              <span className="patient-vital-badge text-emerald-600 dark:text-emerald-400">Room Air</span>
            </div>
            <span className="patient-vital-label">SpO2 Oxygen</span>
            <div className="patient-vital-value text-cyan-600 dark:text-cyan-400">
              {currentSpo2}
            </div>
          </div>

          {/* Temperature */}
          <div className="patient-vital-card">
            <div className="patient-vital-top">
              <div className="patient-vital-icon bg-amber-500/10 text-amber-500">
                <Thermometer size={15} />
              </div>
              <span className="patient-vital-badge text-emerald-600 dark:text-emerald-400">Afebrile</span>
            </div>
            <span className="patient-vital-label">Body Temp</span>
            <div className="patient-vital-value text-amber-500">
              {currentTemp}
            </div>
          </div>

          {/* Weight & BMI */}
          <div className="patient-vital-card">
            <div className="patient-vital-top">
              <div className="patient-vital-icon bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <User size={15} />
              </div>
              <span className="patient-vital-badge text-text-muted">BMI {currentBmi}</span>
            </div>
            <span className="patient-vital-label">Weight & BMI</span>
            <div className="patient-vital-value text-emerald-600 dark:text-emerald-400">
              {currentWeight}
            </div>
          </div>

          {/* Blood Glucose */}
          <div className="patient-vital-card">
            <div className="patient-vital-top">
              <div className="patient-vital-icon bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Droplet size={15} />
              </div>
              <span className="patient-vital-badge text-purple-600 dark:text-purple-400">mg/dL</span>
            </div>
            <span className="patient-vital-label">Blood Sugar</span>
            <div className="patient-vital-value text-purple-600 dark:text-purple-400">
              {currentSugar} mg/dL
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. EMBEDDED INTERACTIVE REACT CHARTS ── */}
      <PatientVitalsGraph patient={patient} />

      {/* ── 5. CONSULTED DOCTORS & CLINICAL ENCOUNTERS HISTORY ── */}
      <div className="glass-card flex flex-col gap-5 rounded-2xl bg-bg-surface border border-border-subtle p-5 md:p-6 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="flex justify-between items-start sm:items-center flex-wrap gap-4 border-b border-border-subtle pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-bold text-text-main tracking-tight">
                  Consulted Doctors & Clinical Encounters
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/12 text-teal-700 dark:text-teal-300 border border-teal-500/25">
                  <CheckCircle2 size={11} /> {consultations.length} Encounters Logged
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1 font-medium leading-relaxed">
                Official clinical encounter records for {patient.name} — including assigned attending physicians, diagnostic findings, examination notes, and e-Prescriptions.
              </p>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm h-9 px-4 text-xs font-bold flex items-center gap-1.5 shrink-0 rounded-xl hover:border-teal-500/40 hover:text-teal-600 transition-all"
            onClick={() => setActiveNav({ module: 'doctors', subModule: null })}
          >
            <Plus size={14} className="text-teal-600 dark:text-teal-400" />
            <span>Consult Another Specialist</span>
          </button>
        </div>

        {/* Primary Attending Specialist Banner */}
        <div className="bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-transparent border border-teal-500/25 rounded-2xl p-4 sm:p-5 flex justify-between items-center flex-wrap gap-4 shadow-xs">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="relative shrink-0">
              <img
                src={attendingDoctorObj.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
                alt={attendingDoctorObj.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shadow-xs"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-teal-600 text-white flex items-center justify-center border-2 border-bg-surface shadow-xs">
                <Stethoscope size={10} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  <UserCheck size={11} /> Primary Attending Physician
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                  ★ {attendingDoctorObj.patientRating || 4.9}
                  <span className="text-text-muted font-semibold text-[11px]">({attendingDoctorObj.successRate || 98.9}% Success)</span>
                </span>
              </div>
              <h4 className="text-base font-bold text-text-main mt-1">
                {attendingDoctorObj.name}
              </h4>
              <div className="text-xs text-text-muted mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="text-teal-600 dark:text-teal-400 font-bold">{attendingDoctorObj.specialty}</span>
                <span className="text-text-dim">•</span>
                <span>Room: <strong className="text-text-main">{attendingDoctorObj.room}</strong></span>
                <span className="text-text-dim">•</span>
                <span>Fee: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">₹{attendingDoctorObj.fee}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              className="btn btn-secondary min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2"
              onClick={() => openModal('doctorSlots', attendingDoctorObj)}
              title="View live slot calendar"
            >
              <Clock size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Slots</span>
            </button>
            <button
              className="btn btn-secondary min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2"
              onClick={() => openModal('doctorProfile', attendingDoctorObj)}
              title="View full doctor credentials"
            >
              <Eye size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Doctor Profile</span>
            </button>
            <button
              className="btn btn-primary min-h-[38px] px-4.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2"
              onClick={() => openModal('doctorConsult', attendingDoctorObj)}
            >
              <Stethoscope size={14} className="shrink-0" />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>

        {/* Chronological Encounters Timeline */}
        <div className="flex flex-col gap-4">
          {consultations.map((enc, idx) => {
            const matchedDoc = doctors.find(
              (d) => d.id === enc.doctorId || d.name.toLowerCase() === enc.doctorName?.toLowerCase()
            ) || attendingDoctorObj;

            return (
              <div
                key={idx}
                className="bg-bg-surface-elevated border border-border-subtle hover:border-teal-500/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xs hover:shadow-xs transition-all duration-200"
              >
                {/* Top Row: Doctor Info & Date */}
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <img
                      src={matchedDoc.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
                      alt={enc.doctorName}
                      className="w-11 h-11 rounded-xl object-cover border-1.5 border-teal-500/30 shrink-0 cursor-pointer hover:border-teal-500 transition-colors shadow-2xs"
                      onClick={() => openModal('doctorProfile', matchedDoc)}
                      title="Click to view doctor details"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className="text-sm sm:text-base font-bold text-text-main cursor-pointer hover:text-teal-600 transition-colors"
                          onClick={() => openModal('doctorProfile', matchedDoc)}
                        >
                          {enc.doctorName}
                        </h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                          {enc.specialty || matchedDoc.specialty}
                        </span>
                        <Badge variant={enc.status === 'Completed' ? 'emerald' : 'teal'} dot>
                          {enc.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-text-muted mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>Encounter: <strong className="font-mono text-teal-600 dark:text-teal-400">{enc.consultationId}</strong></span>
                        <span className="text-text-dim">•</span>
                        <span>Clinic: <strong className="text-text-main">{enc.room || matchedDoc.room}</strong></span>
                        <span className="text-text-dim">•</span>
                        <span>Type: <strong className="text-text-main">{enc.type}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs sm:text-sm font-bold text-text-main flex items-center sm:justify-end gap-1.5">
                      <Calendar size={13} className="text-teal-600 dark:text-teal-400" />
                      <span>{enc.date}</span>
                      <span className="text-text-dim">•</span>
                      <span>{enc.time || '10:00 AM'}</span>
                    </div>
                    {enc.vitalsAtConsult && (
                      <div className="text-[11px] font-mono text-text-dim mt-1 bg-bg-surface px-2 py-0.5 rounded-md border border-border-subtle inline-block">
                        Recorded: {enc.vitalsAtConsult}
                      </div>
                    )}
                  </div>
                </div>

                {/* Diagnosis & Clinical Impression */}
                <div className="bg-bg-surface p-4 rounded-xl border border-border-subtle border-l-4 border-l-teal-500">
                  <div className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FileText size={12} />
                    <span>Clinical Diagnosis & Findings</span>
                  </div>
                  <div className="text-sm font-bold text-text-main">
                    {enc.diagnosis}
                  </div>
                  {enc.clinicalNotes && (
                    <p className="text-xs text-text-muted mt-2 leading-relaxed font-normal bg-bg-surface-elevated/70 p-2.5 rounded-lg border border-border-subtle/50 italic">
                      "{enc.clinicalNotes}"
                    </p>
                  )}
                </div>

                {/* Prescriptions and Actions Footer */}
                <div className="flex justify-between items-center flex-wrap gap-3 border-t border-border-subtle pt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-text-dim font-bold flex items-center gap-1">
                      <Pill size={12} className="text-rose-500" />
                      <span>Prescribed:</span>
                    </span>
                    {enc.prescribedMeds && enc.prescribedMeds.length > 0 ? (
                      enc.prescribedMeds.map((med, mIdx) => (
                        <span
                          key={mIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                        >
                          💊 {med}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-text-dim">No active medicines prescribed</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      className="btn btn-secondary min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                      onClick={() => openModal('doctorSlots', matchedDoc)}
                      title="View time slots"
                    >
                      <Clock size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>Slots</span>
                    </button>
                    <button
                      className="btn btn-secondary min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                      onClick={() => openModal('doctorProfile', matchedDoc)}
                      title="View doctor profile"
                    >
                      <Eye size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>Doctor</span>
                    </button>
                    <button
                      className="btn btn-primary min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                      onClick={() => openModal('doctorConsult', matchedDoc)}
                      title="Initiate re-consultation"
                    >
                      <Stethoscope size={13} className="shrink-0" />
                      <span>Re-Consult</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6. TWO-COLUMN SPLIT: MEDICAL CONDITIONS, INSURANCE & DIAGNOSTICS ── */}
      <div className="responsive-grid-split">
        {/* Left Column: Active Diagnoses & Insurance */}
        <div className="flex flex-col gap-5">
          {/* Active Chronic Diagnoses */}
          <div className="glass-card rounded-2xl bg-bg-surface border border-border-subtle p-5 shadow-xs flex flex-col gap-3">
            <h4 className="text-sm sm:text-base font-semibold text-text-main flex items-center gap-2">
              <Activity size={17} className="text-teal-600" /> Active Chronic Conditions & Diagnoses
            </h4>
            <div className="flex flex-col gap-2">
              {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                patient.chronicConditions.map((cond, i) => (
                  <div
                    key={i}
                    className="bg-bg-surface-elevated py-2.5 px-3.5 rounded-lg flex justify-between items-center border border-border-subtle"
                  >
                    <span className="text-xs sm:text-sm font-bold text-text-main">{cond}</span>
                    <span className="badge badge-teal text-xs font-bold py-0.5 px-2">Active Care</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-dim">No chronic conditions recorded.</p>
              )}
            </div>
          </div>

          {/* Cashless Insurance & TPA */}
          <div className="glass-card rounded-2xl bg-bg-surface border border-border-subtle p-5 shadow-xs flex flex-col gap-3">
            <h4 className="text-sm sm:text-base font-semibold text-text-main flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-600" /> Health Insurance & Cashless TPA
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-bg-surface-elevated p-4 rounded-xl text-xs gap-3.5 border border-border-subtle">
              <div>
                <span className="text-text-dim font-medium">Insurance Provider:</span>
                <div className="font-bold text-text-main text-sm mt-0.5">
                  {patient.insurance?.provider || 'Self-Pay (Cash)'}
                </div>
              </div>
              <div>
                <span className="text-text-dim font-medium">Policy Number:</span>
                <div className="mono font-bold text-teal-600 dark:text-teal-400 text-sm mt-0.5">
                  {patient.insurance?.policyNo || 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-text-dim font-medium">Approved Coverage:</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  {patient.insurance?.coverage || '₹0'}
                </div>
              </div>
              <div>
                <span className="text-text-dim font-medium">TPA Claim Desk:</span>
                <div className="font-bold text-text-main text-sm mt-0.5">
                  {patient.insurance?.tpa || 'Direct Cashless'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prescriptions, Lab Reports, Radiology */}
        <div className="flex flex-col gap-5">
          {/* Active Prescriptions */}
          <div className="glass-card rounded-2xl bg-bg-surface border border-border-subtle p-5 shadow-xs flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2.5">
              <h4 className="text-sm sm:text-base font-semibold text-text-main flex items-center gap-2">
                <Pill size={17} className="text-teal-600" /> Prescriptions & Medications ({patientPrescriptions.length})
              </h4>
              <button
                className="btn btn-primary btn-sm h-8 px-3 text-xs font-bold"
                onClick={() => setActiveNav({ module: 'opd', subModule: 'consultation' })}
              >
                + Write Rx
              </button>
            </div>
            {patientPrescriptions.length === 0 ? (
              <p className="text-xs text-text-dim">No active prescriptions recorded.</p>
            ) : (
              patientPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  onClick={() => openModal('prescription', rx)}
                  className="bg-bg-surface-elevated p-3 rounded-xl cursor-pointer flex items-center justify-between border border-border-subtle glass-card-interactive hover:border-teal-500/40"
                  title="Click to view & print prescription"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400">
                      {rx.id} • {rx.diagnosis}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">
                      By {rx.doctorName} • {rx.date}
                    </div>
                  </div>
                  <button className="btn btn-secondary min-h-[36px] px-3.5 py-1.5 text-xs font-semibold shrink-0 rounded-xl flex items-center gap-1.5">
                    <Printer size={13} className="shrink-0" />
                    <span>Slip</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Diagnostic Laboratory Orders */}
          <div className="glass-card rounded-2xl bg-bg-surface border border-border-subtle p-5 shadow-xs flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2.5">
              <h4 className="text-sm sm:text-base font-semibold text-text-main flex items-center gap-2">
                <Activity size={17} className="text-indigo-600" /> Lab Tests & Pathology ({patientLabOrders.length})
              </h4>
              <button
                className="btn btn-secondary btn-sm h-8 px-3 text-xs font-bold"
                onClick={() => setActiveNav({ module: 'laboratory', subModule: null })}
              >
                Order Test
              </button>
            </div>
            {patientLabOrders.length === 0 ? (
              <p className="text-xs text-text-dim">No laboratory tests ordered for this patient.</p>
            ) : (
              patientLabOrders.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => openModal('lab', lab)}
                  className="bg-bg-surface-elevated p-3 rounded-xl cursor-pointer flex items-center justify-between border border-border-subtle glass-card-interactive hover:border-indigo-500/40"
                  title="Click to view lab report"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {lab.testName}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">Barcode: {lab.barcode}</div>
                  </div>
                  <Badge variant="emerald" size="sm">Report Ready</Badge>
                </div>
              ))
            )}
          </div>

          {/* Radiology Imaging */}
          <div className="glass-card rounded-2xl bg-bg-surface border border-border-subtle p-5 shadow-xs flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2.5">
              <h4 className="text-sm sm:text-base font-semibold text-text-main flex items-center gap-2">
                <FileText size={17} className="text-cyan-600" /> Radiology Scans & Imaging ({patientRadiology.length})
              </h4>
              <button
                className="btn btn-secondary btn-sm h-8 px-3 text-xs font-bold"
                onClick={() => setActiveNav({ module: 'radiology', subModule: null })}
              >
                View PACS
              </button>
            </div>
            {patientRadiology.length === 0 ? (
              <p className="text-xs text-text-dim">No radiology scans on file.</p>
            ) : (
              patientRadiology.map((rad) => (
                <div
                  key={rad.id}
                  onClick={() => openModal('radiology', rad)}
                  className="bg-bg-surface-elevated p-3 rounded-xl cursor-pointer flex items-center justify-between border border-border-subtle glass-card-interactive hover:border-cyan-500/40"
                  title="Click to view scan"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400">
                      {rad.modality} • {rad.bodyPart}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">Ordered by: {rad.orderedBy}</div>
                  </div>
                  <button className="btn btn-secondary min-h-[36px] px-3.5 py-1.5 text-xs font-semibold shrink-0 rounded-xl">
                    View Scan
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── 7. QUICK INTAKE PATIENT MODAL (EASY TO ADD PATIENT) ── */}
      {/* ── 7. QUICK INTAKE PATIENT MODAL (EASY TO ADD PATIENT) ── */}
      {isQuickAddOpen && (
        <div className="patient-quick-modal-backdrop" onClick={() => setIsQuickAddOpen(false)}>
          <div className="patient-quick-modal-card max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-border-subtle flex items-center justify-between bg-bg-surface-elevated">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-text-main font-display">
                    Quick Patient Intake & Registration
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">
                    Fast registration adds patient, medical baseline, and sets active EHR record.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="w-9 h-9 rounded-full bg-bg-surface flex items-center justify-center text-text-muted hover:text-text-main border border-border-subtle hover:border-border-strong transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleQuickAddSubmit} className="px-6 sm:px-8 py-6 overflow-y-auto max-h-[75vh] flex flex-col gap-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Sharma"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.name}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98490 12345"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.phone}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Age (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 38"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.age}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Gender
                  </label>
                  <select
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.gender}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Blood Group
                  </label>
                  <select
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-bold"
                    value={newPatientForm.bloodGroup}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, bloodGroup: e.target.value })}
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Patient Admission Status
                  </label>
                  <select
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.status}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, status: e.target.value })}
                  >
                    <option value="Outpatient">Outpatient (OPD)</option>
                    <option value="Inpatient">Inpatient (IPD Ward)</option>
                    <option value="ICU">Intensive Care (ICU)</option>
                    <option value="Emergency">Emergency Bay (ER)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Attending Specialist
                  </label>
                  <select
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.attendingDoctor}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, attendingDoctor: e.target.value })}
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Blood Pressure (BP)
                  </label>
                  <input
                    type="text"
                    placeholder="120/80 mmHg"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.bp}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, bp: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Pulse / Heart Rate
                  </label>
                  <input
                    type="text"
                    placeholder="72 bpm"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.pulse}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, pulse: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Oxygen SpO2
                  </label>
                  <input
                    type="text"
                    placeholder="99%"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.spo2}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, spo2: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Known Allergies (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa drugs, Peanuts, None known"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.allergies}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, allergies: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Chronic Conditions / Reason for Visit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Type 2 Diabetes, Mild Hypertension, None reported"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={newPatientForm.chronicConditions}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, chronicConditions: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-1">
                <button
                  type="button"
                  className="btn btn-secondary h-11 px-6 rounded-xl font-bold text-xs sm:text-sm cursor-pointer"
                  onClick={() => setIsQuickAddOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-11 px-7 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Check size={16} /> Save & Open Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 8. QUICK VITALS RECORDER MODAL ── */}
      {isVitalsModalOpen && (
        <div className="patient-quick-modal-backdrop" onClick={() => setIsVitalsModalOpen(false)}>
          <div className="patient-quick-modal-card max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-border-subtle flex items-center justify-between bg-bg-surface-elevated">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-text-main font-display">
                    Record Patient Vitals
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">
                    Logging new clinical vitals for {patient.name} ({patient.mrn})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVitalsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-bg-surface flex items-center justify-center text-text-muted hover:text-text-main border border-border-subtle hover:border-border-strong transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleVitalsSubmit} className="px-6 sm:px-8 py-6 overflow-y-auto max-h-[75vh] flex flex-col gap-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={vitalForm.systolic}
                    onChange={(e) => setVitalForm({ ...vitalForm, systolic: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={vitalForm.diastolic}
                    onChange={(e) => setVitalForm({ ...vitalForm, diastolic: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Pulse Rate (bpm)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={vitalForm.pulse}
                    onChange={(e) => setVitalForm({ ...vitalForm, pulse: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={vitalForm.spo2}
                    onChange={(e) => setVitalForm({ ...vitalForm, spo2: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={vitalForm.temp}
                    onChange={(e) => setVitalForm({ ...vitalForm, temp: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={vitalForm.bloodSugar}
                    onChange={(e) => setVitalForm({ ...vitalForm, bloodSugar: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={vitalForm.weight}
                    onChange={(e) => setVitalForm({ ...vitalForm, weight: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Clinical Examination Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Patient stable, vitals within normal clinical limits"
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={vitalForm.notes}
                    onChange={(e) => setVitalForm({ ...vitalForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-1">
                <button
                  type="button"
                  className="btn btn-secondary h-11 px-6 rounded-xl font-bold text-xs sm:text-sm cursor-pointer"
                  onClick={() => setIsVitalsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-11 px-7 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Check size={16} /> Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
