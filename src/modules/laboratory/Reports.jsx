import React, { useState } from 'react';
import {
  FileText,
  Printer,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Clock,
  FlaskConical,
  Filter,
  Check,
  ChevronRight,
  Upload,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Reports = () => {
  const {
    labOrders,
    criticalLabAlerts = [],
    advanceLabOrderStatus,
    acknowledgeCriticalAlert,
    uploadLabReportPdf,
    openModal,
    showToast
  } = useHospital();

  const [activeStageFilter, setActiveStageFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForEntry, setSelectedOrderForEntry] = useState(null);
  const [resultInputValues, setResultInputValues] = useState({});

  // Stages definition
  const STAGES = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'ordered', label: '1. Ordered' },
    { id: 'sample_collected', label: '2. Sample Collected' },
    { id: 'processing', label: '3. In Processing' },
    { id: 'reported', label: '4. Reported' },
    { id: 'verified', label: '5. Verified' }
  ];

  const filteredOrders = labOrders.filter((order) => {
    const currentStatus = (order.stage || order.status || '').toLowerCase();
    const matchesStage = activeStageFilter === 'ALL' || currentStatus === activeStageFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      order.orderNo.toLowerCase().includes(q) ||
      order.patientName.toLowerCase().includes(q) ||
      order.testName.toLowerCase().includes(q);
    return matchesStage && matchesQuery;
  });

  const getStageBadge = (stage) => {
    const s = (stage || '').toLowerCase();
    switch (s) {
      case 'ordered':
        return <Badge variant="slate" size="sm">1. Ordered</Badge>;
      case 'sample_collected':
        return <Badge variant="indigo" size="sm">2. Sample Collected</Badge>;
      case 'processing':
        return <Badge variant="amber" size="sm">3. Processing</Badge>;
      case 'reported':
        return <Badge variant="cyan" size="sm">4. Reported</Badge>;
      case 'verified':
        return <Badge variant="emerald" size="sm">5. Verified</Badge>;
      default:
        return <Badge size="sm">{stage}</Badge>;
    }
  };

  const handleAdvanceStatus = (order, nextStatus) => {
    if (nextStatus === 'reported') {
      setSelectedOrderForEntry(order);
      // Pre-fill existing results if any
      const initVals = {};
      (order.results || []).forEach((r) => {
        initVals[r.paramName] = r.value;
      });
      setResultInputValues(initVals);
      return;
    }

    advanceLabOrderStatus(order.id, nextStatus);
  };

  const handleSaveReportResults = (e) => {
    e.preventDefault();
    if (!selectedOrderForEntry) return;

    const formattedResults = Object.entries(resultInputValues).map(([paramName, value]) => ({
      paramName,
      value: isNaN(Number(value)) ? value : Number(value)
    }));

    advanceLabOrderStatus(selectedOrderForEntry.id, 'reported', {
      results: formattedResults,
      reportedBy: 'Sr. Biochemist Dr. Ramanujan'
    });
    setSelectedOrderForEntry(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <FlaskConical size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-text-main tracking-tight font-display">
                Laboratory Order-to-Result Tracking & Diagnostics
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                5-Stage investigation lifecycle: Ordered → Sample Collected → Processing → Reported → Verified.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Value Alerts Banner (Automatic Doctor Escalation) */}
      {criticalLabAlerts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-900 dark:text-rose-200 flex flex-col gap-3 animate-pulse">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertOctagon size={20} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  Critical Value Alert Dispatched to Consultant Doctor
                </h4>
                <p className="text-xs text-rose-800 dark:text-rose-300/90 mt-0.5">
                  The following results exceed life-critical physiological thresholds. Immediate clinical intervention required.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-rose-500/20">
            {criticalLabAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-bg-surface border border-rose-500/30 flex items-center justify-between flex-wrap gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-text-main">{alert.patientName}</span>
                    <span className="mono text-xs text-text-dim">({alert.uhid || alert.patientId})</span>
                    <Badge variant="rose" size="sm">CRITICAL VALUE</Badge>
                  </div>
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
                    {alert.testName}: {alert.paramName} = <strong>{alert.value} {alert.unit}</strong> (Critical Cutoff: {alert.criticalThreshold})
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    Consultant Alerted: {alert.doctorName} • Generated: {alert.timestamp}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acknowledgeCriticalAlert(alert.id, 'Dr. On-Duty Emergency Physician')}
                    className="btn btn-sm btn-primary bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                  >
                    <CheckCircle2 size={14} /> Acknowledge Alert & Note Intervention
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Stage Lifecycle Stepper & Search Strip */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col gap-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Stepper Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {STAGES.map((stg) => {
              const isSelected = activeStageFilter === stg.id;
              const count = stg.id === 'ALL'
                ? labOrders.length
                : labOrders.filter((o) => (o.stage || o.status || '').toLowerCase() === stg.id.toLowerCase()).length;

              return (
                <button
                  key={stg.id}
                  onClick={() => setActiveStageFilter(stg.id)}
                  className={`btn btn-sm rounded-xl h-10 px-3.5 text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected ? 'btn-primary shadow-xs' : 'btn-secondary'
                  }`}
                >
                  {stg.label}
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-bg-surface-elevated text-text-muted'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search by Order #, Patient, Test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container glass-card rounded-2xl border border-border-subtle overflow-hidden">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Order Ref & Barcode</th>
              <th>Patient Name</th>
              <th>Investigation Panel</th>
              <th>Priority</th>
              <th>Current Stage</th>
              <th>Results / Critical Flag</th>
              <th>Ordering Doctor</th>
              <th className="text-right">Stage Advance & Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((lab) => {
              const currentStage = (lab.stage || lab.status || 'ordered').toLowerCase();
              const isCrit = lab.isCritical || (lab.results || []).some((r) => r.flag === 'CRITICAL');

              return (
                <tr key={lab.id} className="hover:bg-bg-surface-elevated/60 transition-colors">
                  <td>
                    <div className="mono font-bold text-teal-600 dark:text-teal-400 bg-bg-surface px-2.5 py-1 rounded-lg border border-border-subtle text-xs inline-block">
                      {lab.orderNo}
                    </div>
                    {lab.barcode && (
                      <div className="mono text-[10px] text-text-dim mt-0.5">
                        BC: {lab.barcode}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="font-bold text-sm text-text-main">{lab.patientName}</div>
                    <div className="text-[11px] text-text-muted">{lab.patientMrn || lab.patientId}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-text-main text-xs">{lab.testName}</div>
                    <div className="text-[11px] text-text-dim">{lab.category}</div>
                  </td>
                  <td>
                    <Badge variant={lab.urgency?.includes('Urgent') ? 'rose' : 'slate'} size="sm">
                      {lab.urgency || 'Routine'}
                    </Badge>
                  </td>
                  <td>
                    {getStageBadge(currentStage)}
                  </td>
                  <td>
                    {isCrit ? (
                      <span className="badge badge-rose font-bold text-xs flex items-center gap-1">
                        <AlertOctagon size={12} /> CRITICAL VALUE
                      </span>
                    ) : (lab.results && lab.results.length > 0) ? (
                      <div className="flex flex-col gap-0.5 text-[11px]">
                        {lab.results.slice(0, 2).map((r, idx) => (
                          <span key={idx} className="font-mono">
                            {r.paramName}: <strong className={r.flag === 'HIGH' ? 'text-rose-600' : r.flag === 'LOW' ? 'text-amber-600' : 'text-emerald-600'}>
                              {r.value} {r.unit}
                            </strong>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-text-dim text-xs">Awaiting Analysis</span>
                    )}
                  </td>
                  <td className="text-xs font-semibold text-text-main">
                    {lab.doctorName || lab.verifiedBy}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {/* Lifecycle Stage Advancement Buttons */}
                      {currentStage === 'ordered' && (
                        <button
                          onClick={() => handleAdvanceStatus(lab, 'sample_collected')}
                          className="btn btn-secondary btn-xs text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          Collect Sample <ArrowRight size={11} />
                        </button>
                      )}

                      {currentStage === 'sample_collected' && (
                        <button
                          onClick={() => handleAdvanceStatus(lab, 'processing')}
                          className="btn btn-secondary btn-xs text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          Run Analyzer <ArrowRight size={11} />
                        </button>
                      )}

                      {currentStage === 'processing' && (
                        <button
                          onClick={() => handleAdvanceStatus(lab, 'reported')}
                          className="btn btn-warning btn-xs text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          Enter Results <ArrowRight size={11} />
                        </button>
                      )}

                      {currentStage === 'reported' && (
                        <button
                          onClick={() => advanceLabOrderStatus(lab.id, 'verified', { verifiedBy: 'Dr. Sunita Deshmukh (MD Pathology)' })}
                          className="btn btn-primary btn-xs text-xs font-bold rounded-lg flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 size={12} /> Verify & Sign-off
                        </button>
                      )}

                      {/* View & Print Slip */}
                      <button
                        className="btn btn-outline btn-xs text-xs font-semibold rounded-lg"
                        onClick={() => openModal('lab', lab)}
                        title="View Official Report Slip"
                      >
                        <Eye size={12} /> View Slip
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-text-muted text-xs">
                  No laboratory orders found for this stage.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Result Entry Modal for Processing Stage */}
      {selectedOrderForEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="glass-card w-full max-w-lg p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div>
                <h3 className="text-base font-bold text-text-main">Enter Analyzer Test Results</h3>
                <p className="text-xs text-text-muted">
                  {selectedOrderForEntry.testName} • {selectedOrderForEntry.patientName} ({selectedOrderForEntry.orderNo})
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForEntry(null)}
                className="text-text-dim hover:text-text-main p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReportResults} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {(selectedOrderForEntry.results && selectedOrderForEntry.results.length > 0
                  ? selectedOrderForEntry.results
                  : [
                      { paramName: 'Hemoglobin (Hb)', unit: 'g/dL', normalMin: 12.0, normalMax: 17.0 },
                      { paramName: 'Total Leukocyte Count (TLC)', unit: '/cumm', normalMin: 4000, normalMax: 11000 },
                      { paramName: 'Platelet Count', unit: '/cumm', normalMin: 150000, normalMax: 450000 }
                    ]
                ).map((param, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-bg-surface-elevated border border-border-subtle">
                    <div>
                      <div className="text-xs font-bold text-text-main">{param.paramName}</div>
                      <div className="text-[11px] text-text-dim">
                        Normal: {param.normalMin} - {param.normalMax} {param.unit}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 w-32">
                      <input
                        type="text"
                        className="form-input h-9 text-xs font-mono font-bold text-right rounded-lg"
                        value={resultInputValues[param.paramName] || ''}
                        onChange={(e) =>
                          setResultInputValues({
                            ...resultInputValues,
                            [param.paramName]: e.target.value
                          })
                        }
                        placeholder={param.value ? String(param.value) : 'Enter val'}
                        required
                      />
                      <span className="text-[11px] text-text-dim font-mono">{param.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-800 dark:text-teal-300">
                Values will be automatically evaluated against age/gender normal and critical ranges. Out of range values will flag as HIGH, LOW, or CRITICAL.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForEntry(null)}
                  className="btn btn-secondary btn-sm rounded-xl h-10 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm rounded-xl h-10 px-5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Save & Evaluate Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
