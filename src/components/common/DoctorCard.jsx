import React from 'react';
import {
  Stethoscope,
  Clock,
  UserCheck,
  MapPin,
  Coins,
  CalendarClock,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const DoctorCard = ({ doctor, onOpenProfile, onOpenSlots, onConsult }) => {
  const { openModal } = useHospital();

  if (!doctor) return null;

  const handleProfile = () => {
    if (onOpenProfile) onOpenProfile(doctor);
    else openModal('doctorProfile', doctor);
  };

  const handleSlots = (e) => {
    if (e) e.stopPropagation();
    if (onOpenSlots) onOpenSlots(doctor);
    else openModal('doctorSlots', doctor);
  };

  const handleConsult = (e) => {
    if (e) e.stopPropagation();
    if (onConsult) onConsult(doctor);
    else openModal('doctorConsult', doctor);
  };

  const isAvailable = doctor.availableNow;
  const statusConfig = {
    'On-Duty': {
      dot: 'bg-emerald-500',
      label: 'On Duty',
      badgeClass: 'doc-status-available'
    },
    'In-Consult': {
      dot: 'bg-teal-500',
      label: 'In Consult',
      badgeClass: 'doc-status-consult'
    },
    'In-Surgery': {
      dot: 'bg-rose-500',
      label: 'In Surgery',
      badgeClass: 'doc-status-surgery'
    },
    'In-Rounds': {
      dot: 'bg-indigo-500',
      label: 'In Rounds',
      badgeClass: 'doc-status-rounds'
    }
  }[doctor.status] || {
    dot: 'bg-slate-400',
    label: doctor.status || 'Active',
    badgeClass: 'doc-status-default'
  };

  return (
    <div className="doc-card">
      {/* ── 1. CARD TOP BAR: DEPARTMENT & AVAILABILITY STATUS ── */}
      <div className="doc-card-topbar">
        <span className="doc-dept-pill">
          <Briefcase size={12} className="text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="truncate max-w-[135px] font-semibold">{doctor.department}</span>
        </span>

        {isAvailable ? (
          <span className="doc-status-pill doc-status-available" title="Doctor is available for immediate consultation">
            <span className="doc-status-dot bg-emerald-500 animate-pulse" />
            <span>Available</span>
          </span>
        ) : (
          <span className={`doc-status-pill ${statusConfig.badgeClass}`}>
            <span className={`doc-status-dot ${statusConfig.dot}`} />
            <span>{statusConfig.label}</span>
          </span>
        )}
      </div>

      {/* ── 2. DOCTOR IDENTITY HEADER ── */}
      <div className="doc-card-profile">
        <div
          className="doc-avatar-wrap"
          onClick={handleProfile}
          title={`View ${doctor.name}'s profile`}
        >
          <img
            src={doctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
            alt={doctor.name}
            className="doc-avatar-img"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80';
            }}
          />
          <div className="doc-avatar-emblem" title="Certified Specialist">
            <Stethoscope size={11} />
          </div>
        </div>

        <div className="doc-profile-info">
          <h3
            className="doc-name"
            onClick={handleProfile}
            title={doctor.name}
          >
            {doctor.name}
          </h3>

          <p className="doc-specialty" title={doctor.specialty}>
            {doctor.specialty}
          </p>

          <div className="doc-exp-row">
            <Clock size={11} className="text-text-muted shrink-0" />
            <span>{doctor.experience} Experience</span>
          </div>
        </div>
      </div>

      {/* ── 3. ROOM & FEE SPECIFICATIONS STRIP (UNIFIED & UN-CRAMPED) ── */}
      <div className="doc-specs-row">
        {/* Room / Location */}
        <div className="doc-spec-col" title={`Clinical Location: ${doctor.room}`}>
          <div className="doc-spec-meta">
            <MapPin size={12} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="doc-spec-lbl">ROOM</span>
          </div>
          <div className="doc-spec-val">
            {doctor.room || 'General OPD'}
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="doc-spec-divider" />

        {/* Consultation Fee */}
        <div className="doc-spec-col doc-spec-fee" title={`Consultation Fee: ₹${doctor.fee}`}>
          <div className="doc-spec-meta">
            <Coins size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="doc-spec-lbl">FEE</span>
            <span className="doc-cashless-badge">Cashless</span>
          </div>
          <div className="doc-spec-val text-emerald-600 dark:text-emerald-400 font-bold">
            ₹{doctor.fee?.toLocaleString ? doctor.fee.toLocaleString() : doctor.fee}
          </div>
        </div>
      </div>

      {/* ── 4. NEXT SLOT APPOINTMENT BANNER (CLEAN & NON-TRUNCATING) ── */}
      <div
        className="doc-slot-banner"
        onClick={handleSlots}
        title={`Next consultation slot: ${doctor.nextSlot || 'Available Today'}. Click to view slots.`}
      >
        <div className="doc-slot-content">
          <CalendarClock size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="doc-slot-title">Next Slot:</span>
          <span className="doc-slot-highlight">{doctor.nextSlot || 'Available Today'}</span>
        </div>
        <div className="doc-slot-cta">
          <ChevronRight size={14} className="doc-chevron-icon" />
        </div>
      </div>

      {/* ── 5. ACTION BUTTONS FOOTER ── */}
      <div className="doc-card-actions">
        <div className="doc-card-secondary-row">
          <button
            className="doc-btn-secondary"
            onClick={handleSlots}
            title="View live slot calendar"
          >
            <Clock size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Slots</span>
          </button>

          <button
            className="doc-btn-secondary"
            onClick={handleProfile}
            title="View full credentials & reviews"
          >
            <UserCheck size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Details</span>
          </button>
        </div>

        <button
          className="doc-btn-primary doc-btn-full"
          onClick={handleConsult}
          title="Start 1-click consultation booking"
        >
          <Stethoscope size={14} className="shrink-0" />
          <span>Consult</span>
        </button>
      </div>
    </div>
  );
};
