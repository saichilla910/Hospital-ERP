import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, User, Stethoscope, CheckCircle2, XCircle, Printer, MessageSquare, AlertCircle, Filter, Sparkles, Send, CheckCheck, PlayCircle, Eye, RefreshCw } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';
import { printDailyOPDSlotsSchedule, printAppointmentTokenSlip } from '../../services/slotPrintService';

export const Appointments = () => {
  const {
    opdAppointments,
    doctors,
    patients,
    doctorSlots,
    bookDoctorConsultation,
    updateAppointmentStatus,
    sendAppointmentReminder,
    setSelectedPatient,
    setActiveNav,
    openModal,
    showToast
  } = useHospital();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkInModalData, setCheckInModalData] = useState(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // New Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState('09:30 AM');
  const [consultType, setConsultType] = useState('General Consultation');
  const [reason, setReason] = useState('');

  // Filtered Appointments Roster
  const filteredAppointments = (opdAppointments || []).filter((apt) => {
    const matchStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchDoc = doctorFilter === 'ALL' || apt.doctorId === doctorFilter;
    const matchDate = !dateFilter || apt.date === dateFilter;
    const matchSearch =
      !searchTerm ||
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.token && apt.token.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (apt.reason && apt.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchDoc && matchDate && matchSearch;
  });

  // KPI Metrics
  const totalCount = (opdAppointments || []).length;
  const bookedCount = (opdAppointments || []).filter((a) => a.status === 'Booked').length;
  const checkedInCount = (opdAppointments || []).filter((a) => a.status === 'Checked-In').length;
  const inConsultCount = (opdAppointments || []).filter((a) => a.status === 'In-Consultation').length;
  const completedCount = (opdAppointments || []).filter((a) => a.status === 'Completed').length;
  const noShowCount = (opdAppointments || []).filter((a) => a.status === 'No-Show').length;

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
    const pat = patients.find((p) => p.id === selectedPatientId) || patients[0];

    bookDoctorConsultation({
      doctor: doc,
      patient: pat,
      appointmentTime,
      consultType,
      reason: reason || 'Routine OPD Consultation',
      date: appointmentDate
    });

    setShowBookingModal(false);
    setReason('');
  };

  const handleCheckInAction = (apt) => {
    updateAppointmentStatus(apt.id, 'Checked-In');

    const doc = doctors.find((d) => d.id === apt.doctorId) || doctors[0];
    const todayStr = apt.date || new Date().toISOString().split('T')[0];

    const patientsAhead = (opdAppointments || []).filter(
      (a) => a.doctorId === apt.doctorId && a.date === todayStr && (a.status === 'Checked-In' || a.status === 'In-Consultation') && a.id !== apt.id
    ).length;

    const avgConsult = doc?.avgWaitTime ? parseInt(doc.avgWaitTime) || 12 : 12;
    const estimatedWaitMins = patientsAhead * avgConsult;
    const generatedToken = apt.token || `T-${101 + patientsAhead}`;

    setCheckInModalData({
      appointment: apt,
      doctor: doc,
      token: generatedToken,
      patientsAhead,
      estimatedWaitMins,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-main flex items-center gap-2.5">
            <CalendarIcon className="text-teal-600 dark:text-teal-400" size={26} />
            OPD Appointments & Token Queue System
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Manage slot bookings, check-in patients, generate tokens with estimated wait times, and trigger SMS/WhatsApp reminders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            className="btn btn-secondary h-10 px-4 rounded-xl text-xs font-bold border border-border-subtle flex items-center gap-1.5 cursor-pointer hover:bg-bg-surface-elevated transition-all"
            onClick={() => {
              printDailyOPDSlotsSchedule(opdAppointments, new Date().toISOString().split('T')[0], doctors);
              if (showToast) showToast("Generating today's OPD consultation slots & appointment schedule...", 'info');
            }}
            title="Print complete daily OPD consultation slots and patient queue roster"
          >
            <Printer size={15} className="text-teal-600" />
            <span>Print Daily Roster</span>
          </button>

          <button className="btn btn-primary" onClick={() => setShowBookingModal(true)}>
            <Plus size={16} /> Schedule New Appointment
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass-card bg-bg-surface p-4 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[0.75rem] text-text-muted font-medium">Total Bookings</span>
          <div className="text-2xl font-black text-text-main mt-1">{totalCount}</div>
          <span className="text-[0.7rem] text-teal-600 dark:text-teal-400 mt-1">Scheduled Roster</span>
        </div>

        <div className="glass-card bg-bg-surface p-4 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[0.75rem] text-text-muted font-medium">Booked</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{bookedCount}</div>
          <span className="text-[0.7rem] text-text-muted mt-1">Awaiting Check-in</span>
        </div>

        <div className="glass-card bg-bg-surface p-4 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[0.75rem] text-text-muted font-medium">Checked-In</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{checkedInCount}</div>
          <span className="text-[0.7rem] text-amber-600 mt-1">In Lounge Queue</span>
        </div>

        <div className="glass-card bg-bg-surface p-4 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[0.75rem] text-text-muted font-medium">In-Consultation</span>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{inConsultCount}</div>
          <span className="text-[0.7rem] text-teal-600 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> Active Doctor Room
          </span>
        </div>

        <div className="glass-card bg-bg-surface p-4 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[0.75rem] text-text-muted font-medium">Completed</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</div>
          <span className="text-[0.7rem] text-emerald-600 mt-1">Consult Finished</span>
        </div>

        <div className="glass-card bg-bg-surface p-4 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[0.75rem] text-text-muted font-medium">No-Show</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{noShowCount}</div>
          <span className="text-[0.7rem] text-rose-600 mt-1">Missed Visit</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card bg-bg-surface p-4 rounded-xl border border-border-subtle flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <input
            type="text"
            className="form-input text-xs h-9 py-1 px-3 rounded-lg min-w-[200px] flex-1 max-w-sm"
            placeholder="Search by Patient Name, Token (e.g. T-101), or Complaint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold shrink-0">
            <Filter size={13} className="text-teal-600" /> Filter:
          </div>

          <select
            className="form-select text-xs h-9 py-1 px-3 rounded-lg w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses ({opdAppointments.length})</option>
            <option value="Booked">Booked ({bookedCount})</option>
            <option value="Checked-In">Checked-In ({checkedInCount})</option>
            <option value="In-Consultation">In-Consultation ({inConsultCount})</option>
            <option value="Completed">Completed ({completedCount})</option>
            <option value="No-Show">No-Show ({noShowCount})</option>
          </select>

          <select
            className="form-select text-xs h-9 py-1 px-3 rounded-lg w-auto"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="ALL">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>

          <input
            type="date"
            className="form-input text-xs h-9 py-1 px-2.5 rounded-lg w-auto"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div className="text-xs text-text-muted font-mono">
          Showing {filteredAppointments.length} appointments
        </div>
      </div>

      {/* Appointments List Table */}
      <div className="table-container rounded-xl border border-border-subtle overflow-x-auto bg-bg-surface shadow-xs">
        <table className="medicore-table w-full min-w-[1000px]">
          <thead>
            <tr>
              <th className="w-24">Token #</th>
              <th className="min-w-[200px]">Patient Name</th>
              <th className="min-w-[180px]">Consulting Specialist</th>
              <th className="w-32">Slot / Time</th>
              <th className="w-36">Status</th>
              <th className="w-36">Est. Wait Time</th>
              <th className="w-28">Reminder</th>
              <th className="w-44 text-right">Queue Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-text-muted text-xs">
                  No appointments match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((apt) => {
                const doc = doctors.find((d) => d.id === apt.doctorId || d.name.toLowerCase() === apt.doctorName.toLowerCase()) || doctors[0];
                const pat = patients.find((p) => p.id === apt.patientId) || patients[0];

                return (
                  <tr key={apt.id} className="h-16 hover:bg-bg-surface-elevated/60 transition-colors">
                    <td>
                      <span className="mono font-bold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-1 px-2.5 rounded border border-teal-200 dark:border-teal-800 inline-block leading-none">
                        {apt.token || 'T-PAD'}
                      </span>
                    </td>
                    <td className="min-w-[200px] max-w-[260px]">
                      <div className="font-semibold text-text-main text-sm truncate" title={apt.patientName}>
                        {apt.patientName}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5 truncate" title={apt.reason}>
                        {apt.reason}
                      </div>
                    </td>
                    <td>
                      <span
                        className="text-[0.85rem] text-teal-600 dark:text-teal-400 font-bold cursor-pointer hover:underline truncate block"
                        onClick={() => openModal('doctorProfile', doc)}
                        title="Click to view doctor credentials and slots"
                      >
                        {apt.doctorName}
                      </span>
                      <span className="text-[0.7rem] text-text-muted">{doc.room} • {apt.department}</span>
                    </td>
                    <td className="text-xs">
                      <div className="flex items-center gap-1.5 text-text-main font-medium whitespace-nowrap">
                        <Clock size={13} className="text-teal-600 shrink-0" /> {apt.time}
                      </div>
                      <div className="text-[0.7rem] text-text-muted">{apt.date}</div>
                    </td>
                    <td>
                      <Badge
                        variant={
                          apt.status === 'Completed'
                            ? 'emerald'
                            : apt.status === 'In-Consultation'
                            ? 'teal'
                            : apt.status === 'Checked-In'
                            ? 'amber'
                            : apt.status === 'No-Show'
                            ? 'rose'
                            : 'indigo'
                        }
                        dot={apt.status === 'In-Consultation' || apt.status === 'Checked-In'}
                      >
                        {apt.status}
                      </Badge>
                    </td>
                    <td className="text-xs font-mono">
                      {apt.status === 'Checked-In' ? (
                        <div className="text-amber-600 font-bold">
                          ~{apt.estimatedWaitMins || 10} mins ({apt.queuePosition || 1} ahead)
                        </div>
                      ) : apt.status === 'In-Consultation' ? (
                        <div className="text-teal-600 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> In Room Now
                        </div>
                      ) : (
                        <div className="text-text-muted">-</div>
                      )}
                    </td>
                    <td>
                      {apt.reminderSent ? (
                        <span className="text-[0.7rem] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCheck size={12} /> {apt.reminderChannel || 'WhatsApp'}
                        </span>
                      ) : (
                        <button
                          className="text-[0.7rem] text-teal-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          onClick={() => sendAppointmentReminder(apt.id, 'WhatsApp')}
                        >
                          <Send size={10} /> Send Reminder
                        </button>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Status Transition Action Buttons */}
                        {apt.status === 'Booked' && (
                          <button
                            className="btn btn-primary btn-sm h-8 px-2.5 text-xs font-bold rounded-md"
                            onClick={() => handleCheckInAction(apt)}
                          >
                            Check-In
                          </button>
                        )}

                        {apt.status === 'Checked-In' && (
                          <button
                            className="btn btn-primary btn-sm h-8 px-2.5 text-xs font-bold rounded-md bg-teal-600 hover:bg-teal-700"
                            onClick={() => updateAppointmentStatus(apt.id, 'In-Consultation')}
                          >
                            Start Consult
                          </button>
                        )}

                        {apt.status === 'In-Consultation' && (
                          <button
                            className="btn btn-secondary btn-sm h-8 px-2.5 text-xs font-bold rounded-md text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10"
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                          >
                            Complete
                          </button>
                        )}

                        {apt.status !== 'Completed' && apt.status !== 'No-Show' && (
                          <button
                            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-1 cursor-pointer"
                            onClick={() => updateAppointmentStatus(apt.id, 'No-Show')}
                            title="Mark as No-Show"
                          >
                            No-Show
                          </button>
                        )}

                        {/* Print Token Slip Button */}
                        <button
                          className="w-8 h-8 rounded-lg border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-surface-elevated transition-colors cursor-pointer"
                          onClick={() => {
                            printAppointmentTokenSlip({
                              doctor: doc,
                              patient: pat,
                              appointmentTime: apt.time,
                              date: apt.date,
                              consultType: apt.type,
                              reason: apt.reason,
                              token: apt.token || 'T-101',
                              fee: doc.fee || 800
                            });
                            if (showToast) showToast(`Printing Token ${apt.token} Slip for ${apt.patientName}...`, 'info');
                          }}
                          title={`Print OPD Token Slip for ${apt.patientName}`}
                        >
                          <Printer size={13} className="text-teal-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Form Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-teal-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-extrabold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <CalendarIcon size={20} /> Schedule New Appointment & Allocate Slot
            </h3>

            <form onSubmit={handleBookSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">Select Patient</label>
                  <select
                    className="form-select"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    required
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.mrn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Consulting Specialist Doctor</label>
                  <select
                    className="form-select"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    required
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialty} • Fee: ₹{d.fee})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Appointment Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot Window</label>
                  <select
                    className="form-select"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  >
                    <option value="09:00 AM">09:00 AM - 09:30 AM (Capacity 5)</option>
                    <option value="09:30 AM">09:30 AM - 10:00 AM (Capacity 5)</option>
                    <option value="10:00 AM">10:00 AM - 10:30 AM (Capacity 4)</option>
                    <option value="10:30 AM">10:30 AM - 11:00 AM (Capacity 6)</option>
                    <option value="11:00 AM">11:00 AM - 11:30 AM (Capacity 4)</option>
                    <option value="11:30 AM">11:30 AM - 12:00 PM (Capacity 5)</option>
                    <option value="04:00 PM">04:00 PM - 04:30 PM (Capacity 5)</option>
                  </select>
                </div>

                <div className="form-group sm:col-span-2">
                  <label className="form-label">Chief Complaint / Reason for Visit</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Severe joint stiffness or routine follow-up"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Booking & Assign Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-In Summary Modal */}
      {checkInModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-xl font-black text-text-main mb-1">
              Patient Check-In Successful!
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Token generated and patient added to live reception waiting lounge queue.
            </p>

            <div className="bg-bg-surface-elevated p-4 rounded-xl border border-border-subtle my-4 space-y-2">
              <div className="text-[0.7rem] text-text-muted uppercase font-bold tracking-wider">Assigned Token Number</div>
              <div className="text-4xl font-black font-mono text-teal-600 dark:text-teal-400">
                {checkInModalData.token}
              </div>

              <div className="pt-2 border-t border-border-subtle grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-text-muted">Patients Ahead:</div>
                  <div className="font-bold text-text-main">{checkInModalData.patientsAhead}</div>
                </div>
                <div>
                  <div className="text-text-muted">Estimated Wait:</div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">~{checkInModalData.estimatedWaitMins} mins</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-5">
              <button
                className="btn btn-secondary text-xs"
                onClick={() => setCheckInModalData(null)}
              >
                Close
              </button>
              
              <button
                className="btn btn-primary text-xs flex items-center gap-1.5"
                onClick={() => {
                  printAppointmentTokenSlip({
                    doctor: checkInModalData.doctor,
                    patient: { name: checkInModalData.appointment.patientName },
                    appointmentTime: checkInModalData.appointment.time,
                    date: checkInModalData.appointment.date,
                    consultType: checkInModalData.appointment.type,
                    reason: checkInModalData.appointment.reason,
                    token: checkInModalData.token,
                    fee: checkInModalData.doctor.fee || 800
                  });
                  setCheckInModalData(null);
                }}
              >
                <Printer size={14} /> Print Token Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
