import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Users,
  Activity,
  Heart,
  Droplet,
  PieChart as PieIcon,
  BarChart3,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const PatientAnalyticsOverview = () => {
  const { patients, showToast, setActiveNav, setSelectedPatient } = useHospital();

  // Age group demographics
  const ageDistribution = [
    { bracket: '0-18 (Paediatric)', count: 28, share: 11, fill: '#8b5cf6' },
    { bracket: '19-35 (Young Adult)', count: 54, share: 22, fill: '#3b82f6' },
    { bracket: '36-50 (Middle Age)', count: 76, share: 31, fill: '#0d9488' },
    { bracket: '51-65 (Mature)', count: 62, share: 25, fill: '#f59e0b' },
    { bracket: '65+ (Geriatric)', count: 28, share: 11, fill: '#f43f5e' }
  ];

  // Chronic conditions & Diagnoses distribution
  const diseasePrevalence = [
    { condition: 'Hypertension', count: 94, color: '#2563eb', dotClass: 'bg-blue-600', textClass: 'text-blue-600', widthClass: 'w-[94%]' },
    { condition: 'Type 2 Diabetes', count: 78, color: '#0d9488', dotClass: 'bg-teal-600', textClass: 'text-teal-600', widthClass: 'w-[78%]' },
    { condition: 'Coronary Artery Disease', count: 46, color: '#f43f5e', dotClass: 'bg-rose-500', textClass: 'text-rose-500', widthClass: 'w-[46%]' },
    { condition: 'Asthma / COPD', count: 38, color: '#f59e0b', dotClass: 'bg-amber-500', textClass: 'text-amber-500', widthClass: 'w-[38%]' },
    { condition: 'Orthopaedic / Spine', count: 32, color: '#8b5cf6', dotClass: 'bg-purple-500', textClass: 'text-purple-500', widthClass: 'w-[32%]' },
    { condition: 'Renal / CKD', count: 18, color: '#06b6d4', dotClass: 'bg-cyan-500', textClass: 'text-cyan-500', widthClass: 'w-[18%]' }
  ];

  // Blood group inventory compatibility
  const bloodGroupStats = [
    { group: 'O+ Positive', count: 74, color: '#e11d48', textClass: 'text-rose-600' },
    { group: 'B+ Positive', count: 68, color: '#2563eb', textClass: 'text-blue-600' },
    { group: 'A+ Positive', count: 52, color: '#0d9488', textClass: 'text-teal-600' },
    { group: 'AB+ Universal Recipient', count: 24, color: '#8b5cf6', textClass: 'text-purple-600' },
    { group: 'O- Universal Donor', count: 14, color: '#f59e0b', textClass: 'text-amber-600' },
    { group: 'A- & B- Negative', count: 16, color: '#06b6d4', textClass: 'text-cyan-600' }
  ];

  // Admission status distribution
  const admissionSplit = [
    { name: 'Outpatient (OPD)', value: 142, color: '#3b82f6', dotClass: 'bg-blue-500', textClass: 'text-blue-500' },
    { name: 'Inpatient Ward (IPD)', value: 68, color: '#0d9488', dotClass: 'bg-teal-600', textClass: 'text-teal-600' },
    { name: 'Emergency (ER)', value: 24, color: '#f43f5e', dotClass: 'bg-rose-500', textClass: 'text-rose-500' },
    { name: 'Intensive Care (ICU)', value: 14, color: '#8b5cf6', dotClass: 'bg-purple-500', textClass: 'text-purple-500' }
  ];

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bg-surface border border-border-strong rounded-md py-2 px-3 shadow-2xl text-xs">
          <div className="font-bold text-text-main">{label}</div>
          <div className="font-extrabold mt-0.5 text-blue-500">
            {data.count} Registered Patients ({data.share ? `${data.share}%` : ''})
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bg-surface border border-border-strong rounded-md py-2 px-3 shadow-2xl text-xs">
          <div className="font-bold text-text-main">{data.name || data.group}</div>
          <div className={`font-extrabold mt-0.5 ${data.textClass || 'text-primary-accent'}`}>
            {data.value || data.count} Patients
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5.5">
      {/* Header Banner */}
      <div className="flex justify-between items-center flex-wrap gap-3.5 bg-bg-surface p-4 md:p-5 rounded-lg border border-border-subtle">
        <div>
          <h3 className="text-xl font-extrabold text-text-main flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" /> Patient Cohort & Clinical Population Analytics
          </h3>
          <p className="text-[0.825rem] text-text-muted mt-0.5">
            Epidemiological disease prevalence, age brackets, blood type distribution, and admission metrics across all {patients.length} active records.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => showToast('Patient demographic summary dataset refreshed.', 'success')}
        >
          <ShieldCheck size={14} /> NABH Compliance Verified
        </button>
      </div>

      {/* KPI Cards */}
      <div className="responsive-grid-4">
        <StatCard
          title="Total Active Records"
          value={patients.length}
          subtitle="Hospitalized & OPD patients"
          icon={Users}
          color="teal"
          onClick={() => showToast(`Total patients registered: ${patients.length}`, 'info')}
        />
        <StatCard
          title="Avg Patient Age"
          value="45.2 yrs"
          subtitle="Median cohort age"
          icon={Activity}
          color="cyan"
          onClick={() => showToast('Median age: 45.2 years across registered patients', 'info')}
        />
        <StatCard
          title="Chronic Care Tracked"
          value="68.4%"
          subtitle="Patients on active titrations"
          icon={Heart}
          color="rose"
          onClick={() => showToast('68.4% of patients have chronic vitals monitored', 'info')}
        />
        <StatCard
          title="Universal Donors"
          value="14 Patients"
          subtitle="O-Negative blood group"
          icon={Droplet}
          color="amber"
          onClick={() => showToast('14 O-Negative universal donors on file', 'info')}
        />
      </div>

      {/* Row 1: Age Demographics & Chronic Disease Prevalence */}
      <div className="responsive-grid-split">
        {/* Graph 1: Age Brackets Bar Chart */}
        <div className="glass-card flex flex-col gap-4">
          <div>
            <h4 className="text-base font-extrabold text-text-main">
              Age Distribution Pyramid
            </h4>
            <p className="text-xs text-text-muted">
              Patient registry categorized by clinical lifecycle stage
            </p>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistribution} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="bracket"
                  stroke="var(--text-dim)"
                  fontSize={10}
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
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]}>
                  {ageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Chronic Conditions Frequency */}
        <div className="glass-card flex flex-col gap-4">
          <div>
            <h4 className="text-base font-extrabold text-text-main">
              Top Chronic Diagnoses & Co-morbidities
            </h4>
            <p className="text-xs text-text-muted">
              Prevalence of clinical conditions under active outpatient & inpatient care
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            {diseasePrevalence.map((dis, idx) => {
              const maxVal = 100;
              const pct = ((dis.count / maxVal) * 100).toFixed(0);
              return (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[0.8rem]">
                    <span className="font-semibold text-text-main flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dis.dotClass}`} />
                      {dis.condition}
                    </span>
                    <span className={`font-bold ${dis.textClass}`}>
                      {dis.count} cases ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.75 bg-bg-surface-elevated rounded-sm overflow-hidden">
                    <div className={`h-full rounded-sm transition-all ${dis.widthClass} ${dis.dotClass}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Blood Group Inventory & Admission Status Breakdown */}
      <div className="responsive-grid-split">
        {/* Graph 3: Admission Status Distribution */}
        <div className="glass-card flex flex-col gap-3.5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-extrabold text-text-main">
                Admission Status Breakdown
              </h4>
              <p className="text-xs text-text-muted">
                Current distribution across clinical care streams
              </p>
            </div>
            <Badge variant="teal">248 Enrolled</Badge>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3.5">
            <div className="w-[180px] h-[180px] mx-auto relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={admissionSplit}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {admissionSplit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-extrabold text-text-main">248</span>
                <span className="text-[0.65rem] text-text-dim uppercase">Patients</span>
              </div>
            </div>

            <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
              {admissionSplit.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-xs bg-bg-surface-elevated text-[0.775rem]"
                >
                  <span className="flex items-center gap-1.5 text-text-main font-semibold">
                    <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                    {item.name}
                  </span>
                  <span className={`font-bold ${item.textClass}`}>
                    {item.value} ({((item.value / 248) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graph 4: Blood Group Distribution */}
        <div className="glass-card flex flex-col gap-3.5">
          <div>
            <h4 className="text-base font-extrabold text-text-main">
              Blood Group Distribution
            </h4>
            <p className="text-xs text-text-muted">
              Compatibility registry across patient population
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
            {bloodGroupStats.map((bg, i) => (
              <div
                key={i}
                className="bg-bg-surface-elevated border border-border-subtle rounded-xl p-3 flex flex-col gap-1"
              >
                <span className="text-xs font-semibold text-text-main">{bg.group}</span>
                <span className={`text-xl font-bold ${bg.textClass}`}>{bg.count}</span>
                <span className="text-[0.675rem] text-text-muted">Registered</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
