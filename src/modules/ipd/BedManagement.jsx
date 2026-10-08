import React, { useState, useMemo } from 'react';
import {
  Bed,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  User,
  ShieldAlert,
  ArrowRightLeft,
  Calendar,
  Clock,
  LogOut,
  Plus,
  Activity,
  Wind,
  Check,
  Building,
  UserCheck,
  AlertTriangle,
  History,
  TrendingUp,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const BedManagement = () => {
  const {
    beds,
    admissions,
    bedTransfers,
    patients,
    wards,
    markBedCleanedAndAvailable,
    transferPatientBed,
    updateBedStatus,
    dischargePatientAndMarkCleaning,
    setActiveNav,
    showToast,
    currentUser
  } = useHospital();

  // Navigation tabs within Bed Board
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'table' | 'discharges' | 'transfers'
  const [selectedWardFilter, setSelectedWardFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Bed Inspector Modal / Drawer
  const [inspectorBed, setInspectorBed] = useState(null);

  // Bed Transfer Modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferState, setTransferState] = useState({
    patientId: '',
    fromBedNo: '',
    toBedNo: '',
    reason: 'Clinical step-down following stabilization'
  });

  // Housekeeper Sign-off Input
  const [housekeeperName, setHousekeeperName] = useState('Housekeeping Lead S. Rao');

  // Compute live occupancy metrics
  const totalBedsCount = beds.length;
  const occupiedCount = beds.filter((b) => b.status === 'occupied').length;
  const availableCount = beds.filter((b) => b.status === 'available').length;
  const cleaningCount = beds.filter((b) => b.status === 'cleaning').length;
  const reservedCount = beds.filter((b) => b.status === 'reserved').length;
  const maintenanceCount = beds.filter((b) => b.status === 'maintenance').length;
  const occupancyRate = totalBedsCount > 0 ? Math.round((occupiedCount / totalBedsCount) * 100) : 0;

  // Filter beds
  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      const matchWard = selectedWardFilter === 'ALL' || bed.wardId === selectedWardFilter || bed.wardName.includes(selectedWardFilter);
      const matchStatus = selectedStatusFilter === 'ALL' || bed.status.toLowerCase() === selectedStatusFilter.toLowerCase();
      const matchType = selectedTypeFilter === 'ALL' || (bed.bedType && bed.bedType.toLowerCase().includes(selectedTypeFilter.toLowerCase()));
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        bed.bedNo.toLowerCase().includes(q) ||
        (bed.roomNo && bed.roomNo.toLowerCase().includes(q)) ||
        (bed.wardName && bed.wardName.toLowerCase().includes(q)) ||
        (bed.patientName && bed.patientName.toLowerCase().includes(q));

      return matchWard && matchStatus && matchType && matchQuery;
    });
  }, [beds, selectedWardFilter, selectedStatusFilter, selectedTypeFilter, searchQuery]);

  // Expected Discharges Today List
  const expectedDischargesToday = useMemo(() => {
    return admissions.filter((adm) => {
      if (adm.status !== 'Admitted') return false;
      const exp = (adm.expectedDischarge || '').toLowerCase();
      return exp.includes('today') || exp.includes('2026-09-17');
    });
  }, [admissions]);

  // Handle Mark Cleaned
  const handleMarkCleaned = (bedNo) => {
    markBedCleanedAndAvailable(bedNo, housekeeperName);
    if (inspectorBed && inspectorBed.bedNo === bedNo) {
      setInspectorBed((prev) => ({ ...prev, status: 'available' }));
    }
  };

  // Open transfer modal for a specific bed
  const handleOpenTransfer = (bed) => {
    const matchedPatient = patients.find((p) => p.bedNo === bed.bedNo || p.name === bed.patientName) || { id: bed.patientId || 'PAT-TEMP' };
    const availableTargets = beds.filter((b) => b.status === 'available' && b.bedNo !== bed.bedNo);

    setTransferState({
      patientId: matchedPatient.id || bed.patientId,
      fromBedNo: bed.bedNo,
      toBedNo: availableTargets[0]?.bedNo || '',
      reason: 'Clinical step-down following stabilization'
    });
    setIsTransferModalOpen(true);
  };

  // Submit transfer
  const handleSubmitTransfer = (e) => {
    e.preventDefault();
    if (!transferState.toBedNo) {
      showToast('Please select an available destination bed', 'error');
      return;
    }
    transferPatientBed(
      transferState.patientId,
      transferState.fromBedNo,
      transferState.toBedNo,
      transferState.reason
    );
    setIsTransferModalOpen(false);
    setInspectorBed(null);
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'available':
        return <Badge variant="emerald" size="sm">Available</Badge>;
      case 'occupied':
        return <Badge variant="rose" size="sm">Occupied</Badge>;
      case 'cleaning':
        return <Badge variant="amber" size="sm">Cleaning (Sanitizing)</Badge>;
      case 'reserved':
        return <Badge variant="indigo" size="sm">Reserved</Badge>;
      case 'maintenance':
        return <Badge variant="slate" size="sm">Maintenance</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  // Status Border Helper
  const getCardBorderClass = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'available':
        return 'border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10';
      case 'occupied':
        return 'border-rose-500/40 hover:border-rose-500 bg-rose-500/5 dark:bg-rose-500/10';
      case 'cleaning':
        return 'border-amber-500/50 hover:border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 ring-1 ring-amber-500/30';
      case 'reserved':
        return 'border-indigo-500/40 hover:border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10';
      case 'maintenance':
        return 'border-slate-500/40 hover:border-slate-500 bg-slate-500/5 dark:bg-slate-500/10';
      default:
        return 'border-border-subtle bg-bg-surface';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Bed size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-text-main tracking-tight font-display">
                Real-Time IPD Bed Board & Housekeeping Matrix
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Live bed availability, automatic discharge cleaning turnover, and expected discharge planning.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            className="btn btn-secondary btn-sm rounded-xl h-10 px-4 text-xs font-semibold flex items-center gap-2"
            onClick={() => setActiveTab('discharges')}
          >
            <Calendar size={15} className="text-amber-500" />
            <span>Expected Discharges ({expectedDischargesToday.length})</span>
          </button>

          <button
            className="btn btn-primary btn-sm rounded-xl h-10 px-4 text-xs font-bold flex items-center gap-2"
            onClick={() => setActiveNav({ module: 'ipd', subModule: 'admissions' })}
          >
            <Plus size={16} /> Admit Patient
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards Strip (Occupancy %, Cleaning queue, Available, Occupied) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Beds */}
        <div className="glass-card p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Capacity</span>
          <div className="text-2xl font-extrabold text-text-main mt-1">{totalBedsCount} <span className="text-xs text-text-muted font-normal">Beds</span></div>
          <div className="text-[11px] text-text-dim mt-1">Across 3 hospital wings</div>
        </div>

        {/* Occupancy % */}
        <div className="glass-card p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Occupancy Rate</span>
            <TrendingUp size={14} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">{occupancyRate}%</div>
          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-bg-surface-elevated h-1.5 rounded-full overflow-hidden mt-1.5 border border-border-subtle">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyRate > 85 ? 'bg-rose-500' : occupancyRate > 65 ? 'bg-teal-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Available Beds */}
        <div
          onClick={() => setSelectedStatusFilter('available')}
          className="glass-card p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between cursor-pointer hover:border-emerald-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Available Now</span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{availableCount}</div>
          <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">Ready for intake</div>
        </div>

        {/* In Housekeeping / Cleaning */}
        <div
          onClick={() => setSelectedStatusFilter('cleaning')}
          className="glass-card p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/50 flex flex-col justify-between cursor-pointer hover:border-amber-500 transition-all animate-pulse"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Cleaning Queue</span>
            <RefreshCw size={15} className="text-amber-600 dark:text-amber-400 animate-spin" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">{cleaningCount}</div>
          <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold mt-1">Needs Housekeeper turnover</div>
        </div>

        {/* Occupied */}
        <div
          onClick={() => setSelectedStatusFilter('occupied')}
          className="glass-card p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/30 flex flex-col justify-between cursor-pointer hover:border-rose-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Occupied</span>
            <User size={15} className="text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{occupiedCount}</div>
          <div className="text-[11px] text-rose-700/80 dark:text-rose-400/80 mt-1">Active Inpatients</div>
        </div>

        {/* Reserved & Maintenance */}
        <div className="glass-card p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Reserved / Service</span>
          <div className="text-2xl font-extrabold text-text-main mt-1">
            {reservedCount} <span className="text-xs text-text-muted font-normal">/ {maintenanceCount} Maint</span>
          </div>
          <div className="text-[11px] text-text-dim mt-1">Scheduled procedures</div>
        </div>
      </div>

      {/* 3. Navigation View Tabs & Search Toolbar */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col gap-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Main 4 View Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('grid')}
              className={`btn btn-sm rounded-xl h-10 px-4 text-xs font-bold transition-all ${
                activeTab === 'grid' ? 'btn-primary shadow-xs' : 'btn-secondary'
              }`}
            >
              <Bed size={15} /> Color-Coded Ward Grid
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`btn btn-sm rounded-xl h-10 px-4 text-xs font-bold transition-all ${
                activeTab === 'table' ? 'btn-primary shadow-xs' : 'btn-secondary'
              }`}
            >
              <Building size={15} /> Beds Master Table
            </button>
            <button
              onClick={() => setActiveTab('discharges')}
              className={`btn btn-sm rounded-xl h-10 px-4 text-xs font-bold transition-all ${
                activeTab === 'discharges' ? 'btn-primary shadow-xs' : 'btn-secondary'
              }`}
            >
              <Calendar size={15} /> Expected Discharges Today
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300">
                {expectedDischargesToday.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('transfers')}
              className={`btn btn-sm rounded-xl h-10 px-4 text-xs font-bold transition-all ${
                activeTab === 'transfers' ? 'btn-primary shadow-xs' : 'btn-secondary'
              }`}
            >
              <History size={15} /> Bed Transfer History
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                {bedTransfers.length}
              </span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              placeholder="Search bed, room, patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input h-10 pl-10 text-xs sm:text-sm rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Controls (Ward, Status, Type, Legend) */}
        {(activeTab === 'grid' || activeTab === 'table') && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Ward Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-text-dim uppercase">Ward:</span>
                <select
                  className="form-select h-8 text-xs font-medium rounded-lg py-1 px-2.5"
                  value={selectedWardFilter}
                  onChange={(e) => setSelectedWardFilter(e.target.value)}
                >
                  <option value="ALL">All Wards (All Wings)</option>
                  <option value="WARD-ICU">Medical & Coronary ICU</option>
                  <option value="WARD-CARDIO">Cardiology Step-Down (4B)</option>
                  <option value="WARD-ORTHO">Orthopaedics & Joint Care (2A)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-text-dim uppercase">Status:</span>
                <select
                  className="form-select h-8 text-xs font-medium rounded-lg py-1 px-2.5"
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Bed Type Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-text-dim uppercase">Type:</span>
                <select
                  className="form-select h-8 text-xs font-medium rounded-lg py-1 px-2.5"
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Bed Types</option>
                  <option value="Ventilator">Ventilator ICU</option>
                  <option value="Dependency">High Dependency</option>
                  <option value="Semi-Private">Semi-Private</option>
                  <option value="Deluxe">Private Deluxe</option>
                  <option value="General">General Ward</option>
                </select>
              </div>

              {(selectedWardFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || selectedTypeFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSelectedWardFilter('ALL');
                    setSelectedStatusFilter('ALL');
                    setSelectedTypeFilter('ALL');
                  }}
                  className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline ml-1"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Color Legend */}
            <div className="flex items-center gap-3 text-xs text-text-muted font-medium flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" /> Available
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-2xs" /> Occupied
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs animate-pulse" /> Cleaning
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-2xs" /> Reserved
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-2xs" /> Maintenance
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. TAB 1: COLOR-CODED WARD GRID VIEW */}
      {activeTab === 'grid' && (
        <div className="flex flex-col gap-6">
          {/* Cleaning Notice Banner if any beds are currently in cleaning */}
          {cleaningCount > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <RefreshCw size={18} className="animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">
                    Housekeeping Action Required: {cleaningCount} Bed{cleaningCount > 1 ? 's' : ''} in Sanitization Turnover Queue
                  </h4>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300/80 mt-0.5">
                    Beds shift automatically to <strong>Cleaning</strong> on discharge. Housekeeping must sanitize and sign off to unlock them for admissions.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Housekeeper Name"
                  value={housekeeperName}
                  onChange={(e) => setHousekeeperName(e.target.value)}
                  className="form-input text-xs h-8 px-2.5 rounded-lg w-44 bg-bg-surface"
                />
              </div>
            </div>
          )}

          {/* Bed Cards Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBeds.map((bed) => {
              const borderClass = getCardBorderClass(bed.status);
              const isCleaning = bed.status === 'cleaning';
              const isOccupied = bed.status === 'occupied';
              const isAvailable = bed.status === 'available';

              return (
                <div
                  key={bed.bedNo}
                  className={`glass-card p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${borderClass} relative group shadow-2xs hover:shadow-md`}
                >
                  {/* Top: Bed Number, Ward, Status Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mono font-extrabold text-base text-text-main">
                            {bed.bedNo}
                          </span>
                          <span className="text-[11px] font-semibold text-text-muted bg-bg-surface-elevated px-2 py-0.5 rounded-md border border-border-subtle">
                            {bed.roomNo || 'Room N/A'}
                          </span>
                        </div>
                        <div className="text-[11px] text-text-muted font-medium mt-0.5">
                          {bed.wardName} • {bed.floor || '2nd Floor'}
                        </div>
                      </div>
                      {getStatusBadge(bed.status)}
                    </div>

                    {/* Bed Type */}
                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
                      {bed.bedType || 'General Inpatient Bed'}
                    </div>

                    {/* Middle: Patient or Status Details */}
                    {isOccupied ? (
                      <div className="p-2.5 rounded-xl bg-bg-surface border border-border-subtle flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-text-dim">Patient:</span>
                          <span className="font-bold text-text-main truncate max-w-[140px]">
                            {bed.patientName || 'Admitted Patient'}
                          </span>
                        </div>
                        {bed.attendingDoctor && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-text-dim">Doctor:</span>
                            <span className="text-text-muted truncate max-w-[140px] font-medium">{bed.attendingDoctor}</span>
                          </div>
                        )}
                        {bed.expectedDischarge && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-text-dim">Exp. Discharge:</span>
                            <span className="text-amber-600 font-bold truncate max-w-[130px]">{bed.expectedDischarge}</span>
                          </div>
                        )}
                      </div>
                    ) : isCleaning ? (
                      <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col gap-1 text-xs">
                        <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <RefreshCw size={12} className="animate-spin" /> Deep Cleaning in Progress
                        </div>
                        <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                          Started: {bed.cleaningStartedAt || 'Just now'}
                        </div>
                        <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                          Assigned: {bed.housekeeper || housekeeperName}
                        </div>
                      </div>
                    ) : isAvailable ? (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col gap-1">
                        <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Sanitized & Ready
                        </div>
                        <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                          Ready for immediate patient admission
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-bg-surface-elevated border border-border-subtle text-xs text-text-dim">
                        {bed.status === 'maintenance'
                          ? `Maintenance: ${bed.maintenanceReason || 'Equipment calibration'}`
                          : `Reserved: ${bed.patientName || 'Scheduled procedure'}`}
                      </div>
                    )}

                    {/* Equipment Capabilities */}
                    <div className="flex items-center gap-3 text-[11px] text-text-dim mt-2.5">
                      {bed.oxygen && (
                        <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1 font-semibold" title="O2 Port Available">
                          <Wind size={12} /> O2 Port
                        </span>
                      )}
                      {bed.ventilator && (
                        <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-semibold" title="Mechanical Ventilator">
                          <Activity size={12} /> Ventilator
                        </span>
                      )}
                      {bed.telemetry && bed.telemetry !== 'Off' && (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold" title="Continuous ECG / Telemetry">
                          Telemetry
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Contextual Quick Action Buttons */}
                  <div className="pt-3 border-t border-border-subtle/80 flex items-center gap-2">
                    {isCleaning && (
                      <button
                        onClick={() => handleMarkCleaned(bed.bedNo)}
                        className="btn btn-primary btn-sm w-full text-xs font-bold rounded-xl h-9 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check size={14} /> Mark Sanitized & Available
                      </button>
                    )}

                    {isAvailable && (
                      <button
                        onClick={() => setActiveNav({ module: 'ipd', subModule: 'admissions' })}
                        className="btn btn-primary btn-sm w-full text-xs font-bold rounded-xl h-9 flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Admit Patient
                      </button>
                    )}

                    {isOccupied && (
                      <div className="flex items-center gap-1.5 w-full">
                        <button
                          onClick={() => handleOpenTransfer(bed)}
                          className="btn btn-secondary btn-sm flex-1 text-[11px] font-bold rounded-xl h-8 flex items-center justify-center gap-1"
                          title="Transfer Patient to Another Bed"
                        >
                          <ArrowRightLeft size={12} /> Transfer
                        </button>
                        <button
                          onClick={() => setActiveNav({ module: 'ipd', subModule: 'discharge' })}
                          className="btn btn-outline btn-sm flex-1 text-[11px] font-bold rounded-xl h-8 flex items-center justify-center gap-1 text-rose-600 hover:bg-rose-500/10 border-rose-500/30"
                          title="Discharge Patient"
                        >
                          <LogOut size={12} /> Discharge
                        </button>
                      </div>
                    )}

                    {!isCleaning && !isAvailable && !isOccupied && (
                      <button
                        onClick={() => updateBedStatus(bed.bedNo, 'available')}
                        className="btn btn-secondary btn-sm w-full text-xs font-bold rounded-xl h-8 flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 size={13} /> Mark Available
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBeds.length === 0 && (
            <div className="text-center py-12 glass-card rounded-2xl bg-bg-surface border border-border-subtle">
              <Bed size={36} className="mx-auto text-text-dim mb-3" />
              <h3 className="text-base font-bold text-text-main">No beds match filter criteria</h3>
              <p className="text-xs text-text-muted mt-1">Try clearing filters or search terms.</p>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 2: BEDS MASTER TABLE (Ward, Room, Type, Status) */}
      {activeTab === 'table' && (
        <div className="table-container glass-card rounded-2xl border border-border-subtle overflow-hidden">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Bed No</th>
                <th>Ward Name</th>
                <th>Room No</th>
                <th>Bed Classification Type</th>
                <th>Status</th>
                <th>Current Occupant / Note</th>
                <th>Equipment Ports</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeds.map((bed) => (
                <tr key={bed.bedNo} className="hover:bg-bg-surface-elevated/60 transition-colors">
                  <td>
                    <span className="mono font-bold text-sm text-teal-600 dark:text-teal-400 bg-bg-surface px-2.5 py-1 rounded-lg border border-border-subtle">
                      {bed.bedNo}
                    </span>
                  </td>
                  <td className="font-semibold text-text-main text-xs">{bed.wardName}</td>
                  <td className="text-xs font-mono text-text-muted">{bed.roomNo || 'N/A'}</td>
                  <td className="text-xs font-medium text-text-main">{bed.bedType || 'General Bed'}</td>
                  <td>{getStatusBadge(bed.status)}</td>
                  <td className="text-xs">
                    {bed.status === 'occupied' ? (
                      <span className="font-bold text-text-main">{bed.patientName}</span>
                    ) : bed.status === 'cleaning' ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <RefreshCw size={12} className="animate-spin" /> In Cleaning ({bed.housekeeper || 'Housekeeping'})
                      </span>
                    ) : (
                      <span className="text-text-dim">— None (Ready) —</span>
                    )}
                  </td>
                  <td className="text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      {bed.oxygen && <span className="text-teal-600 font-semibold">O2</span>}
                      {bed.ventilator && <span className="text-indigo-600 font-semibold">Vent</span>}
                      {bed.telemetry && <span className="text-emerald-600 font-semibold">Telemetry</span>}
                      {!bed.oxygen && !bed.ventilator && !bed.telemetry && <span className="text-text-dim">Standard</span>}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {bed.status === 'cleaning' && (
                        <button
                          onClick={() => handleMarkCleaned(bed.bedNo)}
                          className="btn btn-primary btn-xs text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check size={12} /> Mark Clean
                        </button>
                      )}
                      {bed.status === 'occupied' && (
                        <button
                          onClick={() => handleOpenTransfer(bed)}
                          className="btn btn-secondary btn-xs text-xs font-semibold rounded-lg"
                        >
                          <ArrowRightLeft size={12} /> Transfer
                        </button>
                      )}
                      {bed.status === 'available' && (
                        <button
                          onClick={() => setActiveNav({ module: 'ipd', subModule: 'admissions' })}
                          className="btn btn-primary btn-xs text-xs font-bold rounded-lg"
                        >
                          <Plus size={12} /> Admit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. TAB 3: EXPECTED DISCHARGES TODAY (For Admission Planning) */}
      {activeTab === 'discharges' && (
        <div className="flex flex-col gap-5">
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between flex-wrap gap-4 text-teal-900 dark:text-teal-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Calendar size={22} />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold">
                  Admission Planning & Bed Forecast ({expectedDischargesToday.length} Expected Discharges Today)
                </h4>
                <p className="text-xs text-teal-800 dark:text-teal-300/90 mt-0.5">
                  Coordinate with ward nursing and housekeeping. Once discharged, beds shift to cleaning for rapid intake turnover.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveNav({ module: 'ipd', subModule: 'discharge' })}
              className="btn btn-primary btn-sm rounded-xl text-xs font-bold"
            >
              <LogOut size={14} /> Open Discharge Clearance Module
            </button>
          </div>

          <div className="table-container glass-card rounded-2xl border border-border-subtle overflow-hidden">
            <table className="medicore-table">
              <thead>
                <tr>
                  <th>Admission ID</th>
                  <th>Patient Name & UHID</th>
                  <th>Current Bed & Ward</th>
                  <th>Admit Time</th>
                  <th>Expected Discharge</th>
                  <th>Attending Doctor</th>
                  <th>Diagnosis / Clinical Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {expectedDischargesToday.map((adm) => (
                  <tr key={adm.admissionId} className="hover:bg-bg-surface-elevated/60 transition-colors">
                    <td>
                      <span className="mono font-bold text-xs text-teal-600 dark:text-teal-400 bg-bg-surface px-2 py-0.5 rounded border border-border-subtle">
                        {adm.admissionId}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-sm text-text-main">{adm.patientName}</div>
                      <div className="text-[11px] mono text-text-muted">{adm.uhid || 'UHID-2026-N/A'}</div>
                    </td>
                    <td>
                      <div className="font-bold text-xs text-text-main">Bed {adm.bedNo}</div>
                      <div className="text-[11px] text-text-muted">{adm.wardName} • {adm.roomNo}</div>
                    </td>
                    <td className="text-xs text-text-muted font-mono">{adm.admitTime}</td>
                    <td>
                      <span className="badge badge-amber font-bold text-xs">
                        {adm.expectedDischarge}
                      </span>
                    </td>
                    <td className="text-xs font-semibold text-text-main">{adm.attendingDoctor}</td>
                    <td className="text-xs text-text-muted max-w-[200px] truncate" title={adm.diagnosis}>
                      {adm.diagnosis}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          dischargePatientAndMarkCleaning(adm.patientId, adm.bedNo, {
                            summary: 'Scheduled discharge processed via Bed Planning Board'
                          });
                        }}
                        className="btn btn-primary btn-xs text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check size={12} /> Confirm Discharge & Clean Bed
                      </button>
                    </td>
                  </tr>
                ))}
                {expectedDischargesToday.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-text-muted text-xs">
                      No patients scheduled for discharge today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB 4: BED TRANSFER HISTORY AUDIT TRAIL */}
      {activeTab === 'transfers' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <History size={18} className="text-indigo-600 dark:text-indigo-400" />
                Inpatient Bed Transfer Audit Trail
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Complete record of patient ward transfers, clinical reasons, and authorizing staff.
              </p>
            </div>
          </div>

          <div className="table-container glass-card rounded-2xl border border-border-subtle overflow-hidden">
            <table className="medicore-table">
              <thead>
                <tr>
                  <th>Transfer Ref</th>
                  <th>Patient Name & UHID</th>
                  <th>Origin (From)</th>
                  <th>Destination (To)</th>
                  <th>Clinical Reason</th>
                  <th>Authorized Staff</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {bedTransfers.map((trf) => (
                  <tr key={trf.id} className="hover:bg-bg-surface-elevated/60 transition-colors">
                    <td>
                      <span className="mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-bg-surface px-2 py-0.5 rounded border border-border-subtle">
                        {trf.id}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-sm text-text-main">{trf.patientName}</div>
                      <div className="text-[11px] mono text-text-muted">{trf.uhid}</div>
                    </td>
                    <td>
                      <span className="font-bold text-xs text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {trf.fromBed}
                      </span>
                      <div className="text-[11px] text-text-muted mt-0.5">{trf.fromWard}</div>
                    </td>
                    <td>
                      <span className="font-bold text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {trf.toBed}
                      </span>
                      <div className="text-[11px] text-text-muted mt-0.5">{trf.toWard}</div>
                    </td>
                    <td className="text-xs text-text-main font-medium max-w-[240px]">
                      {trf.reason}
                    </td>
                    <td className="text-xs font-semibold text-text-muted">{trf.transferredBy}</td>
                    <td className="text-xs text-text-dim font-mono">{trf.timestamp}</td>
                  </tr>
                ))}
                {bedTransfers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-text-muted text-xs">
                      No bed transfers recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. MODAL: BED TRANSFER EXECUTION DIALOG */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="glass-card w-full max-w-lg p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <ArrowRightLeft size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-main">Transfer Inpatient Bed</h3>
                  <p className="text-xs text-text-muted">Origin bed automatically transitions to Cleaning</p>
                </div>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-text-dim hover:text-text-main p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitTransfer} className="flex flex-col gap-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main mb-1.5">
                  Inpatient Currently Admitted
                </label>
                <select
                  className="form-select h-10 text-xs sm:text-sm font-semibold rounded-xl"
                  value={transferState.patientId}
                  onChange={(e) => {
                    const pat = patients.find((p) => p.id === e.target.value);
                    setTransferState({
                      ...transferState,
                      patientId: e.target.value,
                      fromBedNo: pat?.bedNo || transferState.fromBedNo
                    });
                  }}
                >
                  {beds
                    .filter((b) => b.status === 'occupied')
                    .map((b) => (
                      <option key={b.bedNo} value={b.patientId || b.bedNo}>
                        {b.patientName} (Bed {b.bedNo} • {b.wardName})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group mb-0">
                  <label className="form-label text-xs font-bold text-text-main mb-1.5">
                    Source Bed (Origin)
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-input h-10 text-xs sm:text-sm font-mono font-bold rounded-xl bg-bg-surface-elevated"
                    value={transferState.fromBedNo}
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label text-xs font-bold text-text-main mb-1.5">
                    Destination Bed (Available Only) *
                  </label>
                  <select
                    className="form-select h-10 text-xs sm:text-sm font-semibold rounded-xl"
                    value={transferState.toBedNo}
                    onChange={(e) => setTransferState({ ...transferState, toBedNo: e.target.value })}
                    required
                  >
                    <option value="">Select Target Bed...</option>
                    {beds
                      .filter((b) => b.status === 'available')
                      .map((b) => (
                        <option key={b.bedNo} value={b.bedNo}>
                          {b.bedNo} ({b.bedType} • {b.wardName})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs font-bold text-text-main mb-1.5">
                  Clinical Transfer Justification / Reason *
                </label>
                <select
                  className="form-select h-10 text-xs sm:text-sm font-medium rounded-xl mb-2"
                  value={transferState.reason}
                  onChange={(e) => setTransferState({ ...transferState, reason: e.target.value })}
                >
                  <option value="Clinical step-down following stabilization">Clinical step-down following stabilization</option>
                  <option value="Escalation to Intensive Care / Ventilator support">Escalation to Intensive Care / Ventilator support</option>
                  <option value="Patient / Family request for Private Deluxe Room">Patient / Family request for Private Deluxe Room</option>
                  <option value="Infection isolation and barrier nursing protocol">Infection isolation and barrier nursing protocol</option>
                  <option value="Post-operative surgical ward transition">Post-operative surgical ward transition</option>
                </select>
                <input
                  type="text"
                  className="form-input h-10 text-xs sm:text-sm rounded-xl"
                  placeholder="Additional clinical handover notes..."
                  value={transferState.reason}
                  onChange={(e) => setTransferState({ ...transferState, reason: e.target.value })}
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
                <strong>Protocol Note:</strong> Origin Bed <strong>{transferState.fromBedNo}</strong> will automatically shift to <strong>Cleaning</strong> queue. Destination Bed <strong>{transferState.toBedNo || '...'}</strong> will become <strong>Occupied</strong>.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="btn btn-secondary btn-sm rounded-xl h-10 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm rounded-xl h-10 px-5 text-xs font-bold flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  <ArrowRightLeft size={14} /> Execute Bed Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
