import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  X,
  MapPin,
  Database,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { getDoctorSlotsForDate } from '../../services/storageService';
import { printDoctorSlotsReport, printAppointmentTokenSlip } from '../../services/slotPrintService';

export const DoctorSlotsModal = ({ isOpen, onClose, doctor }) => {
  const {
    patients,
    selectedPatient,
    setSelectedPatient,
    userRole,
    authenticatedPatient,
    bookedSlots = [],
    bookDoctorConsultation,
    showToast,
    setActiveNav
  } = useHospital();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterStr = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlotTime, setSelectedSlotTime] = useState(null);
  const [consultType, setConsultType] = useState('In-Person OPD Clinic');
  const [reason, setReason] = useState('');

  const activePatient = (userRole === 'patient' && authenticatedPatient)
    ? authenticatedPatient
    : (selectedPatient || patients?.[0]);
  const [selectedPatientId, setSelectedPatientId] = useState(activePatient?.id || patients?.[0]?.id);

  if (!isOpen || !doctor) return null;

  // Compute live slots for this doctor on the selected date
  const slotData = getDoctorSlotsForDate(doctor, selectedDate, bookedSlots);

  const handleConfirmSlot = (e) => {
    e.preventDefault();
    if (!selectedSlotTime) {
      showToast('Please select an available time slot first.', 'error');
      return;
    }

    const patientToBook = patients.find((p) => p.id === selectedPatientId) || activePatient;
    const generatedToken = `OPD-${Math.floor(10 + Math.random() * 90)}`;

    bookDoctorConsultation({
      doctor,
      patient: patientToBook,
      appointmentTime: selectedSlotTime,
      consultType,
      reason: reason || `Doctor Consultation with ${doctor.name} (${selectedSlotTime})`,
      date: selectedDate,
      token: generatedToken
    });

    showToast(`Slot ${selectedSlotTime} booked for ${patientToBook.name}. Queue Token: ${generatedToken}`, 'success');

    // Automatically trigger official appointment token slip for patient & reception
    printAppointmentTokenSlip({
      doctor,
      patient: patientToBook,
      appointmentTime: selectedSlotTime,
      date: selectedDate,
      consultType,
      reason: reason || `Doctor Consultation with ${doctor.name}`,
      token: generatedToken,
      fee: doctor.fee
    });

    setSelectedSlotTime(null);
    setReason('');
    onClose();

    if (userRole === 'patient') {
      setActiveNav({ module: 'patientManagement', subModule: 'profile' });
    } else {
      setActiveNav({ module: 'opd', subModule: 'appointments' });
    }
  };

  // Format date display
  const formatDateLabel = (dStr) => {
    if (dStr === todayStr) return 'Today';
    if (dStr === tomorrowStr) return 'Tomorrow';
    if (dStr === dayAfterStr) return 'Day After';
    return dStr;
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-slate-950/80 backdrop-blur-[14px] z-[1060] flex items-center justify-center p-4 sm:p-7 md:p-9 lg:p-11 animate-[fadeIn_0.15s_ease]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-frame w-full max-w-3xl max-h-[90vh] bg-bg-surface border border-border-subtle rounded-3xl shadow-[0_32px_75px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-[slideUp_0.22s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header Strip */}
        <div className="modal-header py-5 sm:py-6 px-6 sm:px-10 bg-bg-surface-elevated border-b border-border-subtle flex items-center justify-between gap-4 shrink-0 relative">
          <div className="flex items-center gap-3.5 sm:gap-4.5">
            <img
              src={doctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
              alt={doctor.name}
              className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] rounded-2xl object-cover border-2 border-teal-500/30 shrink-0 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-text-main m-0 tracking-tight font-display">
                  {doctor.name}
                </h3>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 py-0.5 px-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {slotData.totalAvailable} Open Slots
                </span>
              </div>
              <div className="text-xs text-text-muted mt-1 flex items-center gap-2 flex-wrap font-medium">
                <span className="text-teal-600 dark:text-teal-400 font-bold">{doctor.specialty}</span>
                <span className="text-text-dim">·</span>
                <span>Room {doctor.room}</span>
                <span className="text-text-dim">·</span>
                <span>Fee: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">₹{doctor.fee}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                printDoctorSlotsReport(doctor, selectedDate, slotData);
                showToast(`Generating OPD Slots Report for ${doctor.name}...`, 'info');
              }}
              className="btn btn-secondary h-9 px-3.5 rounded-xl text-xs font-bold border border-border-subtle flex items-center gap-1.5 cursor-pointer hover:bg-bg-surface-elevated transition-all"
              title="Print Doctor's Consultation Schedule and Live Slots Report"
            >
              <Printer size={14} className="text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Print Slots Report</span>
              <span className="sm:hidden">Print</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="w-9 h-9 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-main hover:border-border-strong hover:bg-bg-surface-hover transition-all cursor-pointer shrink-0 shadow-xs"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body px-6 sm:px-10 py-6 sm:py-8 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* Schedule Info Banner */}
          <div className="bg-bg-surface-elevated border border-border-subtle rounded-2xl p-4 sm:p-5 flex justify-between items-center flex-wrap gap-2.5 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-teal-600 shrink-0" />
              <div className="text-xs sm:text-sm text-text-main font-semibold">
                <span>Daily Clinic Hours:</span> <span className="font-bold text-teal-600 dark:text-teal-400">{doctor.schedule?.timing || '09:00 AM – 01:00 PM & 04:00 PM – 07:30 PM'}</span>
              </div>
            </div>

            <div className="text-xs text-text-dim flex items-center gap-1 font-medium">
              <Database size={13} className="text-teal-600 shrink-0" /> Live Synchronized with OPD Registry
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">
              Select Appointment Date
            </label>
            <div className="flex gap-2 flex-wrap items-center">
              {[todayStr, tomorrowStr, dayAfterStr].map((dStr) => {
                const isSelected = selectedDate === dStr;
                return (
                  <button
                    key={dStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(dStr);
                      setSelectedSlotTime(null);
                    }}
                    className={`h-9 px-3.5 text-xs font-bold rounded-md cursor-pointer transition-all border shrink-0 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                        : 'border-border-subtle bg-bg-surface-elevated text-text-main hover:bg-bg-surface'
                    }`}
                  >
                    {formatDateLabel(dStr)} ({new Date(dStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                  </button>
                );
              })}

              <input
                type="date"
                className="form-input w-[155px] h-9 py-1 px-2.5 text-xs rounded-md"
                value={selectedDate}
                min={todayStr}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                    setSelectedSlotTime(null);
                  }
                }}
              />
            </div>
          </div>

          {/* Morning Slots */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <div className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                <span>Morning OPD Clinic (09:00 AM – 01:00 PM)</span>
              </div>
              <span className="text-xs font-semibold text-text-muted">
                {slotData.morningSlots.filter((s) => !s.isBooked).length} slots available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {slotData.morningSlots.map((slot) => {
                const isSelected = selectedSlotTime === slot.time;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.isBooked}
                    onClick={() => setSelectedSlotTime(slot.time)}
                    className={`p-2.5 min-h-[58px] rounded-md flex flex-col items-center justify-center gap-1 transition-all ${
                      slot.isBooked
                        ? 'border border-border-subtle bg-bg-surface cursor-not-allowed opacity-40'
                        : isSelected
                        ? 'border-2 border-teal-600 bg-teal-50 dark:bg-teal-950/40 cursor-pointer shadow-xs'
                        : 'border border-border-subtle bg-bg-surface-elevated hover:bg-bg-surface cursor-pointer shadow-xs'
                    }`}
                  >
                    <span className={`font-semibold text-xs sm:text-sm ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-text-main'}`}>
                      {slot.time}
                    </span>
                    <span
                      className={`text-[0.6875rem] font-bold ${
                        slot.isBooked ? 'text-text-dim' : isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {slot.isBooked ? 'Booked' : isSelected ? '✓ Selected' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Evening Slots */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <div className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                <span>Evening OPD Clinic (04:00 PM – 07:30 PM)</span>
              </div>
              <span className="text-xs font-semibold text-text-muted">
                {slotData.eveningSlots.filter((s) => !s.isBooked).length} slots available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {slotData.eveningSlots.map((slot) => {
                const isSelected = selectedSlotTime === slot.time;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.isBooked}
                    onClick={() => setSelectedSlotTime(slot.time)}
                    className={`p-2.5 min-h-[58px] rounded-md flex flex-col items-center justify-center gap-1 transition-all ${
                      slot.isBooked
                        ? 'border border-border-subtle bg-bg-surface cursor-not-allowed opacity-40'
                        : isSelected
                        ? 'border-2 border-teal-600 bg-teal-50 dark:bg-teal-950/40 cursor-pointer shadow-xs'
                        : 'border border-border-subtle bg-bg-surface-elevated hover:bg-bg-surface cursor-pointer shadow-xs'
                    }`}
                  >
                    <span className={`font-semibold text-xs sm:text-sm ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-text-main'}`}>
                      {slot.time}
                    </span>
                    <span
                      className={`text-[0.6875rem] font-bold ${
                        slot.isBooked ? 'text-text-dim' : isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {slot.isBooked ? 'Booked' : isSelected ? '✓ Selected' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleConfirmSlot}
            className={`bg-bg-surface-elevated rounded-md p-4 sm:p-5 flex flex-col gap-4 shadow-xs ${
              selectedSlotTime ? 'border-2 border-teal-600' : 'border border-border-subtle'
            }`}
          >
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <div className="text-sm font-semibold text-text-main">
                  Patient Booking Confirmation
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  Confirmed slot will generate an OPD Queue Token and register in patient records.
                </div>
              </div>

              {selectedSlotTime ? (
                <div className="bg-teal-600 text-white py-1 px-3 rounded-md text-xs font-bold shadow-xs">
                  Selected Slot: {selectedSlotTime} ({formatDateLabel(selectedDate)})
                </div>
              ) : (
                <div className="text-text-muted text-xs font-medium bg-bg-surface py-1 px-2.5 rounded-md border border-border-subtle">
                  Select a slot tile above to proceed
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Patient *</label>
                <select
                  className="form-select h-10 rounded-md text-xs sm:text-sm"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Consultation Mode</label>
                <select
                  className="form-select h-10 rounded-md text-xs sm:text-sm"
                  value={consultType}
                  onChange={(e) => setConsultType(e.target.value)}
                >
                  <option value="In-Person OPD Clinic">In-Person OPD Clinic (Room {doctor.room})</option>
                  <option value="Teleconsultation / Video">Teleconsultation / Video</option>
                  <option value="Follow-up Review">Follow-up Review</option>
                  <option value="Second Specialist Opinion">Second Specialist Opinion</option>
                </select>
              </div>

              <div className="form-group mb-0 sm:col-span-2">
                <label className="form-label text-xs font-bold text-text-main">Chief Reason / Clinical Notes</label>
                <input
                  type="text"
                  className="form-input h-10 rounded-md text-xs sm:text-sm"
                  placeholder="e.g. Regular cardiac review, high blood pressure consultation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border-subtle flex-wrap gap-3">
              <div className="text-xs text-text-muted">
                Consultation Fee: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">₹{doctor.fee}</strong> (Eligible for Cashless TPA)
              </div>

              <div className="flex gap-2.5 ml-auto flex-wrap items-center">
                <button type="button" className="btn btn-secondary btn-sm h-10 px-4" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedSlotTime}
                  onClick={() => {
                    const patientToBook = patients.find((p) => p.id === selectedPatientId) || activePatient;
                    printAppointmentTokenSlip({
                      doctor,
                      patient: patientToBook,
                      appointmentTime: selectedSlotTime,
                      date: selectedDate,
                      consultType,
                      reason: reason || `Doctor Consultation with ${doctor.name}`,
                      token: `OPD-${Math.floor(10 + Math.random() * 90)}`,
                      fee: doctor.fee
                    });
                    showToast('Printing OPD Appointment Token Slip...', 'info');
                  }}
                  className="btn btn-secondary btn-sm h-10 px-3.5 font-bold flex items-center gap-1.5"
                  title="Print official appointment token slip for selected slot"
                >
                  <Printer size={15} />
                  <span>Print Token</span>
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlotTime}
                  className="btn btn-primary btn-sm h-10 px-4 font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} /> Confirm & Print Slip
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
