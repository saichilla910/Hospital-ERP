import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { TestOrders } from './TestOrders';
import { SampleCollection } from './SampleCollection';
import { Processing } from './Processing';
import { Reports } from './Reports';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { FlaskConical, Droplet, Activity, FileText, Cpu } from 'lucide-react';

export const Laboratory = () => {
  const { activeNav, setActiveNav, labOrders } = useHospital();
  const currentSub = activeNav.subModule || 'reports';

  const tabs = [
    { key: 'reports', label: 'Verified Lab Reports', icon: FileText },
    { key: 'testOrders', label: 'Order Lab Tests', icon: FlaskConical },
    { key: 'samples', label: 'Sample Collection Desk', icon: Droplet },
    { key: 'processing', label: 'Testing Machines & Queues', icon: Activity }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'reports':
        return <Reports />;
      case 'testOrders':
        return <TestOrders />;
      case 'samples':
        return <SampleCollection />;
      case 'processing':
        return <Processing />;
      default:
        return <Reports />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Dynamic Lab Metrics Summary */}
      <div className="responsive-grid-4">
        <div className="glass-card p-4 sm:p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600">
            <FileText size={22} />
          </div>
          <div>
            <div className="text-[1.25rem] font-extrabold text-text-main">{labOrders.length} Reports</div>
            <div className="text-[0.75rem] text-text-muted">Verified & Ready to Print</div>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-teal-500/10 flex items-center justify-center text-teal-600">
            <FlaskConical size={22} />
          </div>
          <div>
            <div className="text-[1.25rem] font-extrabold text-teal-600">510 Tests</div>
            <div className="text-[0.75rem] text-text-muted">Conducted Today</div>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-600">
            <Droplet size={22} />
          </div>
          <div>
            <div className="text-[1.25rem] font-extrabold text-purple-600">528 Tubes</div>
            <div className="text-[0.75rem] text-text-muted">Barcoded & Drawn</div>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Cpu size={22} />
          </div>
          <div>
            <div className="text-[1.25rem] font-extrabold text-emerald-600">4 / 4 Online</div>
            <div className="text-[0.75rem] text-text-muted">Analyzers Calibrated</div>
          </div>
        </div>
      </div>

      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'labReports', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
