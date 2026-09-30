import React, { useState } from 'react';
import { UserCheck, Calendar, DollarSign, Clock, Users, ShieldCheck, Phone, Check } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const HRPayroll = () => {
  const { staffRoster, doctors, showToast } = useHospital();
  const [activeTab, setActiveTab] = useState('roster');

  const [onCallDoctors, setOnCallDoctors] = useState([
    { doctor: 'Dr. Arvind Swaminathan', specialty: 'Emergency Doctor', shift: 'Night Shift (8 PM - 8 AM)', phone: '+91 98480 11223', status: 'Available' },
    { doctor: 'Dr. Ananya Mukherjee', specialty: 'Heart Specialist (Cardiology)', shift: 'Emergency On-Call', phone: '+91 98480 22334', status: 'In Hospital' },
    { doctor: 'Dr. Rajesh K. Nair', specialty: 'Bone & Joint Specialist (Orthopaedics)', shift: 'Standby On-Call', phone: '+91 98480 55667', status: 'Available' }
  ]);

  const handleCallDoctor = (doc) => {
    showToast(`Calling ${doc.doctor} (${doc.phone})...`, 'info');
  };

  const handleProcessPayroll = () => {
    showToast('Monthly staff salaries processed and deposited into accounts!', 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.4rem] font-extrabold text-text-main">
            Hospital Staff, Duty Shifts & Salaries
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Manage doctor on-call shifts, nursing staff duty timings, and monthly salary payouts.
          </p>
        </div>

        <div className="segmented-nav-group" role="tablist" aria-label="HR and Payroll Views">
          <button
            role="tab"
            aria-selected={activeTab === 'roster'}
            className={`segmented-nav-btn ${activeTab === 'roster' ? 'active' : ''}`}
            onClick={() => setActiveTab('roster')}
          >
            <Users size={15} /> Staff Directory & Duty Shifts
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'payroll'}
            className={`segmented-nav-btn ${activeTab === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <DollarSign size={15} /> Monthly Salary Payout
          </button>
        </div>
      </div>

      {activeTab === 'roster' ? (
        <div className="flex flex-col gap-5">
          {/* On-Call Doctors */}
          <div className="glass-card flex flex-col gap-3.5">
            <h3 className="text-[1.05rem] text-teal-600 flex items-center gap-2 font-bold">
              <Clock size={16} /> 24x7 Emergency On-Call Doctors (Click to Call)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {onCallDoctors.map((doc, i) => (
                <div
                  key={i}
                  onClick={() => handleCallDoctor(doc)}
                  className="glass-card-interactive bg-bg-surface-elevated p-3.5 rounded-md border border-border-subtle cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[0.95rem] font-bold text-text-main">{doc.doctor}</span>
                    <Badge variant="emerald" size="sm">{doc.status}</Badge>
                  </div>
                  <div className="text-[0.8rem] text-teal-600 font-semibold mt-0.5">{doc.specialty}</div>
                  <div className="text-[0.75rem] text-text-muted mt-1.5">{doc.shift}</div>
                  <div className="text-[0.75rem] text-text-main mt-1 flex items-center gap-1">
                    <Phone size={12} className="text-emerald-600" /> <strong>{doc.phone}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Master Staff Roster */}
          <div className="table-container">
            <table className="medicore-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Staff Member</th>
                  <th>Role / Designation</th>
                  <th>Department</th>
                  <th>Duty Shift</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staffRoster.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => showToast(`Staff details: ${emp.name} (${emp.role} • ${emp.dept})`, 'info')}
                    className="cursor-pointer hover:bg-bg-surface-elevated/60 transition-colors"
                  >
                    <td><span className="mono font-bold text-teal-600">{emp.id}</span></td>
                    <td className="font-bold text-text-main">{emp.name}</td>
                    <td>{emp.role}</td>
                    <td className="text-[0.8rem] text-text-muted">{emp.dept}</td>
                    <td className="text-[0.85rem]">{emp.shift}</td>
                    <td><Badge variant="emerald" size="sm">{emp.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Payroll Table */
        <div className="glass-card flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2.5">
            <div>
              <h3 className="text-[1.05rem] font-bold text-text-main">Monthly Staff Salary Overview</h3>
              <span className="text-[0.8rem] text-teal-600 font-bold">Total Monthly Payroll: ₹9,70,000</span>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleProcessPayroll}>
              <Check size={14} /> Process Salaries
            </button>
          </div>

          <div className="table-container">
            <table className="medicore-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Role</th>
                  <th>Monthly Salary</th>
                  <th>Taxes / Deductions</th>
                  <th>Net Take-Home Pay</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {staffRoster.map((emp) => (
                  <tr key={emp.id}>
                    <td className="font-bold text-text-main">{emp.name}</td>
                    <td className="text-[0.8rem] text-text-muted">{emp.role}</td>
                    <td className="mono font-bold">{emp.salary}</td>
                    <td className="mono text-text-muted">10% Tax</td>
                    <td className="mono font-extrabold text-emerald-600">{emp.salary}</td>
                    <td><Badge variant="emerald" size="sm">Paid Directly to Bank</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
