import React from 'react';
import { CreditCard, CheckCircle2, QrCode, ArrowDownRight, DollarSign, Printer, Receipt } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Payments = () => {
  const { openModal, billingInvoices, showToast } = useHospital();

  const transactions = [
    { txnId: 'TXN-99801', patient: 'Rameshwar Prasad Sharma', patientId: 'PAT-2026-8801', amount: 50000, mode: 'Credit Card (POS)', date: '2026-09-17 09:30 AM', cashier: 'K. Sudhakar', status: 'Payment Successful', type: 'IPD Intermediate Bill Advance' },
    { txnId: 'TXN-99802', patient: 'Sneha Jennifer Thomas', patientId: 'PAT-2026-8802', amount: 5150, mode: 'UPI (GPay / PhonePe)', date: '2026-09-17 10:15 AM', cashier: 'K. Sudhakar', status: 'Payment Successful', type: 'OPD Consultation & Scan' },
    { txnId: 'TXN-99803', patient: 'Ayesha Fatima Khan', patientId: 'PAT-2026-8804', amount: 5000, mode: 'Cash Counter', date: '2026-09-17 10:30 AM', cashier: 'R. Srilatha', status: 'Payment Successful', type: 'Emergency Triage & Bed Deposit' },
    { txnId: 'TXN-99804', patient: 'Kiran Kumar (Emergency)', patientId: 'PAT-2026-8803', amount: 25000, mode: 'Debit Card', date: '2026-09-17 10:45 AM', cashier: 'R. Srilatha', status: 'Payment Successful', type: 'Trauma Resuscitation Deposit' }
  ];

  const handlePrintReceipt = (tx) => {
    // Find matching invoice or generate a comprehensive detailed invoice object for this transaction
    const matched = billingInvoices.find((b) => b.patientName?.toLowerCase().includes(tx.patient?.toLowerCase()) || tx.patient?.toLowerCase().includes(b.patientName?.toLowerCase()));

    const inv = matched || {
      id: `INV-${tx.txnId}`,
      billNo: `RECEIPT-${tx.txnId}`,
      patientId: tx.patientId || 'PAT-OPD',
      patientName: tx.patient,
      type: tx.type || 'Official Counter Payment Receipt',
      date: tx.date.split(' ')[0],
      wardCharges: tx.amount > 20000 ? 12000 : 0,
      doctorConsultCharges: tx.amount > 5000 ? 1500 : Math.min(tx.amount, 900),
      otAndProcedureCharges: tx.amount > 20000 ? 10000 : 0,
      pharmacyCharges: tx.amount > 5000 ? 2500 : 0,
      labAndRadiologyCharges: tx.amount > 5000 ? 1500 : Math.max(0, tx.amount - 900),
      nursingCharges: 0,
      subtotal: tx.amount,
      taxGst: 0,
      discount: 0,
      totalAmount: tx.amount,
      advancePaid: tx.amount,
      insuranceClaimed: 0,
      balanceDue: 0,
      status: 'Paid'
    };

    showToast(`Opening receipt for ${tx.patient} (₹${tx.amount.toLocaleString()})`, 'info');
    openModal('invoice', inv);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Hospital Payment Receipts & Transactions
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            List of payments received across Cash, Cards, UPI QR, and Online payments. Click any row or button to view complete receipt.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Receipt / Txn #</th>
              <th>Patient Name</th>
              <th className="text-right">Amount Paid</th>
              <th>Payment Method</th>
              <th>Date & Time</th>
              <th>Cashier</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.txnId}
                onClick={() => handlePrintReceipt(tx)}
                className="cursor-pointer hover:bg-bg-surface-elevated/60 transition-colors"
              >
                <td>
                  <span className="mono font-medium text-xs text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/20">
                    {tx.txnId}
                  </span>
                </td>
                <td className="font-semibold text-text-main">{tx.patient}</td>
                <td className="mono font-bold text-text-main text-right tabular-nums">
                  ₹{tx.amount.toLocaleString()}
                </td>
                <td><span className="badge badge-gray">{tx.mode}</span></td>
                <td className="text-xs text-text-muted tabular-nums">{tx.date}</td>
                <td className="text-xs text-text-muted">{tx.cashier}</td>
                <td><Badge variant="emerald" size="sm">{tx.status}</Badge></td>
                <td className="text-right">
                  <button
                    className="btn btn-secondary btn-sm h-8 px-3 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrintReceipt(tx);
                    }}
                  >
                    <Receipt size={13} /> View Receipt
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
