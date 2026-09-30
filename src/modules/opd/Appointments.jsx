import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, User, Stethoscope, CheckCircle2, XCircle, Printer } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';
import { printDailyOPDSlotsSchedule, printAppointmentTokenSlip } from '../../services/slotPrintService';

export const Appointments = () => {
  const { opdAppointments, doctors, patients, bookDoctorConsultation, setSelectedPatient, setActiveNav, openModal, showToast } = useHospital();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0].id);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const [appointmentTime, setAppointmentTime] = useState('11:00 AM');
  const [reason, setReason] = useState('');
  const [consultType, setConsultType] = useState('General Consultation');

  const handleBook = (e) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === selectedDoctor) || doctors[0];
    const pat = patients.find((p) => p.id === selectedPatientId) || patients[0];
    const generatedToken = `OPD-${Math.floor(10 + Math.random() * 90)}`;

    bookDoctorConsultation({
      doctor: doc,
      patient: pat,
      appointmentTime,
      consultType,
      reason: reason || 'Routine OPD Consultation',
      token: generatedToken
    });

    if (showToast) {
      showToast(`Appointment confirmed for ${pat.name} with ${doc.name}. Token: ${generatedToken}`, 'success');
    }

    // Auto-generate official appointment token slip
    printAppointmentTokenSlip({
      doctor: doc,
      patient: pat,
      appointmentTime,
      date: new Date().toISOString().split('T')[0],
      consultType,
      reason: reason || 'Routine OPD Consultation',
      token: generatedToken,
      fee: doc.fee
    });

    setShowBookingModal(false);
    setReason('');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-2xl font-extrabold text-text-main">
            Doctor Appointments
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Manage consultation slots, patient check-ins, and scheduled visits for today.
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
            <span>Print Daily Schedule</span>
          </button>

          <button className="btn btn-primary" onClick={() => setShowBookingModal(true)}>
            <Plus size={16} /> Book Appointment
          </button>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingModal && (
        <div className="glass-card border border-teal-500/40 bg-bg-surface-elevated p-5 sm:p-7 rounded-2xl shadow-md">
          <h3 className="text-base text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2 font-extrabold">
            <CalendarIcon size={18} /> Schedule New Appointment
          </h3>
          <form onSubmit={handleBook}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Select Patient</label>
                <select
                  className="form-select"
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

              <div className="form-group">
                <label className="form-label">Consulting Specialist Doctor</label>
                <select
                  className="form-select"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty} • Fee: ₹{d.fee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <select
                  className="form-select"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                >
                  <option value="09:00 AM">09:00 AM - 09:30 AM</option>
                  <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                  <option value="11:00 AM">11:00 AM - 11:30 AM</option>
                  <option value="12:00 PM">12:00 PM - 12:30 PM</option>
                  <option value="02:30 PM">02:30 PM - 03:00 PM</option>
                  <option value="04:00 PM">04:00 PM - 04:30 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Category</label>
                <select
                  className="form-select"
                  value={consultType}
                  onChange={(e) => setConsultType(e.target.value)}
                >
                  <option value="New Patient">New Patient Consult</option>
                  <option value="Follow-up">Follow-up Review</option>
                  <option value="Post-Procedure">Post-Procedure Check</option>
                  <option value="Second Opinion">Specialist Second Opinion</option>
                </select>
              </div>

              <div className="form-group sm:col-span-2">
                <label className="form-label">Chief Complaint / Reason for Visit</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Follow-up after blood tests or chest pain"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Booking & Generate Token
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List Table */}
      <div className="table-container rounded-xl border border-border-subtle overflow-x-auto bg-bg-surface shadow-xs">
        <table className="medicore-table w-full min-w-[880px]">
          <thead>
            <tr>
              <th className="w-24">Token #</th>
              <th className="min-w-[200px]">Patient Name</th>
              <th className="min-w-[180px]">Consulting Specialist</th>
              <th className="w-36">Department</th>
              <th className="w-32">Slot Time</th>
              <th className="w-28">Category</th>
              <th className="w-28">Status</th>
              <th className="w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opdAppointments.map((apt) => (
              <tr key={apt.id} className="h-16 hover:bg-bg-surface-elevated/60 transition-colors">
                <td>
                  <span className="mono font-bold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-1 px-2.5 rounded border border-teal-200 dark:border-teal-800/60 inline-block leading-none">
                    {apt.token}
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
                    onClick={() => {
                      const doc = doctors.find((d) => d.name.toLowerCase() === apt.doctorName.toLowerCase()) || doctors[0];
                      openModal('doctorProfile', doc);
                    }}
                    title="Click to view doctor credentials, track record, and success rate"
                  >
                    {apt.doctorName}
                  </span>
                </td>
                <td className="text-xs text-text-muted whitespace-nowrap">{apt.department}</td>
                <td className="text-xs">
                  <div className="flex items-center gap-1.5 text-text-main font-medium whitespace-nowrap">
                    <Clock size={13} className="text-teal-600 shrink-0" /> {apt.time}
                  </div>
                </td>
                <td>
                  <span className="badge badge-gray text-[0.7rem]">{apt.type}</span>
                </td>
                <td>
                  <Badge variant={apt.status === 'Completed' ? 'emerald' : apt.status === 'In-Consult' ? 'teal' : 'amber'} dot={apt.status === 'In-Consult'}>
                    {apt.status}
                  </Badge>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      className="w-8.5 h-8.5 rounded-lg border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-surface-elevated transition-colors cursor-pointer"
                      onClick={() => {
                        const doc = doctors.find((d) => d.name.toLowerCase() === apt.doctorName.toLowerCase()) || { name: apt.doctorName, specialty: apt.department, room: '304', fee: 800 };
                        const pat = patients.find((p) => p.id === apt.patientId) || { name: apt.patientName, mrn: 'PAT-2026-09' };
                        printAppointmentTokenSlip({
                          doctor: doc,
                          patient: pat,
                          appointmentTime: apt.time,
                          date: new Date().toISOString().split('T')[0],
                          consultType: apt.type,
                          reason: apt.reason,
                          token: apt.token,
                          fee: doc.fee || 800
                        });
                        if (showToast) showToast(`Printing Token ${apt.token} for ${apt.patientName}...`, 'info');
                      }}
                      title={`Print OPD Token Slip for ${apt.patientName} (${apt.token})`}
                    >
                      <Printer size={14} className="text-teal-600 dark:text-teal-400" />
                    </button>

                    <button
                      className="btn btn-secondary btn-sm h-8.5 px-3 text-xs font-bold rounded-md"
                      onClick={() => {
                        const p = patients.find((pat) => pat.id === apt.patientId) || patients[0];
                        setSelectedPatient(p);
                        setActiveNav({ module: 'opd', subModule: 'consultation' });
                      }}
                    >
                      Start Consult
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
