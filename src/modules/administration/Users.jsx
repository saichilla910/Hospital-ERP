import React, { useState } from 'react';
import { UserCheck, Plus, Search, Key, ShieldCheck, X } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useHospital } from '../../context/HospitalContext';

export const Users = () => {
  const { showToast } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, username: 'sjenkins.doc', name: 'Dr. Sarah Jenkins', role: 'Chief Medical Officer / Admin', email: 's.jenkins@hospital.org', lastLogin: 'Today 07:15 AM', status: 'Active' },
    { id: 2, username: 'amukherjee.doc', name: 'Dr. Ananya Mukherjee', role: 'Doctor (Cardiology)', email: 'a.mukherjee@hospital.org', lastLogin: 'Today 08:02 AM', status: 'Active' },
    { id: 3, username: 'aswaminathan.doc', name: 'Dr. Arvind Swaminathan', role: 'Doctor (Emergency)', email: 'a.swaminathan@hospital.org', lastLogin: 'Today 06:45 AM', status: 'Active' },
    { id: 4, username: 'rmathews.nurse', name: 'Sr. Reena Mathews', role: 'Head Nurse (ICU)', email: 'r.mathews@hospital.org', lastLogin: 'Today 06:55 AM', status: 'Active' },
    { id: 5, username: 'rvarma.pharm', name: 'Rajesh Varma', role: 'Head Pharmacist', email: 'r.varma@hospital.org', lastLogin: 'Today 07:40 AM', status: 'Active' },
    { id: 6, username: 'ksudhakar.bill', name: 'K. Sudhakar', role: 'Senior Billing Cashier', email: 'k.sudhakar@hospital.org', lastLogin: 'Today 08:30 AM', status: 'Active' }
  ]);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Account for ${u.name} set to ${newStatus}.`, newStatus === 'Active' ? 'success' : 'warning');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleResetPassword = (name) => {
    showToast(`Password reset link sent to ${name}'s verified email.`, 'info');
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Hospital Staff Accounts
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Manage staff login accounts, passwords, and access permissions.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => showToast('Create Staff Account form opened.', 'info')}
        >
          <Plus size={16} /> Create Staff Account
        </button>
      </div>

      <div className="glass-card p-3.5">
        <div className="relative w-full flex items-center">
          <Search size={16} className="text-teal-600 dark:text-teal-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search staff by name, username, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input form-search-input h-11 pr-10 text-sm rounded-xl w-full"
            style={{ paddingLeft: '42px' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 text-text-dim hover:text-text-main p-1 rounded-md transition-colors"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Assigned Role</th>
              <th>Email Address</th>
              <th>Last Active</th>
              <th>Account Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <span className="mono font-bold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded border border-border-subtle">
                    {u.username}
                  </span>
                </td>
                <td className="font-bold text-text-main">{u.name}</td>
                <td><span className="badge badge-indigo">{u.role}</span></td>
                <td className="text-[0.85rem] text-text-muted">{u.email}</td>
                <td className="text-[0.8rem] text-text-dim">{u.lastLogin}</td>
                <td>
                  <Badge variant={u.status === 'Active' ? 'emerald' : 'rose'} size="sm">
                    {u.status}
                  </Badge>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleResetPassword(u.name)}
                      title="Send Password Reset"
                    >
                      <Key size={13} /> Reset Pass
                    </button>
                    <button
                      className={`btn btn-sm ${u.status === 'Active' ? 'btn-outline' : 'btn-primary'}`}
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
