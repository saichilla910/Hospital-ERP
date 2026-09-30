import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Triage } from './Triage';
import { EmergencyPatients } from './EmergencyPatients';
import { EmergencyBilling } from './EmergencyBilling';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { ShieldAlert, Users, CreditCard } from 'lucide-react';

export const Emergency = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'triage';

  const tabs = [
    { key: 'triage', label: 'ER Intake & Triage', icon: ShieldAlert },
    { key: 'patients', label: 'Active Trauma Bays', icon: Users },
    { key: 'billing', label: 'Emergency Billing', icon: CreditCard }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'triage':
        return <Triage />;
      case 'patients':
        return <EmergencyPatients />;
      case 'billing':
        return <EmergencyBilling />;
      default:
        return <Triage />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'emergency', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
