import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PatientRegistration } from './PatientRegistration';
import { PatientDirectory } from './PatientDirectory';
import { PatientProfile } from './PatientProfile';
import { MedicalHistory } from './MedicalHistory';
import { PatientAnalyticsOverview } from './PatientAnalyticsOverview';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { UserPlus, Users, UserCheck, History, BarChart3, LogIn } from 'lucide-react';

export const PatientManagement = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'directory';

  const tabs = [
    { key: 'directory', label: 'All Patients', icon: Users },
    { key: 'profile', label: 'Patient Record & Vital Graphs', icon: UserCheck },
    { key: 'history', label: 'Unified Patient Timeline', icon: History, badge: 'Visits • Labs • Rx • Bills', highlight: true },
    { key: 'analytics', label: 'Patient Population Graphs', icon: BarChart3 },
    { key: 'registration', label: 'Register New Patient (UHID & ABHA)', icon: UserPlus, badge: 'Intake' },
    { key: 'login', label: 'Patient Portal Login', icon: LogIn, badge: 'Sign In' }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'directory':
        return <PatientDirectory />;
      case 'profile':
        return <PatientProfile />;
      case 'analytics':
        return <PatientAnalyticsOverview />;
      case 'registration':
        return <PatientRegistration initialMode="register" />;
      case 'login':
        return <PatientRegistration initialMode="login" />;
      case 'history':
        return <MedicalHistory />;
      default:
        return <PatientDirectory />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'patientManagement', subModule: subKey })}
      />

      {/* Render Active Sub Module */}
      {renderSubModule()}
    </div>
  );
};
