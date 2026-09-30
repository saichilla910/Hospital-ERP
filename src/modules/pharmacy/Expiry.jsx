import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Trash2, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Expiry = () => {
  const { showToast } = useHospital();

  const [expiringBatches, setExpiringBatches] = useState([
    { id: 1, name: 'Deriphyllin Retard 150mg', batch: 'DP-2291', expiry: '2026-04-28', daysLeft: 42, stock: 65, action: 'Return to Vendor' },
    { id: 2, name: 'Inj. Meropenem 1g (Meromac)', batch: 'MP-1082', expiry: '2026-10-10', daysLeft: 206, stock: 180, action: 'Dispense First (Near Expiry)' },
    { id: 3, name: 'Augmentin 625 Duo', batch: 'AG-4410', expiry: '2026-11-20', daysLeft: 247, stock: 240, action: 'Dispense First (Near Expiry)' }
  ]);

  const handleReturnToVendor = (batch) => {
    showToast(`Batch ${batch.batch} of ${batch.name} (${batch.stock} units) flagged for vendor return credit.`, 'warning');
  };

  const handleFlagFirst = (batch) => {
    showToast(`Batch ${batch.batch} prioritized at counter for immediate dispensing.`, 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main flex items-center gap-2">
            <AlertTriangle size={22} className="text-rose-600" /> Medicine Expiry Tracker
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Track medicines nearing expiration date and return or dispense them early.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Medication Name</th>
              <th>Batch Number</th>
              <th>Expiry Date</th>
              <th>Days Remaining</th>
              <th>Current Units</th>
              <th>Recommended Action</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {expiringBatches.map((b) => (
              <tr key={b.id}>
                <td className="font-bold text-text-main">{b.name}</td>
                <td>
                  <span className="mono font-semibold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded border border-border-subtle">
                    {b.batch}
                  </span>
                </td>
                <td className={`font-bold ${b.daysLeft <= 60 ? 'text-rose-600' : 'text-amber-600'}`}>
                  {b.expiry}
                </td>
                <td>
                  <Badge variant={b.daysLeft <= 60 ? 'rose' : 'amber'} dot={b.daysLeft <= 60}>
                    {b.daysLeft} Days Left
                  </Badge>
                </td>
                <td className="mono font-bold">{b.stock} Units</td>
                <td className="text-[0.85rem] text-text-main">{b.action}</td>
                <td className="text-right">
                  <button
                    className={`btn btn-sm ${b.daysLeft <= 60 ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => (b.daysLeft <= 60 ? handleReturnToVendor(b) : handleFlagFirst(b))}
                  >
                    {b.daysLeft <= 60 ? 'Return Batch' : 'Prioritize'}
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
