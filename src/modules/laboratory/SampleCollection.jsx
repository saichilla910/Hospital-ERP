import React, { useState, useMemo } from 'react';
import {
  QrCode,
  CheckCircle2,
  Clock,
  Droplet,
  Printer,
  Sparkles,
  FlaskConical,
  Info,
  X,
  Search,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const SampleCollection = () => {
  const { labOrders, showToast } = useHospital();
  const [selectedTube, setSelectedTube] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTubeType, setFilterTubeType] = useState('all');

  const vacutainers = [
    {
      id: 'purple',
      accentColor: '#9333ea',
      barColor: '#a855f7',
      badgeColor: 'border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
      pillBg: 'bg-purple-100/80 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200',
      name: 'Purple Top (EDTA Tube)',
      tubeType: 'Purple (EDTA)',
      additive: 'K2 / K3 EDTA',
      use: 'Complete Blood Count (CBC), HbA1c, ESR, Blood Film',
      drawOrder: 'Order #4 (Hematology)',
      inversions: '8 – 10 gentle inversions',
      volume: '3.0 – 4.0 mL',
      specNote: 'Prevents clotting by binding calcium. Mix thoroughly immediately after phlebotomy.'
    },
    {
      id: 'red',
      accentColor: '#e11d48',
      barColor: '#f43f5e',
      badgeColor: 'border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      pillBg: 'bg-rose-100/80 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200',
      name: 'Red / Gold Top (Serum SST)',
      tubeType: 'Serum',
      additive: 'Clot Activator & Gel Separator',
      use: 'Cardiac Troponin, Lipid Profile, Liver (LFT) & Kidney (KFT)',
      drawOrder: 'Order #2 (Biochemistry)',
      inversions: '5 inversions (Allow 30m clot)',
      volume: '5.0 mL',
      specNote: 'Allow blood to clot upright for 30 minutes prior to high-speed centrifugation.'
    },
    {
      id: 'blue',
      accentColor: '#2563eb',
      barColor: '#3b82f6',
      badgeColor: 'border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
      pillBg: 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200',
      name: 'Blue Top (Citrate Tube)',
      tubeType: 'Citrate',
      additive: '3.2% Buffered Sodium Citrate',
      use: 'Coagulation Profiles, PT/INR, aPTT, D-Dimer, Fibrinogen',
      drawOrder: 'Order #1 (Coagulation)',
      inversions: '3 – 4 gentle inversions',
      volume: '2.7 – 4.5 mL',
      specNote: 'Must be filled exactly to the indicator mark for accurate 9:1 blood-to-anticoagulant ratio.'
    },
    {
      id: 'green',
      accentColor: '#059669',
      barColor: '#10b981',
      badgeColor: 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      pillBg: 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200',
      name: 'Green Top (Heparin Tube)',
      additive: 'Sodium / Lithium Heparin',
      use: 'Electrolytes, Blood Gas (ABG), Plasma Biochemistry, Ammonia',
      drawOrder: 'Order #3 (Stat Chemistry)',
      inversions: '8 – 10 gentle inversions',
      volume: '4.0 mL',
      specNote: 'Inhibits thrombin formation. Used for rapid stat clinical biochemistry assays.'
    }
  ];

  const handleTubeClick = (tube) => {
    if (selectedTube === tube.id) {
      setSelectedTube(null);
      setFilterTubeType('all');
    } else {
      setSelectedTube(tube.id);
      showToast(`Inspecting ${tube.name} protocol & specifications.`, 'info');
    }
  };

  const activeInspectionTube = vacutainers.find((t) => t.id === selectedTube);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return labOrders.filter((ord) => {
      // Tube filter
      if (filterTubeType !== 'all') {
        const matchesType =
          ord.sampleType?.toLowerCase().includes(filterTubeType.toLowerCase()) ||
          ord.testName?.toLowerCase().includes(filterTubeType.toLowerCase());
        if (!matchesType) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          ord.patientName?.toLowerCase().includes(q) ||
          ord.barcode?.toLowerCase().includes(q) ||
          ord.testName?.toLowerCase().includes(q) ||
          ord.sampleType?.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [labOrders, filterTubeType, searchQuery]);

  // Helper to color badge of sampleType in table
  const getSampleBadgeStyle = (sampleType = '') => {
    const s = sampleType.toLowerCase();
    if (s.includes('edta') || s.includes('cbc') || s.includes('purple')) {
      return 'badge-purple';
    }
    if (s.includes('serum') || s.includes('red') || s.includes('gold')) {
      return 'badge-rose';
    }
    if (s.includes('citrate') || s.includes('blue') || s.includes('pt')) {
      return 'badge-blue';
    }
    if (s.includes('heparin') || s.includes('green') || s.includes('blood gas')) {
      return 'badge-emerald';
    }
    return 'badge-teal';
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── Page Header Card ── */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/50 flex items-center justify-center shrink-0 shadow-2xs">
            <Droplet size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-main tracking-tight font-display leading-tight">
                Blood & Sample Collection Desk
              </h2>
              <span className="badge badge-teal text-xs font-semibold py-0.5 px-2.5">
                Phlebotomy & Specimen Accessioning
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed font-normal">
              Phlebotomy queue, specimen accessioning, thermal vial barcode printing, and tube guide.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="badge badge-teal py-1.5 px-3.5 text-xs font-bold shadow-2xs">
            {labOrders.length} Pending Samples
          </span>
        </div>
      </div>

      {/* Vacutainer Tube Guide Card */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex flex-col gap-5">
        {/* Header Strip */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800/60 shrink-0 shadow-2xs">
              <FlaskConical size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight">
                  Blood Collection Tube Reference Guide
                </h3>
                <span className="badge badge-gray text-[11px] font-bold py-0.5 px-2">
                  CLSI Order of Draw
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5 font-medium">
                Click on any tube card below to inspect phlebotomy inversion protocol & filter pending samples.
              </p>
            </div>
          </div>

          {selectedTube && (
            <button
              onClick={() => {
                setSelectedTube(null);
                setFilterTubeType('all');
              }}
              className="btn btn-secondary min-h-[36px] px-3.5 py-1.5 text-xs font-semibold text-text-muted hover:text-text-main flex items-center gap-2 rounded-xl"
            >
              <X size={14} className="shrink-0" />
              <span>Clear Tube Selection</span>
            </button>
          )}
        </div>

        {/* 4 Cards Grid - No overlap, generous spacing and clear visual cues */}
        <div className="vacutainer-grid">
          {vacutainers.map((v) => {
            const isSelected = selectedTube === v.id;
            return (
              <div
                key={v.id}
                className={`vacutainer-card group ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTubeClick(v)}
                title={`Click to inspect ${v.name}`}
              >
                {/* Clean left vertical accent bar (never intersects text) */}
                <div
                  className="vacutainer-accent-bar"
                  style={{ backgroundColor: v.barColor }}
                />

                {/* Top: Vial Icon & Additive Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${v.badgeColor} group-hover:scale-105 transition-transform`}
                  >
                    <Droplet size={17} strokeWidth={2.5} />
                  </div>

                  <span
                    className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md truncate max-w-[135px] ${v.pillBg}`}
                  >
                    {v.additive.split(' ')[0]} {v.additive.split(' ')[1] || ''}
                  </span>
                </div>

                {/* Middle: Title & Target Panels */}
                <div className="mt-3 mb-2.5">
                  <div className="text-sm font-semibold text-text-main tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {v.name}
                  </div>
                  <div className="text-xs text-text-muted mt-1 leading-relaxed font-medium line-clamp-2">
                    {v.use}
                  </div>
                </div>

                {/* Bottom: Draw Order & Inversions */}
                <div className="pt-2.5 border-t border-border-subtle/60 flex items-center justify-between text-[11px] text-text-dim">
                  <span className="font-bold text-text-main">{v.drawOrder.split(' ')[0]} {v.drawOrder.split(' ')[1]}</span>
                  <span className="font-semibold text-text-muted">{v.inversions.split(' ')[0]} inv</span>
                </div>

                {/* Selected Indicator Chip */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expanded Inspection Drawer (when a tube is selected) */}
        {activeInspectionTube && (
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-bg-surface-elevated via-bg-surface-elevated to-bg-surface border border-teal-500/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${activeInspectionTube.badgeColor}`}
              >
                <FlaskConical size={22} strokeWidth={2.3} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm sm:text-base font-bold text-text-main">
                    {activeInspectionTube.name} — Phlebotomy Specifications
                  </h4>
                  <span className="badge badge-teal text-[11px] font-bold py-0.5 px-2">
                    {activeInspectionTube.drawOrder}
                  </span>
                </div>
                <div className="text-xs text-text-muted mt-1 font-medium flex items-center gap-3 flex-wrap">
                  <span><strong>Additive:</strong> {activeInspectionTube.additive}</span>
                  <span>•</span>
                  <span><strong>Recommended Mix:</strong> {activeInspectionTube.inversions}</span>
                  <span>•</span>
                  <span><strong>Draw Volume:</strong> {activeInspectionTube.volume}</span>
                </div>
                <p className="text-xs text-text-main/80 mt-1 font-semibold italic">
                  "{activeInspectionTube.specNote}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                className={`btn btn-sm h-9 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                  filterTubeType === activeInspectionTube.tubeType
                    ? 'btn-primary'
                    : 'btn-secondary hover:border-teal-500/50'
                }`}
                onClick={() => {
                  if (filterTubeType === activeInspectionTube.tubeType) {
                    setFilterTubeType('all');
                  } else {
                    setFilterTubeType(activeInspectionTube.tubeType);
                    showToast(`Filtered queue for ${activeInspectionTube.tubeType} orders.`, 'info');
                  }
                }}
              >
                <Layers size={13} />
                <span>
                  {filterTubeType === activeInspectionTube.tubeType ? 'Show All Orders' : `Filter Queue (${activeInspectionTube.tubeType})`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Samples Queue Card */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex flex-col gap-4">
        {/* Table Controls Strip */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-border-subtle/80">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-text-main tracking-tight">
              Samples Collection Queue
            </h3>
            <p className="text-xs text-text-muted mt-0.5 font-normal">
              Showing <strong className="text-text-main font-semibold">{filteredOrders.length}</strong> of {labOrders.length} pending specimen orders
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-[260px] flex items-center">
              <Search size={15} className="text-teal-600 dark:text-teal-400 absolute left-3.5 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search patient, test, barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input form-search-input h-10.5 pl-10 pr-9 text-xs sm:text-sm rounded-xl w-full bg-bg-surface-elevated border border-border-subtle focus:border-teal-500/50 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-text-dim hover:text-text-main p-1 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Reset Filter Button if active */}
            {(filterTubeType !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setFilterTubeType('all');
                  setSearchQuery('');
                  setSelectedTube(null);
                }}
                className="btn btn-secondary btn-sm min-h-[38px] px-3.5 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container mb-0 rounded-2xl border border-border-subtle shadow-xs bg-bg-surface">
          <table className="medicore-table">
            <thead>
              <tr>
                <th className="py-3.5 px-5">Barcode</th>
                <th className="py-3.5 px-5">Patient Name</th>
                <th className="py-3.5 px-5">Lab Test</th>
                <th className="py-3.5 px-5">Required Vial</th>
                <th className="py-3.5 px-5">Collection Time</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-text-muted text-xs sm:text-sm font-medium">
                    No samples found matching the current search or tube filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="cursor-pointer hover:bg-bg-surface-elevated/70 transition-colors group"
                    onClick={() => showToast(`Selected sample #${ord.barcode} for ${ord.patientName}.`, 'info')}
                  >
                    <td className="py-4 px-5">
                      <span className="mono font-semibold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-200/80 dark:border-teal-800/60 shadow-2xs whitespace-nowrap">
                        {ord.barcode}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-text-main group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-xs sm:text-sm whitespace-nowrap">
                      {ord.patientName}
                    </td>
                    <td className="py-4 px-5 text-text-main font-medium text-xs sm:text-sm">
                      {ord.testName}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`badge ${getSampleBadgeStyle(ord.sampleType)} text-xs font-semibold py-0.5 px-2.5`}>
                        {ord.sampleType}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-xs text-text-muted font-medium whitespace-nowrap">
                      {ord.orderTime}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <Badge variant="emerald" size="sm" dot>
                        Collected
                      </Badge>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        className="btn btn-secondary btn-sm min-h-[36px] px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 ml-auto hover:border-teal-500/50 shadow-2xs cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Thermal barcode #${ord.barcode} transmitted to label printer.`, 'success');
                        }}
                      >
                        <Printer size={13} className="text-teal-600 dark:text-teal-400" />
                        <span>Print Label</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
