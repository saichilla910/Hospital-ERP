import React, { useState } from 'react';
import { Bed, Wind, Activity, User, Plus, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const BedManagement = () => {
  const { wards, updateBedStatus, setActiveNav } = useHospital();
  const [activeWardId, setActiveWardId] = useState(wards[0].id);
  const [selectedBed, setSelectedBed] = useState(null);

  const currentWard = wards.find((w) => w.id === activeWardId) || wards[0];

  const handleBedStatusToggle = (wardId, bedNo, newStatus) => {
    updateBedStatus(wardId, bedNo, newStatus);
    setSelectedBed(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display">
            Ward Bed Management
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            View live bed occupancy across all wards and admit, transfer, or discharge patients.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setActiveNav({ module: 'ipd', subModule: 'admissions' })}
        >
          <Plus size={16} /> Admit Patient
        </button>
      </div>

      {/* Ward Selector Tabs & Legend */}
      <div className="glass-card p-4 sm:p-5 flex justify-between items-center flex-wrap gap-4 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {wards.map((ward) => {
            const isSelected = ward.id === activeWardId;
            return (
              <button
                key={ward.id}
                onClick={() => {
                  setActiveWardId(ward.id);
                  setSelectedBed(null);
                }}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} text-xs h-10 px-4 rounded-lg`}
              >
                <Bed size={15} /> {ward.name} ({ward.occupiedBeds}/{ward.totalBeds})
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-text-muted font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cleaning / Prep
          </div>
        </div>
      </div>

      {/* Main Floor Grid Layout */}
      <div className={`grid gap-6 ${selectedBed ? 'responsive-grid-split' : 'grid-cols-1'}`}>
        {/* Ward Bed Grid */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
            <div>
              <h3 className="text-base sm:text-lg text-text-main font-bold">{currentWard.name}</h3>
              <p className="text-xs text-text-dim mt-0.5 font-medium">
                {currentWard.floor} • In-Charge: {currentWard.nurseInCharge} • Ratio: {currentWard.ratio}
              </p>
            </div>
            <span className="text-xs font-semibold text-text-main bg-bg-surface-elevated py-1 px-2.5 rounded-lg border border-border-subtle">
              Occupancy: {((currentWard.occupiedBeds / currentWard.totalBeds) * 100).toFixed(0)}%
            </span>
          </div>

          {/* Bed Cards Matrix (min ~220px, 16px gap, equal heights) */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {currentWard.beds.map((bed) => {
              const isSelected = selectedBed?.bedNo === bed.bedNo;
              const statusClass = bed.status === 'Occupied' ? 'occupied' : bed.status === 'Available' ? 'available' : 'cleaning';

              return (
                <div
                  key={bed.bedNo}
                  onClick={() => setSelectedBed(bed)}
                  className={`bed-card ${statusClass} cursor-pointer ${
                    isSelected ? 'ring-2 ring-teal-500 shadow-sm' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="mono font-bold text-sm text-text-main">
                      {bed.bedNo}
                    </span>
                    <Badge variant={bed.status === 'Occupied' ? 'rose' : bed.status === 'Available' ? 'emerald' : 'amber'} size="sm">
                      {bed.status}
                    </Badge>
                  </div>

                  <div className={`text-xs font-semibold min-h-[36px] flex items-center ${bed.status === 'Occupied' ? 'text-text-main' : 'text-text-dim'}`}>
                    {bed.patientName !== 'None' ? bed.patientName : '— Available for Admission —'}
                  </div>

                  {/* Bed Features Tags */}
                  <div className="flex items-center gap-2 text-[11px] mt-auto pt-2 border-t border-border-subtle">
                    {bed.oxygen && (
                      <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1 font-semibold">
                        <Wind size={12} /> O2 Port
                      </span>
                    )}
                    {bed.ventilator && (
                      <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-semibold">
                        <Activity size={12} /> Vent
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Bed Inspector Drawer */}
        {selectedBed && (
          <div className="glass-card flex flex-col gap-4 bg-bg-surface-elevated rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-xs">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <div>
                <span className="text-[0.7rem] text-text-dim uppercase tracking-wider font-semibold">Bed Overview</span>
                <h3 className="text-lg text-text-main mt-0.5 font-bold">Bed {selectedBed.bedNo}</h3>
              </div>
              <Badge variant={selectedBed.status === 'Occupied' ? 'rose' : selectedBed.status === 'Available' ? 'emerald' : 'amber'}>
                {selectedBed.status}
              </Badge>
            </div>

            <div className="flex flex-col gap-2.5 text-[0.85rem]">
              <div>
                <span className="text-text-dim text-xs">Current Patient:</span>
                <div className="font-bold text-text-main mt-0.5">
                  {selectedBed.patientName !== 'None' ? selectedBed.patientName : 'No patient currently admitted'}
                </div>
              </div>

              {selectedBed.diagnosis !== 'None' && (
                <div>
                  <span className="text-text-dim text-xs">Diagnosis:</span>
                  <div className="text-teal-600 font-semibold">{selectedBed.diagnosis}</div>
                </div>
              )}

              {selectedBed.doctor !== 'None' && (
                <div>
                  <span className="text-text-dim text-xs">Doctor in Charge:</span>
                  <div className="text-text-main">{selectedBed.doctor}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle">
                <div>
                  <span className="text-text-dim text-xs">Oxygen Support:</span>
                  <div className={`font-semibold ${selectedBed.oxygen ? 'text-emerald-600' : 'text-text-dim'}`}>
                    {selectedBed.oxygen ? 'Connected' : 'Not Connected'}
                  </div>
                </div>
                <div>
                  <span className="text-text-dim text-xs">Monitor:</span>
                  <div className="text-teal-600 font-semibold">{selectedBed.telemetry || 'Active'}</div>
                </div>
              </div>
            </div>

            {/* Quick Status Modifiers */}
            <div className="mt-auto pt-4 border-t border-border-subtle flex flex-col gap-2">
              <span className="text-xs font-bold text-text-dim uppercase">Quick Actions</span>
              {selectedBed.status === 'Occupied' ? (
                <>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleBedStatusToggle(currentWard.id, selectedBed.bedNo, 'Cleaning')}
                  >
                    Discharge Patient & Clean Bed
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveNav({ module: 'ipd', subModule: 'nursing' })}
                  >
                    View Nursing Chart
                  </button>
                </>
              ) : selectedBed.status === 'Cleaning' ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleBedStatusToggle(currentWard.id, selectedBed.bedNo, 'Available')}
                >
                  <CheckCircle2 size={14} /> Mark Ready for Next Patient
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveNav({ module: 'ipd', subModule: 'admissions' })}
                >
                  <User size={14} /> Admit Patient to this Bed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
