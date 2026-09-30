import React, { useState } from 'react';
import { Target, CheckCircle2, Clock, Calendar, HeartPulse, User, Plus, Check } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const TreatmentPlans = () => {
  const { selectedPatient, patients, showToast } = useHospital();
  const patient = selectedPatient || patients[0];

  const [milestones, setMilestones] = useState([
    { id: 1, goal: 'Heart Health Recovery & Daily Tablets', target: 'Take blood thinners daily for 6 months without missing a dose', progress: '4 months completed successfully', status: 'On Track' },
    { id: 2, goal: 'Cholesterol Lowering (Target < 55 mg/dL)', target: 'Reduce cholesterol levels with evening medication and low-fat diet', progress: 'Check lab lipid panel in 4 weeks', status: 'In Progress' },
    { id: 3, goal: 'Blood Sugar Control (Diet & Tablets)', target: 'Maintain fasting sugar below 110 mg/dL', progress: 'Metformin tablet once daily after breakfast', status: 'In Progress' },
    { id: 4, goal: 'Blood Pressure Target (< 130/80 mmHg)', target: 'Current BP: 124/80 mmHg within normal range', progress: 'Home BP monitoring log is steady', status: 'Achieved' }
  ]);

  const [newGoal, setNewGoal] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newProgress, setNewProgress] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleStatus = (id) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'Achieved' ? 'On Track' : m.status === 'On Track' ? 'In Progress' : 'Achieved';
          showToast(`Updated "${m.goal}" status to: ${nextStatus}`, 'success');
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal || !newTarget) return;
    const item = {
      id: Date.now(),
      goal: newGoal,
      target: newTarget,
      progress: newProgress || 'Just started',
      status: 'In Progress'
    };
    setMilestones([...milestones, item]);
    setNewGoal('');
    setNewTarget('');
    setNewProgress('');
    setShowAddForm(false);
    showToast(`Added new recovery goal: "${item.goal}"`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight font-display">
            Patient Care & Recovery Goals
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Patient: <strong className="text-text-main font-semibold">{patient.name}</strong> ({patient.mrn}) • Click any goal card to update status.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add Care Goal'}
        </button>
      </div>

      {/* Add New Goal Form */}
      {showAddForm && (
        <div className="glass-card p-5 sm:p-6 bg-bg-surface border border-border-subtle shadow-xs rounded-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
            <Plus size={17} className="text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm sm:text-base text-text-main font-semibold">New Care Plan Goal</h3>
          </div>
          <form onSubmit={handleAddGoal}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="form-group mb-0">
                <label className="form-label">Goal Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Physiotherapy Knee Exercise"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Target / Milestone *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Walk 20 minutes daily without assistance"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  required
                />
              </div>
              <div className="form-group sm:col-span-2 mb-0">
                <label className="form-label">Current Strategy / Daily Plan</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Daily morning stretches guided by nurse"
                  value={newProgress}
                  onChange={(e) => setNewProgress(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm"><Plus size={15} /> Save Goal</button>
            </div>
          </form>
        </div>
      )}

      {/* Goal Cards */}
      <div className="glass-card p-5 sm:p-6 rounded-xl flex flex-col gap-4 border border-border-subtle shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h3 className="text-sm sm:text-base text-text-main flex items-center gap-2 font-semibold">
            <Target size={18} className="text-teal-600 dark:text-teal-400" />
            <span>Active Care Goals & Health Targets</span>
          </h3>
          <span className="text-xs text-text-dim font-medium">Click card to cycle status</span>
        </div>

        <div className="flex flex-col gap-3">
          {milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => toggleStatus(m.id)}
              className={`p-4 sm:p-5 rounded-xl cursor-pointer transition-all duration-150 border flex flex-col gap-2 ${
                m.status === 'Achieved'
                  ? 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60'
                  : 'border-border-subtle bg-bg-surface-elevated hover:border-teal-500/40 hover:bg-bg-surface'
              }`}
            >
              <div className="flex justify-between items-center flex-wrap gap-2.5">
                <span className="text-sm sm:text-base font-semibold text-text-main flex items-center gap-2">
                  {m.status === 'Achieved' && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                  {m.goal}
                </span>
                <Badge variant={m.status === 'Achieved' ? 'emerald' : m.status === 'On Track' ? 'teal' : 'amber'}>
                  {m.status}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-teal-700 dark:text-teal-300 font-medium">
                <strong>Target:</strong> {m.target}
              </p>
              <div className="text-xs text-text-muted">
                <strong className="text-text-dim">Daily Plan:</strong> {m.progress}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
