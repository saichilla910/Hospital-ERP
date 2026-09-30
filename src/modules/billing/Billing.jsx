import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { OPDBilling } from './OPDBilling';
import { IPDBilling } from './IPDBilling';
import { Payments } from './Payments';
import { Insurance } from './Insurance';
import { TPAClaims } from './TPAClaims';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { Receipt, ReceiptText, Building2, CreditCard, ShieldCheck, FileCheck, DollarSign } from 'lucide-react';

export const Billing = () => {
  const { activeNav, setActiveNav, executiveStats } = useHospital();
  const currentSub = activeNav.subModule || 'payments';

  const tabs = [
    { key: 'payments', label: 'All Transactions & Receipts', icon: CreditCard },
    { key: 'opdBilling', label: 'Create Bill (OPD)', icon: ReceiptText },
    { key: 'ipdBilling', label: 'Inpatient Invoices (IPD)', icon: Building2 },
    { key: 'insurance', label: 'Insurance Policy Check', icon: ShieldCheck },
    { key: 'tpaClaims', label: 'Insurance Claims', icon: FileCheck }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'payments':
        return <Payments />;
      case 'opdBilling':
        return <OPDBilling />;
      case 'ipdBilling':
        return <IPDBilling />;
      case 'insurance':
        return <Insurance />;
      case 'tpaClaims':
        return <TPAClaims />;
      default:
        return <Payments />;
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      {/* Top Dynamic Transaction Metric Cards — Equal width with 16px gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-3.5 border border-border-subtle shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <DollarSign size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-text-main tracking-tight truncate">{executiveStats.revenueToday}</div>
            <div className="text-xs text-text-muted mt-0.5 truncate font-medium">Today's Total Collections</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-3.5 border border-border-subtle shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <CreditCard size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tracking-tight truncate">₹2,95,000</div>
            <div className="text-xs text-text-muted mt-0.5 truncate font-medium">UPI & Card Payments (69%)</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-3.5 border border-border-subtle shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Receipt size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-teal-600 dark:text-teal-400 tracking-tight truncate">₹85,500</div>
            <div className="text-xs text-text-muted mt-0.5 truncate font-medium">Cash Counter Received</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-3.5 border border-border-subtle shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
            <ShieldCheck size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-500 dark:text-amber-400 tracking-tight truncate">₹48,000</div>
            <div className="text-xs text-text-muted mt-0.5 truncate font-medium">TPA Insurance Approved</div>
          </div>
        </div>
      </div>

      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'transaction', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
