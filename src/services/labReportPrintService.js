/**
 * Diagnostic Lab Report Print & PDF Generation Service
 * Generates official NABL / CAP accredited lab report slips for printing.
 */

export const generateLabReportHTML = (labReport, hospitalInfo = {}) => {
  const hInfo = {
    name: hospitalInfo.name || 'HospitalCare Super Specialty Hospital & Research Institute',
    address: hospitalInfo.address || 'Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081',
    phone: hospitalInfo.phone || '+91 (040) 6889-4000 / 1800-425-9999',
    licenseNo: hospitalInfo.licenseNo || 'NABH-TERTIARY-2024-99821 • NABL Cert: MC-4190',
    email: hospitalInfo.email || 'pathology@hospitalcare.org'
  };

  const report = {
    orderNo: labReport?.orderNo || 'ORD-LAB-9921',
    barcode: labReport?.barcode || 'MEDLAB*8810*CBC*',
    patientName: labReport?.patientName || 'Rameshwar Prasad Sharma',
    patientId: labReport?.patientId || 'PAT-2026-8801',
    testName: labReport?.testName || 'Comprehensive Cardiac & Lipid Biomarker Panel',
    category: labReport?.category || 'Biochemistry & Clinical Pathology',
    sampleType: labReport?.sampleType || 'Venous Blood (EDTA + Serum Gel Separator)',
    orderTime: labReport?.orderTime || new Date().toISOString().split('T')[0] + ' 08:30 AM',
    verifiedBy: labReport?.verifiedBy || 'Dr. Neha Kulkarni, MD (Pathology)',
    parameters: (labReport?.parameters && labReport.parameters.length > 0)
      ? labReport.parameters
      : [
          { name: 'High-Sensitivity Troponin I', result: '0.012', unit: 'ng/mL', reference: '0.000 - 0.034', flag: 'Normal' },
          { name: 'Total Cholesterol', result: '228.4', unit: 'mg/dL', reference: '125.0 - 200.0', flag: 'High' },
          { name: 'LDL Cholesterol', result: '148.0', unit: 'mg/dL', reference: '< 100.0 (Optimal < 70 in CAD)', flag: 'High' },
          { name: 'HDL Cholesterol', result: '38.2', unit: 'mg/dL', reference: '40.0 - 60.0', flag: 'Low' },
          { name: 'Triglycerides', result: '211.0', unit: 'mg/dL', reference: '< 150.0', flag: 'High' },
          { name: 'Serum Creatinine', result: '1.08', unit: 'mg/dL', reference: '0.70 - 1.20', flag: 'Normal' }
        ],
    interpretation: labReport?.interpretation || 'Lipid profile reveals mixed hyperlipidemia requiring intensifications of statin-ezetimibe combination. Cardiac biomarkers currently non-ischemic.'
  };

  const paramRows = report.parameters.map((p) => {
    const isAbnormal = p.flag === 'High' || p.flag === 'Low' || p.flag === 'Critical';
    const flagColor = p.flag === 'High' ? '#dc2626' : p.flag === 'Low' ? '#d97706' : '#16a34a';
    const flagBg = p.flag === 'High' ? '#fee2e2' : p.flag === 'Low' ? '#fef3c7' : '#dcfce7';

    return `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 12px;">
          ${p.name}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 800; font-size: 13px; color: ${isAbnormal ? '#b91c1c' : '#0f172a'}; text-align: center;">
          ${p.result}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center;">
          ${p.unit}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #475569; text-align: center;">
          ${p.reference}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; background: ${flagBg}; color: ${flagColor}; font-weight: 800; font-size: 10.5px;">
            ${p.flag}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Laboratory Report - ${report.orderNo} - ${report.patientName}</title>
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
    .report-card {
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
      border-bottom: 2.5px solid #4f46e5;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .lab-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .lab-table th {
      background: #f1f5f9;
      color: #334155;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 10px 12px;
      border-bottom: 1.5px solid #cbd5e1;
    }
    .interp-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #4f46e5;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 18px;
    }
    .footer-table {
      width: 100%;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      margin-top: 14px;
    }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .print-bar { display: none !important; }
      .report-card {
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
      Diagnostic Pathology Report (${report.orderNo})
    </div>
    <div>
      <button class="print-btn" onclick="window.print()">🖨️ Print Report</button>
      <button class="close-btn" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="report-card">
    <table class="header-table">
      <tr>
        <td style="vertical-align: top; width: 68%;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; background: #4f46e5; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900;">
              🧪
            </div>
            <div>
              <div style="font-size: 16px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em;">
                ${hInfo.name}
              </div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                Central Diagnostic Pathology & Clinical Biochemistry Laboratory
              </div>
              <div style="font-size: 10px; color: #059669; font-weight: 700; margin-top: 2px;">
                ✓ NABL & CAP Accredited Laboratory • ${hInfo.licenseNo}
              </div>
            </div>
          </div>
        </td>
        <td style="vertical-align: top; text-align: right; width: 32%;">
          <div style="display: inline-block; background: #4f46e5; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.04em;">
            OFFICIAL DIAGNOSTIC REPORT
          </div>
          <div style="font-size: 11.5px; font-weight: 700; color: #475569; margin-top: 6px;">
            Order: <strong style="color: #0f172a; font-family: monospace;">${report.orderNo}</strong>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Barcode: <strong style="color: #4f46e5; font-family: monospace;">${report.barcode}</strong>
          </div>
        </td>
      </tr>
    </table>

    <table style="width: 100%; margin-bottom: 16px; border-collapse: separate; border-spacing: 12px 0;">
      <tr>
        <td style="width: 50%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; vertical-align: top;">
          <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Patient Name</div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">${report.patientName}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            MRN: <strong style="color: #0d9488; font-family: monospace;">${report.patientId}</strong>
          </div>
        </td>
        <td style="width: 50%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; vertical-align: top;">
          <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Investigation Panel</div>
          <div style="font-size: 13.5px; font-weight: 800; color: #4f46e5; margin-top: 2px;">${report.testName}</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            Specimen: <strong>${report.sampleType}</strong>
          </div>
        </td>
      </tr>
    </table>

    <table class="lab-table">
      <thead>
        <tr>
          <th style="width: 38%; text-align: left;">Analyte / Parameter</th>
          <th style="width: 16%; text-align: center;">Observed Result</th>
          <th style="width: 14%; text-align: center;">Biological Units</th>
          <th style="width: 20%; text-align: center;">Reference Interval</th>
          <th style="width: 12%; text-align: right;">Flag</th>
        </tr>
      </thead>
      <tbody>
        ${paramRows}
      </tbody>
    </table>

    <div class="interp-box">
      <div style="font-size: 10.5px; font-weight: 900; color: #3730a3; text-transform: uppercase;">
        Pathologist Clinical Interpretation:
      </div>
      <div style="font-size: 12.5px; color: #1e293b; font-weight: 600; margin-top: 3px; line-height: 1.45;">
        ${report.interpretation}
      </div>
    </div>

    <table class="footer-table">
      <tr>
        <td style="font-size: 10px; color: #64748b; width: 65%; vertical-align: bottom;">
          Report authenticated electronically. Results relate only to the specimen tested. End of diagnostic laboratory report.
        </td>
        <td style="width: 35%; text-align: right; vertical-align: bottom;">
          <div style="border-bottom: 1.5px solid #0f172a; width: 190px; margin-left: auto; padding-bottom: 3px; margin-bottom: 4px;">
            <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #4f46e5;">✓ Verified Pathologist</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a;">${report.verifiedBy}</div>
          <div style="font-size: 10.5px; color: #64748b;">Consultant Pathologist, MD</div>
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
 * Triggers official hospital lab report print window / PDF save dialog
 */
export const printLabReport = (labReport, hospitalInfo) => {
  const htmlContent = generateLabReportHTML(labReport, hospitalInfo);
  const printWindow = window.open('', '_blank', 'width=880,height=820,top=60,left=100');

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    return true;
  } else {
    // Fallback using hidden iframe
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
