import React, { useState } from 'react';
import { ReceiptText, Plus, Printer, CreditCard } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const OPDBilling = () => {
  const { patients, doctors, addInvoice, openModal, showToast } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[1].id);
  const [consultDoctorId, setConsultDoctorId] = useState(doctors[3].id);
  const [includeScan, setIncludeScan] = useState(true);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[1];
  const doctor = doctors.find((d) => d.id === consultDoctorId) || doctors[3];

  const consultFee = doctor.fee || 900;
  const scanFee = includeScan ? 2400 : 0;
  const pharmacyFee = 1850;
  const totalAmount = consultFee + scanFee + pharmacyFee;

  const handleCreateOPDBill = () => {
    const inv = {
      patientId: patient.id,
      patientName: patient.name,
      type: 'OPD Consultation & Diagnostics Bill',
      wardCharges: 0,
      doctorConsultCharges: consultFee,
      otAndProcedureCharges: 0,
      pharmacyCharges: pharmacyFee,
      labAndRadiologyCharges: scanFee,
      nursingCharges: 0,
      subtotal: totalAmount,
      taxGst: 0,
      discount: 0,
      totalAmount: totalAmount,
      advancePaid: totalAmount,
      insuranceClaimed: 0,
      balanceDue: 0,
      status: 'Paid'
    };

    addInvoice(inv);
    openModal('invoice', inv);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Create OPD Consultation & Services Bill
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Generate instant itemized tax receipts for doctor visits, pharmacy items, and lab investigations.
          </p>
        </div>
      </div>

      <div className="glass-card max-w-[850px] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="form-group sm:col-span-2">
            <label className="form-label">Select Patient *</label>
            <select
              className="form-select"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.mrn}) • Phone: {p.phone}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Consulting Doctor</label>
            <select
              className="form-select"
              value={consultDoctorId}
              onChange={(e) => setConsultDoctorId(e.target.value)}
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialty} — Fee: ₹{d.fee})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select className="form-select">
              <option>UPI / QR Scan (Instant)</option>
              <option>Credit / Debit Card POS</option>
              <option>Cash at Counter</option>
              <option>Net Banking</option>
            </select>
          </div>

          <div className="form-group sm:col-span-2">
            <label className="form-label">Investigation & Scan Add-ons</label>
            <div className="flex gap-3 items-center bg-bg-surface-elevated p-2.5 sm:px-3.5 rounded-md">
              <label className="flex items-center gap-2 text-[0.85rem] cursor-pointer text-text-main font-semibold">
                <input type="checkbox" checked={includeScan} onChange={(e) => setIncludeScan(e.target.checked)} />
                Diagnostic Ultrasound Scan (+₹2,400)
              </label>
            </div>
          </div>
        </div>

        {/* Live Bill Summary Card */}
        <div className="bg-bg-surface-elevated p-4 rounded-md mb-5 flex flex-col gap-2">
          <div className="flex justify-between text-[0.85rem] text-text-muted">
            <span>Doctor Consultation Fee ({doctor.name}):</span>
            <span className="mono font-semibold text-text-main">₹{consultFee.toLocaleString()}</span>
          </div>
          {includeScan && (
            <div className="flex justify-between text-[0.85rem] text-text-muted">
              <span>Ultrasound Diagnostic Scan:</span>
              <span className="mono font-semibold text-text-main">₹{scanFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-[0.85rem] text-text-muted">
            <span>Standard Pharmacy Medicines:</span>
            <span className="mono font-semibold text-text-main">₹{pharmacyFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[1.15rem] font-extrabold text-teal-600 pt-2.5 border-t border-border-subtle">
            <span>Total Amount Due:</span>
            <span className="mono">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary btn-lg" onClick={handleCreateOPDBill}>
            <ReceiptText size={18} /> Generate Tax Invoice & Open Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
