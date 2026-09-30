import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointments } from './Appointments';
import { TokenQueue } from './TokenQueue';
import { DoctorConsultation } from './DoctorConsultation';
import { Prescriptions } from './Prescriptions';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { Calendar, ListOrdered, Stethoscope, Pill } from 'lucide-react';

export const OPD = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'appointments';

  const tabs = [
    { key: 'appointments', label: 'Appointments Schedule', icon: Calendar },
    { key: 'consultation', label: 'Doctor Consult & e-Rx', icon: Stethoscope },
    { key: 'queue', label: 'Live Token Board', icon: ListOrdered },
    { key: 'prescriptions', label: 'Prescription Records', icon: Pill }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'appointments':
        return <Appointments />;
      case 'queue':
        return <TokenQueue />;
      case 'consultation':
        return <DoctorConsultation />;
      case 'prescriptions':
        return <Prescriptions />;
      default:
        return <Appointments />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'appointment', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
