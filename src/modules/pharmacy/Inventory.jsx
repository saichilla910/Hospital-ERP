import React from 'react';
import { Boxes, AlertTriangle, CheckCircle2, ArrowDownCircle, Plus } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Inventory = () => {
  const { pharmacyMedicines } = useHospital();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Pharmacy Real-Time Stock & Warehouse Inventory
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Batch level inventory, re-order thresholds, cold-chain storage parameters, and stock valuation.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Batch #</th>
              <th>Current Stock</th>
              <th>Re-order Threshold</th>
              <th>Stock Status</th>
              <th>Storage Requirement</th>
            </tr>
          </thead>
          <tbody>
            {pharmacyMedicines.map((m) => {
              const isLow = m.stock <= m.minStock;
              return (
                <tr key={m.id}>
                  <td className="font-bold text-text-main">{m.name}</td>
                  <td><span className="mono text-[0.8rem]">{m.batchNo}</span></td>
                  <td>
                    <span className={`mono font-bold ${isLow ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {m.stock} Units
                    </span>
                  </td>
                  <td className="text-text-dim">Min: {m.minStock} Units</td>
                  <td>
                    <Badge variant={isLow ? 'rose' : 'emerald'} dot={isLow}>
                      {isLow ? 'Low Stock Warning' : 'Adequate'}
                    </Badge>
                  </td>
                  <td className="text-[0.8rem] text-teal-600 dark:text-teal-400">{m.rack}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
