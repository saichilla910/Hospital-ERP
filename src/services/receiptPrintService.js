/**
 * Convert numeric amount to words (Indian Rupee format)
 */
export const numberToWordsINR = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'Zero Rupees Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    let str = '';
    if (n >= 10000000) {
      str += inWords(Math.floor(n / 10000000)) + ' Crore ';
      n %= 10000000;
    }
    if (n >= 100000) {
      str += inWords(Math.floor(n / 100000)) + ' Lakh ';
      n %= 100000;
    }
    if (n >= 1000) {
      str += inWords(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }
    if (n >= 100) {
      str += inWords(Math.floor(n / 100)) + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (n < 20) {
        str += a[n] + ' ';
      } else {
        str += b[Math.floor(n / 10)] + ' ' + a[n % 10] + ' ';
      }
    }
    return str.trim();
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let result = 'Rupees ' + inWords(rupees);
  if (paise > 0) {
    result += ' and ' + inWords(paise) + ' Paise';
  }
  return result + ' Only';
};

/**
 * Generate official printable HTML content for hospital invoice / receipt
 */
export const generateReceiptHTML = (invoice, hospitalInfo = {}) => {
  const hInfo = {
    name: hospitalInfo.name || 'HospitalCare Super Specialty Hospital & Research Institute',
    tagline: hospitalInfo.tagline || 'Excellence in Tertiary Healthcare & Clinical Research',
    address: hospitalInfo.address || 'Plot 42, Hitech Health City, Financial District, Hyderabad, Telangana 500081',
    phone: hospitalInfo.phone || '+91 40 2345 6789 / 1800-425-9999 (Emergency 24/7)',
    email: hospitalInfo.email || 'billing@hospitalcare.org | www.hospitalcare.org',
    taxId: hospitalInfo.taxId || 'GSTIN: 36AAACM1234F1Z5',
    licenseNo: hospitalInfo.licenseNo || 'NABH-HOSP-2026-0941 • Reg No: MED-TG-2020-8801'
  };

  const inv = {
    billNo: invoice.billNo || 'BILL-2026-0001',
    date: invoice.date || new Date().toISOString().split('T')[0],
    time: invoice.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    patientName: invoice.patientName || 'General OPD Patient',
    patientId: invoice.patientId || 'PAT-2026-8801',
    type: invoice.type || 'Hospital Tax Invoice & Treatment Bill',
    status: invoice.status || 'Paid',
    doctorConsultCharges: Number(invoice.doctorConsultCharges) || 0,
    wardCharges: Number(invoice.wardCharges) || 0,
    otAndProcedureCharges: Number(invoice.otAndProcedureCharges) || 0,
    pharmacyCharges: Number(invoice.pharmacyCharges) || 0,
    labAndRadiologyCharges: Number(invoice.labAndRadiologyCharges) || 0,
    nursingCharges: Number(invoice.nursingCharges) || 0,
    subtotal: Number(invoice.subtotal) || 0,
    discount: Number(invoice.discount) || 0,
    taxGst: Number(invoice.taxGst) || 0,
    totalAmount: Number(invoice.totalAmount) || 0,
    advancePaid: Number(invoice.advancePaid) || 0,
    insuranceClaimed: Number(invoice.insuranceClaimed) || 0,
    balanceDue: Number(invoice.balanceDue) || 0,
    paymentMode: invoice.paymentMode || (invoice.advancePaid > 0 ? 'Digital UPI / POS Card / Cash' : 'Cashless TPA Settled'),
    txnRef: invoice.txnRef || `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`
  };

  // Build items array
  const items = [];
  let sNo = 1;

  if (inv.wardCharges > 0 || (inv.subtotal > 0 && !inv.doctorConsultCharges && !inv.pharmacyCharges)) {
    items.push({
      sNo: sNo++,
      name: 'Inpatient Room & Bed Care Maintenance Charges',
      sac: '999311',
      dept: 'Inpatient Ward',
      qty: '1 Unit',
      amount: inv.wardCharges || inv.subtotal
    });
  }

  if (inv.doctorConsultCharges > 0) {
    items.push({
      sNo: sNo++,
      name: 'Senior Consultant Physician Clinical Consultation & Rounds',
      sac: '999312',
      dept: 'OPD / Specialty Clinical',
      qty: '1 Service',
      amount: inv.doctorConsultCharges
    });
  }

  if (inv.otAndProcedureCharges > 0) {
    items.push({
      sNo: sNo++,
      name: 'Operation Theatre & Specialized Surgical Procedure Charges',
      sac: '999314',
      dept: 'Surgical Suite / OT',
      qty: '1 Procedure',
      amount: inv.otAndProcedureCharges
    });
  }

  if (inv.pharmacyCharges > 0) {
    items.push({
      sNo: sNo++,
      name: 'Hospital Pharmacy Inpatient Medications & Surgical Consumables',
      sac: '999319',
      dept: 'Central Dispensary',
      qty: 'Itemized Rx',
      amount: inv.pharmacyCharges
    });
  }

  if (inv.labAndRadiologyCharges > 0) {
    items.push({
      sNo: sNo++,
      name: 'Diagnostic Pathology Blood Panels & Radiology Scan Imaging',
      sac: '999313',
      dept: 'Pathology & Imaging',
      qty: 'Verified Tests',
      amount: inv.labAndRadiologyCharges
    });
  }

  if (inv.nursingCharges > 0) {
    items.push({
      sNo: sNo++,
      name: 'Round-the-Clock Nursing & Vitals Telemetry Care',
      sac: '999311',
      dept: 'Nursing Services',
      qty: 'Clinical Shift',
      amount: inv.nursingCharges
    });
  }

  if (items.length === 0) {
    items.push({
      sNo: 1,
      name: inv.type || 'Hospital Clinical Service Billing',
      sac: '999311',
      dept: 'Hospital Administration',
      qty: '1 Service',
      amount: inv.totalAmount || inv.subtotal
    });
  }

  const cgst = (inv.taxGst / 2).toFixed(2);
  const sgst = (inv.taxGst / 2).toFixed(2);
  const wordsText = numberToWordsINR(inv.totalAmount);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt_${inv.billNo}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1a202c;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.4;
    }
    .receipt-container {
      max-width: 800px;
      margin: 0 auto;
      border: 1.5px solid #2d3748;
      padding: 24px 28px;
      background: #ffffff;
      position: relative;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .hospital-title {
      font-size: 20px;
      font-weight: 900;
      color: #0f766e;
      letter-spacing: -0.02em;
      margin: 0 0 2px 0;
      text-transform: uppercase;
    }
    .hospital-tagline {
      font-size: 11px;
      font-style: italic;
      color: #4a5568;
      margin-bottom: 4px;
    }
    .hospital-meta {
      font-size: 11px;
      color: #718096;
      line-height: 1.35;
    }
    .receipt-badge-box {
      text-align: right;
      vertical-align: top;
    }
    .receipt-badge {
      display: inline-block;
      background: #0d9488;
      color: #ffffff;
      font-weight: 800;
      font-size: 12px;
      padding: 5px 12px;
      border-radius: 4px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .bill-no-text {
      font-family: monospace;
      font-size: 14px;
      font-weight: 800;
      color: #1a202c;
      margin-top: 6px;
    }
    .date-text {
      font-size: 11px;
      color: #718096;
      margin-top: 2px;
    }
    .patient-box {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      margin-bottom: 16px;
      font-size: 12px;
    }
    .patient-box td {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .field-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      display: block;
      margin-bottom: 2px;
    }
    .field-value {
      font-weight: 700;
      color: #0f172a;
    }
    .field-value-mono {
      font-family: monospace;
      font-weight: 700;
      color: #0f766e;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 12px;
    }
    .items-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 800;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .items-table td {
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .mono {
      font-family: monospace;
    }
    .summary-table-wrap {
      width: 100%;
      margin-bottom: 16px;
    }
    .summary-table {
      width: 320px;
      margin-left: auto;
      border-collapse: collapse;
      font-size: 12px;
    }
    .summary-table td {
      padding: 4px 8px;
    }
    .total-row td {
      font-size: 14px;
      font-weight: 800;
      color: #0f766e;
      border-top: 1.5px solid #0f766e;
      border-bottom: 1.5px solid #0f766e;
      padding: 6px 8px;
    }
    .balance-row td {
      font-size: 13px;
      font-weight: 800;
      color: ${inv.balanceDue > 0 ? '#dc2626' : '#16a34a'};
      border-top: 1px dashed #cbd5e1;
      padding: 6px 8px;
    }
    .words-box {
      border: 1px dashed #94a3b8;
      background: #f8fafc;
      padding: 8px 12px;
      font-size: 11px;
      margin-bottom: 18px;
      border-radius: 4px;
    }
    .footer-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      border-top: 1px solid #cbd5e1;
      padding-top: 12px;
    }
    .footer-table td {
      vertical-align: bottom;
      font-size: 11px;
    }
    .signature-line {
      border-top: 1px solid #475569;
      width: 180px;
      margin-top: 40px;
      text-align: center;
      padding-top: 4px;
      font-weight: 700;
      color: #1e293b;
      margin-left: auto;
    }
    .paid-stamp {
      display: inline-block;
      border: 2.5px solid #16a34a;
      color: #16a34a;
      font-weight: 900;
      font-size: 13px;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      transform: rotate(-3deg);
    }
    .terms-text {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.35;
      max-width: 480px;
    }
    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background: #0f172a;
      border-radius: 8px;
      color: #ffffff;
    }
    .no-print-btn {
      background: #0d9488;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .no-print-btn:hover {
      background: #0f766e;
    }
    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0 !important;
      }
      .receipt-container {
        border: none !important;
        padding: 0 !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div style="font-size: 13px; font-weight: 700;">
      Print Receipt / Save as PDF (${inv.billNo})
    </div>
    <div>
      <button class="no-print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="no-print-btn" style="background: #475569; margin-left: 8px;" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="receipt-container">
    <!-- Hospital Official Header -->
    <table class="header-table">
      <tr>
        <td style="width: 65%;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <div style="width: 22px; height: 22px; background: #0d9488; color: #fff; font-size: 16px; font-weight: 900; text-align: center; line-height: 22px; border-radius: 4px;">✚</div>
            <h1 class="hospital-title">${hInfo.name}</h1>
          </div>
          <div class="hospital-tagline">${hInfo.tagline}</div>
          <div class="hospital-meta">
            ${hInfo.address}<br>
            Phone: ${hInfo.phone}<br>
            Email: ${hInfo.email}<br>
            <strong>${hInfo.taxId}</strong> • <strong>${hInfo.licenseNo}</strong>
          </div>
        </td>
        <td class="receipt-badge-box">
          <div class="receipt-badge">TAX INVOICE & RECEIPT</div>
          <div class="bill-no-text">${inv.billNo}</div>
          <div class="date-text">Date: <strong>${inv.date}</strong> • ${inv.time}</div>
          <div style="margin-top: 6px;">
            <span class="paid-stamp">${inv.status === 'Paid' ? 'PAID & CLEARED' : inv.status}</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Patient & Encounter Metadata Box -->
    <table class="patient-box">
      <tr>
        <td style="width: 35%;">
          <span class="field-label">Patient Name</span>
          <span class="field-value" style="font-size: 14px;">${inv.patientName}</span>
        </td>
        <td style="width: 25%;">
          <span class="field-label">Patient UHID / MRN</span>
          <span class="field-value-mono">${inv.patientId}</span>
        </td>
        <td style="width: 40%;">
          <span class="field-label">Bill Category / Encounter</span>
          <span class="field-value">${inv.type}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="field-label">Payment Mode</span>
          <span class="field-value">${inv.paymentMode}</span>
        </td>
        <td>
          <span class="field-label">Transaction Reference / UTR</span>
          <span class="field-value-mono" style="font-size: 11px;">${inv.txnRef}</span>
        </td>
        <td>
          <span class="field-label">Billing Location</span>
          <span class="field-value">Central Billing Counter 02 • Main Hospital Block</span>
        </td>
      </tr>
    </table>

    <!-- Itemized Breakdown Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 5%;" class="text-center">#</th>
          <th style="width: 48%;">Service / Clinical Treatment Description</th>
          <th style="width: 14%;">SAC Code</th>
          <th style="width: 15%;">Department</th>
          <th style="width: 18%;" class="text-right">Amount (INR ₹)</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((it) => `
          <tr>
            <td class="text-center">${it.sNo}</td>
            <td><strong>${it.name}</strong></td>
            <td class="mono" style="font-size: 11px;">${it.sac}</td>
            <td style="color: #475569;">${it.dept}</td>
            <td class="text-right mono font-bold">₹${Number(it.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Summary Box -->
    <div class="summary-table-wrap">
      <table class="summary-table">
        <tr>
          <td>Subtotal (Gross Charges):</td>
          <td class="text-right mono">₹${inv.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
        ${inv.discount > 0 ? `
        <tr>
          <td style="color: #16a34a;">Institutional Discount:</td>
          <td class="text-right mono" style="color: #16a34a;">- ₹${inv.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>` : ''}
        ${inv.taxGst > 0 ? `
        <tr>
          <td>CGST (2.5%):</td>
          <td class="text-right mono">₹${cgst}</td>
        </tr>
        <tr>
          <td>SGST (2.5%):</td>
          <td class="text-right mono">₹${sgst}</td>
        </tr>` : ''}
        <tr class="total-row">
          <td>TOTAL AMOUNT:</td>
          <td class="text-right mono">₹${inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
        ${inv.advancePaid > 0 ? `
        <tr>
          <td style="color: #475569;">Amount Paid / Deposit:</td>
          <td class="text-right mono" style="color: #475569;">- ₹${inv.advancePaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>` : ''}
        ${inv.insuranceClaimed > 0 ? `
        <tr>
          <td style="color: #0284c7;">TPA Insurance Settled:</td>
          <td class="text-right mono" style="color: #0284c7;">- ₹${inv.insuranceClaimed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>` : ''}
        <tr class="balance-row">
          <td>NET BALANCE DUE:</td>
          <td class="text-right mono">₹${inv.balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>
    </div>

    <!-- Amount in Words -->
    <div class="words-box">
      <span style="font-weight: 700; color: #475569; text-transform: uppercase; font-size: 10px;">Amount in Words:</span><br>
      <strong style="color: #0f172a; font-size: 12px;">${wordsText}</strong>
    </div>

    <!-- Terms & Authorized Signatures -->
    <table class="footer-table">
      <tr>
        <td style="width: 60%;">
          <div class="terms-text">
            <strong>Terms & Information:</strong><br>
            1. This is a computer-generated tax invoice and legal receipt under Section 31 of CGST Act, 2017.<br>
            2. Any clinical refund or discharge clearance requires original receipt presentation.<br>
            3. All medical consultations & diagnostic services are governed by NABH and Indian Medical Council guidelines.<br>
            4. Verified digital electronic health record timestamp: ${inv.date} ${inv.time}.
          </div>
        </td>
        <td style="width: 40%; text-align: right;">
          <div class="signature-line">
            Authorized Cashier / Accountant<br>
            <span style="font-size: 10px; font-weight: 500; color: #64748b;">HospitalCare Billing Operations</span>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <script>
    window.onload = function() {
      // Auto-trigger print dialog smoothly
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;
};

/**
 * Triggers official hospital receipt print window / PDF save dialog
 */
export const printHospitalReceipt = (invoice, hospitalInfo) => {
  const htmlContent = generateReceiptHTML(invoice, hospitalInfo);
  const printWindow = window.open('', '_blank', 'width=900,height=800,top=50,left=100');

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    return true;
  } else {
    // Fallback using hidden iframe if popup is blocked
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 500);
    return true;
  }
};
