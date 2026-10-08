import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Trash2,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Pill,
  Filter,
  Download,
  Building,
  RefreshCw,
  PackageCheck,
  TrendingDown
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const Expiry = () => {
  const {
    pharmacyItems = [],
    pharmacyBatches = [],
    stockMovements = [],
    showToast
  } = useHospital();

  const [activeTab, setActiveTab] = useState('60days'); // '60days' | 'lowstock' | 'allbatches' | 'movements'
  const [filterThresholdDays, setFilterThresholdDays] = useState(60);

  const referenceDate = new Date('2026-09-17');

  // Compute days left and enrich batches
  const enrichedBatches = useMemo(() => {
    return pharmacyBatches.map((batch) => {
      const expDate = new Date(batch.expiryDate);
      const diffMs = expDate.getTime() - referenceDate.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const matchedItem = pharmacyItems.find((i) => i.id === batch.itemId);

      return {
        ...batch,
        daysLeft,
        itemName: matchedItem?.name || batch.name || 'Medicine',
        genericName: matchedItem?.genericName || '',
        category: matchedItem?.category || 'General',
        unitPrice: matchedItem?.unitPrice || 25,
        reorderLevel: matchedItem?.reorderLevel || 50
      };
    });
  }, [pharmacyBatches, pharmacyItems]);

  // Expiring in 60 days
  const expiringSoonBatches = useMemo(() => {
    return enrichedBatches
      .filter((b) => b.daysLeft <= filterThresholdDays && b.qty > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [enrichedBatches, filterThresholdDays]);

  // Low stock items (total stock across batches <= reorder level)
  const lowStockItems = useMemo(() => {
    return pharmacyItems.map((item) => {
      const itemBatches = pharmacyBatches.filter((b) => b.itemId === item.id);
      const totalStock = itemBatches.reduce((acc, b) => acc + (b.qty || 0), 0);
      const isLow = totalStock <= (item.reorderLevel || 50);

      return {
        ...item,
        currentStock: totalStock,
        batchesCount: itemBatches.length,
        isLow
      };
    }).filter((item) => item.isLow);
  }, [pharmacyItems, pharmacyBatches]);

  const handleReturnToVendor = (batch) => {
    showToast(`Batch ${batch.batchNo} of ${batch.itemName} (${batch.qty} units) flagged for vendor return credit.`, 'warning');
  };

  const handlePrioritizeFEFO = (batch) => {
    showToast(`Batch ${batch.batchNo} prioritized for FEFO dispensing at outpatient counter.`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-text-main tracking-tight font-display">
                Batch Inventory, Expiry & Low-Stock Alerts
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                FEFO (First-Expiry-First-Out) tracking, 60-day shelf expiry reports, and supplier replenishment thresholds.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              showToast('Exporting 60-day expiry audit report to CSV...', 'info');
              window.print();
            }}
            className="btn btn-secondary btn-sm rounded-xl h-10 px-4 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download size={14} /> Export Expiry Report
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setActiveTab('60days')}
          className="glass-card p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex flex-col justify-between cursor-pointer hover:border-rose-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Expiring in 60 Days</span>
            <AlertTriangle size={16} className="text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {expiringSoonBatches.length} <span className="text-xs text-rose-700/80 font-normal">Batches</span>
          </div>
          <div className="text-[11px] text-rose-700/80 dark:text-rose-400/80 mt-1">Requires return or FEFO counter priority</div>
        </div>

        <div
          onClick={() => setActiveTab('lowstock')}
          className="glass-card p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col justify-between cursor-pointer hover:border-amber-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Low Stock Stockouts</span>
            <TrendingDown size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">
            {lowStockItems.length} <span className="text-xs text-amber-800/80 font-normal">Meds</span>
          </div>
          <div className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-1">Stock ≤ Reorder threshold</div>
        </div>

        <div
          onClick={() => setActiveTab('allbatches')}
          className="glass-card p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between cursor-pointer hover:border-teal-500/40 transition-all"
        >
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Batches in Store</span>
          <div className="text-2xl font-extrabold text-text-main mt-1">
            {pharmacyBatches.length} <span className="text-xs text-text-muted font-normal">Batches</span>
          </div>
          <div className="text-[11px] text-text-dim mt-1">Across {pharmacyItems.length} active formulations</div>
        </div>

        <div
          onClick={() => setActiveTab('movements')}
          className="glass-card p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 transition-all"
        >
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Stock Movements (FEFO)</span>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {stockMovements.length} <span className="text-xs text-text-muted font-normal">Audits</span>
          </div>
          <div className="text-[11px] text-text-dim mt-1">Dispensing & receipts tracked</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="glass-card p-3 rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('60days')}
            className={`btn btn-sm rounded-xl h-10 px-4 text-xs font-bold transition-all ${
              activeTab === '60days' ? 'btn-primary shadow-xs' : 'btn-secondary'
            }`}
          >
            <AlertTriangle size={14} className="text-rose-500" />
            <span>Expiring in 60 Days Report ({expiringSoonBatches.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('lowstock')}
            className={`btn btn-sm rounded-xl h-10 px-4 text-xs font-bold transition-all ${
              activeTab === 'lowstock' ? 'btn-primary shadow-xs' : 'btn-secondary'
            }`}
          >
            <TrendingDown size={14} className="text-amber-500" />
            <span>Low-Stock Alerts ({lowStockItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('allbatches')}
            className={`btn btn-sm rounded-xl h-10 px-4 text-xs font-bold transition-all ${
              activeTab === 'allbatches' ? 'btn-primary shadow-xs' : 'btn-secondary'
            }`}
          >
            <Pill size={14} />
            <span>All Batch Matrix ({pharmacyBatches.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`btn btn-sm rounded-xl h-10 px-4 text-xs font-bold transition-all ${
              activeTab === 'movements' ? 'btn-primary shadow-xs' : 'btn-secondary'
            }`}
          >
            <RefreshCw size={14} />
            <span>FEFO Movements Log ({stockMovements.length})</span>
          </button>
        </div>

        {activeTab === '60days' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-dim font-bold">Cutoff Threshold:</span>
            <select
              value={filterThresholdDays}
              onChange={(e) => setFilterThresholdDays(Number(e.target.value))}
              className="form-select h-8 text-xs font-semibold rounded-lg py-1 px-2"
            >
              <option value={30}>Expiring in ≤ 30 Days (Critical)</option>
              <option value={60}>Expiring in ≤ 60 Days (Standard)</option>
              <option value={90}>Expiring in ≤ 90 Days (Warning)</option>
            </select>
          </div>
        )}
      </div>

      {/* 1. EXPIRING IN 60 DAYS REPORT TABLE */}
      {activeTab === '60days' && (
        <div className="table-container glass-card rounded-2xl border border-border-subtle overflow-hidden">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Batch Number</th>
                <th>Medication Name & Generic</th>
                <th>Category</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>Available Units</th>
                <th>Recommended Action</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expiringSoonBatches.map((b) => (
                <tr key={b.id || b.batchNo} className="hover:bg-bg-surface-elevated/60 transition-colors">
                  <td>
                    <span className="mono font-bold text-xs text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {b.batchNo}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-sm text-text-main">{b.itemName}</div>
                    <div className="text-[11px] text-text-muted">{b.genericName}</div>
                  </td>
                  <td className="text-xs text-text-muted">{b.category}</td>
                  <td className="text-xs mono font-bold text-rose-600 dark:text-rose-400">
                    {b.expiryDate}
                  </td>
                  <td>
                    <Badge variant={b.daysLeft <= 30 ? 'rose' : 'amber'} size="sm">
                      {b.daysLeft} Days Left
                    </Badge>
                  </td>
                  <td className="text-xs font-extrabold text-text-main">
                    {b.qty} <span className="text-[10px] text-text-muted font-normal">units</span>
                  </td>
                  <td className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                    {b.daysLeft <= 30 ? 'Return to Supplier Credit' : 'FEFO Counter Priority'}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handlePrioritizeFEFO(b)}
                        className="btn btn-secondary btn-xs text-xs font-bold rounded-lg"
                        title="Prioritize for FEFO counter dispensing"
                      >
                        FEFO Priority
                      </button>
                      <button
                        onClick={() => handleReturnToVendor(b)}
                        className="btn btn-outline btn-xs text-xs font-bold text-rose-600 border-rose-500/30 rounded-lg hover:bg-rose-500/10"
                        title="Flag for vendor return and credit note"
                      >
                        Return Credit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {expiringSoonBatches.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-text-muted text-xs">
                    No batches expiring in the next {filterThresholdDays} days. All inventory is safe!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. LOW-STOCK STOCKOUT ALERTS */}
      {activeTab === 'lowstock' && (
        <div className="table-container glass-card rounded-2xl border border-border-subtle overflow-hidden">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Medicine Name & Generic Salt</th>
                <th>Category</th>
                <th>Current In-Store Stock</th>
                <th>Reorder Threshold Level</th>
                <th>Status</th>
                <th className="text-right">Procurement Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-bg-surface-elevated/60 transition-colors">
                  <td>
                    <span className="mono font-bold text-xs text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {item.id}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-sm text-text-main">{item.name}</div>
                    <div className="text-[11px] text-text-muted">{item.genericName}</div>
                  </td>
                  <td className="text-xs text-text-muted">{item.category}</td>
                  <td>
                    <span className="font-extrabold text-sm text-rose-600">
                      {item.currentStock} units
                    </span>
                  </td>
                  <td className="text-xs font-mono text-text-muted">
                    {item.reorderLevel} units
                  </td>
                  <td>
                    <Badge variant="rose" size="sm">LOW STOCK</Badge>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => showToast(`Purchase Requisition generated for ${item.name} (Qty: 200). Transmitted to procurement.`, 'success')}
                      className="btn btn-primary btn-xs text-xs font-bold rounded-lg"
                    >
                      Generate PO / Reorder
                    </button>
                  </td>
                </tr>
              ))}

              {lowStockItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-text-muted text-xs">
                    All formulations are well above reorder levels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. ALL BATCHES MATRIX */}
      {activeTab === 'allbatches' && (
        <div className="table-container glass-card rounded-2xl border border-border-subtle overflow-hidden">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Batch No</th>
                <th>Item Name</th>
                <th>Expiry Date</th>
                <th>Days to Expiry</th>
                <th>Stock Quantity</th>
                <th>Unit MRP</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {enrichedBatches.map((b) => (
                <tr key={b.id || b.batchNo} className="hover:bg-bg-surface-elevated/60 transition-colors">
                  <td>
                    <span className="mono font-bold text-xs text-teal-600 dark:text-teal-400 bg-bg-surface px-2 py-0.5 rounded border border-border-subtle">
                      {b.batchNo}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-xs sm:text-sm text-text-main">{b.itemName}</div>
                    <div className="text-[11px] text-text-dim">{b.genericName}</div>
                  </td>
                  <td className="text-xs font-mono">{b.expiryDate}</td>
                  <td className="text-xs">
                    {b.daysLeft <= 60 ? (
                      <span className="text-rose-600 font-bold">{b.daysLeft} days (Near Expiry)</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">{b.daysLeft} days</span>
                    )}
                  </td>
                  <td className="text-xs font-bold text-text-main">{b.qty} units</td>
                  <td className="text-xs font-mono">₹{b.unitPrice}</td>
                  <td>
                    {b.qty === 0 ? (
                      <Badge variant="slate" size="sm">Depleted</Badge>
                    ) : b.daysLeft <= 60 ? (
                      <Badge variant="rose" size="sm">Near Expiry</Badge>
                    ) : (
                      <Badge variant="emerald" size="sm">Active FEFO</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. STOCK MOVEMENTS LOG */}
      {activeTab === 'movements' && (
        <div className="table-container glass-card rounded-2xl border border-border-subtle overflow-hidden">
          <table className="medicore-table">
            <thead>
              <tr>
                <th>Movement ID</th>
                <th>Date & Time</th>
                <th>Item Name</th>
                <th>Batch Deducted</th>
                <th>Quantity</th>
                <th>Movement Type</th>
                <th>Reference Patient / Order</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.map((mov) => (
                <tr key={mov.id} className="hover:bg-bg-surface-elevated/60 transition-colors">
                  <td>
                    <span className="mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-bg-surface px-2 py-0.5 rounded border border-border-subtle">
                      {mov.id}
                    </span>
                  </td>
                  <td className="text-xs font-mono text-text-muted">{mov.timestamp}</td>
                  <td className="text-xs font-bold text-text-main">{mov.itemName}</td>
                  <td className="text-xs font-mono text-teal-600">{mov.batchNo}</td>
                  <td>
                    <span className="font-bold text-xs text-rose-600">
                      -{mov.qty} units
                    </span>
                  </td>
                  <td>
                    <Badge variant="indigo" size="sm">{mov.type || 'FEFO Dispense'}</Badge>
                  </td>
                  <td className="text-xs text-text-muted">{mov.patientRef || mov.refOrder || 'Walk-in Counter'}</td>
                </tr>
              ))}

              {stockMovements.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-text-muted text-xs">
                    No FEFO stock movements logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
