import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Award,
  GraduationCap,
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  X,
  Languages,
  MessageSquare,
  Calendar,
  Sparkles,
  Check,
  TrendingUp,
  BadgeCheck,
  User,
  Video
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const DoctorProfileModal = ({ isOpen, onClose, doctor }) => {
  const {
    patients,
    selectedPatient,
    userRole,
    authenticatedPatient,
    bookDoctorConsultation,
    setActiveNav,
    showToast,
    activeModal
  } = useHospital();

  const activePatient = (userRole === 'patient' && authenticatedPatient)
    ? authenticatedPatient
    : (selectedPatient || patients?.[0]);

  const [selectedPatientId, setSelectedPatientId] = useState(activePatient?.id || patients?.[0]?.id);
  const [consultType, setConsultType] = useState('In-Person OPD Clinic');
  const [slotTime, setSlotTime] = useState('11:30 AM (Next Available)');
  const [consultReason, setConsultReason] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      if (activeModal?.type === 'doctorConsult') {
        setActiveTab('book');
      } else {
        setActiveTab('overview');
      }
    }
  }, [isOpen, activeModal?.type, doctor?.id]);

  if (!isOpen || !doctor) return null;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === selectedPatientId) || activePatient;
    bookDoctorConsultation({
      doctor,
      patient: pat,
      appointmentTime: slotTime,
      consultType,
      reason: consultReason || `Consultation with ${doctor.name} (${doctor.specialty})`
    });
    showToast(`Appointment confirmed with ${doctor.name} for ${pat.name}!`, 'success');
    onClose();
    if (userRole === 'patient') {
      setActiveNav({ module: 'patientManagement', subModule: 'profile' });
    } else {
      setActiveNav({ module: 'opd', subModule: 'appointments' });
    }
  };

  const tabs = [
    { id: 'overview',  label: 'Overview',                                         icon: Activity },
    { id: 'education', label: 'Education & Credentials',                           icon: GraduationCap },
    { id: 'reviews',   label: `Reviews (${doctor.patientReviews?.length || 2})`,  icon: MessageSquare },
    { id: 'book',      label: 'Book Appointment',                                 icon: Calendar },
  ];

  return (
    <div
      className="doc-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="doc-modal-frame">

        {/* ── BESPOKE HERO BANNER ── */}
        <div className="doc-modal-hero">

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="doc-modal-close"
          >
            <X size={16} />
          </button>

          <div className="doc-hero-body">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={doctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
                alt={doctor.name}
                className="doc-hero-avatar"
              />
              <div
                className="doc-avatar-emblem"
                title="NABH / NMC Certified Specialist"
              >
                <Stethoscope size={12} />
              </div>
            </div>

            {/* Info */}
            <div className="doc-hero-info">
              <div className="doc-hero-title-row">
                <h2 className="doc-hero-name">
                  {doctor.name}
                </h2>
                {doctor.availableNow ? (
                  <span className="doc-badge-pill doc-badge-available">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available for Consult
                  </span>
                ) : (
                  <span className="doc-badge-pill doc-badge-busy">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {doctor.status || 'On Duty'}
                  </span>
                )}
              </div>

              <div className="doc-hero-specialty">
                {doctor.specialty} <span className="text-text-dim font-normal">· {doctor.department}</span>
              </div>

              {/* Clean single metadata line */}
              <div className="doc-hero-summary-line">
                <span>{doctor.experience} experience</span>
                <span className="text-text-dim">•</span>
                <span>Room <strong>{doctor.room}</strong></span>
                <span className="text-text-dim">•</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={12} className="fill-amber-500" />
                  {doctor.patientRating || 4.9}
                  <span className="font-normal text-text-muted">({doctor.reviewCount || 350}+ reviews)</span>
                </span>
                <span className="text-text-dim">•</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{doctor.fee}
                </span>
              </div>
            </div>
          </div>

          {/* Segmented Tab Bar */}
          <div className="doc-segmented-nav">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`doc-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MODAL SCROLL CONTENT ── */}
        <div className="doc-modal-content">

          {/* ════════ TAB 1: OVERVIEW ════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">

              {/* 4 Scorecard Metrics */}
              <div className="doc-scorecard-strip">
                <div className="doc-scorecard-col">
                  <span className="doc-scorecard-title">Clinical Success</span>
                  <span className="doc-scorecard-num text-emerald-600 dark:text-emerald-400">
                    {doctor.successRate || 99.2}%
                  </span>
                  <span className="doc-scorecard-sub">NABH Benchmark</span>
                </div>

                <div className="doc-scorecard-col">
                  <span className="doc-scorecard-title">Surgeries</span>
                  <span className="doc-scorecard-num text-text-main">
                    {doctor.totalSurgeries !== undefined ? doctor.totalSurgeries.toLocaleString() : '3,420+'}
                  </span>
                  <span className="doc-scorecard-sub">OT Register</span>
                </div>

                <div className="doc-scorecard-col">
                  <span className="doc-scorecard-title">Complication-Free</span>
                  <span className="doc-scorecard-num text-teal-600 dark:text-teal-400">
                    {doctor.successfulSurgeries !== undefined ? doctor.successfulSurgeries.toLocaleString() : '3,380+'}
                  </span>
                  <span className="doc-scorecard-sub">Optimal Recovery</span>
                </div>

                <div className="doc-scorecard-col">
                  <span className="doc-scorecard-title">Consultations</span>
                  <span className="doc-scorecard-num text-text-main">
                    {doctor.totalConsultations ? doctor.totalConsultations.toLocaleString() : '15,000+'}
                  </span>
                  <span className="doc-scorecard-sub">OPD & Inpatient</span>
                </div>
              </div>

              {/* About Specialist */}
              <div className="doc-section-block">
                <div className="doc-section-heading">About the Specialist</div>
                <p className="doc-bio-text">
                  {doctor.about || 'Senior clinical specialist committed to patient safety, accurate diagnostic evaluation, precision procedures, and evidence-based recovery protocols.'}
                </p>
              </div>

              {/* Scope of Practice Tags */}
              <div className="doc-section-block">
                <div className="doc-section-heading">Clinical Scope & Conditions Treated</div>
                <div className="doc-scope-tags">
                  {(doctor.proceduresTreated || [
                    'Specialist Diagnosis & Management',
                    'Advanced Clinical Consultation',
                    'Preventive Protocols',
                    'Post-Operative Follow-up',
                    'Emergency Critical Care',
                    'Interventional Procedures'
                  ]).map((proc, i) => (
                    <span key={i} className="doc-tag-pill">
                      {proc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clinic Logistics (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 bg-bg-surface-elevated rounded-2xl border border-border-subtle space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    <Clock size={13} />
                    <span>Clinic Timings & OPD</span>
                  </div>
                  <div className="text-sm font-bold text-text-main">
                    {doctor.schedule?.timing || '09:00 AM – 01:00 PM & 04:00 PM – 07:30 PM'}
                  </div>
                  <div className="text-xs text-text-muted">
                    Average wait time: <strong className="text-teal-600 dark:text-teal-400">{doctor.avgWaitTime || '10–15 mins'}</strong>
                  </div>
                </div>

                <div className="p-4 bg-bg-surface-elevated rounded-2xl border border-border-subtle space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    <Languages size={13} />
                    <span>Languages & Insurance</span>
                  </div>
                  <div className="text-sm font-semibold text-text-main">
                    {(doctor.languages || ['English', 'Hindi', 'Telugu']).join(', ')}
                  </div>
                  <div className="text-xs text-text-muted">
                    Cashless: {(doctor.insuranceAccepted || ['Star Health', 'HDFC ERGO', 'Care Health']).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 2: EDUCATION ════════ */}
          {activeTab === 'education' && (
            <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">
              <div className="space-y-3">
                <div className="doc-section-heading">Academic Qualifications</div>
                <div className="space-y-2.5">
                  {(doctor.education || [
                    { degree: 'MBBS (Bachelor of Medicine & Surgery)', institution: 'All India Institute of Medical Sciences (AIIMS)', year: '2010' },
                    { degree: 'MD / MS Specialist Post-Graduate', institution: 'Postgraduate Institute of Medical Education & Research (PGIMER)', year: '2014' },
                    { degree: 'Fellowship / Sub-Specialty Board Certification', institution: 'Royal College of Physicians & Surgeons / National Board', year: '2017' }
                  ]).map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-bg-surface-elevated rounded-xl border border-border-subtle flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-sm font-bold text-text-main">{edu.degree}</div>
                        <div className="text-xs text-text-muted">{edu.institution}</div>
                      </div>
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-bg-surface py-1 px-3 rounded-full border border-border-subtle shrink-0">
                        {edu.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 bg-bg-surface-elevated rounded-2xl border border-border-subtle space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    <BadgeCheck size={14} />
                    <span>NMC Registration</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-text-main">
                    {doctor.councilRegNo || 'MCI-TS-44120'}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Active with National Medical Commission
                  </div>
                </div>

                <div className="p-4 bg-bg-surface-elevated rounded-2xl border border-border-subtle space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
                    <Award size={14} />
                    <span>Certifications & Fellowships</span>
                  </div>
                  <ul className="text-xs text-text-muted space-y-1 list-disc pl-4 font-medium">
                    <li>Fellow of the National Board (FNB)</li>
                    <li>Advanced Cardiac Life Support (ACLS)</li>
                    <li>NABH Clinical Assessor & Quality Auditor</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 3: REVIEWS ════════ */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
              <div className="p-4 bg-bg-surface-elevated rounded-2xl border border-border-subtle flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-semibold text-text-main flex items-center gap-1.5">
                    <Star size={20} className="fill-amber-500 text-amber-500" />
                    <span>{doctor.patientRating || 4.9}</span>
                  </div>
                  <div className="text-xs text-text-muted">
                    Based on <strong>{doctor.reviewCount || 350}+</strong> verified consultations
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={13} /> 99.2% Positive Experience
                </span>
              </div>

              <div className="space-y-2.5">
                {(doctor.patientReviews || [
                  {
                    patientName: 'Verified Patient (OPD Clinic)',
                    rating: 5,
                    date: 'September 12, 2026',
                    comment: 'Extremely attentive and reassuring doctor. Explained the diagnostic findings clearly and structured a practical, step-by-step recovery plan.'
                  },
                  {
                    patientName: 'Rajesh Kumar (Inpatient Recovery)',
                    rating: 5,
                    date: 'August 28, 2026',
                    comment: 'Dr. was thorough with my cardiac biomarkers and post-op care. The entire nursing team praised his surgical accuracy.'
                  },
                  {
                    patientName: 'Sneha Rao (Follow-up Review)',
                    rating: 5,
                    date: 'August 14, 2026',
                    comment: 'Minimal wait time, clear explanation of medicine dosages, and quick resolution of all my questions.'
                  }
                ]).map((rev, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-4 bg-bg-surface-elevated rounded-2xl border border-border-subtle space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-text-main">{rev.patientName}</span>
                      <span className="text-xs text-text-dim">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 text-xs">{'★'.repeat(rev.rating || 5)}</span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Verified Visit
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════ TAB 4: BOOK APPOINTMENT ════════ */}
          {activeTab === 'book' && (
            <form onSubmit={handleBookingSubmit} className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
              <div className="p-4 bg-gradient-to-r from-teal-500/10 via-bg-surface-elevated to-bg-surface-elevated rounded-2xl border border-teal-500/25 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Calendar size={18} strokeWidth={2.3} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-main">
                      OPD Consultation with {doctor.name}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5 font-medium flex items-center gap-1.5 flex-wrap">
                      <span>Room: <strong className="text-text-main font-bold">{doctor.room}</strong></span>
                      <span>•</span>
                      <span>Next Available: <strong className="text-teal-600 dark:text-teal-400 font-bold">{doctor.nextSlot || 'Today'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/20 shrink-0">
                  Fee: ₹{doctor.fee}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <User size={13} className="text-teal-600 dark:text-teal-400" />
                    <span>Select Patient *</span>
                  </label>
                  <select
                    className="form-select w-full h-11 rounded-xl text-xs sm:text-sm font-semibold border-border-subtle bg-bg-surface-elevated focus:border-teal-500/60"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.mrn}) — Age {p.age}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Activity size={13} className="text-teal-600 dark:text-teal-400" />
                    <span>Consultation Mode</span>
                  </label>
                  <select
                    className="form-select w-full h-11 rounded-xl text-xs sm:text-sm font-semibold border-border-subtle bg-bg-surface-elevated focus:border-teal-500/60"
                    value={consultType}
                    onChange={(e) => setConsultType(e.target.value)}
                  >
                    <option value="In-Person OPD Clinic">In-Person OPD Clinic (Room {doctor.room})</option>
                    <option value="Teleconsultation / Video">Teleconsultation / Video</option>
                    <option value="Follow-up Review">Follow-up Review</option>
                    <option value="Second Specialist Opinion">Second Specialist Opinion</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Clock size={13} className="text-teal-600 dark:text-teal-400" />
                    <span>Preferred Time Slot</span>
                  </label>
                  <select
                    className="form-select w-full h-11 rounded-xl text-xs sm:text-sm font-semibold border-border-subtle bg-bg-surface-elevated focus:border-teal-500/60"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                  >
                    <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                    <option value="11:30 AM (Next Available)">11:30 AM (Next Available)</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:30 PM">02:30 PM (Afternoon Slot)</option>
                    <option value="04:30 PM">04:30 PM (Evening Slot)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Stethoscope size={13} className="text-teal-600 dark:text-teal-400" />
                    <span>Chief Reason / Symptoms</span>
                  </label>
                  <input
                    type="text"
                    className="form-input w-full h-11 rounded-xl text-xs sm:text-sm font-semibold border-border-subtle bg-bg-surface-elevated focus:border-teal-500/60"
                    placeholder="e.g. Chest discomfort, routine review"
                    value={consultReason}
                    onChange={(e) => setConsultReason(e.target.value)}
                  />
                </div>
              </div>

              {/* Quick Symptom Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[11px] font-bold text-text-dim flex items-center gap-1">
                  <Sparkles size={12} className="text-teal-600" /> Quick select:
                </span>
                {['Chest Discomfort', 'High BP / Hypertension', 'Routine Review', 'Shortness of Breath', 'Second Opinion'].map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => setConsultReason(symptom)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                      consultReason === symptom
                        ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/40 font-bold'
                        : 'bg-bg-surface text-text-muted border-border-subtle hover:border-teal-500/30 hover:text-text-main'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>

              <div className="p-3.5 bg-bg-surface-elevated rounded-xl border border-border-subtle text-xs text-text-muted flex items-start gap-2.5">
                <Sparkles size={15} className="text-teal-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-text-main font-bold">Instant Token Confirmation:</strong> Appointment will be assigned an official queue token and added to the Hospital OPD Schedule automatically.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  className="btn btn-secondary h-10 px-5 rounded-xl text-xs font-bold hover:bg-bg-surface-elevated transition-all"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-10 px-6 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-teal-600/20 hover:shadow-lg transition-all"
                >
                  <CheckCircle2 size={15} strokeWidth={2.3} />
                  <span>Confirm & Generate Token</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── MODAL FOOTER ── */}
        {activeTab !== 'book' && (
          <div className="doc-modal-footer">
            <div className="doc-footer-meta">
              Next OPD Slot:&nbsp;<strong className="text-teal-600 dark:text-teal-400">{doctor.nextSlot || 'Available Today'}</strong>
              &nbsp;·&nbsp;Room:&nbsp;<strong className="text-text-main">{doctor.room}</strong>
            </div>

            <div className="doc-footer-actions">
              <button
                className="doc-btn-secondary"
                style={{ padding: '0 16px', minWidth: '80px' }}
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="doc-btn-primary"
                style={{ padding: '0 18px' }}
                onClick={() => setActiveTab('book')}
              >
                <Calendar size={13} /> Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
