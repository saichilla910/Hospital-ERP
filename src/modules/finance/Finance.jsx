import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieIcon, BarChart2, CreditCard, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const Finance = () => {
  const { executiveStats, showToast } = useHospital();

  const deptRevenues = [
    { dept: 'Cardiology (Heart Care)', revenue: 14800000, share: 30.7, growth: '+12.4%', color: '#2563eb', colorClass: 'text-blue-600', dotClass: 'bg-blue-600' },
    { dept: 'Surgery & OT', revenue: 9800000, share: 20.3, growth: '+8.1%', color: '#0d9488', colorClass: 'text-teal-600', dotClass: 'bg-teal-600' },
    { dept: 'Hospital Pharmacy', revenue: 7400000, share: 15.3, growth: '+15.2%', color: '#10b981', colorClass: 'text-emerald-600', dotClass: 'bg-emerald-600' },
    { dept: 'Intensive Care (ICU)', revenue: 6200000, share: 12.8, growth: '+4.0%', color: '#f43f5e', colorClass: 'text-rose-500', dotClass: 'bg-rose-500' },
    { dept: 'Radiology & Scans', revenue: 4800000, share: 10.0, growth: '+6.5%', color: '#8b5cf6', colorClass: 'text-purple-500', dotClass: 'bg-purple-500' },
    { dept: 'Pathology & Lab', revenue: 3200000, share: 6.6, growth: '+9.8%', color: '#06b6d4', colorClass: 'text-cyan-500', dotClass: 'bg-cyan-500' },
    { dept: 'Emergency Care', revenue: 2000000, share: 4.3, growth: '+18.0%', color: '#f59e0b', colorClass: 'text-amber-500', dotClass: 'bg-amber-500' }
  ];

  const handleRowClick = (d) => {
    showToast(`${d.dept}: ₹${d.revenue.toLocaleString()} monthly revenue (${d.share}% share, ${d.growth} growth)`, 'info');
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bg-surface border border-border-subtle rounded-md p-2.5 sm:px-3.5 shadow-xl text-[0.8rem]">
          <div className="font-bold text-text-main">{data.dept}</div>
          <div className="text-emerald-500 font-extrabold text-base mt-0.5">
            ₹{(data.revenue / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[0.725rem] text-text-muted">
            {data.share}% share of total hospital inflow
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.4rem] font-extrabold text-text-main">
            Hospital Income & Department Finances
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Overview of hospital earnings, daily counter collections, and departmental revenue performance graphs.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => showToast('Financial ledger reports reconciled with NABH accounting standards.', 'success')}
        >
          <ShieldCheck size={14} /> Audit Reconciled
        </button>
      </div>

      {/* KPI Cards */}
      <div className="responsive-grid-4">
        <StatCard
          title="Today's Collections"
          value={executiveStats.revenueToday}
          subtitle="All Billing Desks"
          icon={DollarSign}
          trend="+8.2% vs target"
          color="emerald"
          onClick={() => showToast(`Today's Collections: ${executiveStats.revenueToday}`, 'info')}
        />
        <StatCard
          title="This Month's Total"
          value={executiveStats.monthlyRevenue}
          subtitle="Current Month Revenue"
          icon={TrendingUp}
          trend="+14.5% vs last year"
          color="teal"
          onClick={() => showToast(`Monthly Total: ${executiveStats.monthlyRevenue}`, 'info')}
        />
        <StatCard
          title="Operating Profit Margin"
          value="28.4%"
          subtitle="₹1.36 Crore Monthly Margin"
          icon={BarChart2}
          color="indigo"
          onClick={() => showToast('Operating Profit Margin: 28.4% (₹1.36 Cr Monthly)', 'info')}
        />
        <StatCard
          title="Pending Insurance Payments"
          value="₹45,20,000"
          subtitle="Claims in approval process"
          icon={CreditCard}
          color="amber"
          onClick={() => showToast('Pending Insurance: ₹45,20,000 awaiting reimbursement', 'info')}
        />
      </div>

      {/* Visual Finance Charts */}
      <div className="responsive-grid-split">
        {/* Chart 1: Revenue by Department Bar Graph */}
        <div className="glass-card flex flex-col gap-3.5">
          <div>
            <h3 className="text-[1.05rem] font-extrabold text-text-main">
              Monthly Income by Clinical Department
            </h3>
            <p className="text-[0.75rem] text-text-muted">
              Total monthly billing collections in ₹ Lakhs
            </p>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptRevenues} margin={{ top: 10, right: 10, left: -5, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="dept"
                  stroke="var(--text-dim)"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                  tickFormatter={(v) => v.split(' ')[0]}
                />
                <YAxis
                  stroke="var(--text-dim)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                  {deptRevenues.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue Share Donut Chart */}
        <div className="glass-card flex flex-col gap-3.5">
          <div>
            <h3 className="text-[1.05rem] font-extrabold text-text-main">
              Revenue Contribution Share (%)
            </h3>
            <p className="text-[0.75rem] text-text-muted">
              Percentage contribution to overall ₹4.82 Cr hospital revenue
            </p>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3.5">
            <div className="w-[180px] h-[180px] mx-auto relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Share']}
                    contentStyle={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  />
                  <Pie
                    data={deptRevenues}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="share"
                  >
                    {deptRevenues.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[1.1rem] font-extrabold text-text-main">100%</span>
                <span className="text-[0.65rem] text-text-dim uppercase">Inflow</span>
              </div>
            </div>

            <div className="flex-1 min-w-[220px] flex flex-col gap-2">
              {deptRevenues.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-surface-elevated/60 border border-border-subtle text-xs"
                >
                  <span className="flex items-center gap-2 text-text-main font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.dotClass}`} />
                    {item.dept.split('(')[0].trim()}
                  </span>
                  <span className={`font-bold tabular-nums ${item.colorClass}`}>
                    {item.share}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Departmental Revenue Contribution Table */}
      <div className="glass-card flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text-main">Department Revenue Breakdown (Click row to inspect)</h3>

        <div className="table-container">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Department</th>
                <th className="text-right">Monthly Income (₹)</th>
                <th className="text-right">Share of Total (%)</th>
                <th className="text-right">Monthly Growth</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {deptRevenues.map((d, i) => (
                <tr
                  key={i}
                  onClick={() => handleRowClick(d)}
                  className="cursor-pointer hover:bg-bg-surface-elevated/60 transition-colors"
                >
                  <td className="font-semibold text-text-main">{d.dept}</td>
                  <td className="mono font-bold text-text-main text-right tabular-nums">
                    ₹{d.revenue.toLocaleString()}
                  </td>
                  <td className="font-medium text-text-muted text-right tabular-nums">{d.share}%</td>
                  <td className="text-emerald-600 dark:text-emerald-400 font-semibold text-right tabular-nums">{d.growth}</td>
                  <td className="text-center">
                    <Badge variant="emerald" size="sm">Profitable</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
