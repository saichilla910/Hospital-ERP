import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { OTSchedule } from './OTSchedule';
import { Surgery } from './Surgery';
import { PreOp } from './PreOp';
import { PostOp } from './PostOp';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { Scissors, Calendar, ShieldCheck, HeartPulse } from 'lucide-react';

export const OperationTheatre = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'schedule';

  const tabs = [
    { key: 'schedule', label: 'Surgery Schedule', icon: Calendar },
    { key: 'surgery', label: 'Live Surgery Room', icon: Scissors },
    { key: 'preOp', label: 'Pre-Surgery Checklist', icon: ShieldCheck },
    { key: 'postOp', label: 'Recovery Room', icon: HeartPulse }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'schedule':
        return <OTSchedule />;
      case 'surgery':
        return <Surgery />;
      case 'preOp':
        return <PreOp />;
      case 'postOp':
        return <PostOp />;
      default:
        return <OTSchedule />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'operationTheatre', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
