import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Admissions } from './Admissions';
import { BedManagement } from './BedManagement';
import { WardManagement } from './WardManagement';
import { Nursing } from './Nursing';
import { Discharge } from './Discharge';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { Building, Bed, LayoutGrid, HeartPulse, LogOut } from 'lucide-react';

export const IPD = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'beds';

  const tabs = [
    { key: 'beds', label: 'Visual Bed Map', icon: Bed },
    { key: 'admissions', label: 'Admit Patient', icon: Building },
    { key: 'wards', label: 'Wards Overview', icon: LayoutGrid },
    { key: 'nursing', label: 'Nursing Station', icon: HeartPulse },
    { key: 'discharge', label: 'Discharge Summary', icon: LogOut }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'beds':
        return <BedManagement />;
      case 'admissions':
        return <Admissions />;
      case 'wards':
        return <WardManagement />;
      case 'nursing':
        return <Nursing />;
      case 'discharge':
        return <Discharge />;
      default:
        return <BedManagement />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'ipd', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
