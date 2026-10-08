import React from 'react';
import { Modal } from './Modal';
import {
  Printer,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  QrCode,
  FileText,
  FlaskConical,
  User,
  Stethoscope,
  Calendar,
  Clock,
  Download,
  Info,
  UserCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { printLabReport } from '../../services/labReportPrintService';
import { BrandLogo } from './BrandLogo';

export const LabReportModal = ({ isOpen, onClose, labReport }) => {
  const { hospitalInfo, labOrders } = useHospital();
  if (!isOpen) return null;

  const rawReport = labReport || labOrders?.[0];
  const activeReport = {
    id: rawReport?.id || 'LAB-8810',
    orderNo: rawReport?.orderNo || 'ORD-LAB-9921',
    patientId: rawReport?.patientId || 'PAT-2026-8801',
    patientName: rawReport?.patientName || 'Rameshwar Prasad Sharma',
    testName: rawReport?.testName || 'Comprehensive Cardiac & Lipid Biomarker Panel',
    category: rawReport?.category || 'Biochemistry & Pathology',
    orderedBy: rawReport?.orderedBy || rawReport?.doctorName || 'Dr. Ananya Mukherjee',
    sampleType: rawReport?.sampleType || 'Venous Blood (EDTA + Serum Gel Separator)',
    barcode: rawReport?.barcode || 'MEDLAB*8810*CBC*',
    orderTime: rawReport?.orderTime || '2026-09-17 08:30 AM',
    status: rawReport?.status || 'Report Ready',
    verifiedBy: rawReport?.verifiedBy || 'Dr. Neha Kulkarni, MD (Path)',
    parameters: (rawReport?.parameters && rawReport.parameters.length > 0)
      ? rawReport.parameters
      : [
          { name: 'High-Sensitivity Troponin I', result: '0.012', unit: 'ng/mL', reference: '0.000 - 0.034', flag: 'Normal' },
          { name: 'Total Cholesterol', result: '228.4', unit: 'mg/dL', reference: '125.0 - 200.0', flag: 'High' },
          { name: 'LDL Cholesterol', result: '148.0', unit: 'mg/dL', reference: '< 100.0 (Optimal < 70 in CAD)', flag: 'High' },
          { name: 'HDL Cholesterol', result: '38.2', unit: 'mg/dL', reference: '40.0 - 60.0', flag: 'Low' },
          { name: 'Triglycerides', result: '211.0', unit: 'mg/dL', reference: '< 150.0', flag: 'High' }
        ],
    interpretation: rawReport?.interpretation || 'Lipid profile reveals mixed hyperlipidemia requiring intensifications of statin-ezetimibe combination. Cardiac biomarkers currently non-ischemic.'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Diagnostic Laboratory Report (LIS)"
      subtitle={`Sample Barcode: ${activeReport.barcode} • Verified by ${activeReport.verifiedBy}`}
      maxWidth="1050px"
      headerIcon={<FileText size={20} />}
      headerRight={
        <>
          <span className="badge badge-blue text-[11px] font-bold py-0.5 px-2.5 flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck size={13} /> OFFICIAL DIAGNOSTIC REPORT
          </span>
          <span className="text-[11.5px] text-text-muted mt-0.5">
            Order No: <strong className="text-text-main font-mono font-bold">{activeReport.orderNo}</strong>
          </span>
        </>
      }
      footerInfo={
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Info size={12} />
          </div>
          <span>This is an electronically generated report from HospitalCare (LIS). For any queries, please contact the laboratory.</span>
        </div>
      }
      footer={
        <>
          <button
            className="btn btn-secondary h-10 px-4.5 rounded-xl text-xs font-semibold hover:bg-bg-surface-elevated transition-all"
            onClick={onClose}
          >
            ✕ Close
          </button>
          <button
            className="btn btn-outline h-10 px-4.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-1.5 transition-all"
            onClick={() => printLabReport(activeReport, hospitalInfo)}
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
          <button
            className="btn btn-primary h-10 px-5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-teal-600/20 hover:shadow-lg transition-all"
            onClick={() => printLabReport(activeReport, hospitalInfo)}
          >
            <Printer size={15} strokeWidth={2.3} />
            <span>Print Official NABL Report</span>
          </button>
        </>
      }
    >
      <div className="printable-area flex flex-col gap-4 text-text-main">
        {/* 1. Official Letterhead Header Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20 shadow-2xs">
              <BrandLogo size={28} color="#0891b2" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-main tracking-tight font-display">
                {hospitalInfo.name || 'HospitalCare Super Specialty Hospital & Research Institute'}
              </h3>
              <p className="text-xs text-text-muted mt-0.5 font-medium">
                Central Diagnostic Pathology & Clinical Biochemistry Laboratory
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                <span className="badge badge-blue py-0.5 px-2.5 font-semibold text-[10.5px]">
                  ✓ NABL Accredited
                </span>
                <span className="badge badge-teal py-0.5 px-2.5 font-semibold text-[10.5px]">
                  🌐 CAP Accredited
                </span>
                <span className="text-[11px] text-text-muted italic ml-1">
                  Trusted Diagnostics for a Healthier Tomorrow
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-text-muted border-t md:border-t-0 md:border-l border-border-subtle pt-3 md:pt-0 md:pl-5 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-text-dim shrink-0" />
              <span className="text-text-dim w-24">Report Type</span>
              <strong className="text-text-main font-semibold">Diagnostic Laboratory Report</strong>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-text-dim shrink-0" />
              <span className="text-text-dim w-24">Report Date</span>
              <strong className="text-text-main font-semibold font-mono">{activeReport.orderTime}</strong>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical size={14} className="text-text-dim shrink-0" />
              <span className="text-text-dim w-24">Sample Type</span>
              <strong className="text-text-main font-semibold">{activeReport.sampleType}</strong>
            </div>
          </div>
        </div>

        {/* 2. Three Metadata Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Patient */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle flex items-start gap-3 relative overflow-hidden shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/60">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-text-dim uppercase tracking-wider">Patient</span>
              <div className="text-sm font-bold text-text-main truncate mt-0.5">{activeReport.patientName}</div>
              <div className="text-xs text-text-muted mt-0.5">
                ID: <span className="font-mono font-semibold text-teal-600 dark:text-teal-400">{activeReport.patientId}</span>
              </div>
            </div>
            <FileText size={16} className="text-blue-500/30 absolute top-3.5 right-3.5" />
          </div>

          {/* Card 2: Investigation */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle flex items-start gap-3 relative overflow-hidden shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800/60">
              <FlaskConical size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-text-dim uppercase tracking-wider">Investigation</span>
              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">{activeReport.testName}</div>
              <div className="text-xs text-text-muted mt-0.5 truncate">
                Sample: {activeReport.sampleType}
              </div>
            </div>
            <FlaskConical size={16} className="text-purple-500/30 absolute top-3.5 right-3.5" />
          </div>

          {/* Card 3: Clinician & Timestamp */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-subtle flex items-start gap-3 relative overflow-hidden shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/60">
              <Stethoscope size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-text-dim uppercase tracking-wider">Clinician & Timestamp</span>
              <div className="text-sm font-bold text-text-main truncate mt-0.5">{activeReport.orderedBy}</div>
              <div className="text-xs text-text-muted mt-0.5">
                {activeReport.orderTime}
              </div>
            </div>
            <UserCheck size={16} className="text-emerald-500/30 absolute top-3.5 right-3.5" />
          </div>
        </div>

        {/* 3. Test Results Table Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-base font-bold text-text-main">Test Results</h4>
              <p className="text-xs text-text-muted mt-0.5 font-medium">
                Reference ranges may vary based on age, gender and clinical context. Please consult your physician.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Normal
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> High
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Low
              </span>
            </div>
          </div>

          <div className="table-container mb-0 rounded-xl overflow-hidden">
            <table className="medicore-table">
              <thead>
                <tr>
                  <th className="w-[5%] text-center">#</th>
                  <th className="w-[28%]">Test Parameter</th>
                  <th className="w-[18%] text-center">Observed Result</th>
                  <th className="w-[12%] text-center">Units</th>
                  <th className="w-[22%] text-center">Biological Reference Interval</th>
                  <th className="w-[15%] text-right">Clinical Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {activeReport.parameters.map((p, idx) => {
                  const isHigh = p.flag === 'High';
                  const isLow = p.flag === 'Low';
                  const rowBg = isHigh ? 'bg-rose-500/8 dark:bg-rose-950/20' : isLow ? 'bg-amber-500/8 dark:bg-amber-950/20' : '';
                  const resultColor = isHigh ? 'text-rose-600 dark:text-rose-400 font-bold' : isLow ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-text-main font-semibold';

                  return (
                    <tr key={idx} className={`${rowBg} transition-colors`}>
                      <td className="text-center text-xs text-text-dim font-medium">{idx + 1}</td>
                      <td className="font-semibold text-xs sm:text-sm text-text-main">{p.name}</td>
                      <td className={`text-center font-mono text-sm ${resultColor}`}>{p.result}</td>
                      <td className="text-center text-xs text-text-muted font-medium">{p.unit}</td>
                      <td className="text-center text-xs text-text-dim font-medium">{p.reference}</td>
                      <td className="text-right">
                        <span className={`badge ${isHigh ? 'badge-rose' : isLow ? 'badge-amber' : 'badge-emerald'} text-xs font-semibold py-0.5 px-2.5`}>
                          ● {p.flag}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
