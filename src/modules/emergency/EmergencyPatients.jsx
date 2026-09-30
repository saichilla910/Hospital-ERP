import React from 'react';
import { ShieldAlert, Activity, Bed, Clock, User, Stethoscope, Receipt } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const EmergencyPatients = () => {
  const { emergencyCases, setActiveNav, showToast } = useHospital();
  const redZoneCount = emergencyCases.filter((c) => c.triageColor === 'rose').length;
  const yellowZoneCount = emergencyCases.filter((c) => c.triageColor === 'amber').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border-subtle/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            Emergency Department Patient Tracking Board
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-normal">
            Real-time census of trauma arrivals, resuscitation status, and allocated acute care bays.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col">
          <span className="text-xs font-semibold text-text-muted">Active ER Cases</span>
          <span className="text-2xl font-bold text-text-main mt-1">{emergencyCases.length}</span>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-medium">Live Census</span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex flex-col">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Red Zone (Immediate)</span>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{redZoneCount}</span>
          <span className="text-[11px] text-rose-500 mt-1 font-medium">Resuscitation Active</span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Yellow Zone (Urgent)</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{yellowZoneCount}</span>
          <span className="text-[11px] text-amber-600 mt-1 font-medium">Under Observation</span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-border-subtle bg-bg-surface flex flex-col">
          <span className="text-xs font-semibold text-text-muted">Avg. Door-to-Doctor</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">8.5 min</span>
          <span className="text-[11px] text-emerald-500 mt-1 font-medium">Within Golden Hour</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container rounded-2xl border border-border-subtle bg-bg-surface overflow-hidden">
        <table className="medicore-table">
          <thead>
            <tr>
              <th className="py-3.5 px-5">Case #</th>
              <th className="py-3.5 px-5">Patient Name / Demographics</th>
              <th className="py-3.5 px-5">Urgency Acuity</th>
              <th className="py-3.5 px-5">Assigned Bay</th>
              <th className="py-3.5 px-5">Arrival Time</th>
              <th className="py-3.5 px-5">Chief Complaint / Condition</th>
              <th className="py-3.5 px-5">Care Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emergencyCases.map((er) => (
              <tr
                key={er.id}
                className="cursor-pointer hover:bg-bg-surface-elevated/70 transition-colors"
                onClick={() => showToast(`Selected Case ${er.caseNo} for ${er.patientName} (${er.assignedBay}).`, 'info')}
              >
                <td className="py-4 px-5">
                  <span className="mono font-semibold text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-900/40 inline-block leading-none">
                    {er.caseNo}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="font-semibold text-sm text-text-main leading-tight">{er.patientName}</div>
                  <div className="text-xs text-text-muted mt-1 font-medium">{er.age} yrs • {er.gender}</div>
                </td>
                <td className="py-4 px-5">
                  <Badge variant={er.triageColor} dot>
                    {er.triageLevel.split('-')[0]}
                  </Badge>
                </td>
                <td className="py-4 px-5 text-xs text-teal-600 dark:text-teal-400 font-bold whitespace-nowrap">
                  {er.assignedBay}
                </td>
                <td className="py-4 px-5 text-xs font-mono text-text-dim whitespace-nowrap">
                  {er.arrivalTime}
                </td>
                <td className="py-4 px-5 text-xs text-text-main max-w-[280px] leading-relaxed">
                  {er.chiefComplaint}
                </td>
                <td className="py-4 px-5">
                  <Badge variant="amber">
                    {er.status}
                  </Badge>
                </td>
                <td className="py-4 px-5 text-right">
                  <button
                    className="btn btn-primary min-h-[36px] px-4 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-2 ml-auto shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveNav({ module: 'emergency', subModule: 'billing' });
                    }}
                  >
                    <Receipt size={14} className="shrink-0" />
                    <span>Quick Bill</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
