import React, { useState } from 'react';
import { Boxes, Plus, CheckCircle2, AlertTriangle, Truck, ShoppingCart, Check, RefreshCw } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Inventory = () => {
  const { showToast } = useHospital();

  const [supplies, setSupplies] = useState([
    { code: 'SUP-011', name: 'Disposable Sterile Syringes 5mL', category: 'General', stock: 4800, minStock: 1000, unitPrice: 4.5, location: 'Shelf Bay 2', status: 'Adequate' },
    { code: 'SUP-012', name: 'IV Cannula (Pink 20G)', category: 'IV Items', stock: 1200, minStock: 500, unitPrice: 18.0, location: 'Shelf Bay 3', status: 'Adequate' },
    { code: 'SUP-013', name: 'Sterile Surgical Gloves (Medium)', category: 'Surgical', stock: 350, minStock: 600, unitPrice: 45.0, location: 'OT Store', status: 'Low Stock' },
    { code: 'SUP-014', name: 'N95 Protective Face Masks', category: 'Safety', stock: 2400, minStock: 800, unitPrice: 22.0, location: 'Shelf Bay 1', status: 'Adequate' },
    { code: 'SUP-015', name: 'Breathing Tubes (Adult)', category: 'ICU Care', stock: 85, minStock: 100, unitPrice: 450.0, location: 'ICU Store', status: 'Low Stock' }
  ]);

  const [indents, setIndents] = useState([
    { indentNo: 'REQ-991', fromDept: 'ICU Ward', items: '50 IV Cannula, 100 Syringes', requestedBy: 'Sr. Reena Mathews', status: 'Approved & Dispatched' },
    { indentNo: 'REQ-992', fromDept: 'Emergency Room', items: '20 Wound Bandages, 30 Saline Bottles', requestedBy: 'Dr. Arvind Swaminathan', status: 'Pending Delivery' }
  ]);

  const handleReorder = (code, name) => {
    setSupplies((prev) =>
      prev.map((s) => (s.code === code ? { ...s, stock: s.stock + 500, status: 'Adequate' } : s))
    );
    showToast(`Order placed for 500 units of ${name}. Stock replenished!`, 'success');
  };

  const handleApproveIndent = (indentNo) => {
    setIndents((prev) =>
      prev.map((ind) => (ind.indentNo === indentNo ? { ...ind, status: 'Approved & Dispatched' } : ind))
    );
    showToast(`Request ${indentNo} approved and dispatched from warehouse!`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.4rem] font-extrabold text-text-main">
            Hospital Supplies & Store Inventory
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Track hospital stock, consumables, gloves, syringes, and department orders.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => showToast('New stock order request created and sent to warehouse manager.', 'success')}
        >
          <Plus size={16} /> + Order More Supplies
        </button>
      </div>

      {/* Supplies Table */}
      <div className="glass-card flex flex-col gap-4">
        <h3 className="text-[1.05rem] font-bold text-text-main">Hospital Supply Items & Current Stock</h3>

        <div className="table-container">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Supply Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Needed</th>
                <th>Price / Unit</th>
                <th>Shelf Location</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplies.map((s) => (
                <tr key={s.code}>
                  <td><span className="mono font-bold text-teal-600">{s.code}</span></td>
                  <td className="font-bold text-text-main">{s.name}</td>
                  <td><span className="badge badge-gray">{s.category}</span></td>
                  <td className={`mono font-bold ${s.status === 'Low Stock' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {s.stock} Units
                  </td>
                  <td className="text-text-muted">Min: {s.minStock}</td>
                  <td className="mono">₹{s.unitPrice.toFixed(2)}</td>
                  <td className="text-[0.8rem] text-text-muted">{s.location}</td>
                  <td>
                    <Badge variant={s.status === 'Low Stock' ? 'rose' : 'emerald'} dot={s.status === 'Low Stock'}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleReorder(s.code, s.name)}
                    >
                      <Plus size={13} /> + Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Departmental Indents */}
      <div className="glass-card flex flex-col gap-4">
        <h3 className="text-[1.05rem] font-bold text-text-main">Recent Department Supply Requests</h3>

        <div className="table-container">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Department</th>
                <th>Requested Supplies</th>
                <th>Requested By</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {indents.map((ind) => (
                <tr key={ind.indentNo}>
                  <td><span className="mono font-bold text-teal-600">{ind.indentNo}</span></td>
                  <td className="font-bold text-text-main">{ind.fromDept}</td>
                  <td className="text-text-main">{ind.items}</td>
                  <td className="text-[0.85rem]">{ind.requestedBy}</td>
                  <td>
                    <Badge variant={ind.status.includes('Dispatched') ? 'emerald' : 'amber'}>
                      {ind.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApproveIndent(ind.indentNo)}
                      disabled={ind.status.includes('Dispatched')}
                    >
                      <Check size={13} /> Send Items
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
