import React, { useState } from 'react';
import {
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Check,
  XCircle,
  Plus,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const TPAClaims = () => {
  const { insuranceClaims, patients, updateClaimStatus, showToast } = useHospital();

  const [selectedScheme, setSelectedScheme] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [rejectingClaim, setRejectingClaim] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [approvingClaim, setApprovingClaim] = useState(null);
  const [approvedAmountInput, setApprovedAmountInput] = useState(0);

  const filteredClaims = (insuranceClaims || []).filter((clm) => {
    const matchScheme = selectedScheme === 'ALL' || clm.schemeType?.includes(selectedScheme);
    const matchStatus = selectedStatus === 'ALL' || clm.status === selectedStatus;
    const matchSearch =
      !searchQuery ||
      clm.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clm.claimNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clm.insurer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clm.policyNo?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchScheme && matchStatus && matchSearch;
  });

  const totalClaimed = (insuranceClaims || []).reduce((acc, c) => acc + (Number(c.claimAmount) || 0), 0);
  const totalApproved = (insuranceClaims || []).reduce((acc, c) => acc + (Number(c.approvedAmount) || 0), 0);
  const rejectedCount = (insuranceClaims || []).filter((c) => c.status === 'Rejected').length;
  const pmjayCount = (insuranceClaims || []).filter((c) => c.schemeType?.includes('PMJAY')).length;

  const handleOpenApproveModal = (claim) => {
    setApprovingClaim(claim);
    setApprovedAmountInput(claim.preAuthAmount || claim.claimAmount);
  };

  const handleConfirmApproval = (e) => {
    e.preventDefault();
    if (!approvingClaim) return;
    updateClaimStatus({
      claimId: approvingClaim.id,
      newStatus: 'Pre-Auth Approved',
      approvedAmount: Number(approvedAmountInput) || approvingClaim.claimAmount,
      rejectionReason: null,
      remarks: 'Approved by TPA / PMJAY Medical Adjudicator'
    });
    setApprovingClaim(null);
  };

  const handleOpenRejectModal = (claim) => {
    setRejectingClaim(claim);
    setRejectionReasonInput('');
  };

  const handleConfirmRejection = (e) => {
    e.preventDefault();
    if (!rejectingClaim) return;
    if (!rejectionReasonInput.trim()) {
      showToast('Mandatory requirement: Please enter the specific TPA/PMJAY claim rejection reason.', 'error');
      return;
    }

    updateClaimStatus({
      claimId: rejectingClaim.id,
      newStatus: 'Rejected',
      approvedAmount: 0,
      rejectionReason: rejectionReasonInput.trim(),
      remarks: `Claim repudiated: ${rejectionReasonInput.trim()}`
    });
    setRejectingClaim(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-main flex items-center gap-2.5">
            <ShieldCheck className="text-teal-600 dark:text-teal-400" size={24} />
            Insurance & PMJAY Cashless Claims Adjudication
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Track Pre-Auth requests, approved cashless amounts, and audit trail of claim queries and rejections for TPA & Ayushman Bharat (PMJAY) cases.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between bg-bg-surface">
          <div>
            <div className="text-xs text-text-muted font-medium">Total Claims Value</div>
            <div className="text-2xl font-black text-text-main mt-1 font-mono">₹{totalClaimed.toLocaleString()}</div>
            <div className="text-[0.75rem] text-teal-600 dark:text-teal-400 mt-1">{insuranceClaims.length} Claims Filed</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <FileCheck size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between bg-bg-surface">
          <div>
            <div className="text-xs text-text-muted font-medium">Approved Cashless Total</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">₹{totalApproved.toLocaleString()}</div>
            <div className="text-[0.75rem] text-emerald-600 mt-1">Cleared for patient admission</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between bg-bg-surface">
          <div>
            <div className="text-xs text-text-muted font-medium">PMJAY Beneficiary Cases</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">{pmjayCount}</div>
            <div className="text-[0.75rem] text-indigo-600 mt-1">Ayushman Bharat Government Scheme</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="glass-card p-4.5 rounded-xl border border-border-subtle flex items-center justify-between bg-bg-surface">
          <div>
            <div className="text-xs text-text-muted font-medium">Repudiated / Rejected</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">{rejectedCount}</div>
            <div className="text-[0.75rem] text-rose-600 mt-1">Tracked with rejection reasons</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-3.5 rounded-xl border border-border-subtle flex items-center justify-between flex-wrap gap-3 bg-bg-surface">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              className="form-input text-xs pl-8.5 pr-3 py-1.5 h-8.5 rounded-lg w-full"
              placeholder="Search Claim No, Patient Name, Policy, or TPA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold">
            <Filter size={13} className="text-teal-600" /> Scheme:
          </div>
          <select
            className="form-select text-xs h-8.5 py-1 px-2.5 rounded-lg w-auto"
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
          >
            <option value="ALL">All Schemes</option>
            <option value="PMJAY">PMJAY (Ayushman Bharat)</option>
            <option value="Private">Private Health Insurance</option>
            <option value="Corporate">Corporate Group Mediclaim</option>
          </select>

          <select
            className="form-select text-xs h-8.5 py-1 px-2.5 rounded-lg w-auto"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Approval Statuses</option>
            <option value="Pre-Auth Approved">Pre-Auth Approved</option>
            <option value="Pre-Auth Submitted">Pre-Auth Submitted</option>
            <option value="Query Raised">Query Raised</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="text-xs text-text-muted font-mono">
          Showing {filteredClaims.length} claims
        </div>
      </div>

      {/* Claims Master Table */}
      <div className="table-container rounded-xl border border-border-subtle overflow-x-auto bg-bg-surface shadow-xs">
        <table className="medicore-table w-full min-w-[1000px] text-xs">
          <thead>
            <tr>
              <th className="w-28">Claim / Policy #</th>
              <th className="min-w-[180px]">Patient Name</th>
              <th className="min-w-[180px]">Insurer & TPA</th>
              <th className="w-32">Treatment Type</th>
              <th className="w-24 text-right">Pre-Auth (₹)</th>
              <th className="w-28 text-right">Approved (₹)</th>
              <th className="w-32">Status</th>
              <th className="min-w-[200px]">Adjudication / Rejection Reason</th>
              <th className="w-36 text-right">TPA Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((clm) => (
              <tr key={clm.id} className="h-16 hover:bg-bg-surface-elevated/60 transition-colors">
                <td>
                  <div className="mono font-bold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-0.5 px-2 rounded border border-teal-200 dark:border-teal-800 inline-block">
                    {clm.claimNo || clm.id}
                  </div>
                  <div className="text-[10.5px] text-text-muted mono mt-0.5">{clm.policyNo}</div>
                </td>
                <td>
                  <div className="font-bold text-text-main text-xs">{clm.patientName}</div>
                  <div className="text-[10px] text-text-dim">
                    {clm.schemeType?.includes('PMJAY') ? (
                      <span className="text-indigo-600 font-bold">🏛️ PMJAY Ayushman Bharat</span>
                    ) : (
                      <span className="text-teal-600">🛡️ Private Mediclaim</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-text-main">{clm.insurer}</div>
                  <div className="text-[10.5px] text-text-muted">TPA: {clm.tpa}</div>
                </td>
                <td>
                  <span className="badge badge-gray text-[10.5px]">{clm.treatmentType || clm.claimType}</span>
                </td>
                <td className="text-right mono font-semibold text-text-main">
                  ₹{Number(clm.preAuthAmount || clm.claimAmount).toLocaleString()}
                </td>
                <td className="text-right mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  ₹{Number(clm.approvedAmount || 0).toLocaleString()}
                </td>
                <td>
                  <Badge
                    variant={
                      clm.status.includes('Approved')
                        ? 'emerald'
                        : clm.status === 'Rejected'
                        ? 'rose'
                        : clm.status.includes('Query')
                        ? 'amber'
                        : 'indigo'
                    }
                    dot={clm.status.includes('Query') || clm.status === 'Rejected'}
                  >
                    {clm.status}
                  </Badge>
                </td>
                <td>
                  {clm.status === 'Rejected' ? (
                    <div className="bg-rose-500/10 border border-rose-500/30 p-2 rounded-lg text-rose-700 dark:text-rose-400 text-[11px] leading-tight">
                      <strong>Rejection Reason:</strong> {clm.rejectionReason}
                    </div>
                  ) : clm.status.includes('Query') ? (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-lg text-amber-700 dark:text-amber-400 text-[11px] leading-tight">
                      <strong>Query:</strong> {clm.rejectionReason || clm.remarks}
                    </div>
                  ) : (
                    <div className="text-text-muted text-[11px]">{clm.remarks || 'Standard cashless approval'}</div>
                  )}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {clm.status !== 'Pre-Auth Approved' && (
                      <button
                        className="btn btn-primary btn-sm text-[11px] h-7.5 px-2 font-bold"
                        onClick={() => handleOpenApproveModal(clm)}
                        title="Approve Pre-Auth Amount"
                      >
                        <Check size={12} /> Approve
                      </button>
                    )}

                    {clm.status !== 'Rejected' && (
                      <button
                        className="btn btn-secondary btn-sm text-[11px] h-7.5 px-2 text-rose-600 hover:bg-rose-500/10"
                        onClick={() => handleOpenRejectModal(clm)}
                        title="Reject Claim and Record Mandatory Reason"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Claim Modal */}
      {rejectingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-rose-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl relative">
            <h3 className="text-base font-extrabold text-text-main mb-1 flex items-center gap-2 text-rose-600">
              <AlertTriangle size={18} /> Record TPA / PMJAY Claim Rejection
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Patient: <strong>{rejectingClaim.patientName}</strong> • Claim: <strong>{rejectingClaim.claimNo}</strong>
            </p>

            <form onSubmit={handleConfirmRejection} className="flex flex-col gap-3">
              <div className="form-group">
                <label className="form-label text-xs text-rose-600 font-bold">
                  * Official Rejection Reason (Mandatory Compliance):
                </label>
                <textarea
                  className="form-textarea text-xs border-rose-500/40"
                  rows="3"
                  placeholder="e.g. Non-payable consumable exclusion / Cooling period for pre-existing disease not completed / Less than 24h hospitalization under PMJAY rule 4.2"
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => setRejectingClaim(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs bg-rose-600 hover:bg-rose-700">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approve Claim Modal */}
      {approvingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-emerald-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <h3 className="text-base font-extrabold text-text-main mb-1 flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={18} /> Approve Cashless Insurance Amount
            </h3>
            <p className="text-xs text-text-muted mb-3">
              Patient: <strong>{approvingClaim.patientName}</strong> • {approvingClaim.insurer}
            </p>

            <form onSubmit={handleConfirmApproval} className="flex flex-col gap-3">
              <div className="form-group">
                <label className="form-label text-xs">Approved Cashless Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  max={approvingClaim.claimAmount}
                  className="form-input text-base font-mono font-bold text-emerald-600"
                  value={approvedAmountInput}
                  onChange={(e) => setApprovedAmountInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => setApprovingClaim(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs bg-emerald-600 hover:bg-emerald-700">
                  Confirm Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
