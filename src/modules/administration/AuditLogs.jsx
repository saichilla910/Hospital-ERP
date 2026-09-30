import React, { useState } from 'react';
import { FileSpreadsheet, Search, Clock, User, ShieldCheck, Eye, X } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const AuditLogs = () => {
  const { auditLogs, showToast } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');

  const modules = ['All', 'Patient Management', 'OPD', 'IPD', 'Billing', 'Pharmacy', 'Emergency', 'Administration'];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMod = selectedModule === 'All' || log.module.toLowerCase() === selectedModule.toLowerCase();
    return matchesSearch && matchesMod;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            System Activity History & Audit Trail
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Clear record of actions taken by staff, doctor orders, and billing updates.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 flex justify-between items-center flex-wrap gap-3.5">
        <div className="relative flex-1 min-w-[260px] flex items-center">
          <Search size={16} className="text-teal-600 dark:text-teal-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search activity by staff name, action, or record ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input form-search-input h-10 pr-10 text-sm rounded-xl w-full"
            style={{ paddingLeft: '42px' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 text-text-dim hover:text-text-main p-1 rounded-md transition-colors"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModule(m)}
              className={`btn btn-sm text-[0.75rem] ${selectedModule === m ? 'btn-primary' : 'btn-secondary'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Log #</th>
              <th>Staff Member</th>
              <th>Action Done</th>
              <th>Record Details</th>
              <th>Section</th>
              <th>Time</th>
              <th className="text-right">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="cursor-pointer hover:bg-bg-surface-elevated/60 transition-colors"
                onClick={() => showToast(`Activity Log ${log.id}: ${log.user} — "${log.action}" on ${log.target}`, 'info')}
              >
                <td>
                  <span className="mono font-bold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded border border-border-subtle">
                    {log.id}
                  </span>
                </td>
                <td className="font-bold text-text-main">{log.user}</td>
                <td>
                  <span className="font-semibold text-teal-600">{log.action}</span>
                </td>
                <td className="text-text-main text-[0.85rem]">{log.target}</td>
                <td><span className="badge badge-gray">{log.module}</span></td>
                <td className="text-[0.8rem] text-text-dim">{log.timestamp}</td>
                <td className="text-right">
                  <button
                    className="btn-icon btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast(`Viewing verified details for Log Event ${log.id}.`, 'info');
                    }}
                    title="View Log Details"
                  >
                    <Eye size={13} className="text-teal-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
