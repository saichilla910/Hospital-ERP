import React, { useState } from 'react';
import { Search, UserPlus, FileText, Stethoscope, Bed, Activity, Filter, Eye, ChevronRight, UserCheck, X } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const PatientDirectory = () => {
  const { patients, doctors, setSelectedPatient, setActiveNav, openModal } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      (patient.attendingDoctor && patient.attendingDoctor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'Inpatient', 'Outpatient', 'ICU', 'Emergency', 'Post-Op'];

  return (
    <div className="flex flex-col gap-5">
      {/* Top Header & Search Bar */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display">
            Patient Directory & Consulted Doctors
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Structured patient records, attending physicians, and clinical encounter histories.
          </p>
        </div>

        <button
          className="btn btn-primary h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm shadow-teal-600/20"
          onClick={() => setActiveNav({ module: 'patientManagement', subModule: 'registration' })}
        >
          <UserPlus size={16} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Controls (single row, 12px gap, 40px height) */}
      <div className="glass-card p-4 sm:p-4 flex justify-between items-center flex-wrap gap-3 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative w-full flex items-center">
            <Search size={16} className="text-teal-600 dark:text-teal-400 absolute left-3.5 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search by Patient Name, MRN (e.g. MRN-098801), Phone, or Attending Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input form-search-input h-10 pr-9 text-xs sm:text-sm rounded-lg w-full bg-bg-surface-elevated border border-border-subtle focus:border-teal-500/60 focus:bg-bg-surface transition-all"
              style={{ paddingLeft: '38px' }}
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
        </div>

        {/* Status Filter Tabs */}
        <div className="segmented-nav-group" role="tablist" aria-label="Patient Status Filter">
          {statuses.map((st) => (
            <button
              key={st}
              role="tab"
              aria-selected={statusFilter === st}
              onClick={() => setStatusFilter(st)}
              className={`segmented-nav-btn ${statusFilter === st ? 'active' : ''}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table — Wrapped in rounded card with horizontal scroll and min-width */}
      <div className="table-container rounded-xl border border-border-subtle overflow-x-auto bg-bg-surface shadow-xs">
        <table className="medicore-table w-full min-w-[1020px]">
          <thead>
            <tr>
              <th className="min-w-[220px]">Patient Name</th>
              <th className="w-28">MRN</th>
              <th className="w-28 whitespace-nowrap">Age / Gender</th>
              <th className="w-20 text-center">Blood</th>
              <th className="w-28">Status</th>
              <th className="w-36">Location</th>
              <th className="min-w-[220px]">Attending & Consulted Doctor</th>
              <th className="w-32">Phone</th>
              <th className="w-36 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-10 text-text-dim text-xs sm:text-sm font-medium">
                  No matching patients found for "{searchTerm}".
                </td>
              </tr>
            ) : (
              filteredPatients.map((p) => {
                const getStatusVariant = (st) => {
                  switch (st) {
                    case 'ICU':
                    case 'Emergency':
                      return 'rose';
                    case 'Inpatient':
                      return 'teal';
                    case 'Post-Op':
                      return 'indigo';
                    default:
                      return 'emerald';
                  }
                };

                const matchedDoctor = doctors.find((d) => d.name.toLowerCase() === (p.attendingDoctor || '').toLowerCase()) || doctors[0];
                const consultsCount = p.consultationsHistory?.length || 1;

                return (
                  <tr key={p.id} className="hover:bg-bg-surface-elevated/60 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover border border-border-subtle shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <div
                            className="font-bold text-text-main cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors leading-snug truncate"
                            onClick={() => {
                              setSelectedPatient(p);
                              setActiveNav({ module: 'patientManagement', subModule: 'profile' });
                            }}
                          >
                            {p.name}
                          </div>
                          <div className="text-xs text-text-dim mt-0.5">
                            Reg: {p.registeredDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mono text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-1 px-2.5 rounded border border-teal-200 dark:border-teal-800/60 inline-block leading-none">
                        {p.mrn}
                      </span>
                    </td>
                    <td className="text-xs sm:text-sm text-text-main whitespace-nowrap">
                      {p.age} yrs • {p.gender}
                    </td>
                    <td className="text-center">
                      <span className="font-bold text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded border border-rose-200 dark:border-rose-800/60 inline-flex items-center justify-center min-w-[42px] leading-tight text-center">
                        {p.bloodGroup || '—'}
                      </span>
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(p.status)} dot={p.status === 'ICU' || p.status === 'Emergency'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="text-xs text-text-muted whitespace-nowrap">
                      {p.ward !== 'N/A' ? `${p.ward} (${p.bedNo})` : 'Outpatient (OPD)'}
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span
                          className="text-[0.85rem] text-teal-600 dark:text-teal-400 font-bold cursor-pointer hover:underline truncate"
                          onClick={() => openModal('doctorProfile', matchedDoctor)}
                          title="Click to view doctor track record, success rate, and education"
                        >
                          {p.attendingDoctor}
                        </span>
                        <div className="text-[0.7rem] text-text-dim truncate">
                          {matchedDoctor.specialty} • <strong className="text-text-main">{consultsCount} visits</strong>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-text-muted mono whitespace-nowrap">
                      {p.phone}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="btn btn-secondary min-h-[36px] px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 rounded-lg"
                          onClick={() => {
                            setSelectedPatient(p);
                            setActiveNav({ module: 'patientManagement', subModule: 'profile' });
                          }}
                          title="View Full Profile & Consulted Doctors History"
                        >
                          <Eye size={14} className="shrink-0" />
                          <span>View</span>
                        </button>
                        <button
                          className="btn btn-primary min-h-[36px] px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 rounded-lg"
                          onClick={() => {
                            setSelectedPatient(p);
                            openModal('doctorConsult', matchedDoctor);
                          }}
                          title="Book Doctor Consultation"
                        >
                          <Stethoscope size={14} className="shrink-0" />
                          <span>Consult</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
