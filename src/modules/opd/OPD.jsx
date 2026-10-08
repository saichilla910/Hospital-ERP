import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointments } from './Appointments';
import { DoctorSlotManager } from './DoctorSlotManager';
import { TokenQueue } from './TokenQueue';
import { RemindersManager } from './RemindersManager';
import { DoctorConsultation } from './DoctorConsultation';
import { Prescriptions } from './Prescriptions';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { Calendar, Clock, Monitor, MessageSquare, Stethoscope, Pill } from 'lucide-react';

export const OPD = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'appointments';

  const tabs = [
    { key: 'appointments', label: 'Appointments Schedule', icon: Calendar },
    { key: 'slots', label: 'Doctor Slots & Capacity', icon: Clock },
    { key: 'queue', label: 'Live TV Queue Screen', icon: Monitor },
    { key: 'reminders', label: 'SMS & WhatsApp Reminders', icon: MessageSquare },
    { key: 'consultation', label: 'Doctor Consult & e-Rx', icon: Stethoscope },
    { key: 'prescriptions', label: 'Prescriptions', icon: Pill }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'appointments':
        return <Appointments />;
      case 'slots':
        return <DoctorSlotManager />;
      case 'queue':
        return <TokenQueue />;
      case 'reminders':
        return <RemindersManager />;
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
        onSelectTab={(subKey) => setActiveNav({ module: 'opd', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
