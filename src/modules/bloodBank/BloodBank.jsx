import React, { useState } from 'react';
import { Droplet, AlertTriangle, Plus, CheckCircle2, ShieldAlert, HeartHandshake, ArrowUpRight, Check, Printer } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const BloodBank = () => {
  const { bloodBankStock: initialStock, showToast } = useHospital();
  const [stock, setStock] = useState(initialStock);
  const [crossmatchRequests, setCrossmatchRequests] = useState([
    { reqId: 'REQ-BLD-881', patient: 'Kiran Kumar (Emergency #902)', bloodGroup: 'O-', units: 2, component: 'Red Blood Cells', status: 'Issued & In Use', urgency: 'Emergency STAT' },
    { reqId: 'REQ-BLD-882', patient: 'M. K. Nambiar (OT 1 Surgery)', bloodGroup: 'A+', units: 2, component: 'Red Cells + 2 Plasma', status: 'Reserved for Surgery', urgency: 'Surgery Standby' },
    { reqId: 'REQ-BLD-883', patient: 'Deepa Narayan (Ward 2A)', bloodGroup: 'B+', units: 1, component: 'Platelets', status: 'Ready for Dispatch', urgency: 'Routine' }
  ]);

  const handleAddUnit = (group) => {
    setStock((prev) =>
      prev.map((b) => {
        if (b.group === group) {
          showToast(`Added +1 Red Blood Cell unit to Group ${group}. New total: ${b.packedCells + 1} units.`, 'success');
          return { ...b, packedCells: b.packedCells + 1 };
        }
        return b;
      })
    );
  };

  const handleIssueRequest = (reqId, patientName) => {
    setCrossmatchRequests((prev) =>
      prev.map((req) => (req.reqId === reqId ? { ...req, status: 'Blood Bag Handed Over' } : req))
    );
    showToast(`Blood bag successfully issued for ${patientName}!`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.4rem] font-extrabold text-text-main flex items-center gap-2">
            <Droplet size={22} className="text-rose-600" /> Blood Bank & Available Stock
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Available blood bags by blood group (A, B, AB, O). Click any card to add or reserve units.
          </p>
        </div>

        <button
          className="btn btn-danger"
          onClick={() => showToast('Blood Donor alert broadcasted to registered community blood donors.', 'info')}
        >
          <HeartHandshake size={16} /> Request Blood Donors
        </button>
      </div>

      {/* Stock Units Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stock.map((b) => {
          const isCritical = b.status.toLowerCase().includes('critical') || b.status.toLowerCase().includes('shortage') || b.packedCells <= 4;
          return (
            <div
              key={b.group}
              className={`glass-card glass-card-interactive flex flex-col gap-3 transition-all ${
                isCritical ? 'border border-rose-500' : 'border border-border-subtle'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-semibold text-[1.15rem]">
                    {b.group}
                  </div>
                  <div>
                    <span className="text-[0.95rem] font-extrabold text-text-main">Blood Group {b.group}</span>
                    <div className="text-[0.725rem] text-text-muted">ABO / RhD</div>
                  </div>
                </div>
                <Badge variant={isCritical ? 'rose' : 'emerald'} dot={isCritical} size="sm">
                  {isCritical ? 'Low Stock' : 'Adequate'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-bg-surface-elevated p-2.5 rounded-md text-[0.775rem]">
                <div>
                  <span className="text-text-muted">Red Cells (PRBC):</span>
                  <div className="mono font-extrabold text-text-main text-base">{b.packedCells} Bags</div>
                </div>
                <div>
                  <span className="text-text-muted">Fresh Plasma:</span>
                  <div className="mono font-extrabold text-teal-600 text-base">{b.ffp} Bags</div>
                </div>
                <div>
                  <span className="text-text-muted">Platelets:</span>
                  <div className="mono font-extrabold text-amber-600 text-base">{b.platelets} Bags</div>
                </div>
                <div>
                  <span className="text-text-muted">Cryo Factor:</span>
                  <div className="mono font-extrabold text-indigo-600 text-base">{b.cryo} Bags</div>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm w-full text-[0.75rem]"
                  onClick={() => handleAddUnit(b.group)}
                >
                  <Plus size={13} /> +1 Bag (Donor Entry)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crossmatching & Issue Requests Table */}
      <div className="glass-card flex flex-col gap-4">
        <h3 className="text-[1.05rem] font-bold text-text-main">Blood Issue & Patient Requests</h3>

        <div className="table-container">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Patient / Room</th>
                <th>Blood Group & Type</th>
                <th>Units Needed</th>
                <th>Urgency</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crossmatchRequests.map((req) => (
                <tr key={req.reqId}>
                  <td>
                    <span className="mono font-bold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded">
                      {req.reqId}
                    </span>
                  </td>
                  <td className="font-bold text-text-main">{req.patient}</td>
                  <td>
                    <strong className="text-rose-600">{req.bloodGroup}</strong> • {req.component}
                  </td>
                  <td className="mono font-bold">{req.units} Units</td>
                  <td>
                    <Badge variant={req.urgency.includes('STAT') ? 'rose' : 'teal'} dot={req.urgency.includes('STAT')}>
                      {req.urgency}
                    </Badge>
                  </td>
                  <td>
                    <span className="badge badge-emerald">{req.status}</span>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleIssueRequest(req.reqId, req.patient)}
                    >
                      <Check size={13} /> Issue Bag
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
