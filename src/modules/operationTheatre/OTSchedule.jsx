import React, { useState } from 'react';
import { Scissors, Calendar, Clock, User, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const OTSchedule = () => {
  const { operationTheatres: initialTheatres, showToast } = useHospital();
  const [theatres, setTheatres] = useState(initialTheatres);

  const toggleStatus = (otId) => {
    setTheatres((prev) =>
      prev.map((ot) => {
        if (ot.id === otId) {
          const nextStatus =
            ot.status === 'In-Progress'
              ? 'Recovery (PACU)'
              : ot.status === 'Emergency Prep'
              ? 'In-Progress'
              : ot.status === 'Recovery (PACU)'
              ? 'Cleaning & Ready'
              : 'In-Progress';
          showToast(`Updated ${ot.name} status to: ${nextStatus}`, 'success');
          return { ...ot, status: nextStatus };
        }
        return ot;
      })
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Operation Theatre (OT) Surgery Schedule
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Surgery room allocations and live operations. Click any room card to change surgery status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {theatres.map((ot) => (
          <div
            key={ot.id}
            className="glass-card glass-card-interactive flex flex-col gap-3.5 cursor-pointer transition-all"
            onClick={() => toggleStatus(ot.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[1.1rem] font-bold text-text-main">{ot.name}</h3>
                <span className="mono text-[0.75rem] text-teal-600 font-semibold">{ot.timing}</span>
              </div>
              <Badge variant={ot.status === 'In-Progress' ? 'rose' : ot.status === 'Emergency Prep' ? 'amber' : 'teal'} dot={ot.status === 'In-Progress'}>
                {ot.status}
              </Badge>
            </div>

            <div className="bg-bg-surface-elevated p-3 rounded-md">
              <span className="text-[0.7rem] text-text-muted uppercase font-bold">Surgery:</span>
              <div className="text-[0.95rem] font-bold text-teal-600 mt-0.5">
                {ot.surgery}
              </div>
              <div className="text-[0.825rem] text-text-main mt-1">
                Patient: <strong>{ot.patient}</strong>
              </div>
            </div>

            <div className="text-[0.8rem] text-text-muted flex flex-col gap-1">
              <div>Operating Surgeon: <strong className="text-text-main">{ot.surgeon}</strong></div>
              <div>Anesthesia Specialist: <strong className="text-text-main">{ot.anesthetist}</strong></div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-2.5 border-t border-border-subtle text-[0.75rem]">
              <span className={`font-semibold ${ot.preOpDone ? 'text-emerald-600' : 'text-amber-600'}`}>
                {ot.preOpDone ? '✓ Pre-Op Cleared' : '⏳ Pre-Op Pending'}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus(ot.id);
                }}
              >
                <RefreshCw size={12} /> Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
