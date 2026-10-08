import React, { useState } from 'react';
import {
  Zap,
  Building2,
  FlaskConical,
  Pill,
  Radio,
  Stethoscope,
  Scissors,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Receipt,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const ChargeCapture = ({ onSelectPatientForBilling }) => {
  const { charges, patients, runDailyBedChargeJob, addCharge, setActiveNav, showToast } = useHospital();

  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddChargeModal, setShowAddChargeModal] = useState(false);

  // Form State for Manual Charge
  const [newChargePatientId, setNewChargePatientId] = useState(patients[0]?.id || '');
  const [newChargeServiceType, setNewChargeServiceType] = useState('Laboratory');
  const [newChargeName, setNewChargeName] = useState('');
  const [newChargeQty, setNewChargeQty] = useState(1);
  const [newChargeRate, setNewChargeRate] = useState(500);

  const filteredCharges = (charges || []).filter((chg) => {
    const matchMod = selectedModule === 'ALL' || chg.sourceModule === selectedModule;
    const matchStatus = selectedStatus === 'ALL' || chg.status === selectedStatus;
    const matchSearch =
      !searchQuery ||
      chg.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chg.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chg.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMod && matchStatus && matchSearch;
  });

  const totalCapturedAmount = (charges || []).reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const pendingAmount = (charges || [])
    .filter((c) => c.status === 'Pending')
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const autoCapturedCount = (charges || []).filter((c) => c.isAutoCaptured).length;
  const autoCapturePct = (charges || []).length > 0 ? Math.round((autoCapturedCount / charges.length) * 100) : 100;

  const handleManualAddCharge = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newChargePatientId) || patients[0];
    addCharge({
      patientId: pat.id,
      patientName: pat.name,
      admissionId: pat.status === 'Inpatient' ? `IPD-${pat.id.replace('PAT-', '')}` : 'OPD',
      serviceType: newChargeServiceType,
      serviceName: newChargeName,
      qty: Number(newChargeQty) || 1,
      rate: Number(newChargeRate) || 0,
      sourceModule: 'Billing Desk',
      status: 'Pending',
      isAutoCaptured: false
    });
    setShowAddChargeModal(false);
    setNewChargeName('');
  };

  const getModuleBadge = (mod) => {
    switch (mod) {
      case 'Laboratory':
        return <span className="badge badge-purple text-[10.5px] font-semibold flex items-center gap-1"><FlaskConical size={10} /> Lab</span>;
      case 'IPD':
        return <span className="badge badge-teal text-[10.5px] font-semibold flex items-center gap-1"><Building2 size={10} /> IPD Ward</span>;
      case 'Pharmacy':
        return <span className="badge badge-emerald text-[10.5px] font-semibold flex items-center gap-1"><Pill size={10} /> Pharmacy</span>;
      case 'Radiology':
        return <span className="badge badge-blue text-[10.5px] font-semibold flex items-center gap-1"><Radio size={10} /> Radiology</span>;
      case 'OPD':
        return <span className="badge badge-cyan text-[10.5px] font-semibold flex items-center gap-1"><Stethoscope size={10} /> OPD</span>;
      case 'Operation Theatre':
        return <span className="badge badge-indigo text-[10.5px] font-semibold flex items-center gap-1"><Scissors size={10} /> OT</span>;
      default:
        return <span className="badge badge-gray text-[10.5px] font-semibold">{mod}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Quick Actions */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-main flex items-center gap-2.5">
            <Zap className="text-teal-600 dark:text-teal-400" size={24} />
            Automatic Clinical Charge Capture Sheet
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Real-time automated charge audit stream. Every lab test, daily bed stay, pharmacy item, and OT procedure is automatically captured here to prevent missed revenue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            className="btn btn-primary text-xs font-bold flex items-center gap-1.5 h-9.5 px-3.5 shadow-sm"
            onClick={() => runDailyBedChargeJob()}
            title="Automatically audit all admitted IPD inpatients and post missing daily bed & nursing charges"
          >
            <Play size={13} fill="currentColor" /> Run Daily IPD Bed Charge Job
          </button>

          <button
            className="btn btn-secondary text-xs font-bold flex items-center gap-1.5 h-9.5 px-3.5 border border-border-subtle"
            onClick={() => setShowAddChargeModal(true)}
          >
            <Plus size={14} /> Add Consumable / Charge
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Total Captured Charges</div>
            <div className="text-2xl font-black text-text-main mt-1 font-mono">₹{totalCapturedAmount.toLocaleString()}</div>
            <div className="text-[0.75rem] text-teal-600 dark:text-teal-400 mt-1">{(charges || []).length} Recorded line items</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Receipt size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Unbilled / In-Progress</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">₹{pendingAmount.toLocaleString()}</div>
            <div className="text-[0.75rem] text-amber-600 mt-1">Ready for discharge bill inclusion</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Auto-Capture Rate</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{autoCapturePct}%</div>
            <div className="text-[0.75rem] text-emerald-600 mt-1">{autoCapturedCount} of {charges.length} system-triggered</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Zap size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Zero-Leakage Guarantee</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">NABH ✓</div>
            <div className="text-[0.75rem] text-text-muted mt-1">Cross-module clinical sync active</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="glass-card p-3.5 rounded-xl border border-border-subtle flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              className="form-input text-xs pl-8.5 pr-3 py-1.5 h-8.5 rounded-lg w-full"
              placeholder="Search by Patient Name, Service, or Charge ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold">
            <Filter size={13} className="text-teal-600" /> Module:
          </div>
          <select
            className="form-select text-xs h-8.5 py-1 px-2.5 rounded-lg w-auto"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="ALL">All Source Modules</option>
            <option value="IPD">IPD Bed & Room Maintenance</option>
            <option value="Laboratory">Laboratory & Pathology</option>
            <option value="Radiology">Radiology Scans</option>
            <option value="Pharmacy">Pharmacy & Dispensary</option>
            <option value="Operation Theatre">Operation Theatre / OT</option>
            <option value="OPD">OPD Consultation</option>
            <option value="Emergency">Emergency & Triage</option>
          </select>

          <select
            className="form-select text-xs h-8.5 py-1 px-2.5 rounded-lg w-auto"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending (Unbilled)</option>
            <option value="Billed">Billed in Invoice</option>
            <option value="Waived">Waived</option>
          </select>
        </div>

        <div className="text-xs text-text-muted font-mono">
          Showing {filteredCharges.length} charge entries
        </div>
      </div>

      {/* Captured Charges Table */}
      <div className="table-container rounded-xl border border-border-subtle overflow-x-auto bg-bg-surface shadow-xs">
        <table className="medicore-table w-full min-w-[950px] text-xs">
          <thead>
            <tr>
              <th className="w-24">Charge ID</th>
              <th className="w-28">Date</th>
              <th className="min-w-[180px]">Patient Name</th>
              <th className="min-w-[220px]">Service Particulars</th>
              <th className="w-28">Source Module</th>
              <th className="w-16 text-center">Qty</th>
              <th className="w-24 text-right">Rate (₹)</th>
              <th className="w-28 text-right">Amount (₹)</th>
              <th className="w-24">Status</th>
              <th className="w-32 text-right">Bill Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCharges.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-text-muted text-xs">
                  No charge items found matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredCharges.map((chg) => (
                <tr key={chg.id} className="h-14 hover:bg-bg-surface-elevated/60 transition-colors">
                  <td>
                    <span className="mono font-bold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-0.5 px-2 rounded border border-teal-200 dark:border-teal-800 inline-block">
                      {chg.id}
                    </span>
                  </td>
                  <td className="mono text-text-muted whitespace-nowrap">{chg.date}</td>
                  <td>
                    <div className="font-bold text-text-main truncate max-w-[170px]" title={chg.patientName}>
                      {chg.patientName}
                    </div>
                    <div className="text-[10.5px] text-text-muted mono truncate">{chg.patientId} • {chg.admissionId}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-text-main truncate max-w-[240px]" title={chg.serviceName}>
                      {chg.serviceName}
                    </div>
                    <div className="text-[10px] text-text-dim uppercase font-mono tracking-wider">{chg.serviceType}</div>
                  </td>
                  <td>{getModuleBadge(chg.sourceModule)}</td>
                  <td className="text-center mono font-bold">{chg.qty}</td>
                  <td className="text-right mono font-medium">₹{Number(chg.rate).toLocaleString()}</td>
                  <td className="text-right mono font-bold text-text-main text-[13px]">
                    ₹{Number(chg.amount).toLocaleString()}
                  </td>
                  <td>
                    <Badge variant={chg.status === 'Billed' ? 'emerald' : chg.status === 'Pending' ? 'amber' : 'rose'}>
                      {chg.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-secondary btn-sm text-[11px] h-7.5 px-2.5 rounded-md font-semibold hover:bg-teal-500/10 hover:text-teal-600 transition-colors"
                      onClick={() => {
                        if (onSelectPatientForBilling) {
                          onSelectPatientForBilling(chg.patientId);
                        } else {
                          setActiveNav({ module: 'billing', subModule: 'finalBill' });
                        }
                      }}
                      title="Load patient charges into Final Bill Builder"
                    >
                      Bill Patient
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Charge Entry Modal */}
      {showAddChargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-teal-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-text-muted hover:text-text-main"
              onClick={() => setShowAddChargeModal(false)}
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-extrabold text-text-main mb-1 flex items-center gap-2">
              <Plus className="text-teal-600" size={20} /> Manual Consumable & Service Charge Entry
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Add ad-hoc surgical consumables, special dressing materials, or bedside procedures.
            </p>

            <form onSubmit={handleManualAddCharge} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Patient</label>
                <select
                  className="form-select"
                  value={newChargePatientId}
                  onChange={(e) => setNewChargePatientId(e.target.value)}
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn}) • {p.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service / Charge Category</label>
                <select
                  className="form-select"
                  value={newChargeServiceType}
                  onChange={(e) => setNewChargeServiceType(e.target.value)}
                  required
                >
                  <option value="Consumables">Surgical & Ward Consumables</option>
                  <option value="Bed Charges">Extra Bed & Room Surcharge</option>
                  <option value="Laboratory">Pathology & Lab Panel</option>
                  <option value="Radiology">Radiology Scan & Imaging</option>
                  <option value="Pharmacy">Specialized Inpatient Formulation</option>
                  <option value="Surgery/OT">Surgical Anesthesia / OT Material</option>
                  <option value="Nursing">Special Bedside Nursing Care</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description of Service / Consumable</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Surgical Suture Pack / Ortho Knee Brace"
                  value={newChargeName}
                  onChange={(e) => setNewChargeName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={newChargeQty}
                    onChange={(e) => setNewChargeQty(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rate per Unit (₹)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={newChargeRate}
                    onChange={(e) => setNewChargeRate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-bg-surface-elevated p-3 rounded-lg flex justify-between items-center text-xs border border-border-subtle">
                <span className="text-text-muted">Calculated Line Total:</span>
                <span className="mono font-bold text-base text-teal-600 dark:text-teal-400">
                  ₹{(Number(newChargeQty) * Number(newChargeRate)).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-border-subtle">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddChargeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Capture Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
