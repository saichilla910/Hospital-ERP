import React, { useState } from 'react';
import {
  History,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Syringe,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Stethoscope,
  User,
  Eye,
  Search,
  X,
  Building2,
  MapPin,
  Pill,
  Trash2,
  Filter,
  FileText,
  Activity,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const MedicalHistory = () => {
  const {
    selectedPatient,
    setSelectedPatient,
    patients = [],
    doctors = [],
    showToast,
    userRole,
    authenticatedPatient,
    openModal,
    addPatientMedicalEvent,
    deletePatientMedicalEvent
  } = useHospital();

  const patient = (userRole === 'patient' && authenticatedPatient) ? authenticatedPatient : (selectedPatient || patients[0]);

  // UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [patientSearch, setPatientSearch] = useState('');

  // Form State for New Medical Event
  const [formData, setFormData] = useState({
    type: 'Doctor Consultation',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    doctorName: doctors[0]?.name || 'Dr. Ananya Mukherjee',
    doctorId: doctors[0]?.id || 'DOC-102',
    department: doctors[0]?.department || 'Cardiology',
    diagnosis: '',
    desc: '',
    prescribedMeds: '',
    facility: 'MediCore Hospital - OPD Block A',
    severity: 'Normal'
  });

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const matchedDoc = doctors.find((d) => d.id === docId);
    if (matchedDoc) {
      setFormData((prev) => ({
        ...prev,
        doctorId: matchedDoc.id,
        doctorName: matchedDoc.name,
        department: matchedDoc.department
      }));
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter an event title.', 'error');
      return;
    }

    if (!patient?.id) {
      showToast('No active patient selected.', 'error');
      return;
    }

    const medsList = formData.prescribedMeds
      ? formData.prescribedMeds.split(',').map((m) => m.trim()).filter(Boolean)
      : [];

    addPatientMedicalEvent(patient.id, {
      type: formData.type,
      title: formData.title,
      date: formData.date,
      time: formData.time,
      doctorName: formData.doctorName,
      doctorId: formData.doctorId,
      department: formData.department,
      diagnosis: formData.diagnosis,
      desc: formData.desc || `Medical record filed under ${formData.department}. Diagnosis: ${formData.diagnosis || 'None specified'}`,
      prescribedMeds: medsList,
      facility: formData.facility,
      severity: formData.severity,
      status: 'Verified Clinical Record'
    });

    // Reset and close
    setFormData({
      type: 'Doctor Consultation',
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      doctorName: doctors[0]?.name || 'Dr. Ananya Mukherjee',
      doctorId: doctors[0]?.id || 'DOC-102',
      department: doctors[0]?.department || 'Cardiology',
      diagnosis: '',
      desc: '',
      prescribedMeds: '',
      facility: 'MediCore Hospital - OPD Block A',
      severity: 'Normal'
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteEvent = (e, evtId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this medical event from the patient record?')) {
      deletePatientMedicalEvent(patient.id, evtId);
    }
  };

  // 1. User-added custom events
  const customEvents = (patient.medicalEvents || []).map((evt) => {
    let icon = Stethoscope;
    let color = 'teal';

    if (evt.type.includes('Surgery') || evt.type.includes('Procedure')) {
      icon = Scissors;
      color = 'rose';
    } else if (evt.type.includes('Diagnosis') || evt.type.includes('Condition')) {
      icon = AlertTriangle;
      color = 'amber';
    } else if (evt.type.includes('Vaccin') || evt.type.includes('Immuniz')) {
      icon = Syringe;
      color = 'emerald';
    } else if (evt.type.includes('Admission') || evt.type.includes('Ward')) {
      icon = Building2;
      color = 'indigo';
    } else if (evt.type.includes('Emergency')) {
      icon = ShieldAlert;
      color = 'rose';
    } else if (evt.type.includes('Allergy')) {
      icon = ShieldCheck;
      color = 'amber';
    } else if (evt.type.includes('Checkup')) {
      icon = CheckCircle2;
      color = 'cyan';
    }

    const matchedDoc = doctors.find((d) => d.id === evt.doctorId || d.name === evt.doctorName);

    return {
      ...evt,
      icon,
      color,
      isCustom: true,
      doctorObj: matchedDoc
    };
  });

  // 2. Real consultation encounters
  const consultationEncounters = (patient.consultationsHistory || []).map((enc, idx) => {
    const matchedDoc = doctors.find((d) => d.id === enc.doctorId || d.name.toLowerCase() === enc.doctorName?.toLowerCase()) || doctors[0];
    return {
      id: enc.consultationId || `CONS-${idx}`,
      date: enc.date,
      time: enc.time || '10:00 AM',
      type: 'Doctor Consultation',
      title: `Specialist Consult: ${enc.doctorName} (${enc.specialty || matchedDoc.specialty})`,
      desc: `Diagnosis: ${enc.diagnosis}. Clinical Impression: "${enc.clinicalNotes}". Prescriptions issued: ${enc.prescribedMeds?.length > 0 ? enc.prescribedMeds.join(', ') : 'None'}. Follow-up: ${enc.followUp}`,
      diagnosis: enc.diagnosis,
      doctorName: enc.doctorName,
      department: enc.department || matchedDoc.department,
      prescribedMeds: enc.prescribedMeds || [],
      facility: enc.room || 'OPD Clinic',
      icon: Stethoscope,
      color: 'teal',
      doctorObj: matchedDoc,
      status: 'Verified Clinical Record'
    };
  });

  // 3. Baseline intake & chronic health records
  const baselineEvents = [
    {
      id: 'BASE-EMR-01',
      date: patient.registeredDate || '2026-03-15',
      time: '09:00 AM',
      type: 'Registration & Intake',
      title: 'Electronic Health Record (EHR) Initialized',
      desc: `Patient onboarding completed with MediCore Hospital (MRN: ${patient.mrn}). Baseline vitals recorded: BP ${patient.vitals?.bp || '120/80 mmHg'}, Pulse ${patient.vitals?.pulse || '72 bpm'}, SpO2 ${patient.vitals?.spo2 || '98%'}. Attending Physician: ${patient.attendingDoctor}.`,
      facility: 'MediCore Central Registration Desk',
      doctorName: patient.attendingDoctor || 'Dr. Arvind Swaminathan',
      icon: History,
      color: 'teal',
      status: 'Verified Clinical Record'
    },
    ...(patient.chronicConditions && patient.chronicConditions[0] !== 'None reported' ? [
      {
        id: 'BASE-COND-01',
        date: '2025-10-10',
        time: '11:30 AM',
        type: 'Diagnosis',
        title: `Clinical Diagnosis: ${patient.chronicConditions.join(', ')}`,
        desc: `Verified chronic medical conditions recorded under attending physician ${patient.attendingDoctor}. Active medical management plan initiated.`,
        diagnosis: patient.chronicConditions.join(', '),
        facility: 'Outpatient Specialty Clinic',
        doctorName: patient.attendingDoctor,
        icon: AlertTriangle,
        color: 'amber',
        status: 'Active Chronic Care'
      }
    ] : []),
    ...(patient.allergies && patient.allergies[0] !== 'None known' ? [
      {
        id: 'BASE-ALLERGY-01',
        date: '2025-05-18',
        time: '02:15 PM',
        type: 'Allergy Record',
        title: `Allergy Flag: ${patient.allergies.join(', ')}`,
        desc: 'Special clinical vigilance alert enabled across hospital pharmacy dispensing and inpatient orders.',
        facility: 'MediCore Clinical Safety Desk',
        icon: ShieldAlert,
        color: 'rose',
        status: 'High Vigilance Alert'
      }
    ] : []),
    {
      id: 'BASE-VAX-01',
      date: '2025-06-14',
      time: '10:45 AM',
      type: 'Vaccination',
      title: 'Annual Preventive Immunization',
      desc: 'Routine yearly booster vaccine administered at the hospital wellness desk.',
      facility: 'Preventive Healthcare Desk',
      icon: Syringe,
      color: 'emerald',
      status: 'Verified Immunization'
    },
    {
      id: 'BASE-CHK-01',
      date: '2024-02-12',
      time: '08:30 AM',
      type: 'Health Checkup',
      title: 'Annual Executive Health Screening',
      desc: 'Comprehensive metabolic panel, 12-lead ECG, chest radiograph, and clinical review completed.',
      facility: 'Executive Health Screening Suite',
      icon: CheckCircle2,
      color: 'cyan',
      status: 'Verified Screening'
    }
  ];

  // Combine all events and sort by date descending
  const allEvents = [...customEvents, ...consultationEncounters, ...baselineEvents].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Filter & Search Logic
  const filteredEvents = allEvents.filter((evt) => {
    const matchesSearch =
      (evt.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.desc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.type || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'All') return true;
    if (filterType === 'Consultations') return evt.type.includes('Consult');
    if (filterType === 'Surgeries') return evt.type.includes('Surgery') || evt.type.includes('Procedure');
    if (filterType === 'Diagnoses') return evt.type.includes('Diagnosis') || evt.type.includes('Condition');
    if (filterType === 'Vaccinations') return evt.type.includes('Vaccin') || evt.type.includes('Immuniz');
    if (filterType === 'Admissions') return evt.type.includes('Admission') || evt.type.includes('Emergency') || evt.type.includes('Intake');
    if (filterType === 'UserAdded') return evt.isCustom === true;

    return true;
  });

  const filteredPatientList = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.mrn.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. PATIENT SWITCHER BAR ── */}
      {userRole === 'staff' && (
        <div className="patient-switcher-bar flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-xs font-bold text-text-dim px-2 shrink-0">Switch Patient:</span>
            {filteredPatientList.map((p) => {
              const isActive = p.id === patient.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`patient-pill-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                      : 'bg-bg-surface-elevated text-text-muted hover:text-text-main border border-border-subtle'
                  }`}
                >
                  <img
                    src={p.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{p.name.split(' ')[0]}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-bg-surface text-text-dim'}`}>
                    {p.mrn}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Find patient..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="h-8 px-2.5 text-xs rounded-lg bg-bg-surface-elevated border border-border-subtle text-text-main outline-none w-32 focus:w-44 transition-all"
            />
          </div>
        </div>
      )}

      {/* ── 2. PATIENT EMR HEADER CARD ── */}
      <div className="glass-card rounded-2xl p-5 bg-bg-surface border border-border-subtle shadow-xs flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img
            src={patient.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={patient.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-text-main font-display tracking-tight">
                {patient.name}
              </h2>
              <span className="mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25">
                {patient.mrn}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                Blood: {patient.bloodGroup || 'O+'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-text-muted mt-1.5 flex-wrap">
              <span>{patient.age} Yrs • {patient.gender}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold">
                <Stethoscope size={13} /> {patient.attendingDoctor || 'Dr. Ananya Mukherjee'}
              </span>
              <span>•</span>
              <span>Total History Records: <strong className="text-text-main">{allEvents.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Button to Open Add Medical Event Modal */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            className="btn btn-primary h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-teal-600/20 cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Medical Event</span>
          </button>
        </div>
      </div>

      {/* ── 3. TIMELINE FILTER & SEARCH TOOLBAR ── */}
      <div className="flex justify-between items-center flex-wrap gap-3 p-3 rounded-2xl bg-bg-surface border border-border-subtle">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
          {[
            { key: 'All', label: `All Events (${allEvents.length})` },
            { key: 'Consultations', label: 'Consultations' },
            { key: 'Surgeries', label: 'Surgeries & Procedures' },
            { key: 'Diagnoses', label: 'Diagnoses' },
            { key: 'Vaccinations', label: 'Vaccinations' },
            { key: 'Admissions', label: 'Admissions & ER' },
            { key: 'UserAdded', label: `Logged Events (${customEvents.length})` }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterType(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterType === cat.key
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-bg-surface-elevated text-text-muted hover:text-text-main border border-border-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative flex-1 sm:w-64 max-w-xs min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            placeholder="Search events, diagnoses, doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-8 text-xs rounded-xl bg-bg-surface-elevated border border-border-subtle text-text-main outline-none focus:border-teal-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── 4. CHRONOLOGICAL MEDICAL TIMELINE ── */}
      <div className="glass-card p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-text-dim flex flex-col items-center gap-3">
            <History size={40} className="opacity-40" />
            <div className="text-sm font-bold text-text-main">No medical events found for this filter</div>
            <p className="text-xs text-text-muted max-w-sm">
              Try changing your search term or category filter, or click "Add Medical Event" to record a new clinical entry.
            </p>
            <button
              onClick={() => {
                setFilterType('All');
                setSearchTerm('');
              }}
              className="btn btn-secondary btn-sm text-xs font-bold rounded-xl mt-1"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative pl-7 sm:pl-9">
            {/* Vertical Timeline Rule */}
            <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-border-subtle" />

            <div className="flex flex-col gap-6">
              {filteredEvents.map((evt) => {
                const Icon = evt.icon || Stethoscope;

                const getColorClasses = (color) => {
                  switch (color) {
                    case 'teal':
                      return { bg: 'bg-teal-600', badge: 'badge-teal' };
                    case 'rose':
                      return { bg: 'bg-rose-600', badge: 'badge-rose' };
                    case 'amber':
                      return { bg: 'bg-amber-600', badge: 'badge-amber' };
                    case 'emerald':
                      return { bg: 'bg-emerald-600', badge: 'badge-emerald' };
                    case 'indigo':
                      return { bg: 'bg-indigo-600', badge: 'badge-blue' };
                    default:
                      return { bg: 'bg-cyan-600', badge: 'badge-teal' };
                  }
                };

                const { bg, badge } = getColorClasses(evt.color);

                return (
                  <div key={evt.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-7 sm:-left-9 top-1.5 w-7 h-7 rounded-full ${bg} flex items-center justify-center text-white shadow-md z-10 transition-transform group-hover:scale-110`}
                    >
                      <Icon size={14} />
                    </div>

                    {/* Timeline Event Card */}
                    <div
                      className="bg-bg-surface-elevated border border-border-subtle rounded-2xl p-4 sm:p-5 hover:border-teal-500/50 transition-all cursor-pointer shadow-xs flex flex-col gap-3"
                      onClick={() => setSelectedEventDetail(evt)}
                    >
                      {/* Top Row: Title, Date & Severity */}
                      <div className="flex justify-between items-start flex-wrap gap-2.5">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-semibold text-text-main group-hover:text-teal-600 transition-colors">
                              {evt.title}
                            </h4>
                            <span className={`badge ${badge} text-[11px] font-medium py-0.5 px-2`}>
                              {evt.type}
                            </span>
                            {evt.isCustom && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/25">
                                Logged Event
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-text-muted mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-text-dim" /> {evt.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="text-text-dim" /> {evt.time || '10:00 AM'}
                            </span>
                            {evt.facility && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} className="text-text-dim" /> {evt.facility}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Event Right Actions */}
                        <div className="flex items-center gap-2">
                          <span className="mono text-xs bg-bg-surface py-1 px-2.5 rounded-lg text-teal-600 dark:text-teal-400 font-bold border border-border-subtle">
                            {evt.date}
                          </span>
                          {evt.isCustom && (
                            <button
                              onClick={(e) => handleDeleteEvent(e, evt.id)}
                              className="w-7 h-7 rounded-lg bg-bg-surface hover:bg-rose-500/10 text-text-dim hover:text-rose-500 border border-border-subtle flex items-center justify-center transition-colors"
                              title="Delete this medical event"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Event Description / Clinical Notes */}
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                        {evt.desc}
                      </p>

                      {/* Diagnosis & Prescriptions if available */}
                      {(evt.diagnosis || (evt.prescribedMeds && evt.prescribedMeds.length > 0)) && (
                        <div className="bg-bg-surface p-3 rounded-xl border border-border-subtle flex flex-col gap-2 text-xs">
                          {evt.diagnosis && (
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-teal-600 dark:text-teal-400">Diagnosis:</span>
                              <span className="font-medium text-text-main">{evt.diagnosis}</span>
                            </div>
                          )}

                          {evt.prescribedMeds && evt.prescribedMeds.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border-subtle">
                              <span className="font-bold text-text-dim flex items-center gap-1">
                                <Pill size={12} /> Medications:
                              </span>
                              {evt.prescribedMeds.map((med, mIdx) => (
                                <span key={mIdx} className="badge badge-gray text-[11px] py-0.5 px-2">
                                  {med}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bottom Row: Doctor & Actions */}
                      <div className="flex justify-between items-center pt-2 border-t border-border-subtle flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-text-dim">Attending:</span>
                          <strong className="text-text-main">{evt.doctorName || 'Hospital Specialist'}</strong>
                          {evt.department && (
                            <span className="text-text-dim">({evt.department})</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {evt.doctorObj && (
                            <button
                              className="btn btn-secondary min-h-[34px] px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal('doctorProfile', evt.doctorObj);
                              }}
                            >
                              <Eye size={13} className="shrink-0" />
                              <span>Doctor</span>
                            </button>
                          )}
                          <button
                            className="btn btn-secondary min-h-[34px] px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventDetail(evt);
                            }}
                          >
                            <span>Inspect Record</span>
                            <ChevronRight size={13} className="shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. ADD MEDICAL EVENT MODAL (INTERACTIVE & SAVES TO CONTEXT) ── */}
      {isAddModalOpen && (
        <div className="patient-quick-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="patient-quick-modal-card max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-border-subtle flex justify-between items-center bg-bg-surface-elevated">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-text-main font-display">
                    Add Medical Event to Patient History
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-normal">
                    Recording for <strong className="text-text-main font-semibold">{patient.name}</strong> ({patient.mrn})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-main hover:border-border-strong cursor-pointer transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateEvent} className="px-6 sm:px-8 py-6 overflow-y-auto max-h-[75vh] flex flex-col gap-5 text-xs sm:text-sm">
              {/* Event Type & Category Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface-elevated/70 border border-border-subtle flex flex-col gap-4">
                <div>
                  <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                    Event Category / Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main font-bold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                  >
                    <option value="Doctor Consultation">🩺 Doctor Consultation / OPD Visit</option>
                    <option value="Surgery & Surgical Procedure">✂️ Surgery / Operation / OT Procedure</option>
                    <option value="Clinical Diagnosis & Condition">⚠️ Clinical Diagnosis / Chronic Condition</option>
                    <option value="Immunization & Vaccine">💉 Immunization / Vaccine Booster</option>
                    <option value="Inpatient Admission & Ward">🏥 Inpatient Admission / Ward Stay</option>
                    <option value="Emergency & Trauma Visit">🚨 Emergency & Trauma Encounter</option>
                    <option value="Allergy & Adverse Reaction">🛡️ Allergy & Adverse Reaction Flag</option>
                    <option value="Health Checkup & Screening">✅ Health Checkup / Executive Screening</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                    Event Title / Procedure Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Laparoscopic Appendectomy, Annual Cardiac Check, Typhoid Booster"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Date, Time, Doctor & Department Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface-elevated/70 border border-border-subtle flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                      Date of Event <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                      Time / Shift
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:30 AM or Morning Ward Rounds"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                      Attending Physician / Specialist
                    </label>
                    <select
                      value={formData.doctorId}
                      onChange={handleDoctorChange}
                      className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                    >
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                      Clinical Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis, Facility & Clinical Notes Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface-elevated/70 border border-border-subtle flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                      Diagnosis / Primary Finding
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acute Appendicitis, Essential HTN"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                      Hospital Facility / Room / OT
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OT Block 2, ICU Bed 04, OPD Cabin 302"
                      value={formData.facility}
                      onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                    Clinical Impression & Summary Notes <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter detailed clinical impressions, surgical findings, immunization batch numbers, or post-operative recovery instructions..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">
                    Prescribed Medications (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tab. Cefixime 200mg BD, Tab. Pantoprazole 40mg OD, Paracetamol 650mg SOS"
                    value={formData.prescribedMeds}
                    onChange={(e) => setFormData({ ...formData, prescribedMeds: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-bg-surface border border-border-subtle text-text-main outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Form Footer Actions */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-border-subtle mt-1">
                <button
                  type="button"
                  className="btn btn-secondary h-11 px-6 rounded-xl font-bold cursor-pointer text-xs sm:text-sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-11 px-7 rounded-xl font-bold shadow-md shadow-teal-600/30 cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Plus size={16} />
                  <span>Save Medical Event to EMR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 6. EVENT DETAIL MODAL (INSPECT RECORD) ── */}
      {selectedEventDetail && (
        <div className="patient-quick-modal-backdrop" onClick={() => setSelectedEventDetail(null)}>
          <div
            className="patient-quick-modal-card max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-border-subtle flex justify-between items-center bg-bg-surface-elevated">
              <div>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {selectedEventDetail.type}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-text-main font-display mt-0.5">
                  {selectedEventDetail.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEventDetail(null)}
                className="w-9 h-9 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer hover:border-border-strong transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 sm:px-8 py-6 flex flex-col gap-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4.5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                <div>
                  <span className="text-text-dim text-xs block mb-1">Event Date & Time:</span>
                  <strong className="text-text-main text-sm">
                    {selectedEventDetail.date} • {selectedEventDetail.time || '10:00 AM'}
                  </strong>
                </div>

                <div>
                  <span className="text-text-dim text-xs block mb-1">Attending Specialist:</span>
                  <strong className="text-text-main text-sm">
                    {selectedEventDetail.doctorName || 'Hospital Specialist'}
                  </strong>
                </div>

                {selectedEventDetail.department && (
                  <div>
                    <span className="text-text-dim text-xs block mb-1">Department:</span>
                    <strong className="text-text-main text-sm">{selectedEventDetail.department}</strong>
                  </div>
                )}

                {selectedEventDetail.facility && (
                  <div>
                    <span className="text-text-dim text-xs block mb-1">Facility Location:</span>
                    <strong className="text-text-main text-sm">{selectedEventDetail.facility}</strong>
                  </div>
                )}
              </div>

              <div>
                <span className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">Clinical Record & Impression:</span>
                <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle text-text-muted leading-relaxed text-xs sm:text-sm">
                  {selectedEventDetail.desc}
                </div>
              </div>

              {selectedEventDetail.diagnosis && (
                <div>
                  <span className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">Diagnosis:</span>
                  <div className="p-3 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/20 text-xs sm:text-sm">
                    {selectedEventDetail.diagnosis}
                  </div>
                </div>
              )}

              {selectedEventDetail.prescribedMeds && selectedEventDetail.prescribedMeds.length > 0 && (
                <div>
                  <span className="font-bold text-text-main block mb-2 text-xs uppercase tracking-wider">Prescribed Medications:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedEventDetail.prescribedMeds.map((med, i) => (
                      <span key={i} className="badge badge-gray text-xs py-1.5 px-3 font-bold rounded-lg">
                        💊 {med}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
                <button
                  className="btn btn-secondary h-10 px-5 text-xs sm:text-sm font-bold rounded-xl"
                  onClick={() => setSelectedEventDetail(null)}
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
