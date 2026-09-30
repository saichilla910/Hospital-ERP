import React from 'react';
import { Building2, Receipt, Printer, Eye, CreditCard } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const IPDBilling = () => {
  const { billingInvoices, openModal } = useHospital();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Inpatient (IPD) Hospital Bills
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Detailed breakdown of room charges, doctor visits, surgery, pharmacy, and insurance balance. Click any row to view full bill.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Bill Number</th>
              <th>Patient Name</th>
              <th>Bill Type</th>
              <th>Total Amount (₹)</th>
              <th>Insurance Covered</th>
              <th>Advance Paid</th>
              <th>Balance Due (₹)</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {billingInvoices.map((inv) => (
              <tr
                key={inv.id}
                onClick={() => openModal('invoice', inv)}
                className="cursor-pointer hover:bg-bg-surface-elevated/60 transition-colors"
              >
                <td>
                  <span className="mono font-bold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded">
                    {inv.billNo}
                  </span>
                </td>
                <td className="font-bold text-text-main">{inv.patientName}</td>
                <td className="text-[0.8rem] text-text-muted">{inv.type}</td>
                <td className="mono font-semibold">₹{inv.subtotal.toLocaleString()}</td>
                <td className="mono text-cyan-600">₹{inv.insuranceClaimed.toLocaleString()}</td>
                <td className="mono text-emerald-600">₹{inv.advancePaid.toLocaleString()}</td>
                <td className={`mono font-extrabold ${inv.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ₹{inv.balanceDue.toLocaleString()}
                </td>
                <td>
                  <Badge variant={inv.status === 'Paid' ? 'emerald' : 'amber'}>
                    {inv.status}
                  </Badge>
                </td>
                <td className="text-right">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('invoice', inv);
                    }}
                  >
                    <Printer size={13} /> View & Print Bill
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
