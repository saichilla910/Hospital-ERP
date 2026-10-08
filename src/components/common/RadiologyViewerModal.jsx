import React, { useState } from 'react';
import { Modal } from './Modal';
import { ZoomIn, ZoomOut, Contrast, Sun, Eye, Ruler, CheckCircle, Printer } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const RadiologyViewerModal = ({ isOpen, onClose, radiologyOrder }) => {
  const { hospitalInfo, radiologyOrders } = useHospital();
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [inverted, setInverted] = useState(false);
  const [showRuler, setShowRuler] = useState(false);

  if (!isOpen) return null;

  const activeOrder = radiologyOrder || radiologyOrders?.[0] || {
    id: 'RAD-501',
    orderNo: 'ORD-RAD-3011',
    patientId: 'PAT-2026-8805',
    patientName: 'Gurpreet Singh Chawla',
    modality: 'MRI 3.0 Tesla',
    bodyPart: 'Lumbosacral Spine with Contrast Screening',
    urgency: 'Routine',
    orderedBy: 'Dr. Rajesh K. Nair',
    status: 'Verified & PACS Available',
    radiologist: 'Dr. Tarun Sen, MD (Radiodiagnosis)',
    scanDate: '2026-09-16',
    findings: 'Marked diffuse disc bulge with right posterolateral extrusion at L4-L5 level causing severe compression over traversing right L5 nerve root.',
    impression: 'Severe L4-L5 right paracentral disc herniation with nerve impingement correlating with right sciatica symptoms.',
    pacsImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
  };

  const resetFilters = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setInverted(false);
    setShowRuler(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`HospitalCare PACS / DICOM Viewer — ${activeOrder.modality}`}
      subtitle={`Study Order: ${activeOrder.orderNo} • Patient: ${activeOrder.patientName}`}
      maxWidth="1050px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Close PACS Viewer
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Print Radiologist Report
          </button>
        </>
      }
    >
      <div className="printable-area responsive-grid-split">
        {/* Left Side: DICOM PACS Canvas & Controls */}
        <div className="bg-[#04070d] border border-border-subtle rounded-md flex flex-col overflow-hidden">
          {/* DICOM Toolbar */}
          <div className="no-print py-2.5 px-3.5 bg-[#090f1a] border-b border-[#1e293b] flex items-center justify-between gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                className="btn-icon btn-sm bg-[#1e293b] text-white"
                onClick={() => setZoom((prev) => Math.min(prev + 0.25, 2.5))}
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                className="btn-icon btn-sm bg-[#1e293b] text-white"
                onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.75))}
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                className="btn-icon btn-sm bg-[#1e293b] text-white"
                onClick={() => setBrightness((prev) => (prev >= 160 ? 80 : prev + 20))}
                title="Brightness / Window Level"
              >
                <Sun size={14} />
              </button>
              <button
                className="btn-icon btn-sm bg-[#1e293b] text-white"
                onClick={() => setContrast((prev) => (prev >= 160 ? 80 : prev + 20))}
                title="Contrast / Window Width"
              >
                <Contrast size={14} />
              </button>
              <button
                className={`btn-icon btn-sm text-white ${inverted ? 'bg-blue-600' : 'bg-[#1e293b]'}`}
                onClick={() => setInverted((prev) => !prev)}
                title="Invert Colors"
              >
                <Eye size={14} />
              </button>
              <button
                className={`btn-icon btn-sm text-white ${showRuler ? 'bg-blue-600' : 'bg-[#1e293b]'}`}
                onClick={() => setShowRuler((prev) => !prev)}
                title="Calibrated Measurement Ruler"
              >
                <Ruler size={14} />
              </button>
            </div>

            <button
              className="btn btn-secondary btn-sm text-[0.725rem] py-1 px-2 bg-[#1e293b] text-slate-400 border-none"
              onClick={resetFilters}
            >
              Reset View
            </button>
          </div>

          {/* Viewport Canvas */}
          <div className="relative h-[380px] flex items-center justify-center overflow-hidden bg-black">
            {/* DICOM Overlay Top-Left */}
            <div className="absolute top-3 left-3.5 text-green-500 font-mono text-xs leading-[1.3] z-[5] drop-shadow-[0_0_4px_#000]">
              <div>{activeOrder.patientName}</div>
              <div>ID: {activeOrder.patientId}</div>
              <div>{activeOrder.modality} • {activeOrder.bodyPart}</div>
            </div>

            {/* DICOM Overlay Top-Right */}
            <div className="absolute top-3 right-3.5 text-green-500 font-mono text-xs leading-[1.3] text-right z-[5] drop-shadow-[0_0_4px_#000]">
              <div>Date: {activeOrder.scanDate}</div>
              <div>KVp: 120 • mAs: 240</div>
              <div>Matrix: 512 x 512</div>
            </div>

            {/* Measurement Ruler Overlay */}
            {showRuler && (
              <div className="absolute w-[180px] h-[2px] bg-rose-500 shadow-[0_0_8px_#f43f5e] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center">
                <span className="absolute -top-[18px] text-rose-500 text-xs font-bold font-mono bg-black/70 py-px px-1 rounded">
                  34.2 mm (L4-L5 Herniation)
                </span>
              </div>
            )}

            {/* Active Image */}
            <img
              src={activeOrder.pacsImage}
              alt={activeOrder.bodyPart}
              className={`max-w-[90%] max-h-[90%] object-contain transition-[transform,filter] duration-150 ease-out [transform:scale(${zoom})] [filter:brightness(${brightness}%)_contrast(${contrast}%)${inverted ? '_invert(100%)' : ''}]`}
            />
          </div>
        </div>

        {/* Right Side: Clinical Finding & Radiologist Impression */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-4 bg-bg-surface-elevated">
            <span className="text-[0.7rem] text-text-dim uppercase font-bold">
              Study Details
            </span>
            <div className="text-base font-extrabold text-text-main mt-0.5">
              {activeOrder.bodyPart}
            </div>
            <div className="text-[0.8rem] text-text-muted mt-0.5">
              Modality: <strong className="text-cyan-600">{activeOrder.modality}</strong>
            </div>
            <div className="text-[0.8rem] text-text-muted">
              Ordered by: {activeOrder.orderedBy}
            </div>
          </div>

          <div className="glass-card p-4">
            <span className="text-xs font-bold text-text-main uppercase">
              Detailed Radiologist Findings:
            </span>
            <p className="text-[0.85rem] text-text-muted mt-1.5 leading-[1.5]">
              {activeOrder.findings}
            </p>
          </div>

          <div className="glass-card p-4 border-l-4 border-teal-500">
            <span className="text-xs font-bold text-teal-600 uppercase">
              Diagnostic Impression / Conclusion:
            </span>
            <p className="text-[0.875rem] font-semibold text-text-main mt-1.5 leading-[1.5]">
              {activeOrder.impression}
            </p>
          </div>

          <div className="mt-auto p-3 bg-bg-surface-elevated rounded-md text-[0.8rem]">
            <div className="font-bold text-text-main">{activeOrder.radiologist}</div>
            <div className="text-text-dim text-[0.725rem]">Consultant Radiologist • RIS/PACS Verified</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
