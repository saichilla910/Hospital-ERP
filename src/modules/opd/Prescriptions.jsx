import React, { useState } from 'react';
import { Pill, Search, Printer, Eye, Plus, Calendar, Stethoscope, X } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Prescriptions = () => {
  const { prescriptions, openModal, setActiveNav } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRx = prescriptions.filter(
    (rx) =>
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── Page Header Card ── */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/50 flex items-center justify-center shrink-0 shadow-2xs">
            <Pill size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-main tracking-tight font-display leading-tight">
                Digital Prescriptions History
              </h2>
              <span className="badge badge-teal text-xs font-semibold py-0.5 px-2.5">
                OPD Pharmacy Orders
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed font-normal">
              Search, view, audit, and print electronic prescriptions issued to outpatients and clinic visitors.
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary min-h-[42px] px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-teal-600/25 cursor-pointer"
          onClick={() => setActiveNav({ module: 'opd', subModule: 'consultation' })}
        >
          <Plus size={16} strokeWidth={2.4} />
          <span>Write Prescription</span>
        </button>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs">
        <div className="relative w-full flex items-center">
          <Search size={16} className="text-teal-600 dark:text-teal-400 absolute left-4 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search by Rx ID, Patient Name, Doctor, or Clinical Diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input form-search-input h-11 pl-11 pr-10 text-xs sm:text-sm rounded-xl w-full bg-bg-surface-elevated border border-border-subtle focus:border-teal-500/50 transition-all font-medium"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 text-text-dim hover:text-text-main p-1.5 rounded-lg transition-colors cursor-pointer"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Prescriptions Table ── */}
      <div className="table-container rounded-2xl border border-border-subtle shadow-xs mb-0 bg-bg-surface">
        <table className="medicore-table">
          <thead>
            <tr>
              <th className="py-3.5 px-5">Prescription ID</th>
              <th className="py-3.5 px-5">Patient Name</th>
              <th className="py-3.5 px-5">Prescribing Doctor</th>
              <th className="py-3.5 px-5">Department</th>
              <th className="py-3.5 px-5">Clinical Diagnosis</th>
              <th className="py-3.5 px-5">Drugs Count</th>
              <th className="py-3.5 px-5">Date Issued</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRx.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-text-muted text-xs sm:text-sm font-medium">
                  No prescriptions found matching your search query.
                </td>
              </tr>
            ) : (
              filteredRx.map((rx) => (
                <tr key={rx.id} className="hover:bg-bg-surface-elevated/70 transition-colors">
                  <td className="py-4 px-5">
                    <span className="mono font-semibold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-1 px-2.5 rounded-lg border border-teal-200/80 dark:border-teal-800/60 shadow-2xs whitespace-nowrap">
                      {rx.id}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-text-main text-xs sm:text-sm whitespace-nowrap">
                    {rx.patientName}
                  </td>
                  <td className="py-4 px-5 text-xs sm:text-sm text-teal-700 dark:text-teal-300 font-semibold whitespace-nowrap">
                    {rx.doctorName}
                  </td>
                  <td className="py-4 px-5 text-xs text-text-muted font-medium whitespace-nowrap">
                    {rx.department}
                  </td>
                  <td className="py-4 px-5 text-xs sm:text-sm text-text-main font-medium leading-relaxed max-w-[240px] truncate">
                    {rx.diagnosis}
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="badge badge-teal text-xs font-semibold py-0.5 px-2.5">
                      {rx.items.length} {rx.items.length === 1 ? 'Medicine' : 'Medicines'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-text-muted font-medium whitespace-nowrap">
                    {rx.date}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      className="btn btn-primary btn-sm min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ml-auto shadow-2xs cursor-pointer"
                      onClick={() => openModal('prescription', rx)}
                    >
                      <Printer size={14} className="shrink-0" />
                      <span>View & Print</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
