import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { ChargeCapture } from './ChargeCapture';
import { FinalBillBuilder } from './FinalBillBuilder';
import { PriceMasterAndPackages } from './PriceMasterAndPackages';
import { TPAClaims } from './TPAClaims';
import { BillingAuditLogs } from './BillingAuditLogs';
import { Payments } from './Payments';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import {
  Zap,
  ReceiptText,
  Layers,
  ShieldCheck,
  FileText,
  CreditCard,
  DollarSign,
  Receipt
} from 'lucide-react';

export const Billing = () => {
  const { activeNav, setActiveNav, executiveStats, charges, billingAuditLogs } = useHospital();
  const currentSub = activeNav.subModule || 'chargeCapture';

  const [preselectedPatientId, setPreselectedPatientId] = useState(null);

  const tabs = [
    { key: 'chargeCapture', label: 'Auto-Charge Capture Sheet', icon: Zap },
    { key: 'finalBill', label: 'Final Bill & Settlement', icon: ReceiptText },
    { key: 'priceMaster', label: 'Price Master & Packages', icon: Layers },
    { key: 'tpaClaims', label: 'Insurance & PMJAY Claims', icon: ShieldCheck },
    { key: 'discountsAudit', label: 'Discount Audit Trail', icon: FileText },
    { key: 'payments', label: 'Transactions & Receipts', icon: CreditCard }
  ];

  const handleSelectPatientForBilling = (patientId) => {
    setPreselectedPatientId(patientId);
    setActiveNav({ module: 'billing', subModule: 'finalBill' });
  };

  const renderSubModule = () => {
    switch (currentSub) {
      case 'chargeCapture':
        return <ChargeCapture onSelectPatientForBilling={handleSelectPatientForBilling} />;
      case 'finalBill':
        return <FinalBillBuilder initialPatientId={preselectedPatientId} />;
      case 'priceMaster':
        return <PriceMasterAndPackages />;
      case 'tpaClaims':
        return <TPAClaims />;
      case 'discountsAudit':
        return <BillingAuditLogs />;
      case 'payments':
        return <Payments />;
      default:
        return <ChargeCapture onSelectPatientForBilling={handleSelectPatientForBilling} />;
    }
  };

  const unbilledCount = (charges || []).filter((c) => c.status === 'Pending').length;

  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      {/* Top Dynamic Transaction Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-3.5 border border-border-subtle shadow-xs bg-bg-surface">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <DollarSign size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-text-main tracking-tight truncate">
              {executiveStats.revenueToday || '₹4,28,500'}
            </div>
            <div className="text-xs text-text-muted mt-0.5 truncate font-medium">Today's Collections</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-3.5 border border-border-subtle shadow-xs bg-bg-surface">
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Zap size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-teal-600 dark:text-teal-400 tracking-tight truncate">
              {(charges || []).length} Items
            </div>
            <div className="text-xs text-text-muted mt-0.5 truncate font-medium">Auto-Captured Charges ({unbilledCount} Unbilled)</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-3.5 border border-border-subtle shadow-xs bg-bg-surface">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <ShieldCheck size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tracking-tight truncate">
              ₹6,10,000
            </div>
            <div className="text-xs text-text-muted mt-0.5 truncate font-medium">Cashless TPA & PMJAY Approved</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-3.5 border border-border-subtle shadow-xs bg-bg-surface">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
            <FileText size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-500 dark:text-amber-400 tracking-tight truncate">
              {(billingAuditLogs || []).length} Logs
            </div>
            <div className="text-xs text-text-muted mt-0.5 truncate font-medium">Audited Discounts & Edits</div>
          </div>
        </div>
      </div>

      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'billing', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
