import React, { useState } from 'react';
import { CreditCard, Receipt, Plus, CheckCircle2, ShieldAlert, DollarSign, Trash2 } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const EmergencyBilling = () => {
  const { emergencyCases, addInvoice, openModal, showToast } = useHospital();
  const [selectedCaseId, setSelectedCaseId] = useState(emergencyCases[0].id);
  const currentCase = emergencyCases.find((c) => c.id === selectedCaseId) || emergencyCases[0];

  const [erItems, setErItems] = useState([
    { item: 'Emergency Doctor & Triage Consultation', amount: 1500 },
    { item: 'Immediate Vital Stabilization & Monitoring', amount: 3500 },
    { item: 'Bedside Emergency ECG & Blood Gas', amount: 2400 },
    { item: 'Emergency IV Fluids & Nebulizer', amount: 1850 }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemCost) return;
    setErItems([...erItems, { item: newItemName, amount: parseFloat(newItemCost) || 0 }]);
    showToast(`Added "${newItemName}" to emergency bill.`, 'info');
    setNewItemName('');
    setNewItemCost('');
  };

  const handleRemoveItem = (index) => {
    setErItems(erItems.filter((_, i) => i !== index));
  };

  const subtotal = erItems.reduce((acc, curr) => acc + curr.amount, 0);

  const handleGenerateInvoice = () => {
    const inv = {
      billNo: `BILL-EMG-2026-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      patientId: currentCase.id,
      patientName: currentCase.patientName,
      type: 'Emergency Bill',
      wardCharges: 0,
      doctorConsultCharges: 1500,
      otAndProcedureCharges: 3500,
      pharmacyCharges: 1850,
      labAndRadiologyCharges: 2400,
      nursingCharges: 0,
      subtotal,
      taxGst: 0,
      discount: 0,
      totalAmount: subtotal,
      advancePaid: currentCase.depositPaid || 0,
      insuranceClaimed: 0,
      balanceDue: Math.max(0, subtotal - (currentCase.depositPaid || 0)),
      status: subtotal <= (currentCase.depositPaid || 0) ? 'Paid' : 'Partially Paid'
    };

    addInvoice(inv);
    openModal('invoice', inv);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Emergency Billing Counter
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Quick bill generation for emergency treatments, medicines, and doctor fees.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[0.8rem] text-text-muted">Select Patient:</span>
          <select
            className="form-select"
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
          >
            {emergencyCases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.patientName} ({c.caseNo} • {c.assignedBay})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="responsive-grid-split">
        {/* Left: Line Items */}
        <div className="glass-card flex flex-col gap-4">
          <h3 className="text-[1.05rem] text-text-main flex items-center gap-2 font-bold">
            <Receipt size={16} className="text-teal-600" /> Treatment Charges ({currentCase.patientName})
          </h3>

          <div className="table-container">
            <table className="medicore-table">
              <thead>
                <tr>
                  <th>Procedure / Treatment</th>
                  <th className="text-right">Amount (₹)</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {erItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-text-main">{item.item}</td>
                    <td className="text-right font-bold mono">₹{item.amount.toLocaleString()}</td>
                    <td className="text-right">
                      <button
                        className="btn-icon btn-sm btn-icon-danger"
                        onClick={() => handleRemoveItem(idx)}
                        title="Remove Charge Item"
                      >
                        <Trash2 size={20} strokeWidth={2.2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add custom emergency charge */}
          <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end pt-3 border-t border-border-subtle">
            <div className="sm:col-span-7">
              <label className="form-label text-xs">Add Service / Injection</label>
              <input
                type="text"
                placeholder="e.g. Suture Kit / Painkiller IV"
                className="form-input rounded-md"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="form-label text-xs">Amount (₹)</label>
              <input
                type="number"
                placeholder="₹ Amount"
                className="form-input rounded-md"
                value={newItemCost}
                onChange={(e) => setNewItemCost(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn btn-primary w-full rounded-md py-2 text-xs font-bold">
                <Plus size={15} /> Add
              </button>
            </div>
          </form>
        </div>

        {/* Right: Calculation & Settlement */}
        <div className="glass-card flex flex-col gap-3.5 bg-bg-surface-elevated">
          <h3 className="text-[1.05rem] text-teal-600 font-bold">Bill Summary</h3>

          <div className="flex flex-col gap-2 text-[0.85rem]">
            <div className="flex justify-between text-text-muted">
              <span>Total Treatment Charges:</span>
              <span className="mono text-text-main font-bold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Advance Deposit Paid:</span>
              <span className="mono">- ₹{(currentCase.depositPaid || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[1.25rem] font-extrabold text-teal-600 pt-2.5 border-t border-border-subtle">
              <span>Net Balance Due:</span>
              <span className="mono">₹{Math.max(0, subtotal - (currentCase.depositPaid || 0)).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border-subtle">
            <button
              className="btn btn-primary btn-lg w-full"
              onClick={handleGenerateInvoice}
            >
              <CreditCard size={18} /> Print & Collect Bill (₹{Math.max(0, subtotal - (currentCase.depositPaid || 0)).toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
