import React from 'react';
import { Scissors, Activity, FileText, CheckCircle2, User } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const Surgery = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Live Surgery Room Monitor
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Real-time tracking of ongoing surgery in Modular OT 1.
          </p>
        </div>
      </div>

      <div className="glass-card flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-2.5 border-b border-border-subtle pb-3">
          <div>
            <h3 className="text-[1.1rem] text-teal-600 font-bold">
              Active Surgery: Heart Bypass Surgery (CABG)
            </h3>
            <span className="text-[0.825rem] text-text-muted">Room: Modular OT 1 • Patient: M. K. Nambiar (61 yrs, Male)</span>
          </div>
          <Badge variant="rose" dot>Surgery In-Progress (2h 15m elapsed)</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-bg-surface-elevated p-3.5 rounded-md">
            <span className="text-[0.725rem] text-text-muted uppercase font-bold">Anesthesia Type</span>
            <div className="font-extrabold text-text-main mt-1 text-base">General Anesthesia</div>
          </div>
          <div className="bg-bg-surface-elevated p-3.5 rounded-md">
            <span className="text-[0.725rem] text-text-muted uppercase font-bold">Blood Loss</span>
            <div className="font-extrabold text-amber-600 mt-1 text-base">250 mL (Normal / Stable)</div>
          </div>
          <div className="bg-bg-surface-elevated p-3.5 rounded-md">
            <span className="text-[0.725rem] text-text-muted uppercase font-bold">Heart Grafts Placed</span>
            <div className="font-extrabold text-teal-600 mt-1 text-base">3 Grafts Successfully Attached</div>
          </div>
          <div className="bg-bg-surface-elevated p-3.5 rounded-md">
            <span className="text-[0.725rem] text-text-muted uppercase font-bold">Sponge & Tool Count</span>
            <div className="font-extrabold text-emerald-600 mt-1 text-base">✓ All 10/10 Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
