import React, { useState } from 'react';
import { Pill, ShoppingCart, Check, Trash2, Search, Printer, CreditCard, Plus } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const Dispensing = () => {
  const {
    pharmacyMedicines = [],
    pharmacyItems = [],
    pharmacyBatches = [],
    dispenseMedicineFEFO,
    dispenseMedicine,
    showToast,
    openModal,
    addInvoice
  } = useHospital();

  const [selectedMedId, setSelectedMedId] = useState(pharmacyMedicines?.[0]?.id || '');
  const [dispenseQty, setDispenseQty] = useState(10);
  const [cart, setCart] = useState([
    { medId: 'MED-001', name: 'Brilinta (Ticagrelor 90mg)', qty: 30, price: 42.5, total: 1275 },
    { medId: 'MED-002', name: 'Rozavel-EZ 20/10', qty: 30, price: 28.0, total: 840 }
  ]);

  // Find batches for the selected medicine sorted by FEFO (earliest expiry first)
  const activeBatches = pharmacyBatches
    .filter((b) => b.itemId === selectedMedId || b.name === pharmacyMedicines.find((m) => m.id === selectedMedId)?.name)
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const addToCart = () => {
    const med = pharmacyMedicines.find((m) => m.id === selectedMedId);
    if (!med) return;
    const qty = parseInt(dispenseQty) || 1;
    const existing = cart.find((c) => c.medId === med.id);
    if (existing) {
      setCart(cart.map((c) => (c.medId === med.id ? { ...c, qty: c.qty + qty, total: (c.qty + qty) * c.price } : c)));
    } else {
      setCart([...cart, { medId: med.id, name: med.name, qty, price: med.unitPrice, total: qty * med.unitPrice }]);
    }
    showToast(`Added ${qty} units of ${med.name} to POS Cart.`, 'info');
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalBill = cart.reduce((acc, c) => acc + c.total, 0);

  const handleCompleteDispense = () => {
    if (cart.length === 0) return;
    const allAllocations = [];

    cart.forEach((c) => {
      if (dispenseMedicineFEFO) {
        const res = dispenseMedicineFEFO(c.medId, c.qty, 'Walk-in Counter Patient');
        if (res && res.allocatedBatches) {
          allAllocations.push(...res.allocatedBatches);
        }
      } else {
        dispenseMedicine(c.medId, c.qty);
      }
    });

    const inv = {
      patientId: 'PAT-OPD-WALKIN',
      patientName: 'Pharmacy Outpatient Walk-in',
      type: 'Pharmacy Counter Drug Receipt',
      date: new Date().toISOString().split('T')[0],
      wardCharges: 0,
      doctorConsultCharges: 0,
      otAndProcedureCharges: 0,
      pharmacyCharges: totalBill,
      labAndRadiologyCharges: 0,
      nursingCharges: 0,
      subtotal: totalBill,
      taxGst: 0,
      discount: 0,
      totalAmount: totalBill,
      advancePaid: totalBill,
      insuranceClaimed: 0,
      balanceDue: 0,
      status: 'Paid'
    };

    addInvoice(inv);
    openModal('invoice', inv);
    setCart([]);
    showToast(`Prescription dispensed with FEFO batch deduction! Total ₹${totalBill.toLocaleString()} receipt generated.`, 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Pharmacy Dispensary & Counter
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Dispense prescribed medications, collect payments, and automatically update stock inventory.
          </p>
        </div>
      </div>

      <div className="responsive-grid-split">
        {/* Left: Dispense Builder */}
        <div className="glass-card flex flex-col gap-4">
          <h3 className="text-[1.05rem] text-teal-600 font-bold flex items-center gap-2">
            <Pill size={16} /> Select Medicine to Dispense
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="form-group mb-0 sm:col-span-7">
              <label className="form-label text-xs">Select Medicine</label>
              <select
                className="form-select rounded-md"
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
              >
                {pharmacyMedicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.salt}) • Stock: {m.stock} • ₹{m.unitPrice}/u
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-0 sm:col-span-2">
              <label className="form-label text-xs">Quantity</label>
              <input
                type="number"
                min="1"
                className="form-input rounded-md"
                value={dispenseQty}
                onChange={(e) => setDispenseQty(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3">
              <button className="btn btn-primary w-full h-[42px] rounded-md text-xs font-bold flex items-center justify-center gap-1.5" onClick={addToCart}>
                <Plus size={14} /> Add to POS Bill
              </button>
            </div>
          </div>

          {/* FEFO Active Batches Strip */}
          {activeBatches.length > 0 && (
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                  ⚡ FEFO Batch Allocation (Earliest Expiry First):
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono font-semibold">
                  {activeBatches.length} Batches in Store
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {activeBatches.map((b, idx) => (
                  <span
                    key={b.id || idx}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono border ${
                      idx === 0
                        ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                        : 'bg-bg-surface text-text-muted border-border-subtle'
                    }`}
                  >
                    {idx === 0 ? '▶ NEXT DISPENSE: ' : ''}{b.batchNo} ({b.qty}u left • Exp: {b.expiryDate})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Dispense Table */}
          <div className="table-container mt-2.5">
            <table className="medicore-table">
              <thead>
                <tr>
                  <th>Drug Item</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th className="text-right">Total (₹)</th>
                  <th className="text-right">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-text-main">{item.name}</td>
                    <td><span className="mono">{item.qty} units</span></td>
                    <td className="text-text-muted">₹{item.price.toFixed(2)}</td>
                    <td className="text-right font-bold mono">₹{item.total.toFixed(2)}</td>
                    <td className="text-right">
                      <button
                        className="btn-icon btn-sm btn-icon-danger"
                        onClick={() => removeFromCart(idx)}
                        title="Remove Item from Cart"
                      >
                        <Trash2 size={20} strokeWidth={2.2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Checkout & Receipt */}
        <div className="glass-card flex flex-col gap-3.5 bg-bg-surface-elevated">
          <h3 className="text-[1.05rem] text-teal-600 flex items-center gap-2 font-bold">
            <ShoppingCart size={16} /> Bill Summary
          </h3>

          <div className="flex flex-col gap-2 text-[0.85rem]">
            <div className="flex justify-between text-text-muted">
              <span>Items in Bill:</span>
              <span className="mono text-text-main">{cart.length} line items</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Taxes / GST:</span>
              <span className="mono text-text-main">Included in MRP</span>
            </div>
            <div className="flex justify-between text-[1.25rem] font-extrabold text-teal-600 pt-2.5 border-t border-border-subtle">
              <span>Total Amount:</span>
              <span className="mono">₹{totalBill.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-2">
            <button
              className="btn btn-primary btn-lg w-full"
              disabled={cart.length === 0}
              onClick={handleCompleteDispense}
            >
              <CreditCard size={16} /> Dispense Medicines & Collect ₹{totalBill.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
