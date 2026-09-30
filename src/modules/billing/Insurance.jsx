import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Check } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Insurance = () => {
  const { patients, showToast } = useHospital();

  const [insuredPatients, setInsuredPatients] = useState(
    patients.filter((p) => p.insurance && p.insurance.provider !== 'Self-Pay (Cash)')
  );

  const handleVerify = (name) => {
    showToast(`Insurance policy verified and active for ${name}.`, 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Patient Health Insurance & Policy Verification
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Check patient medical insurance coverage, approved cashless limit, and policy numbers.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Insurance Company</th>
              <th>Policy Number</th>
              <th>Total Coverage</th>
              <th>Approved Cashless Limit</th>
              <th>TPA Partner</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {insuredPatients.map((p) => (
              <tr key={p.id}>
                <td className="font-bold text-text-main">{p.name}</td>
                <td className="text-teal-600 font-semibold">{p.insurance.provider}</td>
                <td><span className="mono text-[0.8rem]">{p.insurance.policyNo}</span></td>
                <td className="mono font-semibold">{p.insurance.coverage}</td>
                <td className="mono font-bold text-emerald-600">
                  {p.insurance.approvedPreAuth}
                </td>
                <td className="text-[0.8rem] text-text-muted">{p.insurance.tpa}</td>
                <td><Badge variant="emerald" size="sm">Policy Active</Badge></td>
                <td className="text-right">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleVerify(p.name)}
                  >
                    <Check size={13} /> Verify Policy
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
