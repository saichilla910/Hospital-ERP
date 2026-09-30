import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Users as UsersModule } from './Users';
import { Roles } from './Roles';
import { Permissions } from './Permissions';
import { AuditLogs } from './AuditLogs';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { Users, Key, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export const Administration = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'users';

  const tabs = [
    { key: 'users', label: 'Staff Accounts', icon: Users },
    { key: 'roles', label: 'Staff Roles', icon: Key },
    { key: 'permissions', label: 'Role Permissions', icon: ShieldCheck },
    { key: 'auditLogs', label: 'Activity Logs', icon: FileSpreadsheet }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'users':
        return <UsersModule />;
      case 'roles':
        return <Roles />;
      case 'permissions':
        return <Permissions />;
      case 'auditLogs':
        return <AuditLogs />;
      default:
        return <UsersModule />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'administration', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
