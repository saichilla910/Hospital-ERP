import React from 'react';
import { ScanLine, Play, Eye, Clock, AlertTriangle } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Worklist = () => {
  const { radiologyOrders, openModal } = useHospital();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Pending Scans & Queue
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            List of booked X-Rays, MRI, and CT scans waiting for scanner or ready for viewing. Click any row to view.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Patient Name</th>
              <th>Scan Type</th>
              <th>Body Area</th>
              <th>Urgency</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {radiologyOrders.map((rad) => (
              <tr
                key={rad.id}
                onClick={() => openModal('radiology', rad)}
                className="cursor-pointer hover:bg-bg-surface-elevated/60 transition-colors"
              >
                <td>
                  <span className="mono font-bold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded">
                    {rad.orderNo}
                  </span>
                </td>
                <td className="font-bold text-text-main">{rad.patientName}</td>
                <td className="font-semibold text-teal-600">{rad.modality}</td>
                <td>{rad.bodyPart}</td>
                <td>
                  <Badge variant={rad.urgency.includes('STAT') ? 'rose' : 'teal'} dot={rad.urgency.includes('STAT')}>
                    {rad.urgency.includes('STAT') ? 'Emergency STAT' : 'Routine'}
                  </Badge>
                </td>
                <td><span className="badge badge-emerald">Ready to View</span></td>
                <td className="text-right">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('radiology', rad);
                    }}
                  >
                    <Eye size={13} /> View Scan
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
