import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  Activity,
  TrendingUp,
  Bed,
  DollarSign,
  FlaskConical,
  Users,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '../common/Badge';

// Time-based dataset matrices
const DATASETS = {
  today: {
    label: 'Today (Hourly Traffic)',
    patientTrend: [
      { time: '08:00', opd: 22, emergency: 4, ipd: 3, revenue: 32000 },
      { time: '10:00', opd: 48, emergency: 8, ipd: 6, revenue: 68000 },
      { time: '12:00', opd: 54, emergency: 6, ipd: 9, revenue: 76000 },
      { time: '14:00', opd: 38, emergency: 5, ipd: 4, revenue: 52000 },
      { time: '16:00', opd: 42, emergency: 9, ipd: 7, revenue: 64000 },
      { time: '18:00', opd: 30, emergency: 12, ipd: 5, revenue: 49000 },
      { time: '20:00', opd: 14, emergency: 7, ipd: 2, revenue: 21000 }
    ],
    totalRevenue: '₹3,62,000',
    totalPatients: '344'
  },
  week: {
    label: 'This Week (Daily)',
    patientTrend: [
      { time: 'Mon', opd: 142, emergency: 16, ipd: 28, revenue: 182000 },
      { time: 'Tue', opd: 168, emergency: 21, ipd: 34, revenue: 214000 },
      { time: 'Wed', opd: 194, emergency: 24, ipd: 42, revenue: 258000 },
      { time: 'Thu', opd: 172, emergency: 18, ipd: 31, revenue: 196000 },
      { time: 'Fri', opd: 205, emergency: 28, ipd: 46, revenue: 284000 },
      { time: 'Sat', opd: 224, emergency: 32, ipd: 38, revenue: 310000 },
      { time: 'Sun', opd: 130, emergency: 29, ipd: 22, revenue: 165000 }
    ],
    totalRevenue: '₹16,09,000',
    totalPatients: '1,563'
  },
  month: {
    label: 'This Month (Weekly Cohort)',
    patientTrend: [
      { time: 'Week 1', opd: 980, emergency: 142, ipd: 198, revenue: 1240000 },
      { time: 'Week 2', opd: 1120, emergency: 168, ipd: 215, revenue: 1450000 },
      { time: 'Week 3', opd: 1240, emergency: 185, ipd: 240, revenue: 1620000 },
      { time: 'Week 4', opd: 1060, emergency: 154, ipd: 204, revenue: 1380000 }
    ],
    totalRevenue: '₹56,90,000',
    totalPatients: '5,906'
  },
  year: {
    label: 'Annual (Monthly Trends)',
    patientTrend: [
      { time: 'Jan', opd: 4200, emergency: 580, ipd: 790, revenue: 5200000 },
      { time: 'Feb', opd: 4450, emergency: 610, ipd: 820, revenue: 5500000 },
      { time: 'Mar', opd: 4900, emergency: 690, ipd: 910, revenue: 6100000 },
      { time: 'Apr', opd: 4600, emergency: 640, ipd: 860, revenue: 5800000 },
      { time: 'May', opd: 5100, emergency: 720, ipd: 950, revenue: 6400000 },
      { time: 'Jun', opd: 5350, emergency: 780, ipd: 990, revenue: 6750000 }
    ],
    totalRevenue: '₹3.57 Cr',
    totalPatients: '33,700'
  }
};

// Ward Bed Occupancy Data for Bar Chart
const WARD_OCCUPANCY_DATA = [
  { name: 'ICU / Critical', occupied: 22, available: 2, total: 24, rate: 92, fill: '#f43f5e' },
  { name: 'Cardiology', occupied: 34, available: 6, total: 40, rate: 85, fill: '#0d9488' },
  { name: 'General Medicine', occupied: 52, available: 28, total: 80, rate: 65, fill: '#0f766e' },
  { name: 'Pediatrics', occupied: 12, available: 13, total: 25, rate: 48, fill: '#14b8a6' },
  { name: 'Orthopaedics', occupied: 16, available: 4, total: 20, rate: 80, fill: '#0284c7' },
  { name: 'Deluxe Private', occupied: 14, available: 6, total: 20, rate: 70, fill: '#2563eb' }
];

// Lab Diagnostics Distribution Data
const LAB_DISTRIBUTION_DATA = [
  { name: 'Complete Blood Count', value: 184, share: 36, color: '#0284c7', dotClass: 'bg-sky-500', textClass: 'text-sky-600' },
  { name: 'Biochemistry (LFT/KFT)', value: 132, share: 26, color: '#0d9488', dotClass: 'bg-teal-600', textClass: 'text-teal-600' },
  { name: 'Cardiac Biomarkers', value: 74, share: 15, color: '#f59e0b', dotClass: 'bg-amber-500', textClass: 'text-amber-600' },
  { name: 'Radiology Scans (MRI/CT)', value: 68, share: 13, color: '#6366f1', dotClass: 'bg-indigo-500', textClass: 'text-indigo-600' },
  { name: 'Microbiology & Cultures', value: 52, share: 10, color: '#10b981', dotClass: 'bg-emerald-500', textClass: 'text-emerald-600' }
];

