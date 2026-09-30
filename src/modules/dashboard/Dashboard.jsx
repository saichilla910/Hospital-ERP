import React, { useState } from 'react';
import {
  Users,
  Bed,
  ShieldAlert,
  DollarSign,
  Calendar,
  Clock,
  ArrowUpRight,
  UserPlus,
  Stethoscope,
  ReceiptText,
  Search,
  CheckCircle2,
  Bell,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Activity,
  HeartPulse,
  ShieldCheck,
  Building,
  Layers,
  Phone,
  UserCheck,
  ChevronRight,
  Star,
  Briefcase,
  Scissors,
  MapPin,
  Coins,
  CalendarClock,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { DoctorCard } from '../../components/common/DoctorCard';
import { DashboardCharts } from '../../components/dashboard/DashboardCharts';
import { DoctorWelcomeBanner } from '../../components/dashboard/DoctorWelcomeBanner';

export const Dashboard = () => {
  const {
    executiveStats,
    emergencyCases,
    tokenQueue,
    wards,
    patients,
    doctors,
    opdAppointments,
    setActiveNav,
    setSelectedPatient,
    showToast,
    openModal,
    userRole,
    authenticatedPatient,
    setPatientOnboardingModalOpen,
    loginAsStaff
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [patientFilterStatus, setPatientFilterStatus] = useState('All'); // 'All' | 'Checked-In' | 'In-Consult' | 'Waiting' | 'Completed'

  const totalOccupiedBeds = wards.reduce((acc, w) => acc + w.occupiedBeds, 0);
  const totalBedsCount = wards.reduce((acc, w) => acc + w.totalBeds, 0);
  const availableBedsCount = totalBedsCount - totalOccupiedBeds;

  const activePatient = authenticatedPatient || patients[0];
  const availableDoctors = doctors.filter((d) => d.availableNow);

  const filteredAppointments = opdAppointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      patientFilterStatus === 'All' || apt.status === patientFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const checkedInCount = opdAppointments.filter((a) => a.status === 'Checked-In').length;
  const inConsultCount = opdAppointments.filter((a) => a.status === 'In-Consult').length;
  const waitingCount = opdAppointments.filter((a) => a.status === 'Waiting').length;
  const completedCount = opdAppointments.filter((a) => a.status === 'Completed').length;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full">
      {/* 1. Welcoming Hero Command Banner */}
      {userRole === 'patient' && authenticatedPatient ? (
        <div
          className="relative overflow-hidden rounded-2xl min-h-[140px] p-6 sm:p-7 lg:px-9 flex justify-between items-center flex-wrap gap-5 min-w-0 transition-all duration-300"
          style={{
            background: 'var(--banner-bg, linear-gradient(135deg, rgba(240, 253, 250, 0.95) 0%, rgba(236, 254, 255, 0.9) 45%, rgba(241, 245, 249, 0.95) 100%))',
            border: '1.5px solid rgba(13, 148, 136, 0.35)',
            boxShadow: '0 12px 36px -6px rgba(13, 148, 136, 0.16), 0 0 0 1px rgba(13, 148, 136, 0.08)'
          }}
        >
          {/* Top Edge Luminous Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500" />
          <div className="absolute -right-12 -top-12 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3.5 flex-wrap min-w-0 flex-1 relative z-1">
            <div className="relative shrink-0">
              <div className="w-13 h-13 rounded-2xl p-[2px] bg-gradient-to-tr from-teal-500 via-cyan-400 to-indigo-500 shadow-md">
                <img
                  src={authenticatedPatient.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={authenticatedPatient.name}
                  className="w-full h-full rounded-[14px] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-1.5">
                  <span>Welcome,</span>
                  <span className="bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-900 dark:from-teal-300 dark:via-cyan-300 dark:to-emerald-300 bg-clip-text text-transparent">
                    {authenticatedPatient.name}
                  </span>
                  <span>👋</span>
                </h2>
                <span className="badge badge-teal text-xs py-0.5 px-2.5 font-bold shrink-0 whitespace-nowrap bg-teal-500/15 text-teal-800 dark:text-teal-200 border border-teal-500/30">
                  Patient Portal Active
                </span>
                <span className="mono badge text-xs font-bold shrink-0 whitespace-nowrap bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                  {authenticatedPatient.mrn}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1.5 flex items-center gap-2 flex-wrap min-w-0">
                <span className="truncate">Age: <strong className="text-text-main font-bold">{authenticatedPatient.age} yrs</strong> ({authenticatedPatient.gender})</span>
                <span className="text-text-dim shrink-0">•</span>
                <span className="shrink-0">Blood: <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{authenticatedPatient.bloodGroup}</strong></span>
                <span className="text-text-dim shrink-0">•</span>
                <span className="truncate">Attending: <strong className="text-teal-600 dark:text-teal-400 font-bold">{authenticatedPatient.attendingDoctor}</strong></span>
                <span className="text-text-dim shrink-0">•</span>
                <span className="truncate">Insurance: <strong className="text-text-main font-semibold">{authenticatedPatient.insurance?.provider || 'Star Health TPA'}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0 relative z-1">
            <button
              className="h-9 px-3.5 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl shadow-xs hover:shadow-md flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer transition-all"
              onClick={() => {
                setSelectedPatient(authenticatedPatient);
                setActiveNav({ module: 'patientManagement', subModule: 'profile' });
              }}
            >
              <HeartPulse size={14} /> My Health Record
            </button>
            <button
              className="btn btn-secondary btn-sm h-9 px-3.5 text-xs font-bold shrink-0 whitespace-nowrap"
              onClick={() => setPatientOnboardingModalOpen(true)}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-outline btn-sm h-9 px-3 text-xs font-bold shrink-0 whitespace-nowrap"
              onClick={loginAsStaff}
              title="Switch to Staff Administration Mode"
            >
              Staff Mode
            </button>
          </div>
        </div>
      ) : (
        <DoctorWelcomeBanner
          stats={{
            vacantBeds: availableBedsCount,
            opdInflow: opdAppointments.length,
            erTraumaBays: emergencyCases.length
          }}
          onNewPatientClick={() => setActiveNav({ module: 'patientManagement', subModule: 'registration' })}
          onBedClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
          onOpdClick={() => setActiveNav({ module: 'opd', subModule: 'appointments' })}
          onErClick={() => setActiveNav({ module: 'emergency', subModule: 'triage' })}
        />
      )}

      {/* 2. Four Sleek One-Click Quick Action Cards */}
      <div className="responsive-grid-4">
        {/* Action 1: Register Patient */}
        <div
          onClick={() => setActiveNav({ module: 'patientManagement', subModule: 'registration' })}
          className="glass-card p-4 sm:p-5 flex items-center justify-between gap-3.5 cursor-pointer rounded-2xl bg-bg-surface border border-border-subtle hover:border-teal-500/40 hover:shadow-xs hover:bg-bg-surface-elevated transition-all group min-h-[96px] select-none min-w-0"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:scale-105 transition-transform shadow-2xs">
              <UserPlus size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-text-main line-clamp-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                New Patient Intake
              </div>
              <div className="text-xs text-text-muted mt-1 truncate font-normal">
                12 registered today • OPD/IPD
              </div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-dim group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all shrink-0">
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Action 2: Doctor Consultation */}
        <div
          onClick={() => setActiveNav({ module: 'opd', subModule: 'consultation' })}
          className="glass-card p-4 sm:p-5 flex items-center justify-between gap-3.5 cursor-pointer rounded-2xl bg-bg-surface border border-border-subtle hover:border-blue-500/40 hover:shadow-xs hover:bg-bg-surface-elevated transition-all group min-h-[96px] select-none min-w-0"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:scale-105 transition-transform shadow-2xs">
              <Stethoscope size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-text-main line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Doctor Consult & e-Rx
              </div>
              <div className="text-xs text-text-muted mt-1 truncate font-normal">
                {opdAppointments.length} in live queue • Clinical Rx
              </div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-dim group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shrink-0">
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Action 3: Bed Management */}
        <div
          onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
          className="glass-card p-4 sm:p-5 flex items-center justify-between gap-3.5 cursor-pointer rounded-2xl bg-bg-surface border border-border-subtle hover:border-cyan-500/40 hover:shadow-xs hover:bg-bg-surface-elevated transition-all group min-h-[96px] select-none min-w-0"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:scale-105 transition-transform shadow-2xs">
              <Bed size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-text-main line-clamp-2 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Ward Beds ({availableBedsCount} Free)
              </div>
              <div className="text-xs text-text-muted mt-1 truncate font-normal">
                {totalOccupiedBeds}/{totalBedsCount} occupied • 6 wings
              </div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-dim group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 transition-all shrink-0">
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Action 4: Billing & Quick Invoicing */}
        <div
          onClick={() => setActiveNav({ module: 'billing', subModule: 'opdBilling' })}
          className="glass-card p-4 sm:p-5 flex items-center justify-between gap-3.5 cursor-pointer rounded-2xl bg-bg-surface border border-border-subtle hover:border-emerald-500/40 hover:shadow-xs hover:bg-bg-surface-elevated transition-all group min-h-[96px] select-none min-w-0"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-105 transition-transform shadow-2xs">
              <ReceiptText size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-text-main line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Billing & Invoices
              </div>
              <div className="text-xs text-text-muted mt-1 truncate font-normal">
                {executiveStats.revenueToday} collected today
              </div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-dim group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shrink-0">
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* 2.5 Available Doctors for Immediate Patient Consultation Strip */}
      <div className="glass-card p-5 sm:p-6 flex flex-col gap-4 rounded-xl bg-bg-surface border border-border-subtle shadow-2xs overflow-hidden min-w-0">
        <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border-subtle pb-3.5 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              <span className="pulse-indicator green shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-text-main tracking-tight truncate">
                Specialist Doctors Available for Consult Now
              </h3>
              <span className="badge badge-emerald text-xs font-bold py-0.5 px-2.5 shrink-0 whitespace-nowrap">
                {availableDoctors.length} On-Duty Specialists
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5 truncate font-medium">
              Patients and staff can check live slots, clinical track record, and start instant consultations.
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm h-9 px-3.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            onClick={() => setActiveNav({ module: 'doctors', subModule: null })}
          >
            <span>View All Doctors ({doctors.length})</span>
            <ArrowUpRight size={14} className="text-teal-600" />
          </button>
        </div>

        {/* 3 Featured Doctor Cards Grid - 3-column spacious UI */}
        <div className="dashboard-doc-grid">
          {(availableDoctors.length > 0 ? availableDoctors : doctors).slice(0, 3).map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
            />
          ))}
        </div>
      </div>

      {/* 3. Four Executive KPI Summary Cards */}
      <div className="responsive-grid-4">
        <StatCard
          title="Outpatients Today"
          value={executiveStats.opdFootfall}
          subtitle="Checked in for doctor consult"
          icon={Users}
          color="teal"
          trend="+14.2%"
          onClick={() => setActiveNav({ module: 'opd', subModule: 'appointments' })}
        />
        <StatCard
          title="Inpatient Beds"
          value={`${totalOccupiedBeds} / ${totalBedsCount}`}
          subtitle={`${availableBedsCount} vacant beds ready`}
          icon={Bed}
          color="cyan"
          trend={`${Math.round((totalOccupiedBeds / totalBedsCount) * 100)}% Occupancy`}
          onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
        />
        <StatCard
          title="Emergency Cases"
          value={emergencyCases.length}
          subtitle="Active in ER trauma bays"
          icon={ShieldAlert}
          color="rose"
          trend="1 Critical"
          onClick={() => setActiveNav({ module: 'emergency', subModule: 'triage' })}
        />
        <StatCard
          title="Today's Collections"
          value={executiveStats.revenueToday}
          subtitle="OPD, IPD & Pharmacy POS"
          icon={DollarSign}
          color="emerald"
          trend="+8.5% vs target"
          onClick={() => setActiveNav({ module: 'billing', subModule: 'opdBilling' })}
        />
      </div>

      {/* 4. Visual Hospital React Analytics Charts */}
      <DashboardCharts />

      {/* 5. Main Operational Workspace: Today's Patient Consultations & Ward / ER Snapshot */}
      <div className="responsive-grid-split min-w-0">
        {/* Left Column: Today's OPD Schedule & Appointments */}
        <div className="glass-card flex flex-col gap-5 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs p-5 sm:p-6 overflow-hidden min-w-0">
          {/* Card Header & Search */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-subtle pb-4 min-w-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-text-main tracking-tight truncate">
                  Today's Patient Consultations
                </h3>
                <span className="badge badge-teal text-xs font-bold py-1 px-3 shrink-0 whitespace-nowrap flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  {filteredAppointments.length} In Queue
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1 truncate font-medium">
                Click on any patient row to open clinical notes, examination, and e-prescription.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-[260px] shrink-0 flex items-center">
              <Search size={16} className="text-teal-600 dark:text-teal-400 absolute left-3.5 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search patient, token, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input form-search-input h-10 pr-9 text-xs sm:text-sm rounded-xl w-full bg-bg-surface-elevated border border-border-subtle focus:border-teal-500/60 focus:bg-bg-surface transition-all"
                style={{ paddingLeft: '40px' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-text-dim hover:text-text-main p-1 transition-colors"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Status Tabs / Pill Navbar */}
          <div className="dash-filter-nav no-scrollbar">
            {[
              { id: 'All', label: 'All', count: opdAppointments.length },
              { id: 'Checked-In', label: 'Checked-In', count: checkedInCount },
              { id: 'In-Consult', label: 'In-Consult', count: inConsultCount },
              { id: 'Waiting', label: 'Waiting', count: waitingCount },
              { id: 'Completed', label: 'Completed', count: completedCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPatientFilterStatus(tab.id)}
                className={`dash-filter-pill ${patientFilterStatus === tab.id ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
                <span className="dash-filter-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* List of Patients (Perfect Column Alignment) */}
          <div className="flex flex-col gap-2.5 min-w-0">
            {filteredAppointments.length === 0 ? (
              <div className="p-10 text-center bg-bg-surface-elevated rounded-2xl border border-border-subtle text-text-dim text-xs sm:text-sm font-medium flex flex-col items-center justify-center gap-2">
                <Users size={28} className="text-text-dim/60 mb-1" />
                <span>No patient consultations found matching "{searchQuery}".</span>
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const matchedPatient = patients.find((p) => p.id === apt.patientId) || patients[0];
                return (
                  <div
                    key={apt.id}
                    className="dash-consult-row group"
                    onClick={() => {
                      setSelectedPatient(matchedPatient);
                      setActiveNav({ module: 'opd', subModule: 'consultation' });
                    }}
                    title={`Open consultation file for ${apt.patientName}`}
                  >
                    {/* Col 1: Token */}
                    <div className="font-mono font-bold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-1.5 px-2.5 rounded-lg border border-teal-200 dark:border-teal-800/60 text-center shrink-0 leading-none">
                      {apt.token}
                    </div>

                    {/* Col 2: Patient & Doctor Info */}
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-sm font-semibold text-text-main group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                          {apt.patientName}
                        </span>
                        <span className="text-xs text-text-dim shrink-0">
                          ({matchedPatient?.age || 34}y, {matchedPatient?.gender || 'M'})
                        </span>
                      </div>
                      <div className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5 truncate font-medium">
                        <span className="text-text-main font-medium truncate">{apt.doctorName}</span>
                        <span className="badge badge-teal text-[10px] py-0 px-1.5 leading-tight shrink-0">{apt.department}</span>
                        {apt.reason && (
                          <>
                            <span className="text-text-dim shrink-0">•</span>
                            <span className="text-text-muted truncate text-[11px]">{apt.reason}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Col 3: Status Badge */}
                    <div className="dash-consult-status-col flex justify-center shrink-0">
                      <Badge
                        variant={
                          apt.status === 'In-Consult' ? 'teal' : apt.status === 'Completed' ? 'emerald' : apt.status === 'Checked-In' ? 'amber' : 'gray'
                        }
                        dot={apt.status === 'In-Consult' || apt.status === 'Checked-In'}
                        className="w-full justify-center text-xs"
                      >
                        {apt.status}
                      </Badge>
                    </div>

                    {/* Col 4: Time */}
                    <div className="dash-consult-time-col flex items-center justify-end font-mono text-xs text-text-main shrink-0 gap-1.5">
                      <Clock size={12} className="text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{apt.time.split(' ')[0]} {apt.time.split(' ')[1]}</span>
                    </div>

                    {/* Col 5: Arrow Button */}
                    <div className="w-8 h-8 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center text-text-dim group-hover:text-teal-600 group-hover:border-teal-500/40 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 transition-all shrink-0">
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-border-subtle flex-wrap gap-3">
            <span className="text-xs text-text-muted font-medium">
              Showing <strong className="text-text-main font-bold">{filteredAppointments.length}</strong> of {opdAppointments.length} patient appointments today
            </span>
            <button
              className="btn btn-secondary btn-sm h-9 px-3.5 text-xs font-semibold flex items-center gap-2 rounded-lg shrink-0 hover:border-teal-500/50 hover:bg-bg-surface-elevated transition-all"
              onClick={() => setActiveNav({ module: 'opd', subModule: 'appointments' })}
            >
              <span>View Full Appointments Calendar</span>
              <ArrowUpRight size={14} className="text-teal-600 dark:text-teal-400" />
            </button>
          </div>
        </div>

        {/* Right Column: Ward Bed Availability & Active ER Trauma Matrix */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Ward Bed Status */}
          <div className="glass-card flex flex-col gap-4 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs p-5 sm:p-6 overflow-hidden min-w-0">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3.5 min-w-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-text-main truncate">
                  Ward Bed Availability
                </h3>
                <p className="text-xs text-text-muted mt-0.5 truncate font-medium">
                  Live occupancy across all hospital wings
                </p>
              </div>
              <button
                className="btn btn-secondary h-9 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap hover:border-teal-500/40"
                onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
              >
                <span>Bed Map</span>
                <ArrowUpRight size={13} className="text-teal-600" />
              </button>
            </div>

            <div className="flex flex-col gap-3 min-w-0">
              {wards.map((ward) => {
                const freeBeds = ward.totalBeds - ward.occupiedBeds;
                const occupancyPct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);

                return (
                  <div
                    key={ward.id}
                    className="dash-ward-card"
                    onClick={() => setActiveNav({ module: 'ipd', subModule: 'beds' })}
                  >
                    <div className="flex justify-between items-center mb-2 gap-2 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-text-main truncate min-w-0 flex-1">
                        {ward.name}
                      </span>
                      <span
                        className={`text-xs font-semibold shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-md ${
                          freeBeds > 2
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {freeBeds} beds free ({ward.occupiedBeds}/{ward.totalBeds})
                      </span>
                    </div>

                    {/* Progress Bar (8px height, rounded) */}
                    <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden border border-border-subtle">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 70 ? 'bg-amber-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Emergency Patients */}
          <div className="glass-card flex flex-col gap-4 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs p-5 sm:p-6 overflow-hidden min-w-0">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3.5 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="pulse-indicator red shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-text-main truncate">
                    Active Emergency Bays
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 truncate font-medium">
                    Critical trauma resuscitations in progress
                  </p>
                </div>
              </div>
              <button
                className="btn btn-secondary h-9 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap hover:border-rose-500/40 text-rose-600 dark:text-rose-400"
                onClick={() => setActiveNav({ module: 'emergency', subModule: 'triage' })}
              >
                <span>ER Triage</span>
                <ArrowUpRight size={13} className="text-rose-600" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 min-w-0">
              {emergencyCases.map((er) => (
                <div
                  key={er.id}
                  className="dash-er-row group"
                  onClick={() => setActiveNav({ module: 'emergency', subModule: 'triage' })}
                  title={`View emergency case ${er.caseNo}`}
                >
                  <div className="min-w-0 flex-1 pr-1">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-text-main truncate group-hover:text-rose-600 transition-colors">
                        {er.patientName}
                      </span>
                      <Badge variant={er.triageColor} size="sm">
                        {er.triageLevel.split('-')[0]}
                      </Badge>
                    </div>
                    <div className="text-xs text-text-muted mt-1 truncate font-medium min-w-0">
                      <strong className="text-teal-600 dark:text-teal-400">{er.assignedBay}</strong> • <span className="text-text-dim">{er.arrivalTime}</span> • <span className="text-text-muted">{er.chiefComplaint}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center text-text-dim group-hover:text-rose-600 group-hover:border-rose-500/30 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/40 transition-all shrink-0">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
