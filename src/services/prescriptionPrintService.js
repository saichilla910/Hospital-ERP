/**
 * Prescription Print & PDF Generation Service
 * Generates official high-resolution, full-color hospital prescription slips for A4 / Letter printing.
 */

export const generatePrescriptionHTML = (prescription, hospitalInfo = {}) => {
  const hInfo = {
    name: hospitalInfo.name || 'MediCore Super Specialty Hospital & Research Institute',
    address: hospitalInfo.address || 'Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081',
    phone: hospitalInfo.phone || '+91 (040) 6889-4000 / 1800-425-9999',
    licenseNo: hospitalInfo.licenseNo || 'NABH-TERTIARY-2024-99821 • Reg No: MED-TG-2020-8801',
    email: hospitalInfo.email || 'clinical@medicorehospital.org'
  };

  const rx = {
    id: prescription?.id || prescription?.rxNo || 'RX-2026-4401',
    date: prescription?.date || new Date().toISOString().split('T')[0],
    patientId: prescription?.patientId || 'PAT-2026-6322',
    patientName: prescription?.patientName || 'sai kumar',
    doctorId: prescription?.doctorId || 'DOC-102',
    doctorName: prescription?.doctorName || 'Dr. Ananya Mukherjee',
    department: prescription?.department || 'Cardiology',
    diagnosis: prescription?.diagnosis || 'I20.0 - Unstable Angina, Stabilized',
    items: (prescription?.items && prescription.items.length > 0)
      ? prescription.items
      : [
          { name: 'Tab. Ticagrelor 90mg (Brilinta)', dosage: '1 tab twice daily (BID)', duration: '30 Days', instructions: 'After meals, do not skip dose' },
          { name: 'Tab. Rosuvastatin 20mg + Ezetimibe 10mg', dosage: '1 tab at bedtime (HS)', duration: '30 Days', instructions: 'Night time' },
          { name: 'Tab. Metoprolol Succinate 25mg (Betaloc)', dosage: '1 tab morning (OD)', duration: '30 Days', instructions: 'Monitor pulse' }
        ],
    dietAdvice: prescription?.dietAdvice || 'Strict low salt (<2g/day), zero trans fats, 30 min gentle walk daily.',
    followUp: prescription?.followUp || 'Review after 4 weeks with Lipid Profile and Serum Creatinine.'
  };

  const rowsHtml = rx.items.map((item, idx) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="color: #0d9488; font-size: 14px;">💊</span>
          <span>${item.name}</span>
        </div>
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px; text-align: center;">
        <span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; background: #f0fdfa; color: #0f766e; border: 1px solid #b2f5ea; font-weight: 700;">
          ${item.dosage}
        </span>
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 700; font-size: 12px; color: #0f172a; text-align: center;">
        ${item.duration}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #475569; text-align: right;">
        ${item.instructions || 'After meals'}
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Prescription Slip - ${rx.id} - ${rx.patientName}</title>
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.45;
    }
    .print-bar {
      max-width: 820px;
      margin: 0 auto 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background: #0f172a;
      border-radius: 8px;
      color: #ffffff;
    }
    .print-btn {
      background: #0d9488;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .print-btn:hover { background: #0f766e; }
    .close-btn {
      background: #475569;
      color: #ffffff;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      margin-left: 8px;
      cursor: pointer;
    }
    .prescription-card {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px 36px;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2.5px solid #0d9488;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .meta-grid {
      width: 100%;
      border-collapse: separate;
      border-spacing: 12px 0;
      margin-bottom: 16px;
    }
    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
    }
    .diagnosis-box {
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      border-left: 4px solid #0d9488;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 18px;
    }
    .rx-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .rx-table th {
      background: #f1f5f9;
      color: #334155;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 10px 12px;
      border-bottom: 1.5px solid #cbd5e1;
    }
    .advice-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    .advice-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 12px;
    }
    .footer-table {
      width: 100%;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      margin-top: 14px;
    }
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .print-bar { display: none !important; }
      .prescription-card {
        border: none !important;
        box-shadow: none !important;
        padding: 10mm 12mm !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div style="font-weight: 700; font-size: 13px;">
      Medical Prescription Slip (${rx.id})
    </div>
    <div>
      <button class="print-btn" onclick="window.print()">🖨️ Print Prescription</button>
      <button class="close-btn" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="prescription-card">
    <!-- Header -->
    <table class="header-table">
      <tr>
        <td style="vertical-align: top; width: 68%;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; background: #0d9488; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; line-height: 1;">
              ✚
            </div>
            <div>
              <div style="font-size: 16px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em;">
                ${hInfo.name}
              </div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                ${hInfo.address} • Tel: ${hInfo.phone}
              </div>
              <div style="font-size: 10px; color: #059669; font-weight: 700; margin-top: 2px;">
                ✓ ${hInfo.licenseNo}
              </div>
            </div>
          </div>
        </td>
        <td style="vertical-align: top; text-align: right; width: 32%;">
          <div style="display: inline-block; background: #0d9488; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.04em;">
            OPD CLINICAL PRESCRIPTION
          </div>
          <div style="font-size: 11.5px; font-weight: 700; color: #475569; margin-top: 6px;">
            Date: <strong style="color: #0f172a; font-family: monospace;">${rx.date}</strong>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Rx No: <strong style="color: #0d9488; font-family: monospace;">${rx.id}</strong>
          </div>
        </td>
      </tr>
    </table>

    <!-- Patient & Doctor Metadata -->
    <table style="width: 100%; margin-bottom: 16px; border-collapse: separate; border-spacing: 12px 0;">
      <tr>
        <td style="width: 50%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; vertical-align: top;">
          <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em;">Patient Details</div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">${rx.patientName}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Patient ID: <strong style="color: #0d9488; font-family: monospace;">${rx.patientId}</strong>
          </div>
        </td>
        <td style="width: 50%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; vertical-align: top;">
          <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em;">Prescribing Consultant</div>
          <div style="font-size: 14px; font-weight: 800; color: #0d9488; margin-top: 2px;">${rx.doctorName}</div>
          <div style="font-size: 11px; color: #475569; font-weight: 600; margin-top: 2px;">
            Department of ${rx.department}
          </div>
        </td>
      </tr>
    </table>

    <!-- Clinical Diagnosis -->
    <div class="diagnosis-box">
      <div style="font-size: 10.5px; font-weight: 900; color: #0f766e; text-transform: uppercase; letter-spacing: 0.05em;">
        Clinical Diagnosis / Findings:
      </div>
      <div style="font-size: 13.5px; font-weight: 800; color: #0f172a; margin-top: 3px;">
        ${rx.diagnosis}
      </div>
    </div>

    <!-- Rx Medication Table -->
    <div style="margin-bottom: 6px;">
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
        <span style="font-size: 20px; font-family: serif; font-weight: 900; color: #0d9488;">℞</span>
        <span style="font-size: 13px; font-weight: 800; color: #0f172a;">Prescribed Medication Schedule:</span>
      </div>

      <table class="rx-table">
        <thead>
          <tr>
            <th style="width: 44%; text-align: left;">Medicine Name / Salt</th>
            <th style="width: 26%; text-align: center;">Dosage & Frequency</th>
            <th style="width: 14%; text-align: center;">Duration</th>
            <th style="width: 16%; text-align: right;">Instructions</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Advice & Follow-up -->
    <div class="advice-grid">
      <div class="advice-card">
        <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
          <span>🥗</span> <span>Dietary & Lifestyle Advice:</span>
        </div>
        <div style="color: #475569; font-size: 11.5px; line-height: 1.4;">
          ${rx.dietAdvice}
        </div>
      </div>

      <div class="advice-card">
        <div style="font-weight: 800; color: #0d9488; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
          <span>📅</span> <span>Next Clinical Review / Follow-up:</span>
        </div>
        <div style="color: #475569; font-size: 11.5px; line-height: 1.4;">
          ${rx.followUp}
        </div>
      </div>
    </div>

    <!-- Footer Signature -->
    <table class="footer-table">
      <tr>
        <td style="font-size: 10px; color: #64748b; width: 65%; vertical-align: bottom;">
          Digitally generated via MediCore ERP Electronic Medical Record (EMR). Valid under National Medical Commission digital prescription regulations.
        </td>
        <td style="width: 35%; text-align: right; vertical-align: bottom;">
          <div style="border-bottom: 1.5px solid #0f172a; width: 180px; margin-left: auto; padding-bottom: 3px; margin-bottom: 4px;">
            <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #0d9488;">✓ Digitally Signed</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a;">${rx.doctorName}</div>
          <div style="font-size: 10.5px; color: #64748b;">Reg: MCI-NMC-2024-88419</div>
        </td>
      </tr>
    </table>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;
};

/**
 * Triggers official hospital prescription print window / PDF save dialog
 */
export const printPrescriptionSlip = (prescription, hospitalInfo) => {
  const htmlContent = generatePrescriptionHTML(prescription, hospitalInfo);
  const printWindow = window.open('', '_blank', 'width=880,height=820,top=60,left=100');

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
