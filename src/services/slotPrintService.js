/**
 * Slot & Appointment Print Service
 * Generates official Doctor OPD Consultation Timetables, Slot Availability Reports,
 * and OPD Patient Queue Token Confirmation Slips for high-resolution printing.
 */

/**
 * Generate official Doctor OPD Consultation Timetable & Slots Report HTML
 */
export const generateDoctorSlotsReportHTML = ({ doctor, selectedDate, slotData, hospitalInfo = {} }) => {
  const hInfo = {
    name: hospitalInfo.name || 'MediCore Super Specialty Hospital & Research Institute',
    address: hospitalInfo.address || 'Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081',
    phone: hospitalInfo.phone || '+91 (040) 6889-4000 / 1800-425-9999',
    licenseNo: hospitalInfo.licenseNo || 'NABH-TERTIARY-2024-99821 • Reg No: MED-TG-2020-8801'
  };

  const doc = doctor || {
    name: 'Dr. Ananya Mukherjee',
    specialty: 'Cardiology & Interventional Cardiothoracic',
    department: 'Department of Cardiology',
    room: '304',
    fee: 850,
    experience: '16+ Years',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology), FESC'
  };

  const dateObj = new Date(selectedDate || Date.now());
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const morningSlots = slotData?.morningSlots || [];
  const eveningSlots = slotData?.eveningSlots || [];

  const morningAvailable = morningSlots.filter((s) => !s.isBooked).length;
  const eveningAvailable = eveningSlots.filter((s) => !s.isBooked).length;
  const totalSlots = morningSlots.length + eveningSlots.length;
  const totalAvailable = morningAvailable + eveningAvailable;
  const totalBooked = totalSlots - totalAvailable;

  const reportId = `SLOT-${doc.name.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase()}-${selectedDate.replace(/-/g, '')}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OPD Consultation Slots & Schedule - ${doc.name}</title>
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
      font-size: 11px;
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
      padding: 28px 32px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
    @media print {
      body { background: #ffffff !important; }
      .print-control-bar { display: none !important; }
      .page-container {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
      }
    }

    /* Hospital Header Strip */
    .hospital-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #0d9488;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .hospital-brand {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .hospital-logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #0d9488 0%, #0369a1 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 24px;
      font-weight: 900;
    }
    .hospital-title {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin: 0 0 3px 0;
    }
    .hospital-meta {
      font-size: 10px;
      color: #475569;
      line-height: 1.35;
    }

    /* Doctor Card Header */
    .doctor-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0d9488;
      padding: 12px 16px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .doc-name {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
    }
    .doc-spec {
      font-size: 11px;
      color: #0f766e;
      font-weight: 700;
    }
    .doc-details {
      font-size: 10px;
      color: #475569;
      margin-top: 2px;
    }

    /* Summary Metric Strip */
    .stat-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      text-align: center;
    }
    .stat-label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
    }
    .stat-val {
      font-size: 16px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 2px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f766e;
      margin: 14px 0 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }

    /* Slots Grid */
    .slots-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    .slots-table th {
      background: #f1f5f9;
      padding: 6px 10px;
      font-size: 9.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #475569;
      border: 1px solid #e2e8f0;
      text-align: left;
    }
    .slots-table td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      font-size: 10.5px;
    }
    .badge-open {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;
      font-weight: 700;
      font-size: 9.5px;
    }
    .badge-booked {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      font-weight: 700;
      font-size: 9.5px;
    }

    /* Patient Instructions */
    .info-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      padding: 10px 12px;
      margin-top: 14px;
      font-size: 10px;
      color: #1e40af;
      line-height: 1.45;
    }

    /* Sign-off */
    .signoff-row {
      margin-top: 24px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signoff-cell {
      text-align: center;
    }
    .signoff-sig {
      font-family: 'Brush Script MT', cursive, serif;
      font-size: 17px;
      color: #0369a1;
      margin-bottom: 3px;
    }
    .signoff-name {
      font-weight: 700;
      font-size: 10.5px;
      color: #0f172a;
    }
    .signoff-role {
      font-size: 9.5px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="print-control-bar">
    <div style="font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px;">
      <span>📅</span>
      <span>Doctor OPD Consultation Timetable & Slots Roster</span>
    </div>
    <div>
      <button class="print-btn" onclick="window.print()">🖨️ Print Schedule / Save PDF</button>
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
            OPD Appointment Desk & Patient Coordination: ${hInfo.phone}<br>
            NABH Accredited Tertiary Medical Institute
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <span style="display:inline-block; padding: 3px 8px; background: #f0fdfa; border: 1px solid #99f6e4; color: #0d9488; font-size: 9.5px; font-weight: 800; border-radius: 4px;">
          OPD CLINIC ROSTER
        </span>
        <div style="font-size: 9.5px; color: #64748b; margin-top: 4px;">Ref: ${reportId}</div>
      </div>
    </div>

    <!-- Doctor Banner -->
    <div class="doctor-banner">
      <div>
        <div class="doc-name">${doc.name}</div>
        <div class="doc-spec">${doc.specialty} · ${doc.department || 'Outpatient Department'}</div>
        <div class="doc-details">
          ${doc.qualifications || ''} · Room No: <strong style="color:#0f172a;">${doc.room}</strong> · Experience: ${doc.experience || '10+ Yrs'}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; font-weight: 800; color: #0f172a;">${dateFormatted}</div>
        <div style="font-size: 10px; color: #475569; margin-top: 2px;">
          Clinic Fee: <strong style="color: #0f766e; font-size: 12px;">₹${doc.fee}</strong> (TPA Cashless Accepted)
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stat-strip">
      <div class="stat-card">
        <div class="stat-label">Total Slots Today</div>
        <div class="stat-val">${totalSlots}</div>
      </div>
      <div class="stat-card" style="border-top: 2.5px solid #10b981;">
        <div class="stat-label">Available Slots</div>
        <div class="stat-val" style="color: #10b981;">${totalAvailable}</div>
      </div>
      <div class="stat-card" style="border-top: 2.5px solid #f59e0b;">
        <div class="stat-label">Confirmed Bookings</div>
        <div class="stat-val" style="color: #d97706;">${totalBooked}</div>
      </div>
      <div class="stat-card" style="border-top: 2.5px solid #0d9488;">
        <div class="stat-label">Slot Duration</div>
        <div class="stat-val" style="font-size: 14px;">15 - 20 Mins</div>
      </div>
    </div>

    <!-- Morning Session -->
    <div class="section-title">
      <span>Morning Clinic Timetable (09:00 AM – 01:00 PM)</span>
      <span style="font-size: 10px; font-weight: 700; color: #15803d;">${morningAvailable} Available</span>
    </div>
    <table class="slots-table">
      <thead>
        <tr>
          <th style="width: 100px;">Time Slot</th>
          <th style="width: 80px;">Session</th>
          <th style="width: 110px;">Status</th>
          <th>Patient Allocation / Notes</th>
          <th style="width: 80px; text-align: center;">Room</th>
        </tr>
      </thead>
      <tbody>
        ${morningSlots.map((s, idx) => `
          <tr style="${s.isBooked ? 'background: #fffafa;' : ''}">
            <td style="font-family: monospace; font-weight: 700; color: #0f172a;">${s.time}</td>
            <td style="color: #64748b; font-size: 10px;">Morning OPD</td>
            <td>
              <span class="${s.isBooked ? 'badge-booked' : 'badge-open'}">
                ${s.isBooked ? '● Confirmed' : '✓ Open Slot'}
              </span>
            </td>
            <td style="color: #334155;">
              ${s.isBooked ? `<strong>${s.bookedBy || 'Scheduled OPD Patient'}</strong> (Queue Token #${idx + 1})` : '<span style="color:#94a3b8; font-style: italic;">Available for Booking</span>'}
            </td>
            <td style="text-align: center; font-weight: 700; color: #0f766e;">Room ${doc.room}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Evening Session -->
    <div class="section-title" style="margin-top: 18px;">
      <span>Evening Clinic Timetable (04:00 PM – 07:30 PM)</span>
      <span style="font-size: 10px; font-weight: 700; color: #15803d;">${eveningAvailable} Available</span>
    </div>
    <table class="slots-table">
      <thead>
        <tr>
          <th style="width: 100px;">Time Slot</th>
          <th style="width: 80px;">Session</th>
          <th style="width: 110px;">Status</th>
          <th>Patient Allocation / Notes</th>
          <th style="width: 80px; text-align: center;">Room</th>
        </tr>
      </thead>
      <tbody>
        ${eveningSlots.map((s, idx) => `
          <tr style="${s.isBooked ? 'background: #fffafa;' : ''}">
            <td style="font-family: monospace; font-weight: 700; color: #0f172a;">${s.time}</td>
            <td style="color: #64748b; font-size: 10px;">Evening OPD</td>
            <td>
              <span class="${s.isBooked ? 'badge-booked' : 'badge-open'}">
                ${s.isBooked ? '● Confirmed' : '✓ Open Slot'}
              </span>
            </td>
            <td style="color: #334155;">
              ${s.isBooked ? `<strong>${s.bookedBy || 'Scheduled OPD Patient'}</strong> (Queue Token #${morningSlots.length + idx + 1})` : '<span style="color:#94a3b8; font-style: italic;">Available for Booking</span>'}
            </td>
            <td style="text-align: center; font-weight: 700; color: #0f766e;">Room ${doc.room}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- OPD Patient Guidelines -->
    <div class="info-box">
      <strong>Important OPD Patient Guidelines:</strong><br>
      • Patients must report at OPD Reception Counter (Ground Floor) 15 minutes prior to their allocated slot time.<br>
      • Please bring all prior medical records, previous investigation slips, and active drug prescription booklets.<br>
      • For insurance / cashless claims, present your valid health card at the TPA desk 30 minutes before appointment.
    </div>

    <!-- Signatures -->
    <div class="signoff-row">
      <div class="signoff-cell">
        <div class="signoff-sig">${doc.name.split(' ')[1] || 'Doctor'}</div>
        <div class="signoff-name">${doc.name}</div>
        <div class="signoff-role">Attending Specialist</div>
      </div>
      <div class="signoff-cell">
        <div style="display:inline-block; border: 1.5px solid #0d9488; padding: 4px 10px; border-radius: 6px; color: #0d9488; font-weight: 800; font-size: 9.5px;">
          OPD REGISTRY VERIFIED
        </div>
        <div style="font-size: 9px; color: #64748b; margin-top: 3px;">System Generated Roster</div>
      </div>
      <div class="signoff-cell">
        <div class="signoff-sig">Suresh V.</div>
        <div class="signoff-name">Mr. Suresh V.</div>
        <div class="signoff-role">OPD In-Charge & Chief Registrar</div>
      </div>
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
};

/**
 * Generate official OPD Appointment Confirmation & Token Slip HTML
 */
export const generateAppointmentTokenHTML = (booking, hospitalInfo = {}) => {
  const hInfo = {
    name: hospitalInfo.name || 'MediCore Super Specialty Hospital & Research Institute',
    address: hospitalInfo.address || 'Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081',
    phone: hospitalInfo.phone || '+91 (040) 6889-4000 / 1800-425-9999'
  };

  const patientName = booking.patient?.name || booking.patientName || 'sai kumar';
  const patientMrn = booking.patient?.mrn || booking.patientMrn || 'MRN-2026-0814';
  const doctorName = booking.doctor?.name || booking.doctorName || 'Dr. Ananya Mukherjee';
  const doctorSpecialty = booking.doctor?.specialty || booking.department || 'Cardiology';
  const room = booking.doctor?.room || booking.room || '304';
  const appointmentTime = booking.appointmentTime || booking.time || '10:30 AM';
  const appointmentDate = booking.date || new Date().toISOString().split('T')[0];
  const fee = booking.doctor?.fee || booking.fee || 850;
  const token = booking.token || `OPD-${Math.floor(10 + Math.random() * 90)}`;
  const consultType = booking.consultType || 'In-Person OPD Clinic';
  const reason = booking.reason || 'General Specialist Consultation';

  const dateFormatted = new Date(appointmentDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OPD Appointment Token - ${token}</title>
  <style>
    @page {
      size: A5 portrait;
      margin: 8mm;
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
      background: #f8fafc;
      color: #0f172a;
      font-size: 11px;
    }
    .print-bar {
      position: sticky;
      top: 0;
      background: #0f172a;
      padding: 10px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      z-index: 100;
    }
    .print-btn {
      background: #0d9488;
      color: #ffffff;
      border: none;
      padding: 7px 14px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }
    .close-btn {
      background: #334155;
      color: #f8fafc;
      border: none;
      padding: 7px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      margin-left: 8px;
    }
    .slip-container {
      max-width: 520px;
      margin: 15px auto;
      background: #ffffff;
      border: 1.5px solid #0d9488;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    @media print {
      body { background: #ffffff !important; }
      .print-bar { display: none !important; }
      .slip-container {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
      }
    }
    .slip-header {
      border-bottom: 2px solid #0d9488;
      padding-bottom: 10px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .token-box {
      background: #f0fdfa;
      border: 2px dashed #0d9488;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      margin-bottom: 14px;
    }
    .token-label {
      font-size: 10px;
      font-weight: 700;
      color: #0f766e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .token-num {
      font-size: 26px;
      font-weight: 900;
      color: #0f172a;
      font-family: monospace;
      line-height: 1.1;
      margin: 2px 0;
    }
    .detail-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    .detail-table td {
      padding: 6px 8px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 11px;
    }
    .detail-table td.label {
      width: 38%;
      color: #64748b;
      font-weight: 600;
    }
    .detail-table td.val {
      color: #0f172a;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div style="font-weight: 700; font-size: 12px;">OPD Appointment Confirmation Slip (${token})</div>
    <div>
      <button class="print-btn" onclick="window.print()">🖨️ Print Slip</button>
      <button class="close-btn" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="slip-container">
    <div class="slip-header">
      <div>
        <div style="font-weight: 900; font-size: 14px; color: #0f172a;">${hInfo.name}</div>
        <div style="font-size: 9.5px; color: #475569;">${hInfo.address} · Helpdesk: ${hInfo.phone}</div>
      </div>
      <div style="text-align: right;">
        <span style="background: #0d9488; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: 800; font-size: 9px;">
          OPD SLIP
        </span>
      </div>
    </div>

    <!-- Token Highlight -->
    <div class="token-box">
      <div class="token-label">OPD Queue Token Number</div>
      <div class="token-num">${token}</div>
      <div style="font-size: 11px; font-weight: 700; color: #0d9488;">
        Time Slot: ${appointmentTime} · Room: ${room}
      </div>
    </div>

    <!-- Details Table -->
    <table class="detail-table">
      <tr>
        <td class="label">Patient Name:</td>
        <td class="val">${patientName}</td>
      </tr>
      <tr>
        <td class="label">Patient MRN:</td>
        <td class="val"><span style="font-family: monospace;">${patientMrn}</span></td>
      </tr>
      <tr>
        <td class="label">Consulting Doctor:</td>
        <td class="val">${doctorName}</td>
      </tr>
      <tr>
        <td class="label">Specialty & Dept:</td>
        <td class="val">${doctorSpecialty}</td>
      </tr>
      <tr>
        <td class="label">Appointment Date:</td>
        <td class="val">${dateFormatted}</td>
      </tr>
      <tr>
        <td class="label">Clinic Room No:</td>
        <td class="val" style="color: #0f766e;">Room ${room}</td>
      </tr>
      <tr>
        <td class="label">Consultation Mode:</td>
        <td class="val">${consultType}</td>
      </tr>
      <tr>
        <td class="label">Reason / Notes:</td>
        <td class="val" style="font-weight: 500; font-size: 10.5px;">${reason}</td>
      </tr>
      <tr>
        <td class="label">Consultation Fee:</td>
        <td class="val" style="color: #15803d; font-size: 12px;">₹${fee} (Paid / Registered)</td>
      </tr>
    </table>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; font-size: 9.5px; color: #475569; line-height: 1.35; margin-bottom: 12px;">
      <strong>Note:</strong> Please present this token slip at Room <strong>${room}</strong> at least 10 minutes prior to <strong>${appointmentTime}</strong>. Emergency cases may take precedence.
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 9px; color: #64748b;">
      <div>Issued by: MediCore OPD Reception</div>
      <div>Date: ${new Date().toLocaleDateString('en-US')}</div>
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
};

/**
 * Generate Master Daily OPD Schedule HTML
 */
export const generateDailyOPDScheduleHTML = (appointments = [], dateStr, doctors = [], hospitalInfo = {}) => {
  const hInfo = {
    name: hospitalInfo.name || 'MediCore Super Specialty Hospital & Research Institute',
    address: hospitalInfo.address || 'Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081',
    phone: hospitalInfo.phone || '+91 (040) 6889-4000 / 1800-425-9999'
  };

  const currentDate = dateStr || new Date().toISOString().split('T')[0];
  const dateFormatted = new Date(currentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Daily OPD Appointments & Slots Schedule - ${currentDate}</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; color: #0f172a; font-size: 11px; }
    .print-bar { position: sticky; top: 0; background: #0f172a; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; color: #ffffff; }
    .print-btn { background: #0d9488; color: #ffffff; border: none; padding: 8px 16px; font-weight: 700; border-radius: 6px; cursor: pointer; }
    .close-btn { background: #334155; color: #f8fafc; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; margin-left: 8px; }
    .page-container { padding: 24px; }
    @media print { .print-bar { display: none !important; } .page-container { padding: 0 !important; } }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    th { background: #f1f5f9; padding: 8px 10px; font-size: 10px; text-transform: uppercase; text-align: left; border-bottom: 2px solid #cbd5e1; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="print-bar">
    <div style="font-weight: 700;">Daily OPD Appointments & Slots Schedule (${dateFormatted})</div>
    <div>
      <button class="print-btn" onclick="window.print()">🖨️ Print Daily Schedule</button>
      <button class="close-btn" onclick="window.close()">✕ Close</button>
    </div>
  </div>
  <div class="page-container">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
      <div>
        <h2 style="margin: 0; font-size: 18px; font-weight: 800;">${hInfo.name}</h2>
        <div style="font-size: 10px; color: #64748b;">${hInfo.address} · Daily Consultation Schedule</div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 800; font-size: 12px; color: #0d9488;">DATE: ${dateFormatted}</div>
        <div style="font-size: 10px; color: #64748b;">Total Scheduled Consultations: <strong>${appointments.length}</strong></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Token #</th>
          <th>Patient Name</th>
          <th>Consulting Specialist</th>
          <th>Department</th>
          <th>Slot Time</th>
          <th>Category</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${appointments.map((apt) => `
          <tr>
            <td style="font-family: monospace; font-weight: 700; color: #0d9488;">${apt.token}</td>
            <td style="font-weight: 700;">${apt.patientName}</td>
            <td style="font-weight: 600; color: #0284c7;">${apt.doctorName}</td>
            <td style="color: #64748b;">${apt.department}</td>
            <td style="font-weight: 700;">${apt.time}</td>
            <td><span style="font-size: 9.5px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${apt.type}</span></td>
            <td style="font-weight: 700;">${apt.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 500);
    });
  </script>
</body>
</html>`;
};

/**
 * Triggers Doctor Slots Report Print Dialog
 */
export const printDoctorSlotsReport = (doctor, selectedDate, slotData, hospitalInfo) => {
  const htmlContent = generateDoctorSlotsReportHTML({ doctor, selectedDate, slotData, hospitalInfo });
  return openPrintWindow(htmlContent);
};

/**
 * Triggers Appointment Confirmation Token Slip Print Dialog
 */
export const printAppointmentTokenSlip = (booking, hospitalInfo) => {
  const htmlContent = generateAppointmentTokenHTML(booking, hospitalInfo);
  return openPrintWindow(htmlContent, 600, 750);
};

/**
 * Triggers Daily OPD Schedule Print Dialog
 */
export const printDailyOPDSlotsSchedule = (appointments, dateStr, doctors, hospitalInfo) => {
  const htmlContent = generateDailyOPDScheduleHTML(appointments, dateStr, doctors, hospitalInfo);
  return openPrintWindow(htmlContent, 960, 850);
};

/**
 * Helper to open print window with iframe fallback
 */
const openPrintWindow = (htmlContent, width = 900, height = 820) => {
  const printWindow = window.open('', '_blank', `width=${width},height=${height},top=50,left=100`);

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
