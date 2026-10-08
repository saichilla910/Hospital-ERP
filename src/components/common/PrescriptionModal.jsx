import React from 'react';
import { Modal } from './Modal';
import {
  Printer,
  Pill,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Stethoscope,
  Activity,
  HeartPulse,
  Sparkles,
  FileText,
  Clock,
  Check,
  Download,
  Info,
  UserCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { printPrescriptionSlip } from '../../services/prescriptionPrintService';
import { BrandLogo } from './BrandLogo';

export const PrescriptionModal = ({ isOpen, onClose, prescription }) => {
  const { hospitalInfo, prescriptions, showToast } = useHospital();
  if (!isOpen) return null;

  const rawPrescription = prescription || prescriptions?.[0];

  // Robust fallback defaults so nothing ever displays as 'undefined'
  const activePrescription = {
    id: rawPrescription?.id || rawPrescription?.rxNo || 'RX-2026-4401',
    date: rawPrescription?.date || new Date().toISOString().split('T')[0],
    patientId: rawPrescription?.patientId || 'PAT-2026-6322',
    patientName: rawPrescription?.patientName || 'sai kumar',
    doctorId: rawPrescription?.doctorId || 'DOC-102',
    doctorName: rawPrescription?.doctorName || 'Dr. Ananya Mukherjee',
    department: rawPrescription?.department || 'Cardiology',
    diagnosis: rawPrescription?.diagnosis || 'I20.0 - Unstable Angina, Stabilized',
    items: (rawPrescription?.items && rawPrescription.items.length > 0)
      ? rawPrescription.items
      : [
          { name: 'Tab. Ticagrelor 90mg (Brilinta)', dosage: '1 tab twice daily (BID)', duration: '30 Days', instructions: 'After meals, do not skip dose' },
          { name: 'Tab. Rosuvastatin 20mg + Ezetimibe 10mg', dosage: '1 tab at bedtime (HS)', duration: '30 Days', instructions: 'Night time' },
          { name: 'Tab. Metoprolol Succinate 25mg (Betaloc)', dosage: '1 tab morning (OD)', duration: '30 Days', instructions: 'Monitor resting pulse' }
        ],
    dietAdvice: rawPrescription?.dietAdvice || 'Strict low salt (<2g/day), zero trans fats, 30 min gentle walk daily.',
    followUp: rawPrescription?.followUp || 'Review after 4 weeks with Lipid Profile and Serum Creatinine.'
  };

  const handlePrint = () => {
    printPrescriptionSlip(activePrescription, hospitalInfo);
    showToast(`Prescription slip ${activePrescription.id} ready for printing / PDF save.`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Electronic Prescription (e-Rx)"
      subtitle={`Rx ID: ${activePrescription.id} • Issued: ${activePrescription.date}`}
      maxWidth="1050px"
      headerIcon={<FileText size={20} />}
      headerRight={
        <>
          <span className="badge badge-teal text-[11px] font-bold py-0.5 px-2.5 flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck size={13} /> OPD CLINICAL PRESCRIPTION
          </span>
          <span className="text-[11.5px] text-text-muted mt-0.5">
            Rx No: <strong className="text-text-main font-mono font-bold">{activePrescription.id}</strong>
          </span>
        </>
      }
      footerInfo={
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Info size={12} />
          </div>
          <span>This is an electronically generated prescription under NMC Digital Health Guidelines.</span>
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
            className="btn btn-outline h-10 px-4.5 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center gap-1.5 transition-all"
            onClick={handlePrint}
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
          <button
            className="btn btn-primary h-10 px-5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-teal-600/20 hover:shadow-lg transition-all"
            onClick={handlePrint}
          >
            <Printer size={15} strokeWidth={2.3} />
            <span>Print Prescription Slip</span>
          </button>
        </>
      }
    >
      <div className="printable-area flex flex-col gap-4 text-text-main">
        {/* 1. Official Letterhead Header Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500/15 to-cyan-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20 shadow-2xs">
              <BrandLogo size={28} color="#0d9488" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-main tracking-tight font-display">
                {hospitalInfo.name || 'HospitalCare Super Specialty Hospital & Research Institute'}
              </h3>
              <p className="text-xs text-text-muted mt-0.5 font-medium">
                {hospitalInfo.address} • Tel: {hospitalInfo.phone}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                <span className="badge badge-emerald py-0.5 px-2.5 font-bold text-[10.5px]">
                  ✓ NABH & JCI Accredited
                </span>
                <span className="badge badge-teal py-0.5 px-2.5 font-bold text-[10.5px]">
                  Reg: {hospitalInfo.licenseNo}
                </span>
                <span className="text-[11px] text-text-muted italic ml-1">
                  Department of Outpatient Clinical Medicine
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-text-muted border-t md:border-t-0 md:border-l border-border-subtle pt-3 md:pt-0 md:pl-5 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-text-dim shrink-0" />
              <span className="text-text-dim w-24">Document Type</span>
              <strong className="text-text-main font-bold">OPD Clinical e-Rx</strong>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-text-dim shrink-0" />
              <span className="text-text-dim w-24">Issue Date</span>
              <strong className="text-text-main font-bold font-mono">{activePrescription.date}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-text-dim shrink-0" />
              <span className="text-text-dim w-24">Rx Status</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Active Medication Plan</strong>
            </div>
          </div>
        </div>

        {/* 2. Three Metadata Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Patient */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle flex items-start gap-3 relative overflow-hidden shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800/60">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-text-dim uppercase tracking-wider">Patient</span>
              <div className="text-sm font-semibold text-text-main truncate mt-0.5">{activePrescription.patientName}</div>
              <div className="text-xs text-text-muted mt-0.5">
                ID: <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{activePrescription.patientId}</span>
              </div>
            </div>
            <FileText size={16} className="text-teal-500/30 absolute top-3.5 right-3.5" />
          </div>

          {/* Card 2: Prescribing Consultant */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle flex items-start gap-3 relative overflow-hidden shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-200 dark:border-cyan-800/60">
              <Stethoscope size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-text-dim uppercase tracking-wider">Prescribing Consultant</span>
              <div className="text-sm font-semibold text-text-main truncate mt-0.5">{activePrescription.doctorName}</div>
              <div className="text-xs text-teal-600 dark:text-teal-400 font-bold mt-0.5 truncate">
                Dept. of {activePrescription.department}
              </div>
            </div>
            <UserCheck size={16} className="text-cyan-500/30 absolute top-3.5 right-3.5" />
          </div>

          {/* Card 3: Clinical Diagnosis */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle flex items-start gap-3 relative overflow-hidden shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800/60">
              <Activity size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-text-dim uppercase tracking-wider">Clinical Diagnosis</span>
              <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">{activePrescription.diagnosis}</div>
              <div className="text-xs text-text-muted mt-0.5">
                ICD-10 Primary Finding
              </div>
            </div>
            <Sparkles size={16} className="text-indigo-500/30 absolute top-3.5 right-3.5" />
          </div>
        </div>

        {/* 3. Medication Schedule Table Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold text-teal-600 dark:text-teal-400 leading-none">℞</span>
              <div>
                <h4 className="text-base font-bold text-text-main">Prescribed Medication Schedule</h4>
                <p className="text-xs text-text-muted mt-0.5 font-medium">
                  Follow prescribed timings, dietary instructions, and complete full medication courses.
                </p>
              </div>
            </div>

            <span className="badge badge-teal py-0.5 px-3 text-xs font-bold">
              {activePrescription.items.length} Medicines Prescribed
            </span>
          </div>

          <div className="table-container mb-0 rounded-xl overflow-hidden">
            <table className="medicore-table">
              <thead>
                <tr>
                  <th className="w-[5%] text-center">#</th>
                  <th className="w-[38%]">Medicine Name / Salt</th>
                  <th className="w-[25%] text-center">Dosage & Frequency</th>
                  <th className="w-[14%] text-center">Duration</th>
                  <th className="w-[18%] text-right">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {activePrescription.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-bg-surface-elevated/80 transition-colors">
                    <td className="text-center text-xs text-text-dim font-bold">{idx + 1}</td>
                    <td className="font-extrabold text-xs sm:text-sm text-text-main">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Pill size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="font-extrabold">{item.genericName || item.name}</span>
                        </div>
                        {item.genericName && (
                          <span className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold pl-5.5">
                            Brand: {item.name} {item.strength ? `(${item.strength})` : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-teal py-0.5 px-3 text-xs font-bold">
                        {item.dosage}
                      </span>
                    </td>
                    <td className="text-center font-mono font-bold text-xs text-text-main">
                      {item.duration}
                    </td>
                    <td className="text-right text-xs text-text-muted font-medium">
                      {item.instructions || 'After meals'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Advice & Next Review Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
              <HeartPulse size={15} className="text-rose-500 shrink-0" />
              <span>Dietary & Lifestyle Advice:</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-medium">
              {activePrescription.dietAdvice}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <Calendar size={15} className="shrink-0" />
              <span>Next Clinical Review / Follow-Up:</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-medium">
              {activePrescription.followUp}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
