import React from 'react';
import { Modal } from './Modal';
import {
  Printer,
  CheckCircle2,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Building2,
  Receipt,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { printHospitalReceipt, numberToWordsINR } from '../../services/receiptPrintService';
import { exportToExcel } from '../../services/excelService';

export const InvoiceModal = ({ isOpen, onClose, invoice }) => {
  const { hospitalInfo, billingInvoices, showToast } = useHospital();
  if (!isOpen) return null;

  const rawInvoice = invoice || billingInvoices?.[0];
  const activeInvoice = {
    ...rawInvoice,
    billNo: rawInvoice?.billNo || rawInvoice?.id || 'BILL-2026-9544',
    date: rawInvoice?.date || new Date().toISOString().split('T')[0],
    time: rawInvoice?.time || '10:30 AM',
    patientName: rawInvoice?.patientName || 'Rameshwar Prasad Sharma',
    patientId: rawInvoice?.patientId || 'PAT-2026-8801',
    type: rawInvoice?.type || 'Hospital Clinical Tax Invoice & Treatment Bill',
    wardCharges: rawInvoice?.wardCharges || 0,
    doctorConsultCharges: rawInvoice?.doctorConsultCharges || 0,
    otAndProcedureCharges: rawInvoice?.otAndProcedureCharges || 0,
    pharmacyCharges: rawInvoice?.pharmacyCharges || 0,
    labAndRadiologyCharges: rawInvoice?.labAndRadiologyCharges || 0,
    nursingCharges: rawInvoice?.nursingCharges || 0,
    subtotal: rawInvoice?.subtotal || (rawInvoice?.totalAmount || 152950),
    taxGst: rawInvoice?.taxGst || 0,
    discount: rawInvoice?.discount || 0,
    totalAmount: rawInvoice?.totalAmount || rawInvoice?.subtotal || 152950,
    advancePaid: rawInvoice?.advancePaid || 0,
    insuranceClaimed: rawInvoice?.insuranceClaimed || 0,
    balanceDue: rawInvoice?.balanceDue ?? Math.max(0, (rawInvoice?.totalAmount || rawInvoice?.subtotal || 0) - (rawInvoice?.advancePaid || 0)),
    status: rawInvoice?.status || 'Partially Paid'
  };

  const handlePrintPDF = () => {
    printHospitalReceipt(activeInvoice, hospitalInfo);
    showToast(`Generating printable hospital receipt for ${activeInvoice.billNo}...`, 'info');
  };

  const handleExportExcel = () => {
    const itemRows = [];
    let sNo = 1;

    if (activeInvoice.wardCharges > 0 || (activeInvoice.subtotal > 0 && !activeInvoice.doctorConsultCharges)) {
      itemRows.push({
        'S.No': sNo++,
        'Service Particulars': 'Inpatient Bed & Room Care Maintenance',
        'SAC Code': '999311',
        'Department': 'Inpatient Ward',
        'Amount (INR)': activeInvoice.wardCharges || activeInvoice.subtotal
      });
    }

    if (activeInvoice.doctorConsultCharges > 0) {
      itemRows.push({
        'S.No': sNo++,
        'Service Particulars': 'Consultant Physician Clinical Rounds & Review',
        'SAC Code': '999312',
        'Department': 'Clinical OPD',
        'Amount (INR)': activeInvoice.doctorConsultCharges
      });
    }

    if (activeInvoice.otAndProcedureCharges > 0) {
      itemRows.push({
        'S.No': sNo++,
        'Service Particulars': 'Operation Theatre & Specialized Surgical Procedure',
        'SAC Code': '999314',
        'Department': 'OT Suite',
        'Amount (INR)': activeInvoice.otAndProcedureCharges
      });
    }

    if (activeInvoice.pharmacyCharges > 0) {
      itemRows.push({
        'S.No': sNo++,
        'Service Particulars': 'Hospital Pharmacy Medications & Consumables',
        'SAC Code': '999319',
        'Department': 'Dispensary',
        'Amount (INR)': activeInvoice.pharmacyCharges
      });
    }

    if (activeInvoice.labAndRadiologyCharges > 0) {
      itemRows.push({
        'S.No': sNo++,
        'Service Particulars': 'Diagnostic Pathology Tests & Radiology Imaging',
        'SAC Code': '999313',
        'Department': 'Pathology & Imaging',
        'Amount (INR)': activeInvoice.labAndRadiologyCharges
      });
    }

    if (activeInvoice.nursingCharges > 0) {
      itemRows.push({
        'S.No': sNo++,
        'Service Particulars': 'Nursing Care & Critical Patient Monitoring',
        'SAC Code': '999311',
        'Department': 'Nursing',
        'Amount (INR)': activeInvoice.nursingCharges
      });
    }

    const summaryRows = [
      { 'Summary Field': 'Gross Subtotal', 'Amount (INR)': activeInvoice.subtotal },
      { 'Summary Field': 'Institutional Discount', 'Amount (INR)': -activeInvoice.discount },
      { 'Summary Field': 'Tax GST (5%)', 'Amount (INR)': activeInvoice.taxGst },
      { 'Summary Field': 'Total Amount Payable', 'Amount (INR)': activeInvoice.totalAmount },
      { 'Summary Field': 'Advance Deposit Paid', 'Amount (INR)': -activeInvoice.advancePaid },
      { 'Summary Field': 'Insurance TPA Approved', 'Amount (INR)': -activeInvoice.insuranceClaimed },
      { 'Summary Field': 'Net Patient Balance Due', 'Amount (INR)': activeInvoice.balanceDue }
    ];

    exportToExcel(
      [
        { name: 'Itemized_Charges', data: itemRows },
        { name: 'Invoice_Summary', data: summaryRows }
      ],
      `Hospital_Tax_Invoice_${activeInvoice.billNo}.xlsx`
    );

    showToast(`Invoice spreadsheet "${activeInvoice.billNo}.xlsx" downloaded!`, 'success');
  };

  const amountInWords = numberToWordsINR(activeInvoice.totalAmount);
  const cgst = (activeInvoice.taxGst / 2).toFixed(2);
  const sgst = (activeInvoice.taxGst / 2).toFixed(2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Hospital Tax Invoice & Cash Receipt"
      subtitle={`Receipt / Bill No: ${activeInvoice.billNo} • Date: ${activeInvoice.date}`}
      maxWidth="1050px"
      headerIcon={<Receipt size={20} />}
      headerRight={
        <>
          <span className="badge badge-emerald text-[11px] font-bold py-0.5 px-2.5 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 size={13} /> {activeInvoice.status}
          </span>
          <span className="text-[11.5px] text-text-muted mt-0.5">
            Bill No: <strong className="text-text-main font-mono font-bold">{activeInvoice.billNo}</strong>
          </span>
        </>
      }
      footerInfo={
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={13} />
          </div>
          <span>Official GST Tax Invoice authenticated by HospitalCare Hospital Billing.</span>
        </div>
      }
      footer={
        <>
          <button
            className="btn btn-secondary h-10 px-4.5 rounded-xl text-xs font-bold hover:bg-bg-surface-elevated transition-all"
            onClick={onClose}
          >
            ✕ Close
          </button>
          <button
            className="btn btn-outline h-10 px-4 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-1.5 transition-all"
            onClick={handleExportExcel}
            title="Download itemized invoice as Excel spreadsheet"
          >
            <FileSpreadsheet size={15} />
            <span>Export Excel</span>
          </button>
          <button
            className="btn btn-primary h-10 px-5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-teal-600/20 hover:shadow-lg transition-all"
            onClick={handlePrintPDF}
            title="Open real-life hospital print layout to print or save as A4 PDF"
          >
            <Printer size={15} strokeWidth={2.3} />
            <span>Print Receipt / Save PDF</span>
          </button>
        </>
      }
    >
      <div className="printable-area invoice-paper text-text-main">
        {/* ── 1. OFFICIAL HOSPITAL LETTERHEAD HEADER ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-5 border-b-2 border-teal-600 pb-5 mb-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-semibold text-xl shadow-xs shrink-0">
                ✚
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-teal-700 dark:text-teal-400 tracking-tight uppercase font-display leading-snug">
                  {hospitalInfo.name || 'HospitalCare Super Specialty Hospital & Research Institute'}
                </h2>
                <div className="text-[11px] italic text-text-muted mt-0.5">
                  {hospitalInfo.tagline || 'Excellence in Tertiary Healthcare & Clinical Research'}
                </div>
              </div>
            </div>

            <p className="text-xs text-text-muted mt-2.5 leading-relaxed">
              {hospitalInfo.address || 'Plot 42, Hitech Health City, Financial District, Hyderabad, Telangana 500081'}<br />
              <span className="text-[11px] text-text-dim">
                Helpline: {hospitalInfo.phone || '+91 40 2345 6789 (24x7 Emergency)'} • {hospitalInfo.email || 'billing@medicorehospital.org'}
              </span>
            </p>

            <div className="text-[11px] font-mono text-text-dim mt-1.5 flex items-center gap-2 flex-wrap">
              <span><strong>GSTIN:</strong> {hospitalInfo.taxId || '36AAACM1234F1Z5'}</span>
              <span>•</span>
              <span><strong>NABH Accreditation:</strong> {hospitalInfo.licenseNo || 'NABH-HOSP-2026-0941'}</span>
            </div>
          </div>

          <div className="sm:text-right shrink-0 bg-bg-surface-elevated p-3.5 sm:p-4 rounded-2xl border border-border-subtle min-w-[220px]">
            <span className="inline-block bg-teal-600 text-white text-[10.5px] font-extrabold uppercase px-3 py-1 rounded-md tracking-wider shadow-xs">
              TAX INVOICE & CASH RECEIPT
            </span>
            <div className="mt-2 text-base font-semibold text-text-main mono tracking-tight">
              {activeInvoice.billNo}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              Date: <strong className="text-text-main">{activeInvoice.date}</strong> • {activeInvoice.time || '10:30 AM'}
            </div>
            <div className="mt-2">
              <span className={`inline-block text-[11px] font-semibold uppercase px-3 py-1 rounded-lg border ${
                activeInvoice.status === 'Paid'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
              }`}>
                {activeInvoice.status === 'Paid' ? '✓ PAID & CLEARED' : activeInvoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. BILLED PATIENT & ENCOUNTER METADATA BOX ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-bg-surface-elevated p-4 sm:p-5 rounded-2xl mb-6 text-xs border border-border-subtle">
          <div>
            <span className="text-[10px] text-text-dim uppercase font-bold tracking-wider block mb-1">Billed Patient</span>
            <div className="text-sm font-semibold text-text-main">
              {activeInvoice.patientName}
            </div>
            <div className="text-text-muted mt-1 font-medium">
              UHID / MRN: <span className="mono font-bold text-teal-600 dark:text-teal-400">{activeInvoice.patientId}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-text-dim uppercase font-bold tracking-wider block mb-1">Bill Type & Department</span>
            <div className="font-bold text-text-main text-sm">
              {activeInvoice.type}
            </div>
            <div className="text-text-muted mt-1 font-medium">
              Counter: Central Billing Desk 02
            </div>
          </div>

          <div>
            <span className="text-[10px] text-text-dim uppercase font-bold tracking-wider block mb-1">Payment Reference</span>
            <div className="font-bold text-text-main text-sm">
              {activeInvoice.paymentMode || 'POS Card / UPI QR / Cash'}
            </div>
            <div className="text-text-muted mt-1 mono text-[11px]">
              Ref: {activeInvoice.txnRef || 'TXN-8894210398'}
            </div>
          </div>
        </div>

        {/* ── 3. ITEMIZED CHARGES TABLE ── */}
        <div className="table-container mb-6 rounded-2xl border border-border-subtle overflow-hidden shadow-xs">
          <table className="medicore-table text-xs w-full">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Itemized Clinical Service / Treatment</th>
                <th style={{ width: '15%' }}>SAC Code</th>
                <th style={{ width: '20%' }}>Department</th>
                <th style={{ width: '20%' }} className="text-right">Amount (INR ₹)</th>
              </tr>
            </thead>
            <tbody>
              {(activeInvoice.wardCharges > 0 || (activeInvoice.subtotal > 0 && !activeInvoice.doctorConsultCharges && !activeInvoice.pharmacyCharges)) && (
                <tr>
                  <td>
                    <div className="font-bold text-text-main">Inpatient Room & Bed Maintenance Charges</div>
                    <div className="text-[11px] text-text-muted mt-0.5">General / Semi-Private / ICU Bed Occupancy</div>
                  </td>
                  <td className="mono text-text-dim">999311</td>
                  <td><span className="badge badge-gray text-[11px]">Inpatient Ward</span></td>
                  <td className="text-right font-semibold mono text-text-main">
                    ₹{(activeInvoice.wardCharges || activeInvoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}

              {activeInvoice.doctorConsultCharges > 0 && (
                <tr>
                  <td>
                    <div className="font-bold text-text-main">Doctor Professional Consultation & Clinical Rounds</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Specialist Physician Review</div>
                  </td>
                  <td className="mono text-text-dim">999312</td>
                  <td><span className="badge badge-teal text-[11px]">Clinical OPD</span></td>
                  <td className="text-right font-semibold mono text-text-main">
                    ₹{activeInvoice.doctorConsultCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}

              {activeInvoice.otAndProcedureCharges > 0 && (
                <tr>
                  <td>
                    <div className="font-bold text-text-main">Operation Theatre & Specialized Surgical Procedure Charges</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Surgical Team, Anesthesia & OT Sterilization</div>
                  </td>
                  <td className="mono text-text-dim">999314</td>
                  <td><span className="badge badge-indigo text-[11px]">Surgical OT</span></td>
                  <td className="text-right font-semibold mono text-text-main">
                    ₹{activeInvoice.otAndProcedureCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}

              {activeInvoice.pharmacyCharges > 0 && (
                <tr>
                  <td>
                    <div className="font-bold text-text-main">Hospital Pharmacy Inpatient Medications & Consumables</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Prescribed Inpatient Formulary</div>
                  </td>
                  <td className="mono text-text-dim">999319</td>
                  <td><span className="badge badge-emerald text-[11px]">Dispensary</span></td>
                  <td className="text-right font-semibold mono text-text-main">
                    ₹{activeInvoice.pharmacyCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}

              {activeInvoice.labAndRadiologyCharges > 0 && (
                <tr>
                  <td>
                    <div className="font-bold text-text-main">Diagnostic Pathology Blood Panels & Radiology Scan Imaging</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Hematology, Biochemistry & Radiology Review</div>
                  </td>
                  <td className="mono text-text-dim">999313</td>
                  <td><span className="badge badge-purple text-[11px]">Diagnostics</span></td>
                  <td className="text-right font-semibold mono text-text-main">
                    ₹{activeInvoice.labAndRadiologyCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}

              {activeInvoice.nursingCharges > 0 && (
                <tr>
                  <td>
                    <div className="font-bold text-text-main">Round-the-Clock Nursing Care & Critical Monitoring</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Telemetry & Bedside Vitals Monitoring</div>
                  </td>
                  <td className="mono text-text-dim">999311</td>
                  <td><span className="badge badge-gray text-[11px]">Nursing</span></td>
                  <td className="text-right font-semibold mono text-text-main">
                    ₹{activeInvoice.nursingCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── 4. FINANCIAL SUMMARY & AMOUNT IN WORDS ── */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-5 mb-6">
          {/* Left: Amount in Words */}
          <div className="flex-1 w-full bg-bg-surface-elevated p-4 sm:p-5 rounded-2xl border border-dashed border-border-subtle text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] text-text-dim uppercase font-bold tracking-wider block mb-1.5">
                Amount In Words (Indian Rupees)
              </span>
              <div className="font-bold text-text-main text-sm leading-relaxed">
                {amountInWords}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border-subtle/50 text-[11px] text-text-muted leading-relaxed">
              Payment Terms: Cleared via Authorized Gateway / Hospital Counter.<br />
              All medical billing reconciled under CGST Act Section 31.
            </div>
          </div>

          {/* Right: Calculations Table */}
          <div className="w-full md:w-[360px] bg-bg-surface-elevated p-4 sm:p-5 rounded-2xl border border-border-subtle flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-text-muted font-medium">
              <span>Subtotal (Gross Charges):</span>
              <span className="mono text-text-main font-bold">
                ₹{activeInvoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {activeInvoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Institutional Discount:</span>
                <span className="mono font-bold">- ₹{activeInvoice.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            {activeInvoice.taxGst > 0 && (
              <>
                <div className="flex justify-between text-text-dim text-[11px]">
                  <span>CGST (2.5%):</span>
                  <span className="mono">₹{cgst}</span>
                </div>
                <div className="flex justify-between text-text-dim text-[11px]">
                  <span>SGST (2.5%):</span>
                  <span className="mono">₹{sgst}</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-sm font-semibold text-teal-600 dark:text-teal-400 pt-2 border-t border-border-subtle">
              <span>Total Bill Amount:</span>
              <span className="mono text-base">₹{activeInvoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {activeInvoice.advancePaid > 0 && (
              <div className="flex justify-between text-text-muted text-[11px]">
                <span>Advance / Deposit Paid:</span>
                <span className="mono font-bold">- ₹{activeInvoice.advancePaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            {activeInvoice.insuranceClaimed > 0 && (
              <div className="flex justify-between text-blue-600 dark:text-blue-400 text-[11px]">
                <span>Cashless TPA Approved:</span>
                <span className="mono font-bold">- ₹{activeInvoice.insuranceClaimed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className={`flex justify-between text-xs font-semibold pt-2 border-t border-dashed border-border-subtle ${
              activeInvoice.balanceDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              <span>Net Balance Due:</span>
              <span className="mono font-semibold text-sm">
                ₹{activeInvoice.balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* ── 5. LEGAL NOTES & SIGNATURE BLOCKS ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-4 border-t border-border-subtle text-[11px] text-text-muted">
          <div className="max-w-md text-text-dim leading-relaxed">
            <strong>Note:</strong> Original receipt must be submitted for discharge clearance or mediclaim reimbursement. This computer-generated hospital receipt is digitally recorded under the HospitalCare Information System.
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-xs font-bold text-text-main">
              Accounts & Billing Department
            </div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-0.5">
              Authorized Cashier Signature
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
