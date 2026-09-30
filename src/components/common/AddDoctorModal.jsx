import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  Building2,
  Award,
  Clock,
  Coins,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  User,
  Phone,
  Mail,
  FileText,
  Activity,
  Briefcase
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

const DEFAULT_DOCTOR_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594824813589-322197603c40?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80'
];

export const AddDoctorModal = ({ isOpen, onClose, onDoctorAdded }) => {
  const { addDoctor, showToast } = useHospital();

  const [formData, setFormData] = useState({
    name: '',
    department: 'Cardiology',
    specialty: '',
    qualifications: '',
    licenseNo: '',
    experience: '12',
    fee: '800',
    room: '304',
    timing: '09:00 AM – 01:00 PM & 04:00 PM – 07:30 PM',
    days: 'Mon - Sat',
    phone: '+91 98480 22334',
    email: '',
    surgeries: '1200',
    about: '',
    photo: DEFAULT_DOCTOR_AVATARS[0],
    availableNow: true
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Please enter the doctor name.', 'error');
      return;
    }

    if (!formData.specialty.trim()) {
      showToast('Please enter doctor specialty.', 'error');
      return;
    }

    const newDoc = addDoctor({
      name: formData.name.trim(),
      department: formData.department,
      specialty: formData.specialty.trim(),
      qualifications: formData.qualifications.trim() || 'MBBS, MD',
      licenseNo: formData.licenseNo.trim() || `NMC-TG-${Math.floor(1000 + Math.random() * 9000)}`,
      experience: formData.experience,
      fee: formData.fee,
      room: formData.room,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/[^a-z]/g, '')}@medicorehospital.org`,
      totalSurgeries: formData.surgeries,
      timing: formData.timing,
      days: formData.days,
      about: formData.about || `Senior consultant in ${formData.department} specializing in advanced diagnostic care and clinical treatment.`,
      photo: formData.photo,
      availableNow: formData.availableNow
    });

    if (onDoctorAdded) {
      onDoctorAdded(newDoc);
    }

    onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-slate-950/80 backdrop-blur-[14px] z-[1060] flex items-center justify-center p-4 sm:p-7 md:p-9 lg:p-11 animate-[fadeIn_0.15s_ease]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-frame w-full max-w-3xl max-h-[90vh] bg-bg-surface border border-border-subtle rounded-3xl shadow-[0_32px_75px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-[slideUp_0.22s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Header Strip */}
        <div className="modal-header py-5 sm:py-6 px-6 sm:px-10 bg-bg-surface-elevated border-b border-border-subtle flex items-center justify-between gap-4 shrink-0 relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
              <Stethoscope size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-text-main m-0 tracking-tight font-display">
                  Onboard Specialist Doctor
                </h3>
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 py-0.5 px-2.5 rounded-lg border border-teal-200 dark:border-teal-800/50 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  NMC & NABH Verified
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5 font-medium">
                Register clinical credentials, consultation fees, clinic room, and OPD hours.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-main hover:border-border-strong hover:bg-bg-surface-hover transition-all cursor-pointer shrink-0 shadow-xs"
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="modal-body px-6 sm:px-10 py-6 sm:py-8 overflow-y-auto flex-1 flex flex-col gap-6">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2.5">
              Doctor Portrait / Profile Photo
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {DEFAULT_DOCTOR_AVATARS.map((imgUrl, idx) => {
                const isSelected = formData.photo === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChange('photo', imgUrl)}
                    className={`relative rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-600 shadow-md ring-2 ring-teal-500/30 scale-105'
                        : 'border-border-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Avatar ${idx + 1}`} className="w-14 h-14 object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-teal-600/20 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 1: Doctor Identity */}
          <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle flex flex-col gap-4 shadow-xs">
            <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} />
              <span>1. Doctor Identity & Clinical Specialization</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajeshwari Kumar"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Clinical Department *</label>
                <select
                  className="form-select h-10 text-xs sm:text-sm"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopaedics">Orthopaedics</option>
                  <option value="Paediatrics">Paediatrics</option>
                  <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                  <option value="Emergency">Emergency Medicine</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Laboratory">Laboratory & Pathology</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Nephrology">Nephrology</option>
                </select>
              </div>

              <div className="form-group mb-0 sm:col-span-2">
                <label className="form-label text-xs font-bold text-text-main">Specialty Title / Sub-specialty *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Interventional Cardiologist & Electrophysiologist"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.specialty}
                  onChange={(e) => handleChange('specialty', e.target.value)}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Medical Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (Medicine), DM (Cardiology), FESC"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.qualifications}
                  onChange={(e) => handleChange('qualifications', e.target.value)}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Years of Experience</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  placeholder="e.g. 14"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinic & OPD Details */}
          <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle flex flex-col gap-4 shadow-xs">
            <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} />
              <span>2. OPD Clinic Hours, Room & Fee Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Consultation Fee (₹) *</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  required
                  placeholder="e.g. 850"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.fee}
                  onChange={(e) => handleChange('fee', e.target.value)}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Clinic Room No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 304 (Wing B)"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.room}
                  onChange={(e) => handleChange('room', e.target.value)}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Surgeries / Procedures Logged</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.surgeries}
                  onChange={(e) => handleChange('surgeries', e.target.value)}
                />
              </div>

              <div className="form-group mb-0 sm:col-span-2">
                <label className="form-label text-xs font-bold text-text-main">OPD Clinic Timings</label>
                <input
                  type="text"
                  placeholder="e.g. 09:00 AM – 01:00 PM & 04:00 PM – 07:30 PM"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.timing}
                  onChange={(e) => handleChange('timing', e.target.value)}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Working Days</label>
                <input
                  type="text"
                  placeholder="e.g. Mon - Sat"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.days}
                  onChange={(e) => handleChange('days', e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-text-main">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  checked={formData.availableNow}
                  onChange={(e) => handleChange('availableNow', e.target.checked)}
                />
                <span>Available for Immediate Consultations Now (On-Duty)</span>
              </label>
            </div>
          </div>

          {/* Section 3: Professional Bio & Contacts */}
          <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle flex flex-col gap-4 shadow-xs">
            <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} />
              <span>3. Clinical Track Record & Contact Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+91 98480 22334"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main">Hospital Official Email</label>
                <input
                  type="email"
                  placeholder="doctor@medicorehospital.org"
                  className="form-input h-10 text-xs sm:text-sm"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div className="form-group mb-0 sm:col-span-2">
                <label className="form-label text-xs font-bold text-text-main">Professional Bio / Clinical Notes</label>
                <textarea
                  rows="2"
                  placeholder="Brief synopsis of surgical expertise, clinical awards, international fellowships..."
                  className="form-input text-xs sm:text-sm py-2"
                  value={formData.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
            <button
              type="button"
              className="btn btn-secondary h-10 px-5 rounded-xl text-xs font-bold hover:bg-bg-surface-elevated transition-all"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary h-10 px-6 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-teal-600/20 hover:shadow-lg transition-all"
            >
              <CheckCircle2 size={16} strokeWidth={2.3} />
              <span>Register & Onboard Specialist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