// Custom Tooltip for Patient Traffic Chart
const PatientTrafficTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-surface/95 backdrop-blur-md border border-border-subtle rounded-xl py-2.5 px-3.5 shadow-lg text-xs">
        <div className="font-bold text-text-main mb-1.5 pb-1 border-b border-border-subtle flex items-center justify-between gap-3">
          <span>{label}</span>
          <span className="text-[0.675rem] text-text-dim font-medium">Clinical Breakdown</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => {
            const dotColorClass =
              entry.dataKey === 'opd'
                ? 'bg-blue-500'
                : entry.dataKey === 'emergency'
                ? 'bg-rose-500'
                : 'bg-teal-600';

            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-text-muted">
                  <span className={`w-2 h-2 rounded-full ${dotColorClass}`} />
                  {entry.name}:
                </span>
                <span className="font-semibold text-text-main">{entry.value} patients</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Revenue Chart
const RevenueTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-surface/95 backdrop-blur-md border border-border-subtle rounded-xl py-2.5 px-3.5 shadow-lg text-xs">
        <div className="font-semibold text-text-muted">{label}</div>
        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
          ₹{data.revenue.toLocaleString()}
        </div>
        <div className="text-[0.725rem] text-text-dim mt-0.5">
          Total hospital revenue collections
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Bed Occupancy
const BedTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-surface/95 backdrop-blur-md border border-border-subtle rounded-xl py-2.5 px-3.5 shadow-lg text-xs">
        <div className="font-bold text-text-main">{data.name}</div>
        <div className="mt-1.5 flex flex-col gap-1">
          <div className="text-rose-600 dark:text-rose-400 font-semibold">Occupied: {data.occupied} beds</div>
          <div className="text-emerald-600 dark:text-emerald-400 font-semibold">Vacant: {data.available} beds</div>
          <div className="text-text-muted font-semibold mt-0.5 pt-1 border-t border-border-subtle flex justify-between gap-3">
            <span>Occupancy Rate:</span>
            <span className={data.rate > 85 ? 'text-rose-600' : 'text-teal-600'}>{data.rate}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Lab Pie Chart
const LabPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-surface/95 backdrop-blur-md border border-border-subtle rounded-xl py-2 px-3 shadow-lg text-[0.785rem]">
        <div className="font-semibold text-text-main">{data.name}</div>
        <div className={`font-bold mt-0.5 ${data.textClass || 'text-teal-600'}`}>
          {data.value} Tests ({data.share}%)
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardCharts = () => {
  const [timeRange, setTimeRange] = useState('week'); // 'today' | 'week' | 'month' | 'year'
  const currentData = DATASETS[timeRange];

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full min-w-0">
      {/* Charts Section Header & Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-bg-surface p-4 sm:p-5 lg:p-5.5 rounded-2xl border border-border-subtle shadow-xs min-w-0">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0">
            <Activity size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-text-main tracking-tight leading-snug truncate">
              Live Hospital Analytics & Trend Graphs
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Visual curves for patient admissions, bed occupancy, revenue trajectory, and diagnostic test volumes.
            </p>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="segmented-nav-group shrink-0" role="tablist" aria-label="Analytics Time Filter">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'Annual' }
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={timeRange === t.id}
              onClick={() => setTimeRange(t.id)}
              className={`segmented-nav-btn ${timeRange === t.id ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Patient Inflow Curve & Ward Bed Distribution */}
      <div className="responsive-grid-split">
        {/* Graph 1: Patient Traffic & Volume Trajectory (Composed Chart) */}
        <div className="glass-card flex flex-col gap-4 relative rounded-2xl bg-bg-surface border border-border-subtle shadow-xs p-5 sm:p-6">
          <div className="flex justify-between items-start flex-wrap gap-3 border-b border-border-subtle pb-3.5">
            <div>
              <h4 className="text-base font-bold text-text-main tracking-tight leading-snug">
                Patient Inflow & Clinical Footfall
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                {currentData.label} • OPD Consultations, Emergency Triages, and Inpatient Admissions
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold flex-wrap">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" /> OPD
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> ER Triage
              </span>
              <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> IPD Stay
              </span>
            </div>
          </div>

          {/* Recharts Composed Container */}
          <div className="h-[290px] w-full min-h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentData.patientTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="opdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="var(--text-dim)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                />
                <YAxis
                  stroke="var(--text-dim)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                />
                <Tooltip content={<PatientTrafficTooltip />} />
                <Area
                  type="monotone"
                  dataKey="opd"
                  name="OPD Visits"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#opdGradient)"
                />
                <Bar
                  dataKey="emergency"
                  name="Emergency"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
                <Line
                  type="monotone"
                  dataKey="ipd"
                  name="IPD Admissions"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0d9488', strokeWidth: 1.5, stroke: '#ffffff' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Mini Banner */}
          <div className="flex justify-between items-center py-2.5 px-3.5 bg-bg-surface-elevated rounded-xl text-xs border border-border-subtle">
            <span className="text-text-muted">
              Total Patient Encounters in Period: <strong className="text-text-main font-bold">{currentData.totalPatients}</strong>
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              <TrendingUp size={14} /> +12.4% vs prev period
            </span>
          </div>
        </div>

        {/* Graph 2: Ward Bed Occupancy & Capacity Utilization (Bar Chart) */}
        <div className="glass-card flex flex-col gap-4 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs p-5 sm:p-6">
          <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border-subtle pb-3.5">
            <div>
              <h4 className="text-base font-bold text-text-main tracking-tight leading-snug">
                Bed Occupancy by Clinical Ward
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Occupied vs available beds across specialty wings
              </p>
            </div>
            <span className="badge badge-teal text-xs font-bold py-0.5 px-2.5">
              73% Overall Occupancy
            </span>
          </div>

          <div className="h-[270px] w-full min-h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={WARD_OCCUPANCY_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-dim)"
                  fontSize={10.5}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                />
                <YAxis
                  stroke="var(--text-dim)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                />
                <Tooltip content={<BedTooltip />} />
                <Bar dataKey="occupied" name="Occupied Beds" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]}>
                  {WARD_OCCUPANCY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 85 ? '#f43f5e' : entry.fill} />
                  ))}
                </Bar>
                <Bar dataKey="available" name="Available Beds" stackId="a" fill="var(--bg-surface-elevated)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs text-text-muted border-t border-border-subtle pt-2.5">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> Critical (&gt;85%)
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" /> Normal Occupancy
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-xs bg-bg-surface-elevated border border-border-subtle" /> Vacant
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Revenue Collections Curve & Diagnostic Laboratory Donut */}
      <div className="responsive-grid-split">
        {/* Graph 3: Hospital Revenue Flow Trend (Area Chart) */}
        <div className="glass-card flex flex-col gap-4 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs p-5 sm:p-6">
          <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border-subtle pb-3.5">
            <div>
              <h4 className="text-base font-bold text-text-main tracking-tight leading-snug">
                Hospital Inflow & Revenue Graph
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Billing collections across OPD, Wards, Laboratory & Pharmacy POS
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {currentData.totalRevenue}
              </div>
              <div className="text-[0.7rem] text-text-muted font-semibold">Total Period Collections</div>
            </div>
          </div>

          <div className="h-[250px] w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.patientTrend} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="var(--text-dim)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                />
                <YAxis
                  stroke="var(--text-dim)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Laboratory & Diagnostics Breakdown (Donut Chart) */}
        <div className="glass-card flex flex-col gap-4 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs p-5 sm:p-6">
          <div className="flex justify-between items-center border-b border-border-subtle pb-3.5">
            <div>
              <h4 className="text-base font-bold text-text-main flex items-center gap-2 tracking-tight leading-snug">
                <FlaskConical size={18} className="text-teal-600 dark:text-teal-400 shrink-0" /> Diagnostic Test Breakdown
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Tests conducted today across pathology, biochemistry & radiology
              </p>
            </div>
            <span className="badge badge-teal text-xs font-bold py-0.5 px-2.5">510 Tests Done</span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            {/* Donut Chart */}
            <div className="w-[190px] h-[190px] mx-auto relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<LabPieTooltip />} />
                  <Pie
                    data={LAB_DISTRIBUTION_DATA}
                    innerRadius={54}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {LAB_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-text-main leading-none">510</span>
                <span className="text-[0.675rem] text-text-dim font-semibold uppercase tracking-wider mt-0.5">Tests</span>
              </div>
            </div>

            {/* Legend Breakdown List with mini visual progress bar */}
            <div className="flex-1 min-w-[220px] flex flex-col gap-2">
              {LAB_DISTRIBUTION_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 py-1.5 px-2.5 rounded-xl bg-bg-surface-elevated text-xs border border-border-subtle hover:border-teal-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-text-main font-semibold truncate">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.dotClass || 'bg-teal-600'} shrink-0`} />
                      <span className="truncate">{item.name.split('(')[0]}</span>
                    </span>
                    <span className={`font-bold mono shrink-0 ${item.textClass || 'text-teal-600'}`}>
                      {item.value} ({item.share}%)
                    </span>
                  </div>
                  {/* Subtle Mini Progress Bar */}
                  <div className="w-full h-1 bg-bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.dotClass || 'bg-teal-600'}`}
                      style={{ width: `${item.share}%` }}
                    />
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
