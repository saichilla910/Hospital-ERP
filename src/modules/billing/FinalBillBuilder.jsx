import React, { useState, useEffect } from 'react';
import {
  ReceiptText,
  Building2,
  CheckCircle2,
  Printer,
  ShieldCheck,
  CreditCard,
  Plus,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  Package,
  Layers,
  ArrowRight,
  User,
  Clock
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const FinalBillBuilder = ({ initialPatientId }) => {
  const {
    patients,
    charges,
    servicePackages,
    insuranceClaims,
    billingInvoices,
    generateFinalBill,
    applyPackageToPatient,
    openModal,
    showToast
  } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || patients[0]?.id || '');
  const [selectedChargeIds, setSelectedChargeIds] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [advancePaid, setAdvancePaid] = useState(0);
  const [insuranceAmount, setInsuranceAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('UPI / QR Scan');
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(servicePackages[0]?.id || '');

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Get charges for this patient
  const patientCharges = (charges || []).filter((c) => c.patientId === selectedPatientId);
  const pendingCharges = patientCharges.filter((c) => c.status === 'Pending');

  // Check if patient has insurance claim
  const matchedClaim = (insuranceClaims || []).find((clm) => clm.patientId === selectedPatientId && clm.status.includes('Approved'));

  // Initialize selected charges when patient changes
  useEffect(() => {
    setSelectedChargeIds(patientCharges.map((c) => c.id));
    if (matchedClaim) {
      setInsuranceAmount(matchedClaim.approvedAmount || 0);
    } else {
      setInsuranceAmount(0);
    }
  }, [selectedPatientId, charges]);

  const toggleSelectCharge = (id) => {
    setSelectedChargeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllCharges = () => {
    setSelectedChargeIds(patientCharges.map((c) => c.id));
  };

  // Financial Calculations
  const selectedChargesList = patientCharges.filter((c) => selectedChargeIds.includes(c.id));
  const subtotal = selectedChargesList.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const numDiscount = Number(discountAmount) || 0;
  const numAdvance = Number(advancePaid) || 0;
  const numInsurance = Number(insuranceAmount) || 0;
  const taxGst = Math.round(Math.max(0, subtotal - numDiscount) * 0.05);
  const totalAmount = Math.max(0, subtotal - numDiscount + taxGst);
  const balanceDue = Math.max(0, totalAmount - numAdvance - numInsurance);

  const handleGenerateBill = () => {
    if (selectedChargeIds.length === 0) {
      showToast('Please select at least one captured charge to generate bill.', 'error');
      return;
    }

    if (numDiscount > 0 && !discountReason.trim()) {
      showToast('Mandatory compliance requirement: Please enter a clinical/administrative reason for applying institutional discount.', 'error');
      return;
    }

    const createdInvoice = generateFinalBill({
      patientId: activePatient.id,
      patientName: activePatient.name,
      chargeIds: selectedChargeIds,
      discount: numDiscount,
      discountReason: discountReason.trim(),
      advancePaid: numAdvance,
      insuranceClaimed: numInsurance,
      paymentMode
    });

    if (createdInvoice) {
      openModal('invoice', createdInvoice);
    }
  };

  const handleApplyPackage = () => {
    const pkg = servicePackages.find((p) => p.id === selectedPackageId);
    if (!pkg) return;

    applyPackageToPatient({
      patientId: activePatient.id,
      patientName: activePatient.name,
      packageId: pkg.id,
      discount: 0,
      discountReason: `Enrolled in standard ${pkg.name}`
    });

    setShowPackageModal(false);
  };

  // Patient past invoices
  const patientInvoices = (billingInvoices || []).filter((inv) => inv.patientId === selectedPatientId);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-main flex items-center gap-2.5">
            <ReceiptText className="text-teal-600 dark:text-teal-400" size={24} />
            Final Bill Builder & Inpatient Settlement
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Aggregates all auto-captured module charges into a finalized NABH tax invoice. Deducts advance deposits, TPA/PMJAY cashless approvals, and audited discounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            className="btn btn-secondary text-xs font-bold flex items-center gap-1.5 h-9.5 px-3.5 border border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10"
            onClick={() => setShowPackageModal(true)}
          >
            <Package size={14} /> Apply Care Package Pricing
          </button>
        </div>
      </div>

      {/* Patient Selection Bar */}
      <div className="glass-card p-4 rounded-xl border border-border-subtle flex items-center justify-between flex-wrap gap-4 bg-bg-surface">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-muted shrink-0">
            <User size={15} className="text-teal-600" /> Select Patient for Billing:
          </div>

          <select
            className="form-select text-xs font-semibold h-9 py-1 px-3 rounded-lg min-w-[280px] flex-1 max-w-md"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            {patients.map((p) => {
              const pendingCount = (charges || []).filter((c) => c.patientId === p.id && c.status === 'Pending').length;
              return (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrn}) • {p.status} {pendingCount > 0 ? `(${pendingCount} unbilled charges)` : ''}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-text-muted">Status:</span>
          <Badge variant={activePatient.status === 'Inpatient' ? 'teal' : activePatient.status === 'ICU' ? 'rose' : 'gray'}>
            {activePatient.status} ({activePatient.ward || 'OPD'})
          </Badge>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itemized Captured Charges (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass-card p-4.5 rounded-xl border border-border-subtle bg-bg-surface">
            <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">
                  Itemized Captured Charges ({patientCharges.length})
                </h3>
                {pendingCharges.length > 0 && (
                  <span className="badge badge-amber text-[10px] font-bold">
                    {pendingCharges.length} Unbilled
                  </span>
                )}
              </div>

              <button
                className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                onClick={selectAllCharges}
              >
                Select All ({patientCharges.length})
              </button>
            </div>

            {patientCharges.length === 0 ? (
              <div className="text-center py-10 text-text-muted text-xs">
                No captured charges found for this patient. Click "Run Daily IPD Bed Charge Job" or add charges from modules.
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
                {patientCharges.map((chg) => {
                  const isChecked = selectedChargeIds.includes(chg.id);
                  return (
                    <div
                      key={chg.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isChecked
                          ? 'bg-teal-500/5 border-teal-500/40 shadow-xs'
                          : 'bg-bg-surface-elevated border-border-subtle opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => toggleSelectCharge(chg.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="accent-teal-600 w-4 h-4 cursor-pointer rounded shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-text-main text-xs truncate">{chg.serviceName}</div>
                          <div className="text-[10.5px] text-text-muted flex items-center gap-2 mt-0.5">
                            <span className="mono font-semibold text-teal-600 dark:text-teal-400">{chg.sourceModule}</span>
                            <span>•</span>
                            <span>{chg.date}</span>
                            <span>•</span>
                            <span>Qty: {chg.qty} × ₹{Number(chg.rate).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="mono font-bold text-sm text-text-main">
                          ₹{Number(chg.amount).toLocaleString()}
                        </div>
                        <Badge variant={chg.status === 'Billed' ? 'emerald' : 'amber'}>
                          {chg.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Invoices Box */}
          {patientInvoices.length > 0 && (
            <div className="glass-card p-4 rounded-xl border border-border-subtle bg-bg-surface">
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2.5">
                Existing Tax Invoices for {activePatient.name} ({patientInvoices.length})
              </h4>
              <div className="space-y-2">
                {patientInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-2.5 bg-bg-surface-elevated rounded-lg border border-border-subtle flex justify-between items-center text-xs hover:border-teal-500/40 transition-colors"
                  >
                    <div>
                      <span className="mono font-bold text-teal-600 dark:text-teal-400 mr-2">{inv.billNo}</span>
                      <span className="text-text-muted">{inv.date} • {inv.type}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="mono font-bold">₹{inv.totalAmount.toLocaleString()}</span>
                      <button
                        className="btn btn-secondary btn-sm text-[11px] h-7 px-2"
                        onClick={() => openModal('invoice', inv)}
                      >
                        <Printer size={11} /> View Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Financial Calculation Box & Audit Compliance (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-card p-5 rounded-2xl border border-teal-500/30 bg-bg-surface shadow-md">
            <h3 className="text-base font-extrabold text-text-main mb-4 flex items-center gap-2 border-b border-border-subtle pb-3">
              <ReceiptText size={18} className="text-teal-600" /> Final Bill Computation
            </h3>

            <div className="flex flex-col gap-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-muted font-medium">Gross Subtotal ({selectedChargesList.length} items):</span>
                <span className="mono font-bold text-sm text-text-main">₹{subtotal.toLocaleString()}</span>
              </div>

              {/* Discount Input with Mandatory Reason */}
              <div className="bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-text-main font-bold flex items-center gap-1">
                    Institutional Discount (₹):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={subtotal}
                    className="form-input text-xs h-7.5 py-0 px-2 w-28 text-right font-mono font-bold text-emerald-600"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                  />
                </div>

                {numDiscount > 0 && (
                  <div>
                    <label className="text-[10.5px] text-rose-600 dark:text-rose-400 font-bold block mb-1">
                      * Mandatory Audit Reason for Discount:
                    </label>
                    <input
                      type="text"
                      className="form-input text-xs py-1 px-2.5 h-7.5 w-full border-rose-500/50"
                      placeholder="e.g. Senior Citizen NABH Concession approved by Medical Director"
                      value={discountReason}
                      onChange={(e) => setDiscountReason(e.target.value)}
                      required
                    />
                    <span className="text-[10px] text-text-muted mt-1 block">
                      Compliance: Logged into immutable audit log with your authorized username.
                    </span>
                  </div>
                )}
              </div>

              {/* Tax GST */}
              <div className="flex justify-between items-center text-text-muted">
                <span>Tax GST (5% Standard Clinical):</span>
                <span className="mono font-semibold text-text-main">₹{taxGst.toLocaleString()}</span>
              </div>

              {/* Total Bill Amount */}
              <div className="flex justify-between items-center pt-2.5 border-t border-border-subtle text-sm">
                <span className="font-extrabold text-text-main">Total Bill Amount:</span>
                <span className="mono font-black text-teal-600 dark:text-teal-400 text-lg">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Advance Paid */}
              <div className="flex justify-between items-center text-text-muted">
                <span>Advance Deposit Paid:</span>
                <div className="flex items-center gap-1">
                  <span className="text-text-muted">₹</span>
                  <input
                    type="number"
                    min="0"
                    className="form-input text-xs h-7 py-0 px-2 w-24 text-right font-mono"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                  />
                </div>
              </div>

              {/* Insurance Covered */}
              <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                <span className="font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} /> Cashless TPA / PMJAY Approved:
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-text-muted">₹</span>
                  <input
                    type="number"
                    min="0"
                    className="form-input text-xs h-7 py-0 px-2 w-24 text-right font-mono font-bold text-blue-600"
                    value={insuranceAmount}
                    onChange={(e) => setInsuranceAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Net Balance Due */}
              <div className={`p-3 rounded-xl border flex justify-between items-center font-bold text-sm ${
                balanceDue > 0
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              }`}>
                <span>Net Patient Balance Due:</span>
                <span className="mono text-lg font-black">₹{balanceDue.toLocaleString()}</span>
              </div>

              {/* Payment Mode */}
              <div className="form-group mt-1">
                <label className="form-label text-xs">Payment Method for Balance</label>
                <select
                  className="form-select text-xs h-8.5"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="UPI / QR Scan">Instant UPI / QR Code Scan</option>
                  <option value="POS Credit/Debit Card">POS Credit / Debit Card</option>
                  <option value="Cash Counter">Cash at Counter</option>
                  <option value="Net Banking / NEFT">Net Banking / NEFT Transfer</option>
                  <option value="100% Cashless PMJAY">100% Cashless PMJAY / TPA Settlement</option>
                </select>
              </div>

              {/* Submit Final Bill Button */}
              <button
                className="btn btn-primary btn-lg w-full mt-2 font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
                onClick={handleGenerateBill}
              >
                <ReceiptText size={17} /> Generate Official Tax Invoice & Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Package Selection Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-teal-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-extrabold text-text-main mb-1 flex items-center gap-2">
              <Package className="text-teal-600" size={20} /> Select Healthcare Package
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Apply bundled pricing for surgical procedures, deliveries, or health checkups for {activePatient.name}.
            </p>

            <div className="flex flex-col gap-3 my-4 max-h-[380px] overflow-y-auto pr-1">
              {servicePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedPackageId === pkg.id
                      ? 'border-teal-500 bg-teal-500/10'
                      : 'border-border-subtle bg-bg-surface-elevated hover:border-teal-500/30'
                  }`}
                  onClick={() => setSelectedPackageId(pkg.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-text-main text-xs">{pkg.name}</h4>
                      <p className="text-[11px] text-text-muted">{pkg.department} • {pkg.roomType} ({pkg.stayDurationDays} Days)</p>
                    </div>
                    <div className="text-right">
                      <span className="mono font-bold text-sm text-teal-600 dark:text-teal-400">
                        ₹{pkg.discountedRate.toLocaleString()}
                      </span>
                      <div className="text-[10px] text-text-muted line-through">₹{pkg.baseRate.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-muted border-t border-border-subtle pt-1.5 flex flex-wrap gap-1">
                    {pkg.inclusions.slice(0, 3).map((inc, i) => (
                      <span key={i} className="bg-bg-surface px-1.5 py-0.5 rounded text-[10px] border border-border-subtle">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border-subtle">
              <button className="btn btn-secondary text-xs" onClick={() => setShowPackageModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary text-xs" onClick={handleApplyPackage}>
                Apply Package to Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
