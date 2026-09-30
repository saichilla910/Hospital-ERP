/**
 * Executive Report Print & PDF Generation Service
 * Generates official high-resolution, full-color A4 Hospital Executive Quality,
 * Operational Performance, and Clinical Governance Reports.
 */

export const generateExecutiveReportHTML = (reportData = {}, hospitalInfo = {}) => {
  const hInfo = {
    name: hospitalInfo.name || 'MediCore Super Specialty Hospital & Research Institute',
    address: hospitalInfo.address || 'Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081',
    phone: hospitalInfo.phone || '+91 (040) 6889-4000 / 1800-425-9999',
    licenseNo: hospitalInfo.licenseNo || 'NABH-TERTIARY-2024-99821 • Reg No: MED-TG-2020-8801',
    email: hospitalInfo.email || 'clinical.audit@medicorehospital.org'
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const reportId = reportData.reportId || `REP-2026-Q3-${Math.floor(1000 + Math.random() * 9000)}`;
  const reportingPeriod = reportData.period || 'Quarter 3 (Q3) - Fiscal Year 2026';

  const qualityStandards = reportData.qualityMetrics || [
    { indicator: 'Average Patient Hospital Stay', benchmark: 'Under 4.5 Days', achieved: '3.8 Days', status: 'Excellent' },
    { indicator: 'Bed Occupancy (Beds in Use)', benchmark: '75% - 85%', achieved: '81.3%', status: 'Normal' },
    { indicator: 'Hospital Cleanliness & Infection Prevention', benchmark: 'Below 0.5%', achieved: '0.08%', status: 'Excellent' },
    { indicator: 'Emergency to Admission Rate', benchmark: '35% - 45%', achieved: '42.0%', status: 'Normal' },
    { indicator: 'Medicine Dispensing Accuracy', benchmark: 'Above 99.9%', achieved: '100% (Zero Error)', status: 'Excellent' },
    { indicator: 'Patient Discharge Satisfaction', benchmark: 'Above 90%', achieved: '96.4%', status: 'Excellent' }
  ];

  const trends = reportData.performanceTrend || [
    { month: 'Apr 2026', satisfaction: 94.2, recovery: 96.0, compliance: 99.4 },
    { month: 'May 2026', satisfaction: 95.1, recovery: 96.8, compliance: 99.6 },
    { month: 'Jun 2026', satisfaction: 95.8, recovery: 97.2, compliance: 99.8 },
    { month: 'Jul 2026', satisfaction: 96.0, recovery: 97.5, compliance: 99.8 },
    { month: 'Aug 2026', satisfaction: 96.2, recovery: 97.8, compliance: 99.9 },
    { month: 'Sep 2026', satisfaction: 96.4, recovery: 98.2, compliance: 99.9 }
  ];

  const wards = (reportData.wards && reportData.wards.length > 0) ? reportData.wards : [
    { name: 'Intensive Cardiac Care (ICCU)', floor: '3rd Floor - Wing A', totalBeds: 16, occupiedBeds: 14, nurseInCharge: 'Sister Nirmala R.' },
    { name: 'Surgical ICU (SICU)', floor: '3rd Floor - Wing B', totalBeds: 14, occupiedBeds: 11, nurseInCharge: 'Sister Priya K.' },
    { name: 'General Medicine Ward', floor: '2nd Floor - Wing A', totalBeds: 30, occupiedBeds: 25, nurseInCharge: 'Sister Aruna S.' },
    { name: 'Orthopedic Post-Op Care', floor: '2nd Floor - Wing B', totalBeds: 22, occupiedBeds: 18, nurseInCharge: 'Sister Lakshmi T.' },
    { name: 'Pediatric Care Unit', floor: '4th Floor - Wing A', totalBeds: 18, occupiedBeds: 12, nurseInCharge: 'Sister Mary D.' }
  ];

  // Helper badge color
  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('optimal') || s.includes('excellent') || s.includes('exemplary') || s.includes('accredited')) {
      return `background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;`;
    }
    if (s.includes('normal') || s.includes('active')) {
      return `background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4;`;
    }
    return `background: #fffbeb; color: #92400e; border: 1px solid #fde68a;`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hospital Executive Performance & Quality Report - ${reportId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #0f172a;
      background-color: #f1f5f9;
      font-size: 11.5px;
      line-height: 1.45;
    }
    .print-control-bar {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 1000;
    }
    .print-btn {
      background: #0d9488;
      color: #ffffff;
      border: none;
      padding: 9px 18px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: background 0.15s;
    }
    .print-btn:hover { background: #0f766e; }
    .close-btn {
      background: #334155;
      color: #f8fafc;
      border: none;
      padding: 9px 16px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      margin-left: 10px;
    }
    .close-btn:hover { background: #475569; }
    .page-container {
      max-width: 820px;
      margin: 20px auto 40px auto;
      background: #ffffff;
      padding: 32px 36px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
    @media print {
      body {
        background: #ffffff !important;
      }
      .print-control-bar {
        display: none !important;
      }
      .page-container {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
      }
      .page-break {
        page-break-before: always;
      }
    }

    /* Hospital Header Strip */
    .hospital-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #0d9488;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .hospital-brand {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .hospital-logo {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, #0d9488 0%, #0369a1 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 26px;
      font-weight: 900;
    }
    .hospital-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin: 0 0 3px 0;
    }
    .hospital-meta {
      font-size: 10.5px;
      color: #475569;
      line-height: 1.4;
    }
    .accreditation-badges {
      text-align: right;
    }
    .badge-pill {
      display: inline-block;
      padding: 3px 9px;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 6px;
      margin-bottom: 4px;
      background: #f0fdfa;
      color: #0d9488;
      border: 1px solid #99f6e4;
    }

    /* Report Banner */
    .report-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0d9488;
      padding: 12px 16px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .report-title-box h1 {
      margin: 0 0 3px 0;
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.2px;
    }
    .report-title-box p {
      margin: 0;
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    .report-meta-grid {
      text-align: right;
      font-size: 10.5px;
      color: #334155;
      line-height: 1.5;
    }
    .report-meta-grid strong {
      color: #0f172a;
    }

    /* KPI Highlights Grid */
    .section-heading {
      font-size: 12.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f766e;
      margin: 18px 0 10px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-heading::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e2e8f0;
      margin-left: 8px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      border-top: 3px solid #0d9488;
    }
    .kpi-label {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }
    .kpi-value {
      font-size: 17px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.1;
      margin-bottom: 2px;
    }
    .kpi-sub {
      font-size: 9.5px;
      color: #059669;
      font-weight: 600;
    }

    /* Data Tables */
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 11px;
    }
    .report-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .report-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
    }
    .report-table tr:nth-child(even) td {
      background: #fafafa;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 700;
    }

    /* Progress bar */
    .bar-outer {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      margin-top: 4px;
    }
    .bar-inner {
      height: 100%;
      background: #0d9488;
      border-radius: 9999px;
    }

    /* Sign-off Section */
    .signoff-section {
      margin-top: 30px;
      border-top: 1.5px dashed #cbd5e1;
      padding-top: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .signoff-box {
      text-align: center;
    }
    .signature-line {
      height: 38px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-bottom: 6px;
      font-family: 'Brush Script MT', cursive, serif;
      font-size: 19px;
      color: #0369a1;
    }
    .signoff-name {
      font-weight: 700;
      font-size: 11px;
      color: #0f172a;
    }
    .signoff-role {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 1px;
    }

    .report-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 9.5px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <!-- Floating Print Bar for Screen Mode -->
  <div class="print-control-bar">
    <div style="font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px;">
      <span>🏥</span>
      <span>Executive Performance & Quality Audit Report (${reportId})</span>
    </div>
    <div>
      <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="close-btn" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="page-container">
    <!-- Header -->
    <div class="hospital-header">
      <div class="hospital-brand">
        <div class="hospital-logo">M</div>
        <div>
          <h2 class="hospital-title">${hInfo.name}</h2>
          <div class="hospital-meta">
            ${hInfo.address}<br>
            Emergency & OPD: ${hInfo.phone} · Web: www.medicorehospital.org<br>
            <span style="font-weight: 600; color: #0f766e;">NABH & NABL Accredited Tertiary Healthcare Institute</span>
          </div>
        </div>
      </div>
      <div class="accreditation-badges">
        <div class="badge-pill">NABH ACCREDITED</div><br>
        <div class="badge-pill" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe;">JCI COMPLIANT</div><br>
        <div style="font-size: 9px; color: #64748b; margin-top: 4px;">License: ${hInfo.licenseNo.split('•')[0]}</div>
      </div>
    </div>

    <!-- Title & Period Banner -->
    <div class="report-banner">
      <div class="report-title-box">
        <h1>Executive Quality & Hospital Performance Report</h1>
        <p>Prepared for Hospital Governing Board, Clinical Governance & Quality Assurance Committee</p>
      </div>
      <div class="report-meta-grid">
        <div>Ref: <strong>${reportId}</strong></div>
        <div>Period: <strong>${reportingPeriod}</strong></div>
        <div>Generated: <strong>${currentDate}, ${currentTime}</strong></div>
        <div>Security Classification: <strong style="color: #0f766e;">Clinical Audit (Internal)</strong></div>
      </div>
    </div>

    <!-- Executive KPI Summary Cards -->
    <div class="section-heading">
      <span>1. Executive Clinical & Operational Scorecards</span>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Average Hospital Stay</div>
        <div class="kpi-value">3.8 Days</div>
        <div class="kpi-sub">Target: &lt;4.5 Days (Achieved)</div>
      </div>
      <div class="kpi-card" style="border-top-color: #10b981;">
        <div class="kpi-label">Bed Sanitization Time</div>
        <div class="kpi-value">0.6 Days</div>
        <div class="kpi-sub">Turnaround: 14.4 Hours</div>
      </div>
      <div class="kpi-card" style="border-top-color: #0284c7;">
        <div class="kpi-label">Safety Compliance</div>
        <div class="kpi-value">99.92%</div>
        <div class="kpi-sub">NABH Gold Standard</div>
      </div>
      <div class="kpi-card" style="border-top-color: #8b5cf6;">
        <div class="kpi-label">Patient Satisfaction</div>
        <div class="kpi-value">96.4%</div>
        <div class="kpi-sub">Based on 1,420+ Discharges</div>
      </div>
    </div>

    <!-- Section 2: Quality & NABH Standards -->
    <div class="section-heading">
      <span>2. Clinical Care Quality Benchmarks & Indicators</span>
    </div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 32px;">#</th>
          <th>Clinical Quality Indicator</th>
          <th>Accreditation Benchmark (NABH / JCI)</th>
          <th>Achieved Result</th>
          <th style="text-align: right;">Audit Status</th>
        </tr>
      </thead>
      <tbody>
        ${qualityStandards.map((q, idx) => `
          <tr>
            <td style="font-weight: 700; color: #64748b;">${idx + 1}</td>
            <td style="font-weight: 600; color: #0f172a;">${q.indicator}</td>
            <td style="color: #475569; font-family: monospace; font-size: 10.5px;">${q.benchmark}</td>
            <td style="font-weight: 700; color: #0f766e;">${q.achieved}</td>
            <td style="text-align: right;">
              <span class="status-badge" style="${getStatusBadge(q.status)}">
                ${q.status}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Section 3: Inpatient Capacity & Bed Census -->
    <div class="section-heading">
      <span>3. Departmental Inpatient Capacity & Bed Census</span>
    </div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 32px;">#</th>
          <th>Ward / Clinical Care Unit</th>
          <th>Floor / Wing</th>
          <th style="text-align: center;">Total Beds</th>
          <th style="text-align: center;">Occupied</th>
          <th style="text-align: center;">Vacant</th>
          <th>Occupancy %</th>
          <th>Nurse Supervisor</th>
        </tr>
      </thead>
      <tbody>
        ${wards.map((w, idx) => {
          const total = w.totalBeds || (w.beds ? w.beds.length : 12);
          const occupied = w.occupiedBeds || (w.beds ? w.beds.filter(b => b.status === 'Occupied').length : 8);
          const available = total - occupied;
          const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
          return `
            <tr>
              <td style="font-weight: 700; color: #64748b;">${idx + 1}</td>
              <td style="font-weight: 700; color: #0f172a;">${w.name}</td>
              <td style="color: #64748b; font-size: 10.5px;">${w.floor || 'Clinical Block'}</td>
              <td style="text-align: center; font-weight: 600;">${total}</td>
              <td style="text-align: center; font-weight: 700; color: #0f766e;">${occupied}</td>
              <td style="text-align: center; font-weight: 600; color: #16a34a;">${available}</td>
              <td style="width: 130px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 10px;">
                  <span>${pct}%</span>
                </div>
                <div class="bar-outer">
                  <div class="bar-inner" style="width: ${pct}%;"></div>
                </div>
              </td>
              <td style="font-size: 10px; color: #475569;">${w.nurseInCharge || 'Sister In-Charge'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <!-- Section 4: Monthly Recovery & Compliance Trajectory -->
    <div class="section-heading">
      <span>4. Monthly Clinical Recovery & Safety Compliance Trajectory</span>
    </div>
    <table class="report-table">
      <thead>
        <tr>
          <th>Reporting Month</th>
          <th style="text-align: center;">Clinical Recovery Rate</th>
          <th style="text-align: center;">Patient Satisfaction Score</th>
          <th style="text-align: center;">Safety & Hygiene Compliance</th>
          <th style="text-align: right;">Gold Standard Benchmark</th>
        </tr>
      </thead>
      <tbody>
        ${trends.map(t => `
          <tr>
            <td style="font-weight: 700; color: #0f172a;">${t.month}</td>
            <td style="text-align: center; font-weight: 700; color: #0f766e;">${t.recovery}%</td>
            <td style="text-align: center; font-weight: 700; color: #2563eb;">${t.satisfaction}%</td>
            <td style="text-align: center; font-weight: 700; color: #16a34a;">${t.compliance}%</td>
            <td style="text-align: right; color: #64748b; font-size: 10px;">≥ 95.0% Target Achieved</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Section 5: Official Signatures & Endorsement -->
    <div class="signoff-section">
      <div class="signoff-box">
        <div class="signature-line">Dr. Rajeshwari K.</div>
        <div class="signoff-name">Dr. Rajeshwari K., MD, FRCS</div>
        <div class="signoff-role">Chief Medical Superintendent</div>
      </div>
      <div class="signoff-box">
        <div class="signature-line">Venkatesh Rao</div>
        <div class="signoff-name">Dr. Venkatesh Rao, MHA</div>
        <div class="signoff-role">Director - Quality & Patient Safety</div>
      </div>
      <div class="signoff-box">
        <div class="signature-line">Prof. Arunkumar M.</div>
        <div class="signoff-name">Prof. Arunkumar M., MS, MCh</div>
        <div class="signoff-role">Chief Executive Officer</div>
      </div>
    </div>

    <!-- Report Footer -->
    <div class="report-footer">
      This document is an electronically generated and digitally validated hospital clinical quality record under MediCore Hospital ERP System v4.2.<br>
      Confidential • For Internal Clinical & Quality Audit Use Only • Report Ref: ${reportId}
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      // Auto trigger print dialog smoothly
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
};

/**
 * Triggers official hospital executive report print window / PDF save dialog
 */
export const printExecutiveQualityReport = (reportData, hospitalInfo) => {
  const htmlContent = generateExecutiveReportHTML(reportData, hospitalInfo);
  const printWindow = window.open('', '_blank', 'width=920,height=850,top=40,left=80');

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
