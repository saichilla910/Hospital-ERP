import React, { useState, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  BarChart3,
  Download,
  Printer,
  ShieldCheck,
  Activity,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  ChevronDown,
  FileText,
  Building2,
  Stethoscope,
  BedDouble,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { exportToExcel, exportToCSV } from '../../services/excelService';
import { printExecutiveQualityReport } from '../../services/reportPrintService';

export const Reports = () => {
  const { showToast, doctors = [], wards = [], patients = [] } = useHospital();
  const [isExporting, setIsExporting] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const qualityMetrics = [
    { indicator: 'Average Patient Hospital Stay', benchmark: 'Under 4.5 Days', achieved: '3.8 Days', status: 'Excellent' },
    { indicator: 'Bed Occupancy (Beds in Use)', benchmark: '75% - 85%', achieved: '81.3%', status: 'Normal' },
    { indicator: 'Hospital Cleanliness & Infection Prevention', benchmark: 'Below 0.5%', achieved: '0.08%', status: 'Excellent' },
    { indicator: 'Emergency to Admission Rate', benchmark: '35% - 45%', achieved: '42.0%', status: 'Normal' },
    { indicator: 'Medicine Dispensing Accuracy', benchmark: 'Above 99.9%', achieved: '100% (Zero Error)', status: 'Excellent' },
    { indicator: 'Patient Discharge Satisfaction', benchmark: 'Above 90%', achieved: '96.4%', status: 'Excellent' }
  ];

  // Monthly Quality & Satisfaction Trajectory
  const performanceTrend = [
    { month: 'Apr', satisfaction: 94.2, recovery: 96.0, compliance: 99.4 },
    { month: 'May', satisfaction: 95.1, recovery: 96.8, compliance: 99.6 },
    { month: 'Jun', satisfaction: 95.8, recovery: 97.2, compliance: 99.8 },
    { month: 'Jul', satisfaction: 96.0, recovery: 97.5, compliance: 99.8 },
    { month: 'Aug', satisfaction: 96.2, recovery: 97.8, compliance: 99.9 },
    { month: 'Sep', satisfaction: 96.4, recovery: 98.2, compliance: 99.9 }
  ];

  const executiveKPIs = [
    { Metric: 'Average Patient Hospital Stay', Value: '3.8 Days', Benchmark: '< 4.5 Days', Status: 'Optimal' },
    { Metric: 'Bed Sanitization Turnaround', Value: '0.6 Days', Benchmark: '< 1.0 Day', Status: 'Optimal' },
    { Metric: 'Clinical Safety & Cleanliness Compliance', Value: '99.92%', Benchmark: '> 99.0%', Status: 'Accredited' },
    { Metric: 'Patient Discharge Satisfaction', Value: '96.4%', Benchmark: '> 90.0%', Status: 'Excellent' },
    { Metric: 'Active Specialist Doctors', Value: `${doctors.length} Doctors`, Benchmark: 'Full Roster', Status: 'Active' },
    { Metric: 'Bed Occupancy Rate', Value: '81.3%', Benchmark: '75% - 85%', Status: 'Optimal' },
    { Metric: 'Medicine Dispensing Accuracy', Value: '100% (Zero Error)', Benchmark: '> 99.9%', Status: 'Exemplary' }
  ];

  /**
   * Master Multi-Sheet Excel Workbook Export
   */
  const handleExportMasterExcel = () => {
    setIsExporting(true);
    setExportDropdownOpen(false);

    try {
      // 1. Quality Indicators Sheet
      const qualitySheet = qualityMetrics.map((kpi, idx) => ({
        'S.No': idx + 1,
        'Quality Indicator / Clinical Metric': kpi.indicator,
        'Accreditation Target (NABH / JCI)': kpi.benchmark,
        'Achieved Hospital Result': kpi.achieved,
        'Audit Status': kpi.status,
        'Reporting Period': 'Q3 2026'
      }));

      // 2. Monthly Trend Sheet
      const trendSheet = performanceTrend.map((t) => ({
        'Reporting Month': `${t.month} 2026`,
        'Clinical Recovery Rate (%)': `${t.recovery}%`,
        'Patient Satisfaction Score (%)': `${t.satisfaction}%`,
        'Compliance & Safety Score (%)': `${t.compliance}%`,
        'NABH Gold Benchmark': '95.0%'
      }));

      // 3. Executive KPIs Sheet
      const kpiSheet = executiveKPIs.map((k, idx) => ({
        'S.No': idx + 1,
        'Executive KPI Metric': k.Metric,
        'Current Achieved Value': k.Value,
        'Standard Target Benchmark': k.Benchmark,
        'Operational Status': k.Status
      }));

      // 4. Doctor Staff Roster Sheet
      const doctorSheet = doctors.map((doc, idx) => ({
        'S.No': idx + 1,
        'Doctor Name': doc.name,
        'Specialty': doc.specialty,
        'Department': doc.department,
        'Qualifications': doc.qualifications,
        'Experience': doc.experience,
        'Duty Status': doc.status,
        'Available for OPD Now': doc.availableNow ? 'Yes' : 'No',
        'Clinic Room': doc.room,
        'Consultation Fee (INR)': doc.fee,
        'Patient Rating': doc.patientRating || 4.9,
        'Surgeries Logged': doc.surgeries || 0
      }));

      // 5. Ward & Bed Occupancy Sheet
      const wardSheet = (wards || []).map((w, idx) => {
        const total = w.totalBeds || (w.beds ? w.beds.length : 12);
        const occupied = w.occupiedBeds || (w.beds ? w.beds.filter((b) => b.status === 'Occupied').length : 8);
        const available = total - occupied;
        const occRate = total > 0 ? ((occupied / total) * 100).toFixed(1) + '%' : '0%';

        return {
          'S.No': idx + 1,
          'Ward Name': w.name,
          'Ward Type': w.type || 'Inpatient Care',
          'Floor / Location': w.floor || 'Main Clinical Block',
          'Total Bed Capacity': total,
          'Currently Occupied Beds': occupied,
          'Available Empty Beds': available,
          'Occupancy Rate': occRate,
          'Nurse Supervisor In-Charge': w.nurseInCharge || 'Sister In-Charge'
        };
      });

      const sheets = [
        { name: 'Quality_Benchmarks', data: qualitySheet },
        { name: 'Monthly_Trends', data: trendSheet },
        { name: 'Executive_KPIs', data: kpiSheet },
        { name: 'Doctor_Specialists', data: doctorSheet },
        { name: 'Ward_Bed_Occupancy', data: wardSheet }
      ];

      const fileName = `HospitalCare_Performance_Report_2026.xlsx`;
      exportToExcel(sheets, fileName);
      showToast(`Master Excel report "${fileName}" downloaded successfully!`, 'success');
    } catch (err) {
      console.error('Master Excel export failed:', err);
      showToast('Failed to export Excel report. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Export Quality Indicators Table Only
   */
  const handleExportQualityOnly = (format = 'xlsx') => {
    setIsExporting(true);
    setExportDropdownOpen(false);

    try {
      const data = qualityMetrics.map((kpi, idx) => ({
        'S.No': idx + 1,
        'Quality Measure': kpi.indicator,
        'Hospital Benchmark Target': kpi.benchmark,
        'Achieved Hospital Result': kpi.achieved,
        'Audit Status': kpi.status
      }));

      if (format === 'csv') {
        const fileName = 'Hospital_Quality_Care_Standards_2026.csv';
        exportToCSV(data, fileName);
        showToast(`CSV file "${fileName}" downloaded successfully!`, 'success');
      } else {
        const fileName = 'Hospital_Quality_Care_Standards_2026.xlsx';
        exportToExcel([{ name: 'Quality_Standards', data }], fileName);
        showToast(`Excel file "${fileName}" downloaded successfully!`, 'success');
      }
    } catch (err) {
      console.error('Quality export failed:', err);
      showToast('Failed to export quality standards table.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Export Monthly Recovery & Satisfaction Trends
   */
  const handleExportTrendsOnly = () => {
    setIsExporting(true);
    setExportDropdownOpen(false);

    try {
      const data = performanceTrend.map((t) => ({
        'Reporting Month': `${t.month} 2026`,
        'Clinical Recovery Rate (%)': `${t.recovery}%`,
        'Patient Satisfaction Score (%)': `${t.satisfaction}%`,
        'Compliance & Safety Score (%)': `${t.compliance}%`,
        'NABH Gold Benchmark': '95.0%'
      }));

      const fileName = 'Hospital_Monthly_Clinical_Trends_2026.xlsx';
      exportToExcel([{ name: 'Monthly_Trends', data }], fileName);
      showToast(`Excel file "${fileName}" downloaded successfully!`, 'success');
    } catch (err) {
      console.error('Trends export failed:', err);
      showToast('Failed to export monthly trend report.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Export Ward & Bed Census
   */
  const handleExportWardsOnly = () => {
    setIsExporting(true);
    setExportDropdownOpen(false);

    try {
      const data = (wards || []).map((w, idx) => {
        const total = w.totalBeds || (w.beds ? w.beds.length : 12);
        const occupied = w.occupiedBeds || (w.beds ? w.beds.filter((b) => b.status === 'Occupied').length : 8);
        return {
          'S.No': idx + 1,
          'Ward Name': w.name,
          'Ward Type': w.type || 'Inpatient Care',
          'Floor': w.floor || 'Main Clinical Block',
          'Total Beds': total,
          'Occupied Beds': occupied,
          'Available Beds': total - occupied,
          'Nurse In-Charge': w.nurseInCharge || 'Sister In-Charge'
        };
      });

      const fileName = 'Hospital_Ward_Bed_Occupancy_2026.xlsx';
      exportToExcel([{ name: 'Ward_Occupancy', data }], fileName);
      showToast(`Excel file "${fileName}" downloaded successfully!`, 'success');
    } catch (err) {
      console.error('Ward export failed:', err);
      showToast('Failed to export ward census.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintReport = () => {
    try {
      printExecutiveQualityReport({
        qualityMetrics,
        performanceTrend,
        executiveKPIs,
        doctors,
        wards
      });
      showToast('Generating official Hospital Executive Quality & Performance Report...', 'info');
    } catch (err) {
      console.error('Failed to print executive report:', err);
      window.print();
    }
  };

  const handleRowClick = (m) => {
    showToast(`${m.indicator}: ${m.achieved} (Benchmark: ${m.benchmark})`, 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── HEADER BANNER ── */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-text-main tracking-tight font-display">
              Hospital Performance & Quality Reports
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
              <CheckCircle2 size={13} />
              NABH & JCI Accredited Metrics
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1 max-w-3xl leading-relaxed">
            Hospital quality indicators, bed turnover statistics, clinical recovery rates, and interactive visual performance graphs.
          </p>
        </div>

        {/* Action Buttons with Excel Export Dropdown */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Excel Export Split-Action */}
          <div className="relative inline-flex items-center shadow-xs rounded-lg" ref={dropdownRef}>
            <button
              className="h-10 px-4 rounded-l-lg border border-r-0 border-border-subtle bg-bg-surface hover:bg-bg-surface-elevated text-xs font-semibold text-text-main flex items-center gap-2 cursor-pointer transition-colors"
              onClick={handleExportMasterExcel}
              disabled={isExporting}
              title="Download full multi-sheet hospital performance workbook"
            >
              {isExporting ? (
                <Loader2 size={15} className="animate-spin text-emerald-600 dark:text-emerald-400" />
              ) : (
                <FileSpreadsheet size={15} className="text-emerald-600 dark:text-emerald-400" />
              )}
              <span>{isExporting ? 'Generating Excel...' : 'Download Excel (.xlsx)'}</span>
            </button>

            <button
              className="h-10 w-9 flex items-center justify-center rounded-r-lg border border-border-subtle bg-bg-surface hover:bg-bg-surface-elevated text-text-muted hover:text-text-main text-xs font-semibold cursor-pointer transition-colors"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              title="More export formats & sheets"
            >
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Export Dropdown Menu */}
            {exportDropdownOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 bg-bg-surface border border-border-subtle rounded-2xl shadow-xl shadow-black/10 p-2 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-text-dim border-b border-border-subtle">
                  Spreadsheet Export Options
                </div>

                <button
                  onClick={handleExportMasterExcel}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-bg-surface-elevated flex items-center gap-2.5 text-xs font-bold text-text-main transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FileSpreadsheet size={15} />
                  </div>
                  <div>
                    <div>Master Hospital Workbook</div>
                    <div className="text-[11px] text-text-muted font-normal">All 5 sheets (.xlsx)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportQualityOnly('xlsx')}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-bg-surface-elevated flex items-center gap-2.5 text-xs font-bold text-text-main transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <div>Quality & Safety Standards</div>
                    <div className="text-[11px] text-text-muted font-normal">Benchmark indicators (.xlsx)</div>
                  </div>
                </button>

                <button
                  onClick={handleExportTrendsOnly}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-bg-surface-elevated flex items-center gap-2.5 text-xs font-bold text-text-main transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <TrendingUp size={15} />
                  </div>
                  <div>
                    <div>Monthly Clinical Trends</div>
                    <div className="text-[11px] text-text-muted font-normal">Recovery & satisfaction (.xlsx)</div>
                  </div>
                </button>

                <button
                  onClick={handleExportWardsOnly}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-bg-surface-elevated flex items-center gap-2.5 text-xs font-bold text-text-main transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <BedDouble size={15} />
                  </div>
                  <div>
                    <div>Ward & Bed Occupancy</div>
                    <div className="text-[11px] text-text-muted font-normal">Inpatient census (.xlsx)</div>
                  </div>
                </button>

                <div className="border-t border-border-subtle my-1" />

                <button
                  onClick={() => handleExportQualityOnly('csv')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-bg-surface-elevated flex items-center gap-2.5 text-xs font-bold text-text-muted hover:text-text-main transition-colors cursor-pointer"
                >
                  <FileText size={14} className="text-text-dim" />
                  <span>Export Standards as CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary h-10 px-4 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            onClick={handlePrintReport}
            title="Generate and print official full-color Hospital Executive Performance & Quality Report"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="responsive-grid-4">
        <StatCard
          title="Average Hospital Stay"
          value="3.8 Days"
          subtitle="Target: Under 4.5 Days"
          icon={Activity}
          color="teal"
          onClick={() => showToast('Average Stay: 3.8 days (Target: <4.5 days)', 'info')}
        />
        <StatCard
          title="Bed Sanitization Time"
          value="0.6 Days"
          subtitle="Quick turnaround between patients"
          icon={TrendingUp}
          color="emerald"
          onClick={() => showToast('Bed Sanitization: 0.6 days between admissions', 'info')}
        />
        <StatCard
          title="Safety Compliance"
          value="99.92%"
          subtitle="Hospital Cleanliness & Safety"
          icon={ShieldCheck}
          color="cyan"
          onClick={() => showToast('Safety Compliance: 99.92% (High standard)', 'info')}
        />
        <StatCard
          title="Patient Satisfaction"
          value="96.4%"
          subtitle="From feedback surveys"
          icon={BarChart3}
          color="indigo"
          onClick={() => showToast('Patient Satisfaction: 96.4% positive ratings', 'info')}
        />
      </div>

      {/* Quality Trend Graph */}
      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="text-base font-semibold text-text-main">
              Monthly Clinical Recovery & Patient Satisfaction Trend (%)
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              6-month longitudinal quality scores & NABH accreditation benchmarks
            </p>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Recovery Rate (%)
              </span>
              <span className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Patient Satisfaction (%)
              </span>
            </div>

            <button
              onClick={handleExportTrendsOnly}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer transition-colors"
              title="Download monthly trend data as Excel"
            >
              <Download size={12} />
              <span>Export Trend</span>
            </button>
          </div>
        </div>

        <div className="h-[290px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceTrend} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="var(--text-dim)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-subtle)' }}
              />
              <YAxis
                domain={[90, 100]}
                stroke="var(--text-dim)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(val, name) => [`${val}%`, name]}
                contentStyle={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <ReferenceLine
                y={95}
                stroke="#0d9488"
                strokeDasharray="4 4"
                label={{ value: '95% Gold Benchmark', fill: '#0d9488', fontSize: 10, position: 'insideTopLeft' }}
              />
              <Area
                type="monotone"
                dataKey="recovery"
                name="Clinical Recovery Rate"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#recGrad)"
              />
              <Area
                type="monotone"
                dataKey="satisfaction"
                name="Patient Satisfaction"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#satGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quality Indicators Table */}
      <div className="glass-card flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-2.5">
          <div>
            <h3 className="text-[1.05rem] font-extrabold text-text-main">
              Hospital Quality & Care Standards
            </h3>
            <p className="text-[0.75rem] text-text-muted">
              Live audit benchmarks vs achieved hospital operational results (Click row to inspect)
            </p>
          </div>

          <button
            onClick={() => handleExportQualityOnly('xlsx')}
            className="btn btn-secondary h-8 px-3 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            title="Download Quality Standards table as Excel"
          >
            <FileSpreadsheet size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Export Table (.xlsx)</span>
          </button>
        </div>

        <div className="table-container">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Quality Measure</th>
                <th>Standard Hospital Target</th>
                <th>Our Hospital Result</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {qualityMetrics.map((kpi, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleRowClick(kpi)}
                  className="cursor-pointer hover:bg-bg-surface-elevated/60 transition-colors"
                >
                  <td className="font-bold text-text-main">{kpi.indicator}</td>
                  <td className="text-text-muted">{kpi.benchmark}</td>
                  <td className="mono font-extrabold text-teal-600 dark:text-teal-400">{kpi.achieved}</td>
                  <td>
                    <Badge variant={kpi.status === 'Excellent' ? 'emerald' : 'teal'} size="sm">
                      {kpi.status}
                    </Badge>
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
