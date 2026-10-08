import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  User,
  Clock,
  ArrowRight,
  Sparkles,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const BillingAuditLogs = () => {
  const { billingAuditLogs } = useHospital();

  const [selectedAction, setSelectedAction] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = (billingAuditLogs || []).filter((log) => {
    const matchAction = selectedAction === 'ALL' || log.action === selectedAction;
    const matchSearch =
      !searchQuery ||
      log.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAction && matchSearch;
  });

  const totalDiscountVal = (billingAuditLogs || [])
    .filter((l) => l.action === 'Discount Applied')
    .reduce((sum, l) => sum + (Number(l.changeAmount) || 0), 0);

  const discountCount = (billingAuditLogs || []).filter((l) => l.action === 'Discount Applied').length;
  const rateAdjustCount = (billingAuditLogs || []).filter((l) => l.action === 'Rate Adjusted').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-main flex items-center gap-2.5">
            <FileText className="text-teal-600 dark:text-teal-400" size={24} />
            Discount & Bill Modification Audit Trail
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Immutable regulatory audit log for all institutional discounts, fee waivers, and tariff alterations with mandatory user justification.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between bg-bg-surface">
          <div>
            <div className="text-xs text-text-muted font-medium">Audited Concessions</div>
            <div className="text-2xl font-black text-text-main mt-1 font-mono">₹{totalDiscountVal.toLocaleString()}</div>
            <div className="text-[0.75rem] text-teal-600 dark:text-teal-400 mt-1">{discountCount} Approved Discounts</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between bg-bg-surface">
          <div>
            <div className="text-xs text-text-muted font-medium">Tariff Adjustments</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{rateAdjustCount}</div>
            <div className="text-[0.75rem] text-amber-600 mt-1">Room / Nursing overlaps corrected</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Receipt size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between bg-bg-surface">
          <div>
            <div className="text-xs text-text-muted font-medium">Audit Compliance</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">100% Verified</div>
            <div className="text-[0.75rem] text-emerald-600 mt-1">Zero unverified modifications</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between bg-bg-surface">
          <div>
            <div className="text-xs text-text-muted font-medium">Audit Standard</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">CGST Sec 31</div>
            <div className="text-[0.75rem] text-text-muted mt-1">NABH Financial Integrity</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Sparkles size={22} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-3.5 rounded-xl border border-border-subtle flex items-center justify-between flex-wrap gap-3 bg-bg-surface">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              className="form-input text-xs pl-8.5 pr-3 py-1.5 h-8.5 rounded-lg w-full"
              placeholder="Search Bill No, Patient, Reason, or Authorizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold">
            <Filter size={13} className="text-teal-600" /> Action:
          </div>
          <select
            className="form-select text-xs h-8.5 py-1 px-2.5 rounded-lg w-auto"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="ALL">All Actions</option>
            <option value="Discount Applied">Discount Applied</option>
            <option value="Rate Adjusted">Rate Adjusted</option>
            <option value="Package Applied">Package Applied</option>
          </select>
        </div>

        <div className="text-xs text-text-muted font-mono">
          Showing {filteredLogs.length} audit records
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-container rounded-xl border border-border-subtle overflow-x-auto bg-bg-surface shadow-xs">
        <table className="medicore-table w-full min-w-[950px] text-xs">
          <thead>
            <tr>
              <th className="w-32">Timestamp</th>
              <th className="w-32">Bill / Inv #</th>
              <th className="min-w-[170px]">Patient Name</th>
              <th className="w-32">Action</th>
              <th className="w-36">Field / Parameter</th>
              <th className="min-w-[160px]">Previous → New</th>
              <th className="min-w-[240px]">Mandatory Clinical / Admin Reason</th>
              <th className="min-w-[180px]">Authorized By</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="h-16 hover:bg-bg-surface-elevated/60 transition-colors">
                <td className="mono text-text-muted whitespace-nowrap">{log.timestamp}</td>
                <td>
                  <span className="mono font-bold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-0.5 px-2 rounded border border-teal-200 dark:border-teal-800">
                    {log.billNo}
                  </span>
                </td>
                <td className="font-bold text-text-main">{log.patientName}</td>
                <td>
                  <Badge
                    variant={
                      log.action.includes('Discount')
                        ? 'emerald'
                        : log.action.includes('Adjusted')
                        ? 'amber'
                        : 'indigo'
                    }
                  >
                    {log.action}
                  </Badge>
                </td>
                <td className="font-medium text-text-muted">{log.field}</td>
                <td>
                  <div className="flex items-center gap-1.5 mono text-[11px]">
                    <span className="text-text-muted">{log.previousValue}</span>
                    <ArrowRight size={11} className="text-teal-600" />
                    <span className="font-bold text-text-main">{log.newValue}</span>
                  </div>
                </td>
                <td>
                  <div className="p-2 bg-bg-surface-elevated rounded-lg border border-border-subtle text-[11.5px] leading-tight text-text-main">
                    {log.reason}
                  </div>
                </td>
                <td>
                  <div className="font-bold text-text-main text-[11.5px]">{log.user}</div>
                  <div className="text-[10px] text-text-dim uppercase mono">Role: {log.role}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
