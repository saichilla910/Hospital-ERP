import React from 'react';
import { Eye, Printer, FileText, CheckCircle2, ScanLine } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Reports = () => {
  const { radiologyOrders, openModal } = useHospital();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Completed Scan Reports & X-Rays
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Official doctor findings and medical scans. Click any card to inspect the scan and read full notes.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {radiologyOrders.map((rad) => (
          <div
            key={rad.id}
            className="glass-card glass-card-interactive flex justify-between items-center flex-wrap gap-4 cursor-pointer"
            onClick={() => openModal('radiology', rad)}
          >
            <div className="flex items-center gap-4">
              <img
                src={rad.pacsImage}
                alt="Scan Thumbnail"
                className="w-[68px] h-[68px] rounded-lg object-cover border border-border-subtle"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[1.05rem] font-bold text-text-main">
                    {rad.modality} — {rad.bodyPart}
                  </h3>
                  <Badge variant="emerald">Doctor Verified</Badge>
                </div>
                <div className="text-[0.8rem] text-text-muted mt-0.5">
                  Patient: <strong className="text-text-main">{rad.patientName}</strong> • Specialist: <span className="text-teal-600 font-semibold">{rad.radiologist}</span>
                </div>
                <div className="text-[0.8rem] text-text-main mt-1 bg-bg-surface-elevated px-2 py-1 rounded">
                  <strong>Doctor's Finding:</strong> {rad.impression}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('radiology', rad);
                }}
              >
                <Eye size={14} /> View Scan & Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
