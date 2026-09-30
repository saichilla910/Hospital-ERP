import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { ImagingOrders } from './ImagingOrders';
import { Worklist } from './Worklist';
import { Reports } from './Reports';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { ScanLine, ListOrdered, FileText } from 'lucide-react';

export const Radiology = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'imagingOrders';

  const tabs = [
    { key: 'imagingOrders', label: 'Order Scan / X-Ray', icon: ScanLine },
    { key: 'worklist', label: 'Scan Queue', icon: ListOrdered },
    { key: 'reports', label: 'Scan Reports & Images', icon: FileText }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'imagingOrders':
        return <ImagingOrders />;
      case 'worklist':
        return <Worklist />;
      case 'reports':
        return <Reports />;
      default:
        return <ImagingOrders />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'radiology', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
