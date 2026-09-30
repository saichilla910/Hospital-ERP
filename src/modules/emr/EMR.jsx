import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { ClinicalNotes } from './ClinicalNotes';
import { Diagnosis } from './Diagnosis';
import { Allergies } from './Allergies';
import { Medications } from './Medications';
import { TreatmentPlans } from './TreatmentPlans';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { FileText, ClipboardList, AlertTriangle, Pill, Target } from 'lucide-react';

export const EMR = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'clinicalNotes';

  const tabs = [
    { key: 'clinicalNotes', label: 'Doctor Notes & Vitals', icon: FileText },
    { key: 'diagnosis', label: 'Diagnosed Conditions', icon: ClipboardList },
    { key: 'allergies', label: 'Allergies Alert', icon: AlertTriangle },
    { key: 'medications', label: 'Active Medicines', icon: Pill },
    { key: 'treatmentPlans', label: 'Care & Recovery Plans', icon: Target }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'clinicalNotes':
        return <ClinicalNotes />;
      case 'diagnosis':
        return <Diagnosis />;
      case 'allergies':
        return <Allergies />;
      case 'medications':
        return <Medications />;
      case 'treatmentPlans':
        return <TreatmentPlans />;
      default:
        return <ClinicalNotes />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'emr', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
