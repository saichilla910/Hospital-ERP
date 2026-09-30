import React from 'react';
import { Building, Users, Bed, ShieldCheck, HeartPulse, Plus, Eye } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const WardManagement = () => {
  const { wards, setActiveNav, showToast } = useHospital();

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-2xl font-extrabold text-text-main">
            Hospital Wards Overview
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Overview of all hospital rooms and wards, available beds, and in-charge nurses.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
        >
          <Bed size={16} /> Bed Availability Matrix
        </button>
      </div>

      {/* Wards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {wards.map((w) => {
          const occPct = ((w.occupiedBeds / w.totalBeds) * 100).toFixed(0);
          return (
            <div
              key={w.id}
              className="glass-card glass-card-interactive flex flex-col gap-4 cursor-pointer"
              onClick={() => {
                showToast(`Viewing ${w.name}: ${w.totalBeds - w.occupiedBeds} beds available.`, 'info');
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg text-text-main font-bold">{w.name}</h3>
                  <p className="text-[0.775rem] text-text-muted mt-0.5">{w.floor} • {w.type}</p>
                </div>
                <Badge variant={occPct > 85 ? 'rose' : 'teal'}>
                  {occPct}% Occupied
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-bg-surface-elevated p-3 rounded-md text-[0.825rem]">
                <div>
                  <span className="text-text-muted">Total Beds:</span>
                  <div className="font-bold text-text-main mt-0.5">{w.totalBeds} Beds</div>
                </div>
                <div>
                  <span className="text-text-muted">Occupied Beds:</span>
                  <div className="font-bold text-rose-600 mt-0.5">{w.occupiedBeds} Beds</div>
                </div>
                <div>
                  <span className="text-text-muted">Available Beds:</span>
                  <div className="font-bold text-emerald-600 mt-0.5">{w.totalBeds - w.occupiedBeds} Beds Free</div>
                </div>
                <div>
                  <span className="text-text-muted">Nurse Ratio:</span>
                  <div className="font-bold text-teal-600 mt-0.5">{w.ratio}</div>
                </div>
              </div>

              <div>
                <span className="text-xs text-text-muted">In-Charge Nurse:</span>
                <div className="text-[0.875rem] font-semibold text-text-main mt-0.5">
                  {w.nurseInCharge}
                </div>
              </div>

              <div
                className="flex gap-2 mt-auto pt-2.5 border-t border-border-subtle"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn btn-secondary btn-sm flex-1"
                  onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
                >
                  <Eye size={13} /> View Beds
                </button>
                <button
                  className="btn btn-primary btn-sm flex-1"
                  onClick={() => setActiveNav({ module: 'ipd', subModule: 'nursing' })}
                >
                  Nursing Desk
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
