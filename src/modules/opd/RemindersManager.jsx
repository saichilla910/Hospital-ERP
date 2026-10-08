import React, { useState } from 'react';
import { MessageSquare, Send, CheckCheck, Smartphone, Clock, Calendar, AlertCircle, Sparkles, User, RefreshCw } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const RemindersManager = () => {
  const { opdAppointments, sendAppointmentReminder, sendBatchReminders, showToast } = useHospital();

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [targetDate, setTargetDate] = useState(tomorrowStr);
  const [channel, setChannel] = useState('WhatsApp');

  const filteredAppointments = (opdAppointments || []).filter((apt) => apt.date === targetDate);
  const sentCount = filteredAppointments.filter((apt) => apt.reminderSent).length;
  const pendingCount = filteredAppointments.length - sentCount;
  const deliveryRate = filteredAppointments.length > 0 ? Math.round((sentCount / filteredAppointments.length) * 100) : 0;

  const handleBatchSend = () => {
    sendBatchReminders(targetDate, channel);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-main flex items-center gap-2.5">
            <MessageSquare className="text-emerald-600 dark:text-emerald-400" size={26} />
            Automated SMS & WhatsApp Appointment Reminders
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Dispatch pre-visit notifications the day before consultation to reduce patient no-shows and reception crowding.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="btn btn-secondary" onClick={() => setChannel(channel === 'WhatsApp' ? 'SMS' : 'WhatsApp')}>
            <Smartphone size={15} /> Active Channel: <strong className="text-emerald-600 dark:text-emerald-400">{channel}</strong>
          </button>
          
          <button className="btn btn-primary" onClick={handleBatchSend} disabled={filteredAppointments.length === 0}>
            <Send size={16} /> Send Reminders ({filteredAppointments.length})
          </button>
        </div>
      </div>

      {/* Metric Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card bg-bg-surface p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Scheduled Visits for Target Date</div>
            <div className="text-2xl font-black text-text-main mt-1">{filteredAppointments.length} <span className="text-xs text-text-muted font-normal">Patients</span></div>
            <div className="text-[0.75rem] text-teal-600 dark:text-teal-400 mt-1">Date: {targetDate}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Calendar size={22} />
          </div>
        </div>

        <div className="glass-card bg-bg-surface p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Dispatched Reminders</div>
            <div className="text-2xl font-black text-text-main mt-1">{sentCount} <span className="text-xs text-text-muted font-normal">Sent</span></div>
            <div className="text-[0.75rem] text-emerald-600 dark:text-emerald-400 mt-1">{pendingCount} Pending Dispatch</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCheck size={22} />
          </div>
        </div>

        <div className="glass-card bg-bg-surface p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Delivery Success Rate</div>
            <div className="text-2xl font-black text-text-main mt-1">{deliveryRate}%</div>
            <div className="w-24 bg-border-subtle h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${deliveryRate}%` }} />
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Sparkles size={22} />
          </div>
        </div>

        <div className="glass-card bg-bg-surface p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Estimated No-Show Reduction</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">-68%</div>
            <div className="text-[0.75rem] text-text-muted mt-1">Based on WhatsApp 1-day reminders</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Smartphone size={22} />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Live WhatsApp Template Preview + Dispatch List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WhatsApp Message Template Preview Card */}
        <div className="glass-card bg-bg-surface rounded-xl p-5 border border-border-subtle flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-subtle">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">
                {channel} Message Template Preview
              </h3>
            </div>

            {/* Smartphone Graphic Container */}
            <div className="bg-[#0b141a] text-white rounded-2xl p-4 shadow-xl border border-emerald-900/60 font-sans text-xs">
              <div className="flex items-center gap-2.5 pb-2.5 mb-3 border-b border-emerald-800/40">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  HC
                </div>
                <div>
                  <div className="font-bold text-white text-xs">HospitalCare Super Specialty</div>
                  <div className="text-[0.65rem] text-emerald-400">Verified Business Account ✓</div>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="bg-[#202c33] p-3 rounded-xl rounded-tl-none border border-emerald-800/40 text-slate-100 flex flex-col gap-2">
                <div className="font-semibold text-emerald-400 text-[0.75rem]">🏥 APPOINTMENT REMINDER</div>
                <p className="leading-relaxed">
                  Dear <strong className="text-white">Sneha Jennifer Thomas</strong>, this is a reminder for your upcoming OPD consultation tomorrow:
                </p>

                <div className="bg-[#111b21] p-2.5 rounded-lg text-[0.7rem] space-y-1 font-mono text-emerald-200 border border-emerald-900/40">
                  <div>👨‍⚕️ <strong>Doctor:</strong> Dr. Ananya Reddy</div>
                  <div>📅 <strong>Date:</strong> {targetDate}</div>
                  <div>⏰ <strong>Time Slot:</strong> 09:30 AM</div>
                  <div>📍 <strong>Location:</strong> OPD-302 (Block A)</div>
                  <div>🎟️ <strong>Token #:</strong> T-101</div>
                </div>

                <p className="text-[0.7rem] text-slate-300">
                  Please arrive 10 minutes prior for token check-in. Reply <strong className="text-emerald-400">1</strong> to Confirm or <strong className="text-rose-400">2</strong> to Reschedule.
                </p>

                <div className="text-[0.65rem] text-slate-400 text-right mt-1 font-mono">
                  18:00 • Delivered ✓✓
                </div>
              </div>
            </div>
          </div>

          <div className="text-[0.75rem] text-text-muted bg-bg-surface-elevated p-3 rounded-lg border border-border-subtle">
            💡 Reminders automatically query tomorrow's appointments and send personalized WhatsApp notifications via API gateway.
          </div>
        </div>

        {/* Reminders Dispatch Table */}
        <div className="lg:col-span-2 glass-card bg-bg-surface rounded-xl border border-border-subtle overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border-subtle flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-main">
                  Scheduled Patient Reminders List
                </h3>
                <span className="mono text-xs text-text-muted bg-bg-surface-elevated px-2 py-0.5 rounded border border-border-subtle">
                  {filteredAppointments.length} Total
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-text-muted font-medium">Target Date:</label>
                <input
                  type="date"
                  className="form-input text-xs py-1 px-2.5 h-8 rounded-md max-w-[150px]"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container overflow-x-auto">
              <table className="medicore-table w-full">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Mobile Phone</th>
                    <th>Consulting Specialist</th>
                    <th>Slot Time</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-text-muted text-xs">
                        No appointments found for date {targetDate}. Select another date or book new appointments.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-bg-surface-elevated/60 transition-colors">
                        <td>
                          <div className="font-bold text-text-main text-xs">{apt.patientName}</div>
                          <div className="text-[0.7rem] text-text-muted">{apt.reason}</div>
                        </td>
                        <td className="mono text-xs text-text-muted whitespace-nowrap">
                          {apt.patientPhone || '+91 98480 12345'}
                        </td>
                        <td>
                          <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">{apt.doctorName}</div>
                          <div className="text-[0.7rem] text-text-muted">{apt.department} • Room {apt.room}</div>
                        </td>
                        <td className="mono text-xs font-bold text-text-main whitespace-nowrap">{apt.time}</td>
                        <td>
                          <span className="badge badge-gray text-[0.7rem] flex items-center gap-1 w-max">
                            <Smartphone size={10} className="text-emerald-500" />
                            {apt.reminderChannel || channel}
                          </span>
                        </td>
                        <td>
                          {apt.reminderSent ? (
                            <Badge variant="emerald" dot>
                              Delivered ({apt.reminderTime || 'Sent'})
                            </Badge>
                          ) : (
                            <Badge variant="amber">
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="text-right">
                          <button
                            className={`btn btn-sm text-xs h-7.5 px-2.5 rounded-md ${
                              apt.reminderSent ? 'btn-secondary' : 'btn-primary'
                            }`}
                            onClick={() => sendAppointmentReminder(apt.id, channel)}
                          >
                            <Send size={11} /> {apt.reminderSent ? 'Resend' : 'Send Now'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-bg-surface-elevated border-t border-border-subtle flex justify-between items-center text-xs text-text-muted">
            <span>Automated WhatsApp Bot Active • HospitalCare Notification Hub</span>
            <button className="text-teal-600 hover:underline font-semibold cursor-pointer" onClick={handleBatchSend}>
              Dispatch All Pending ({pendingCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
