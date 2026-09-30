import React, { useState } from 'react';
import { FileCheck, AlertCircle, CheckCircle2, Clock, Check } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const TPAClaims = () => {
  const { insuranceClaims: initialClaims, showToast } = useHospital();
  const [claims, setClaims] = useState(initialClaims);

  const handleApprove = (id, patientName, amount) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Claim Approved (Cashless)', approvedAmount: c.claimAmount } : c))
    );
    showToast(`Approved cashless insurance claim of ₹${amount.toLocaleString()} for ${patientName}!`, 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Insurance & Cashless Hospital Claims
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Track cashless hospital bills submitted to insurance companies and approved amounts.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Patient Name</th>
              <th>Insurance Company</th>
              <th>Bill Claimed</th>
              <th>Approved Amount</th>
              <th>Treatment Type</th>
              <th>Approval Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((clm) => (
              <tr key={clm.id}>
                <td>
                  <span className="mono font-bold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded">
                    {clm.id}
                  </span>
                </td>
                <td className="font-bold text-text-main">{clm.patientName}</td>
                <td>
                  <div className="font-semibold text-text-main">{clm.insurer}</div>
                  <div className="text-[0.75rem] text-text-muted">TPA: {clm.tpa}</div>
                </td>
                <td className="mono font-semibold">₹{clm.claimAmount.toLocaleString()}</td>
                <td className="mono font-bold text-emerald-600">
                  ₹{clm.approvedAmount.toLocaleString()}
                </td>
                <td><span className="badge badge-gray">{clm.claimType}</span></td>
                <td>
                  <Badge
                    variant={clm.status.includes('Approved') ? 'emerald' : clm.status.includes('Query') ? 'rose' : 'amber'}
                    dot={clm.status.includes('Query')}
                  >
                    {clm.status}
                  </Badge>
                </td>
                <td className="text-right">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApprove(clm.id, clm.patientName, clm.claimAmount)}
                    disabled={clm.status.includes('Approved')}
                  >
                    <Check size={13} /> {clm.status.includes('Approved') ? 'Approved' : 'Approve Claim'}
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
