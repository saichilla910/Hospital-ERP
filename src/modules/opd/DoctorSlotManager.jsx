import React, { useState } from 'react';
import { Clock, Plus, User, Calendar, Users, Stethoscope, CheckCircle2, AlertCircle, X, Sparkles, Filter } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const DoctorSlotManager = () => {
  const { doctorSlots, doctors, createDoctorSlot, deleteDoctorSlot, showToast, setActiveNav, openModal } = useHospital();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState('ALL');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal Form State
  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || '');
  const [slotDate, setSlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('09:30 AM');
  const [capacity, setCapacity] = useState(5);
  const [avgConsultTimeMins, setAvgConsultTimeMins] = useState(12);

  const filteredSlots = (doctorSlots || []).filter((slot) => {
    const docMatch = filterDoctor === 'ALL' || slot.doctorId === filterDoctor;
    const dateMatch = !filterDate || slot.date === filterDate;
    return docMatch && dateMatch;
  });

  const totalCapacity = filteredSlots.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const totalBooked = filteredSlots.reduce((acc, s) => acc + (s.bookedCount || 0), 0);
  const occupancyPct = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  const handleCreateSlot = (e) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === selectedDocId) || doctors[0];
    
    createDoctorSlot({
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      room: doc.room,
      date: slotDate,
      startTime,
      endTime,
      capacity,
      avgConsultTimeMins
    });

    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Action Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-main flex items-center gap-2.5">
            <Clock className="text-teal-600 dark:text-teal-400" size={26} />
            OPD Doctor Slot & Capacity Management
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Configure consultation time slots, patient capacities, and average turn durations for specialists.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Add Consultation Slot
        </button>
      </div>

      {/* Metric Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card bg-bg-surface p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Active Slots</div>
            <div className="text-2xl font-black text-text-main mt-1">{filteredSlots.length}</div>
            <div className="text-[0.75rem] text-teal-600 dark:text-teal-400 mt-1">Configured for {filterDate || 'all dates'}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Clock size={22} />
          </div>
        </div>

        <div className="glass-card bg-bg-surface p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Total Capacity</div>
            <div className="text-2xl font-black text-text-main mt-1">{totalCapacity} <span className="text-xs text-text-muted font-normal">Patients</span></div>
            <div className="text-[0.75rem] text-emerald-600 dark:text-emerald-400 mt-1">{totalBooked} Already Booked</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
        </div>

        <div className="glass-card bg-bg-surface p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Slot Occupancy</div>
            <div className="text-2xl font-black text-text-main mt-1">{occupancyPct}%</div>
            <div className="w-24 bg-border-subtle h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, occupancyPct)}%` }} />
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Sparkles size={22} />
          </div>
        </div>

        <div className="glass-card bg-bg-surface p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Avg Consult Duration</div>
            <div className="text-2xl font-black text-text-main mt-1">10 – 15 <span className="text-xs text-text-muted font-normal">mins</span></div>
            <div className="text-[0.75rem] text-teal-600 dark:text-teal-400 mt-1">Used for Queue Wait Est.</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Stethoscope size={22} />
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-card bg-bg-surface p-4 rounded-xl border border-border-subtle flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold">
            <Filter size={14} className="text-teal-600" /> Filter Slots:
          </div>

          <select
            className="form-select text-xs h-9 py-1 px-3 rounded-lg"
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="ALL">All Specialist Doctors ({doctors.length})</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>

          <input
            type="date"
            className="form-input text-xs h-9 py-1 px-3 rounded-lg max-w-[170px]"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div className="text-xs text-text-muted font-mono">
          Showing {filteredSlots.length} slot schedules
        </div>
      </div>

      {/* Slot Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center rounded-xl border border-border-subtle">
            <Clock size={40} className="mx-auto text-text-muted opacity-40 mb-3" />
            <h3 className="text-base font-bold text-text-main">No Slots Configured for Selected Criteria</h3>
            <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
              Click "Add Consultation Slot" above to define OPD consultation windows, maximum patient capacities, and consultation speeds.
            </p>
          </div>
        ) : (
          filteredSlots.map((slot) => {
            const doc = doctors.find((d) => d.id === slot.doctorId) || { name: slot.doctorName, specialty: slot.department, room: slot.room };
            const isFull = slot.bookedCount >= slot.capacity;
            const fillPct = Math.round(((slot.bookedCount || 0) / (slot.capacity || 1)) * 100);

            return (
              <div
                key={slot.id}
                className="glass-card bg-bg-surface rounded-xl p-5 border border-border-subtle hover:border-teal-500/50 transition-all flex flex-col justify-between gap-4 shadow-xs"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="mono text-[0.7rem] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        {slot.id}
                      </span>
                      <h4 className="text-base font-bold text-text-main mt-1.5">{slot.doctorName}</h4>
                      <p className="text-xs text-text-muted">{slot.department} • Room {slot.room}</p>
                    </div>
                    <Badge variant={isFull ? 'rose' : fillPct > 70 ? 'amber' : 'teal'}>
                      {isFull ? 'FULL' : 'ACTIVE'}
                    </Badge>
                  </div>

                  {/* Slot Details Box */}
                  <div className="bg-bg-surface-elevated rounded-lg p-3 my-3 border border-border-subtle flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-muted flex items-center gap-1">
                        <Calendar size={13} className="text-teal-600" /> Date:
                      </span>
                      <span className="font-semibold text-text-main">{slot.date}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-muted flex items-center gap-1">
                        <Clock size={13} className="text-teal-600" /> Timing Window:
                      </span>
                      <span className="font-bold text-teal-600 dark:text-teal-400">{slot.startTime} – {slot.endTime}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-muted flex items-center gap-1">
                        <Stethoscope size={13} className="text-teal-600" /> Avg Consult Speed:
                      </span>
                      <span className="font-semibold text-text-main">{slot.avgConsultTimeMins || 12} mins / patient</span>
                    </div>
                  </div>

                  {/* Capacity Progress */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-text-muted font-medium">Slot Booking Capacity</span>
                      <span className="font-bold text-text-main">
                        {slot.bookedCount || 0} / {slot.capacity} spots ({fillPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFull ? 'bg-rose-500' : fillPct > 75 ? 'bg-amber-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${Math.min(100, fillPct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-border-subtle">
                  <button
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    onClick={() => deleteDoctorSlot(slot.id)}
                  >
                    Delete Slot
                  </button>

                  <button
                    className="btn btn-secondary btn-sm h-8 px-3 text-xs"
                    onClick={() => {
                      setActiveNav({ module: 'opd', subModule: 'appointments' });
                      if (showToast) showToast(`Navigating to Appointment booking for ${slot.doctorName}...`, 'info');
                    }}
                  >
                    Book in Slot
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Slot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-teal-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-text-muted hover:text-text-main"
              onClick={() => setShowCreateModal(false)}
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-extrabold text-text-main mb-1 flex items-center gap-2">
              <Clock className="text-teal-600" size={20} /> Configure New Doctor Slot
            </h3>
            <p className="text-xs text-text-muted mb-5">
              Set availability window, max patient limit, and average consultation speed for a doctor.
            </p>

            <form onSubmit={handleCreateSlot} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Consulting Specialist Doctor</label>
                <select
                  className="form-select"
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  required
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty} • Room {d.room})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Patient Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="form-input"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <select className="form-select" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <select className="form-select" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Average Consultation Duration (Minutes per Patient)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    className="w-full accent-teal-600 cursor-pointer"
                    value={avgConsultTimeMins}
                    onChange={(e) => setAvgConsultTimeMins(e.target.value)}
                  />
                  <span className="mono font-bold text-sm text-teal-600 shrink-0 w-16 text-right">
                    {avgConsultTimeMins} mins
                  </span>
                </div>
                <p className="text-[0.75rem] text-text-muted mt-1">
                  Used by the queue engine at check-in: <code className="text-teal-600">Estimated Wait = Avg Duration × Patients Ahead</code>
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border-subtle">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Slot Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
