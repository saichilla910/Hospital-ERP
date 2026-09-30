import React, { useState } from 'react';
import { Activity, CheckCircle2, RefreshCw, Cpu, Sparkles } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useHospital } from '../../context/HospitalContext';

export const Processing = () => {
  const { showToast } = useHospital();
  const [analyzers, setAnalyzers] = useState([
    { id: 1, name: 'Hematology Blood Counter (Sysmex XN)', dept: 'Blood Counts & CBC', status: 'Running', queue: 6, calibration: 'Calibrated & Ready (Pass)', temp: '22.4 °C' },
    { id: 2, name: 'Biochemistry Analyzer (Roche Cobas)', dept: 'Liver, Kidney & Sugar', status: 'Running', queue: 14, calibration: 'Quality Check Passed', temp: '37.0 °C' },
    { id: 3, name: 'Microbiology Culture Machine (VITEK)', dept: 'Bacteria & Sensitivity', status: 'Processing', queue: 8, calibration: 'Calibrated & Ready', temp: '35.5 °C' },
    { id: 4, name: 'Blood Gas Analyzer (Radiometer)', dept: 'Emergency Blood Oxygen & pH', status: 'Ready', queue: 0, calibration: 'Self-Calibrated 15m ago', temp: '37.0 °C' }
  ]);

  const handleSelfCheck = (name) => {
    showToast(`Quick self-diagnostic test completed for ${name} — 100% healthy.`, 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Lab Machine Status & Testing Queue
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Live status of hospital lab testing machines, samples in queue, and test health.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => showToast('All laboratory machine telemetry refreshed.', 'info')}
        >
          <RefreshCw size={15} /> Refresh All Machines
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {analyzers.map((a) => (
          <div
            key={a.id}
            className="glass-card glass-card-interactive flex flex-col justify-between h-full gap-3.5 cursor-pointer rounded-md border border-border-subtle hover:border-teal-500/40 transition-all shadow-xs"
            onClick={() => handleSelfCheck(a.name)}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-sm sm:text-base text-text-main font-bold leading-snug">{a.name}</h3>
                <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5 font-semibold">{a.dept}</p>
              </div>
              <Badge variant={a.status === 'Running' ? 'emerald' : a.status === 'Processing' ? 'amber' : 'teal'} dot>{a.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-bg-surface-elevated p-3 rounded-md text-xs border border-border-subtle/50">
              <div>
                <span className="text-text-muted">Samples in Queue:</span>
                <div className="font-bold text-text-main text-sm mt-0.5">{a.queue} Samples</div>
              </div>
              <div>
                <span className="text-text-muted">Machine Temp:</span>
                <div className="mono font-bold text-teal-600 dark:text-teal-400 text-sm mt-0.5">{a.temp}</div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-text-muted pt-1 border-t border-border-subtle/40">
              <span className="truncate mr-2">Health: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{a.calibration}</strong></span>
              <button
                className="btn btn-outline btn-sm shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelfCheck(a.name);
                }}
              >
                Self-Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
