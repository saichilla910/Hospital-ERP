import React, { useState } from 'react';
import { Settings as SettingsIcon, Building, Bell, ShieldCheck, Database, Save, Check } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const Settings = () => {
  const { hospitalInfo, showToast } = useHospital();
  const [formData, setFormData] = useState({
    name: hospitalInfo.name,
    licenseNo: hospitalInfo.licenseNo,
    taxId: hospitalInfo.taxId,
    address: hospitalInfo.address,
    phone: hospitalInfo.phone,
    emergencyHelpline: hospitalInfo.emergencyHelpline,
    email: hospitalInfo.email,
    activeShift: hospitalInfo.activeShift,
    autoBackup: true,
    smsAlerts: true,
    emailReports: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Hospital settings saved successfully!', 'success');
  };

  return (
    <div className="flex flex-col gap-6 max-w-[900px] mx-auto w-full pb-16">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-text-main tracking-tight font-display flex items-center gap-2.5">
          <SettingsIcon size={24} className="text-teal-600 dark:text-teal-400" /> Hospital Details & Settings
        </h2>
        <p className="text-sm text-text-muted mt-1 leading-relaxed">
          Hospital profile, emergency contact numbers, registration details, and notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="glass-card p-6 sm:p-8 flex flex-col">
          {/* Section 1: Hospital Profile */}
          <div>
            <h3 className="text-base font-semibold text-text-main flex items-center gap-2 mb-4">
              <Building size={18} className="text-teal-600 dark:text-teal-400" /> Hospital Name & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="form-group sm:col-span-2">
                <label className="form-label">Hospital Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital License / Registration No</label>
                <input
                  type="text"
                  className="form-input mono"
                  value={formData.licenseNo}
                  onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GST / Tax Number</label>
                <input
                  type="text"
                  className="form-input mono"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                />
              </div>

              <div className="form-group sm:col-span-2">
                <label className="form-label">Hospital Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reception / Helpline Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency 24x7 Ambulance Helpline</label>
                <input
                  type="text"
                  className="form-input mono"
                  value={formData.emergencyHelpline}
                  onChange={(e) => setFormData({ ...formData, emergencyHelpline: e.target.value })}
                />
              </div>

              <div className="form-group sm:col-span-2">
                <label className="form-label">Hospital Official Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section Divider with 24px spacing */}
          <div className="border-t border-border-subtle my-6" />

          {/* Section 2: Notifications & Backup */}
          <div>
            <h3 className="text-base font-semibold text-text-main flex items-center gap-2 mb-4">
              <Database size={18} className="text-teal-600 dark:text-teal-400" /> Automatic Backups & Patient SMS Alerts
            </h3>

            <div className="flex flex-col gap-3">
              <label className="flex items-start sm:items-center gap-3 text-sm text-text-main cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 sm:mt-0 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-border-strong cursor-pointer"
                  checked={formData.autoBackup}
                  onChange={(e) => {
                    setFormData({ ...formData, autoBackup: e.target.checked });
                    showToast(`Automatic cloud backup ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
                  }}
                />
                <span className="leading-snug">Keep automatic daily encrypted cloud backups of hospital records</span>
              </label>

              <label className="flex items-start sm:items-center gap-3 text-sm text-text-main cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 sm:mt-0 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-border-strong cursor-pointer"
                  checked={formData.smsAlerts}
                  onChange={(e) => {
                    setFormData({ ...formData, smsAlerts: e.target.checked });
                    showToast(`SMS notifications ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
                  }}
                />
                <span className="leading-snug">Send SMS and WhatsApp appointment reminders and digital prescriptions to patients</span>
              </label>

              <label className="flex items-start sm:items-center gap-3 text-sm text-text-main cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 sm:mt-0 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-border-strong cursor-pointer"
                  checked={formData.emailReports}
                  onChange={(e) => {
                    setFormData({ ...formData, emailReports: e.target.checked });
                    showToast(`Daily email summary ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
                  }}
                />
                <span className="leading-snug">Email daily financial summary and bed occupancy report every night</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sticky visible Footer Bar for Save Button */}
        <div className="sticky bottom-4 z-20 flex justify-end items-center p-3.5 sm:p-4 rounded-xl border border-border-subtle bg-bg-surface/95 backdrop-blur-md shadow-lg shadow-black/5">
          <button type="submit" className="btn btn-primary h-10 px-5 text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-xs">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
