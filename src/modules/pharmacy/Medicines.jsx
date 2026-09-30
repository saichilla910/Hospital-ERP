import React, { useState } from 'react';
import { Pill, Search, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Medicines = () => {
  const { pharmacyMedicines, dispenseMedicine, setActiveNav } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMeds = pharmacyMedicines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.salt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Medicine Catalog & Stock
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Browse available medicines, check shelf locations, unit prices, and dispense stock.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setActiveNav({ module: 'pharmacy', subModule: 'dispensing' })}
        >
          <Plus size={16} /> Dispense Medicine
        </button>
      </div>

      <div className="glass-card p-3.5">
        <div className="relative w-full flex items-center">
          <Search size={16} className="text-teal-600 dark:text-teal-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search by Medicine Name, generic salt, batch number, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input form-search-input h-11 pr-10 text-sm rounded-xl w-full"
            style={{ paddingLeft: '42px' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 text-text-dim hover:text-text-main p-1 rounded-md transition-colors"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Generic Formula</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit Price (₹)</th>
              <th>Shelf Location</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeds.map((med) => (
              <tr key={med.id}>
                <td>
                  <div className="font-bold text-text-main">
                    <div className="flex items-center gap-1.5">
                      <Pill size={14} className="text-teal-600" /> {med.name}
                    </div>
                  </div>
                  <div className="text-[0.75rem] text-text-dim">Batch: {med.batchNo}</div>
                </td>
                <td className="text-[0.85rem] text-text-muted">{med.salt}</td>
                <td><span className="badge badge-gray text-[0.7rem]">{med.category}</span></td>
                <td>
                  <span className={`mono font-bold ${med.stock <= med.minStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {med.stock} Units
                  </span>
                </td>
                <td className="mono font-semibold">₹{med.unitPrice.toFixed(2)}</td>
                <td className="text-[0.8rem] text-teal-600 font-semibold">{med.rack}</td>
                <td>
                  <Badge variant={med.status === 'In-Stock' ? 'emerald' : med.status === 'Low Stock' ? 'amber' : 'rose'}>
                    {med.status}
                  </Badge>
                </td>
                <td className="text-right">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={med.stock <= 0}
                    onClick={() => dispenseMedicine(med.id, 1)}
                    title="Dispense 1 Unit"
                  >
                    Quick Dispense (1u)
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
