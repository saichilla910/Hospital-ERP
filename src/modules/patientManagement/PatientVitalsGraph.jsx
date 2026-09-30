import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  HeartPulse,
  Activity,
  Thermometer,
  Wind,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

// Custom Tooltip for Blood Pressure and Pulse
const BpPulseTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isHighBp = data.systolic >= 140 || data.diastolic >= 90;
    const isOptimalBp = data.systolic <= 120 && data.diastolic <= 80;

    return (
      <div className="bg-bg-surface border border-border-strong rounded-md p-3 md:p-4 shadow-2xl text-xs min-w-[200px]">
        <div className="flex justify-between items-center mb-2 border-b border-border-subtle pb-1">
          <span className="font-extrabold text-text-main">{data.date} • {data.time}</span>
          <span
            className={`text-[0.675rem] font-bold py-0.5 px-1.5 rounded ${
              isHighBp
                ? 'bg-rose-500/10 text-rose-600'
                : isOptimalBp
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-teal-500/10 text-teal-600'
            }`}
          >
            {isHighBp ? 'Elevated BP' : isOptimalBp ? 'Optimal BP' : 'Stage 1'}
          </span>
        </div>

        <div className="flex flex-col gap-1.25">
          <div className="flex justify-between">
            <span className="text-blue-600 font-semibold">Systolic BP:</span>
            <strong className="text-text-main">{data.systolic} mmHg</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-600 font-semibold">Diastolic BP:</span>
            <strong className="text-text-main">{data.diastolic} mmHg</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-rose-500 font-semibold">Pulse (Heart Rate):</span>
            <strong className="text-text-main">{data.pulse} bpm</strong>
          </div>
          {data.notes && (
            <div className="mt-1.5 pt-1.5 border-t border-dashed border-border-subtle text-[0.725rem] text-text-muted">
              Note: <em>{data.notes}</em>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for SpO2 and Temp
const SpO2TempTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-surface border border-border-strong rounded-md py-2.5 px-3.5 shadow-2xl text-xs">
        <div className="font-bold text-text-muted mb-1">
          {data.date} • {data.time}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-4">
            <span className="text-teal-600 font-semibold">Oxygen SpO2:</span>
            <strong className={data.spo2 < 95 ? 'text-rose-600' : 'text-teal-600'}>{data.spo2}%</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-amber-500 font-semibold">Temperature:</span>
            <strong className={data.temp > 99.5 ? 'text-rose-600' : 'text-amber-500'}>{data.temp} °F</strong>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Glucose & Weight
const GlucoseWeightTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-surface border border-border-strong rounded-md py-2.5 px-3.5 shadow-2xl text-xs">
        <div className="font-bold text-text-muted mb-1">
          {data.date} • {data.time}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-4">
            <span className="text-purple-600 font-semibold">Blood Sugar:</span>
            <strong className={data.bloodSugar > 140 ? 'text-rose-600' : 'text-purple-600'}>{data.bloodSugar} mg/dL</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-emerald-500 font-semibold">Weight:</span>
            <strong className="text-emerald-500">{data.weight} kg</strong>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const PatientVitalsGraph = ({ patient }) => {
  const { addPatientVital, showToast } = useHospital();

  const [activeTab, setActiveTab] = useState('bp'); // 'bp' | 'spo2' | 'glucose'
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new vital entry
  const [formData, setFormData] = useState({
    systolic: '128',
    diastolic: '82',
    pulse: '76',
    spo2: '98',
    temp: '98.6',
    bloodSugar: '115',
    weight: patient?.vitals?.weight ? patient.vitals.weight.replace(/[^0-9.]/g, '') : '70',
    notes: 'Clinical ward round check'
  });

  const vitalsHistory = patient?.vitalsHistory || [
    { date: '09/14', time: '08:00 AM', systolic: 140, diastolic: 90, pulse: 82, spo2: 97, temp: 98.6, bloodSugar: 140, weight: 74, notes: 'Baseline' },
    { date: '09/15', time: '08:00 AM', systolic: 136, diastolic: 86, pulse: 78, spo2: 98, temp: 98.4, bloodSugar: 132, weight: 74, notes: 'Morning round' },
    { date: '09/16', time: '08:00 AM', systolic: 132, diastolic: 84, pulse: 76, spo2: 99, temp: 98.5, bloodSugar: 125, weight: 74, notes: 'Titrating meds' },
    { date: '09/17', time: '08:00 AM', systolic: 128, diastolic: 82, pulse: 74, spo2: 99, temp: 98.4, bloodSugar: 118, weight: 74, notes: 'Target achieved' }
  ];

  const handleSaveVital = (e) => {
    e.preventDefault();
    if (!patient) return;
    addPatientVital(patient.id, formData);
    setShowAddModal(false);
  };

  const latest = vitalsHistory[vitalsHistory.length - 1] || {};
  const isElevated = latest.systolic >= 140 || latest.diastolic >= 90;

  return (
    <div className="flex flex-col gap-5">
      {/* Vitals Header Card with Quick Log Button */}
      <div className="flex justify-between items-center flex-wrap gap-3.5 bg-bg-surface p-4 md:p-5 rounded-lg border border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2">
              <HeartPulse size={20} className="text-rose-600" /> Longitudinal Clinical Vitals Graphs
            </h3>
            <Badge variant={isElevated ? 'amber' : 'emerald'} dot>
              {isElevated ? 'Mildly Elevated' : 'Controlled & Stable'}
            </Badge>
          </div>
          <p className="text-[0.825rem] text-text-muted mt-0.5">
            Multi-parameter physiological trend graphs with clinical reference lines for <strong className="text-text-main">{patient.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Vital Logging Button */}
          <button
            className="btn btn-primary text-[0.825rem] py-2 px-4"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} /> Record New Vital Point
          </button>
        </div>
      </div>

      {/* Mini Current Vitals Snapshot Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div
          onClick={() => setActiveTab('bp')}
          className={`glass-card glass-card-interactive p-3 text-center cursor-pointer ${
            activeTab === 'bp' ? 'border-b-[3px] border-b-blue-600' : ''
          }`}
        >
          <span className="text-[0.675rem] text-text-dim uppercase font-bold">Blood Pressure</span>
          <div className="mono text-xl font-extrabold text-blue-600 mt-0.5">
            {latest.systolic}/{latest.diastolic}
          </div>
          <span className="text-[0.65rem] text-text-muted">mmHg</span>
        </div>

        <div
          onClick={() => setActiveTab('bp')}
          className={`glass-card glass-card-interactive p-3 text-center cursor-pointer ${
            activeTab === 'bp' ? 'border-b-[3px] border-b-rose-500' : ''
          }`}
        >
          <span className="text-[0.675rem] text-text-dim uppercase font-bold">Heart Rate</span>
          <div className="mono text-xl font-extrabold text-rose-500 mt-0.5">
            {latest.pulse}
          </div>
          <span className="text-[0.65rem] text-text-muted">bpm</span>
        </div>

        <div
          onClick={() => setActiveTab('spo2')}
          className={`glass-card glass-card-interactive p-3 text-center cursor-pointer ${
            activeTab === 'spo2' ? 'border-b-[3px] border-b-teal-600' : ''
          }`}
        >
          <span className="text-[0.675rem] text-text-dim uppercase font-bold">SpO2 Saturation</span>
          <div className="mono text-xl font-extrabold text-teal-600 mt-0.5">
            {latest.spo2}%
          </div>
          <span className="text-[0.65rem] text-text-muted">Target: &gt;95%</span>
        </div>

        <div
          onClick={() => setActiveTab('spo2')}
          className={`glass-card glass-card-interactive p-3 text-center cursor-pointer ${
            activeTab === 'spo2' ? 'border-b-[3px] border-b-amber-500' : ''
          }`}
        >
          <span className="text-[0.675rem] text-text-dim uppercase font-bold">Body Temp</span>
          <div className="mono text-xl font-extrabold text-amber-500 mt-0.5">
            {latest.temp} °F
          </div>
          <span className="text-[0.65rem] text-text-muted">Oral Thermometer</span>
        </div>

        <div
          onClick={() => setActiveTab('glucose')}
          className={`glass-card glass-card-interactive p-3 text-center cursor-pointer ${
            activeTab === 'glucose' ? 'border-b-[3px] border-b-purple-600' : ''
          }`}
        >
          <span className="text-[0.675rem] text-text-dim uppercase font-bold">Blood Sugar</span>
          <div className="mono text-xl font-extrabold text-purple-600 mt-0.5">
            {latest.bloodSugar}
          </div>
          <span className="text-[0.65rem] text-text-muted">mg/dL (Post-Meal)</span>
        </div>
      </div>

      {/* Main Interactive Chart Container */}
      <div className="glass-card flex flex-col gap-4">
        {/* Graph Selection Tabs */}
        <div className="flex justify-between items-center flex-wrap gap-2.5">
          <div className="segmented-nav-group" role="tablist" aria-label="Vital Graph Selection">
            {[
              { id: 'bp', label: 'Blood Pressure & Heart Rate' },
              { id: 'spo2', label: 'Oxygen (SpO2) & Temperature' },
              { id: 'glucose', label: 'Blood Sugar & Body Weight' }
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`segmented-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-text-dim">
            Showing {vitalsHistory.length} recorded rounds
          </span>
        </div>

        {/* Tab 1: Blood Pressure & Heart Rate Trajectory */}
        {activeTab === 'bp' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="text-base font-extrabold text-text-main">
                  Arterial Blood Pressure & Heart Rate Trend
                </h4>
                <p className="text-xs text-text-muted">
                  Systolic (Blue), Diastolic (Cyan), and Pulse Rate (Rose) with 120/80 normal reference lines
                </p>
              </div>

              <div className="flex gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Systolic
                </span>
                <span className="flex items-center gap-1 text-cyan-600">
                  <span className="w-2 h-2 rounded-full bg-cyan-600" /> Diastolic
                </span>
                <span className="flex items-center gap-1 text-rose-500">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Pulse (bpm)
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsHistory} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--text-dim)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <YAxis
                    domain={[50, 180]}
                    stroke="var(--text-dim)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <Tooltip content={<BpPulseTooltip />} />
                  <ReferenceLine y={140} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: '140 Hypertension Limit', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }} />
                  <ReferenceLine y={120} stroke="#10b981" strokeDasharray="4 4" label={{ value: '120 Normal Systolic', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />
                  <ReferenceLine y={80} stroke="#0d9488" strokeDasharray="4 4" label={{ value: '80 Normal Diastolic', fill: '#0d9488', fontSize: 10, position: 'insideBottomRight' }} />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    name="Systolic BP"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    name="Diastolic BP"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pulse"
                    name="Heart Rate (Pulse)"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Oxygen Saturation & Temperature */}
        {activeTab === 'spo2' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="text-base font-extrabold text-text-main">
                  Oxygen Saturation (SpO2 %) & Body Temperature (°F)
                </h4>
                <p className="text-xs text-text-muted">
                  Continuous respiratory recovery and thermoregulation tracking
                </p>
              </div>

              <div className="flex gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-teal-600">
                  <span className="w-2 h-2 rounded-full bg-teal-600" /> SpO2 (%)
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Temp (°F)
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vitalsHistory} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--text-dim)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <YAxis
                    domain={[85, 105]}
                    stroke="var(--text-dim)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <Tooltip content={<SpO2TempTooltip />} />
                  <ReferenceLine y={95} stroke="#0d9488" strokeDasharray="4 4" label={{ value: '95% Healthy SpO2 Target', fill: '#0d9488', fontSize: 10, position: 'insideTopLeft' }} />
                  <Area
                    type="monotone"
                    dataKey="spo2"
                    name="SpO2 Saturation"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#spo2Gradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    name="Temperature (°F)"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#ffffff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 3: Blood Sugar & Weight Progression */}
        {activeTab === 'glucose' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="text-base font-extrabold text-text-main">
                  Blood Sugar (mg/dL) & Weight (kg) Progression
                </h4>
                <p className="text-xs text-text-muted">
                  Metabolic glycemic control and weight trajectory during clinical care
                </p>
              </div>

              <div className="flex gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-purple-600">
                  <span className="w-2 h-2 rounded-full bg-purple-600" /> Blood Sugar
                </span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Weight (kg)
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsHistory} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--text-dim)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <YAxis
                    domain={[60, 220]}
                    stroke="var(--text-dim)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <Tooltip content={<GlucoseWeightTooltip />} />
                  <ReferenceLine y={140} stroke="#8b5cf6" strokeDasharray="4 4" label={{ value: '140 Post-Meal Upper Target', fill: '#8b5cf6', fontSize: 10, position: 'insideTopLeft' }} />
                  <ReferenceLine y={100} stroke="#10b981" strokeDasharray="4 4" label={{ value: '100 Fasting Target', fill: '#10b981', fontSize: 10, position: 'insideBottomLeft' }} />
                  <Line
                    type="monotone"
                    dataKey="bloodSugar"
                    name="Blood Sugar (mg/dL)"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modal to Log New Vitals */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="glass-card modal-content max-w-[520px] w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2">
                <HeartPulse size={20} className="text-rose-600" /> Record Patient Vital Reading
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-transparent border-0 cursor-pointer text-text-dim hover:text-text-main p-1"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-[0.825rem] text-text-muted mb-4">
              Enter latest nurse or doctor examination vitals for <strong>{patient.name}</strong> ({patient.mrn}). The graph will update automatically.
            </p>

            <form onSubmit={handleSaveVital} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    required
                    min={60}
                    max={260}
                  />
                </div>
                <div>
                  <label className="form-label">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    required
                    min={40}
                    max={160}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Heart Rate (Pulse bpm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.pulse}
                    onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                    required
                    min={30}
                    max={220}
                  />
                </div>
                <div>
                  <label className="form-label">Oxygen SpO2 (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.spo2}
                    onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                    required
                    min={70}
                    max={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={formData.temp}
                    onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.bloodSugar}
                    onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Clinical Observations & Notes</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Post-medication review, resting comfortably"
                />
              </div>

              <div className="flex justify-end gap-2.5 mt-2.5">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Save Vital Point & Refresh Graph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
