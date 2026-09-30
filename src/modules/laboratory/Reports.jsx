import React from 'react';
import { FileText, Printer, CheckCircle2, AlertOctagon, Eye } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Reports = () => {
  const { labOrders, openModal } = useHospital();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Lab Test Reports
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            View verified patient lab test reports and print official result slips.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Patient Name</th>
              <th>Investigation Panel</th>
              <th>Department</th>
              <th>Verified Pathologist</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labOrders.map((lab) => (
              <tr key={lab.id}>
                <td>
                  <span className="mono font-bold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded border border-border-subtle">
                    {lab.orderNo}
                  </span>
                </td>
                <td className="font-bold text-text-main">{lab.patientName}</td>
                <td className="font-semibold text-text-main">{lab.testName}</td>
                <td className="text-[0.8rem] text-text-muted">{lab.category}</td>
                <td className="text-[0.85rem] text-indigo-600 font-semibold">{lab.verifiedBy}</td>
                <td><Badge variant="emerald" size="sm">Verified</Badge></td>
                <td className="text-right">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openModal('lab', lab)}
                  >
                    <Eye size={13} /> View & Print Report
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
